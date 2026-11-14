-- OMEGA AMPLIFY — REVIEW ONLY; NOT APPLIED.
-- Requires initial.sql and harden_tenant_security.sql in a dedicated Amplify project.
-- DB security review, staged migrations, two-tenant RLS/SQL tests and permission
-- checks are REQUIRED before treating this as ready. Do NOT run on Omega Education.
--
-- Objectives:
-- 1. Only an explicitly authorised CLIENT approver may review their submitted
--    project deliverable, never a generic organisation member/viewer/staff member.
-- 2. Direct authenticated writes cannot mark items 'approved' or 'changes_requested'.
-- 3. Preserve a dated review trail with optional feedback.
-- 4. Fail closed on missing project/service subscription and withdrawn authority.
begin;

-- The server or trusted administrative provisioning path creates these records.
-- No authenticated user may insert/update/delete their own approval authority.
create table if not exists public.client_approval_authorities (
 organisation_id uuid not null references public.organisations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 authorised_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 revoked_at timestamptz,
 primary key(organisation_id,user_id)
);
create index if not exists client_approval_auth_user_idx
  on public.client_approval_authorities(user_id,organisation_id);
alter table public.client_approval_authorities enable row level security;
revoke all on public.client_approval_authorities from public,anon,authenticated;
grant select on public.client_approval_authorities to authenticated;
drop policy if exists "view own approval authority" on public.client_approval_authorities;
create policy "view own approval authority"
 on public.client_approval_authorities for select to authenticated
 using (user_id=(select auth.uid()));
-- No INSERT, UPDATE or DELETE policy for authenticated users.

create table if not exists public.client_deliverable_reviews (
 id uuid primary key default gen_random_uuid(),
 organisation_id uuid not null references public.organisations(id) on delete cascade,
 deliverable_id uuid not null references public.deliverables(id) on delete cascade,
 reviewer_id uuid not null references auth.users(id),
 decision text not null check (decision in ('approved','changes_requested')),
 note text not null default '' check(length(note)<=1000),
 recorded_at timestamptz not null default now()
);
create index if not exists client_review_org_idx on public.client_deliverable_reviews(organisation_id,recorded_at desc);
create index if not exists client_review_deliverable_idx on public.client_deliverable_reviews(deliverable_id,recorded_at desc);
alter table public.client_deliverable_reviews enable row level security;
revoke all on public.client_deliverable_reviews from public,anon,authenticated;
grant select on public.client_deliverable_reviews to authenticated;
drop policy if exists "client or staff reads own deliverable reviews" on public.client_deliverable_reviews;
create policy "client or staff reads own deliverable reviews"
 on public.client_deliverable_reviews for select to authenticated
 using ((select auth.uid()) is not null and public.has_org_access(organisation_id));
-- Never grant inserts directly to a web or client role.

-- This migration replaces the earlier, overly broad membership-only RPC.
-- Keep privileged implementation in a non-exposed schema. Its own identity,
-- membership, explicit authority and project/subscription checks are mandatory.
create schema if not exists private;
revoke all on schema private from public,anon,authenticated;
grant usage on schema private to authenticated;

create or replace function private.review_deliverable_secure(
 p_deliverable_id uuid,
 p_decision text,
 p_note text
)
returns public.deliverables
language plpgsql
security definer
set search_path=''
as $$
declare
 d public.deliverables;
 reviewer uuid := (select auth.uid());
 clean_note text := btrim(coalesce(p_note,''));
begin
 if reviewer is null then
  raise exception 'Sign-in required' using errcode='28000';
 end if;
 if p_decision not in ('approved','changes_requested') then
  raise exception 'Invalid review decision' using errcode='22023';
 end if;
 if length(clean_note)>1000 or (p_decision='changes_requested' and length(clean_note)=0) then
  raise exception 'A valid review note is required for changes' using errcode='22023';
 end if;
 select * into d from public.deliverables where id=p_deliverable_id for update;
 if not found then
  raise exception 'Deliverable not found' using errcode='P0002';
 end if;
 if d.status<>'submitted' then
  raise exception 'Only submitted deliverables may be reviewed' using errcode='22023';
 end if;
 if d.project_id is null then
  raise exception 'Deliverable must belong to a contracted project' using errcode='22023';
 end if;
 if not exists (
   select 1
   from public.memberships m
   inner join public.client_approval_authorities a
     on a.organisation_id=m.organisation_id and a.user_id=m.user_id
   inner join public.projects p
     on p.id=d.project_id and p.organisation_id=d.organisation_id
   inner join public.services s
     on s.id=p.service_id and s.organisation_id=p.organisation_id and s.status='active'
   where m.organisation_id=d.organisation_id
     and m.user_id=reviewer
     and m.role='client'
     and a.revoked_at is null
 ) then
  raise exception 'Authorised client approver and active subscribed service required'
    using errcode='42501';
 end if;
 update public.deliverables
   set status=p_decision
   where id=d.id
   returning * into d;
 insert into public.client_deliverable_reviews(
   organisation_id,deliverable_id,reviewer_id,decision,note
 ) values (d.organisation_id,d.id,reviewer,p_decision,clean_note);
 insert into public.audit_events(organisation_id,actor_id,event_type,entity_id)
 values (d.organisation_id,reviewer,'client_deliverable_review',d.id);
 return d;
end $$;
revoke all on function private.review_deliverable_secure(uuid,text,text) from public,anon,authenticated;
grant execute on function private.review_deliverable_secure(uuid,text,text) to authenticated;

drop function if exists public.review_deliverable(uuid,text);
-- Existing browser/API callers using the original two arguments remain valid
-- via default p_note=NULL. A change request must supply a non-empty note.
create or replace function public.review_deliverable(
 p_deliverable_id uuid,
 p_decision text,
 p_note text default null
)
returns public.deliverables
language sql
security invoker
set search_path=''
as $$
 select private.review_deliverable_secure(p_deliverable_id,p_decision,p_note)
$$;
revoke all on function public.review_deliverable(uuid,text,text) from public,anon,authenticated;
grant execute on function public.review_deliverable(uuid,text,text) to authenticated;

-- The original broad 'staff manage deliverables' policy remains staff-only
-- at RLS level, but staff must not assign client-approved status directly.
-- Remove all table-level UPDATE grants to the Data API roles; permit safe
-- staff-editable columns only. Never grant UPDATE(status) to authenticated.
revoke update on public.deliverables from public,anon,authenticated;
grant update(title,description,due_at,project_id) on public.deliverables to authenticated;

-- Direct inserts must start draft/submitted. Dedicated privileged functions
-- are needed for future submit/publish workflow transitions.
create or replace function public.check_new_deliverable_status()
returns trigger language plpgsql security invoker set search_path=''
as $$
begin
 if new.status not in ('draft','submitted') then
  raise exception 'New deliverables must begin in draft or submitted'
    using errcode='23514';
 end if;
 return new;
end $$;
revoke all on function public.check_new_deliverable_status() from public,anon,authenticated;
drop trigger if exists deliverables_check_initial_status on public.deliverables;
create trigger deliverables_check_initial_status
 before insert on public.deliverables for each row
 execute function public.check_new_deliverable_status();

commit;
