-- Security hardening: replace broad client UPDATE with a column-safe review RPC.
-- This migration is not applied automatically.
drop policy if exists "clients review submitted deliverables" on public.deliverables;
create or replace function public.review_deliverable(p_deliverable_id uuid,p_decision text)
returns public.deliverables
language plpgsql security definer set search_path=''
as $$
declare d public.deliverables;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required' using errcode='28000'; end if;
  if p_decision not in ('approved','changes_requested') then raise exception 'Invalid decision' using errcode='22023'; end if;
  select * into d from public.deliverables where id=p_deliverable_id for update;
  if not found then raise exception 'Deliverable not found' using errcode='P0002'; end if;
  if not public.has_org_access(d.organisation_id) then raise exception 'Not authorised' using errcode='42501'; end if;
  if d.status <> 'submitted' then raise exception 'Deliverable is not awaiting review' using errcode='22023'; end if;
  update public.deliverables set status=p_decision where id=p_deliverable_id returning * into d;
  return d;
end $$;
revoke all on function public.review_deliverable(uuid,text) from public;
grant execute on function public.review_deliverable(uuid,text) to authenticated;
-- Ensure a referenced project belongs to the same organisation.
create unique index if not exists projects_id_org_unique on public.projects(id,organisation_id);
create unique index if not exists services_id_org_unique on public.services(id,organisation_id);
alter table public.projects add constraint project_service_same_org foreign key(service_id,organisation_id) references public.services(id,organisation_id);
alter table public.leads add constraint lead_project_same_org foreign key(project_id,organisation_id) references public.projects(id,organisation_id);
alter table public.tasks add constraint task_project_same_org foreign key(project_id,organisation_id) references public.projects(id,organisation_id);
alter table public.deliverables add constraint deliverable_project_same_org foreign key(project_id,organisation_id) references public.projects(id,organisation_id);
-- Guard tenant ownership on update for tables where staff have UPDATE policies.
create or replace function public.prevent_org_reassignment() returns trigger language plpgsql set search_path='' as $$
begin
  if new.organisation_id is distinct from old.organisation_id then
    raise exception 'Organisation cannot be reassigned' using errcode='42501';
  end if;
  return new;
end $$;
create trigger services_org_immutable before update on public.services for each row execute function public.prevent_org_reassignment();
create trigger projects_org_immutable before update on public.projects for each row execute function public.prevent_org_reassignment();
create trigger leads_org_immutable before update on public.leads for each row execute function public.prevent_org_reassignment();
create trigger tasks_org_immutable before update on public.tasks for each row execute function public.prevent_org_reassignment();
create trigger deliverables_org_immutable before update on public.deliverables for each row execute function public.prevent_org_reassignment();
