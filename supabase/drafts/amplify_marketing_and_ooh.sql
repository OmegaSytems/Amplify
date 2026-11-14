-- REVIEW-ONLY DRAFT. NOT APPLIED. Never run against Omega Education.
-- Depends on the original organisations, memberships and organisation access functions.
-- Execute in a dedicated Omega Amplify staging project only after review.
--
-- The browser must NEVER receive a service_role key. Writes are server-only.
-- All marketing and OOH tables deny direct anon/authenticated writes.

create table if not exists public.media_campaigns (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null check(length(trim(title)) between 1 and 240),
  channel text not null check(length(trim(channel)) between 1 and 100),
  objective text not null default '',
  status text not null default 'Draft' check (status in ('Draft','Review','Approved','Active','Paused','Closed','Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(id,organisation_id)
);

create table if not exists public.ooh_flights (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  campaign_id uuid,
  name text not null check(length(trim(name)) between 1 and 240),
  site text not null check(length(trim(site)) between 1 and 400),
  format text not null check(length(trim(format)) between 1 and 120),
  supplier text not null check(length(trim(supplier)) between 1 and 250),
  starts_on date not null,
  ends_on date not null,
  total_budget_cents bigint not null check(total_budget_cents>0),
  approved_budget_cents bigint not null default 0 check(approved_budget_cents>=0),
  spend_cents bigint not null default 0 check(spend_cents>=0),
  status text not null default 'Draft' check(status in ('Draft','Booked','Live','Closed','Cancelled')),
  version bigint not null default 0 check(version>=0),
  permission_ref text,
  budget_approval_ref text,
  creative_ref text,
  capacity_ref text,
  tracking_ref text,
  tracking_url text,
  booking_ref text,
  install_proof_ref text,
  inspection_ref text,
  removal_ref text,
  cancel_reason text,
  response_count integer not null default 0 check(response_count>=0),
  qualified_count integer not null default 0 check(qualified_count>=0 AND qualified_count<=response_count),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint flight_dates_valid check(ends_on>=starts_on),
  constraint flight_campaign_org_fk foreign key(campaign_id,organisation_id)
    references public.media_campaigns(id,organisation_id)
);

create table if not exists public.ooh_flight_events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  flight_id uuid not null references public.ooh_flights(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  action text not null check(length(action) between 1 and 50),
  payload jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);

-- Separate projection for client access. Keeps supplier references,
-- internal permissions and cost approvals out of the client-facing Data API.
create table if not exists public.client_ooh_updates (
  flight_id uuid primary key references public.ooh_flights(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  format text not null,
  status text not null,
  starts_on date not null,
  ends_on date not null,
  updated_at timestamptz not null default now()
);
create index if not exists ooh_flights_org_idx on public.ooh_flights(organisation_id,created_at desc);
create index if not exists ooh_events_org_flight_idx on public.ooh_flight_events(organisation_id,flight_id,at desc);
create index if not exists media_campaigns_org_idx on public.media_campaigns(organisation_id,status);
create index if not exists client_ooh_updates_org_idx on public.client_ooh_updates(organisation_id,updated_at desc);

alter table public.media_campaigns enable row level security;
alter table public.ooh_flights enable row level security;
alter table public.ooh_flight_events enable row level security;
alter table public.client_ooh_updates enable row level security;

-- Revoke any permissive defaults in public. Safe access is explicit.
revoke all on public.media_campaigns,public.ooh_flights,public.ooh_flight_events,public.client_ooh_updates from anon,authenticated;
grant select on public.media_campaigns,public.ooh_flights,public.ooh_flight_events,public.client_ooh_updates to authenticated;
-- The service_role can write only from a trusted backend.
grant select,insert,update,delete on public.media_campaigns,public.ooh_flights,public.ooh_flight_events,public.client_ooh_updates to service_role;

drop policy if exists "campaign member read" on public.media_campaigns;
create policy "campaign member read" on public.media_campaigns for select to authenticated
 using(public.has_org_access(organisation_id));

drop policy if exists "flight staff read" on public.ooh_flights;
create policy "flight staff read" on public.ooh_flights for select to authenticated
 using(public.has_org_staff_access(organisation_id));

drop policy if exists "event staff read" on public.ooh_flight_events;
create policy "event staff read" on public.ooh_flight_events for select to authenticated
 using(public.has_org_staff_access(organisation_id));

drop policy if exists "client OOH projection read" on public.client_ooh_updates;
create policy "client OOH projection read" on public.client_ooh_updates for select to authenticated
 using(public.has_org_access(organisation_id));

-- Atomic server-side transition helper. Callable only with a service_role
-- key on a trusted server after real session verification. The function also
-- re-checks supplied actor's membership to prevent a forged body role.
create or replace function public.progress_ooh_flight(
  p_flight_id uuid,
  p_expected_version bigint,
  p_action text,
  p_payload jsonb,
  p_actor_id uuid
) returns public.ooh_flights
language plpgsql security invoker set search_path=''
as $body$
declare
  v public.ooh_flights;
  v_role text;
  v_ref text := trim(coalesce(p_payload->>'ref',''));
  v_amount bigint;
  v_responses integer;
  v_qualified integer;
  v_spend bigint;
begin
  if p_action not in ('permission','budget','creative','capacity','tracking','book','install','inspect','outcome','close','cancel') then
    raise exception 'Unknown OOH action' using errcode='22023';
  end if;
  if p_payload is null or jsonb_typeof(p_payload)<>'object' or length(p_payload::text)>12000 then
    raise exception 'Invalid event payload' using errcode='22023';
  end if;
  select * into v from public.ooh_flights where id=p_flight_id for update;
  if not found then raise exception 'Flight not found' using errcode='P0002'; end if;
  if v.version<>p_expected_version then raise exception 'Stale flight version' using errcode='40001'; end if;
  select m.role into v_role from public.memberships m
   where m.organisation_id=v.organisation_id and m.user_id=p_actor_id;
  if v_role not in ('owner','manager','staff') or v_role is null then
    raise exception 'Not authorised to change this flight' using errcode='42501';
  end if;
  if p_action in ('budget','cancel') and v_role not in ('owner','manager') then
    raise exception 'Manager approval required' using errcode='42501';
  end if;
  if p_action <> 'outcome' and (length(v_ref)<3 or length(v_ref)>512) then
    raise exception 'Evidence reference required' using errcode='22023';
  end if;

  if p_action in ('permission','budget','creative','capacity','tracking','book') and v.status<>'Draft' then
    raise exception 'Action requires Draft flight' using errcode='22023';
  end if;

  case p_action
    when 'permission' then
      update public.ooh_flights set permission_ref=v_ref where id=p_flight_id;
    when 'budget' then
      if coalesce(p_payload->>'amount_cents','') !~ '^[0-9]{1,15}
        raise exception 'Invalid amount' using errcode='22023';
      end if;
      v_amount := (p_payload->>'amount_cents')::bigint;
      if v_amount<v.total_budget_cents then
        raise exception 'Insufficient approved budget' using errcode='22023';
      end if;
      update public.ooh_flights set budget_approval_ref=v_ref,approved_budget_cents=v_amount where id=p_flight_id;
    when 'creative' then
      update public.ooh_flights set creative_ref=v_ref where id=p_flight_id;
    when 'capacity' then
      update public.ooh_flights set capacity_ref=v_ref where id=p_flight_id;
    when 'tracking' then
      if coalesce(p_payload->>'url','') not like 'https://%' then
        raise exception 'HTTPS tracking URL required' using errcode='22023';
      end if;
      update public.ooh_flights set tracking_ref=v_ref,tracking_url=p_payload->>'url' where id=p_flight_id;
    when 'book' then
      if v.permission_ref is null or v.budget_approval_ref is null or v.creative_ref is null
        or v.capacity_ref is null or v.tracking_ref is null or v.approved_budget_cents<v.total_budget_cents
      then raise exception 'Required booking gates incomplete' using errcode='22023'; end if;
      update public.ooh_flights set booking_ref=v_ref,status='Booked' where id=p_flight_id;
    when 'install' then
      if v.status<>'Booked' then raise exception 'Booking required' using errcode='22023'; end if;
      update public.ooh_flights set install_proof_ref=v_ref,status='Live' where id=p_flight_id;
    when 'inspect' then
      if v.status<>'Live' then raise exception 'Live placement required' using errcode='22023'; end if;
      update public.ooh_flights set inspection_ref=v_ref where id=p_flight_id;
    when 'outcome' then
      if v.status not in ('Live','Closed') then raise exception 'Live or closed flight required' using errcode='22023'; end if;
      if coalesce(p_payload->>'responses','') !~ '^[0-9]{1,9}
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;


-- Populate client-safe projection when a draft flight is first created.
-- This avoids a client-visible record appearing only after the first action.
create or replace function public.project_new_ooh_flight()
returns trigger
language plpgsql security invoker set search_path=''
as $
begin
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(new.id,new.organisation_id,new.name,new.format,new.status,new.starts_on,new.ends_on,now())
  on conflict(flight_id) do update
    set title=excluded.title,format=excluded.format,status=excluded.status,
        starts_on=excluded.starts_on,ends_on=excluded.ends_on,updated_at=excluded.updated_at;
  return new;
end $;
revoke all on function public.project_new_ooh_flight() from public,anon,authenticated;
drop trigger if exists project_new_ooh_flight on public.ooh_flights;
create trigger project_new_ooh_flight
after insert on public.ooh_flights for each row execute function public.project_new_ooh_flight();

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.
 then
        raise exception 'Invalid amount' using errcode='22023';
      end if;
      v_amount := (p_payload->>'amount_cents')::bigint;
      if v_amount<v.total_budget_cents then
        raise exception 'Insufficient approved budget' using errcode='22023';
      end if;
      update public.ooh_flights set budget_approval_ref=v_ref,approved_budget_cents=v_amount where id=p_flight_id;
    when 'creative' then
      update public.ooh_flights set creative_ref=v_ref where id=p_flight_id;
    when 'capacity' then
      update public.ooh_flights set capacity_ref=v_ref where id=p_flight_id;
    when 'tracking' then
      if (p_payload->>'url') not like 'https://%' then
        raise exception 'HTTPS tracking URL required' using errcode='22023';
      end if;
      update public.ooh_flights set tracking_ref=v_ref,tracking_url=p_payload->>'url' where id=p_flight_id;
    when 'book' then
      if v.permission_ref is null or v.budget_approval_ref is null or v.creative_ref is null
        or v.capacity_ref is null or v.tracking_ref is null or v.approved_budget_cents<v.total_budget_cents
      then raise exception 'Required booking gates incomplete' using errcode='22023'; end if;
      update public.ooh_flights set booking_ref=v_ref,status='Booked' where id=p_flight_id;
    when 'install' then
      if v.status<>'Booked' then raise exception 'Booking required' using errcode='22023'; end if;
      update public.ooh_flights set install_proof_ref=v_ref,status='Live' where id=p_flight_id;
    when 'inspect' then
      if v.status<>'Live' then raise exception 'Live placement required' using errcode='22023'; end if;
      update public.ooh_flights set inspection_ref=v_ref where id=p_flight_id;
    when 'outcome' then
      if v.status not in ('Live','Closed') then raise exception 'Live or closed flight required' using errcode='22023'; end if;
      if (p_payload->>'responses') !~ '^[0-9]{1,9}$'
        or (p_payload->>'qualified') !~ '^[0-9]{1,9}$'
        or (p_payload->>'spend_cents') !~ '^[0-9]{1,15}$'
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.

        or coalesce(p_payload->>'qualified','') !~ '^[0-9]{1,9}
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.
 then
        raise exception 'Invalid amount' using errcode='22023';
      end if;
      v_amount := (p_payload->>'amount_cents')::bigint;
      if v_amount<v.total_budget_cents then
        raise exception 'Insufficient approved budget' using errcode='22023';
      end if;
      update public.ooh_flights set budget_approval_ref=v_ref,approved_budget_cents=v_amount where id=p_flight_id;
    when 'creative' then
      update public.ooh_flights set creative_ref=v_ref where id=p_flight_id;
    when 'capacity' then
      update public.ooh_flights set capacity_ref=v_ref where id=p_flight_id;
    when 'tracking' then
      if (p_payload->>'url') not like 'https://%' then
        raise exception 'HTTPS tracking URL required' using errcode='22023';
      end if;
      update public.ooh_flights set tracking_ref=v_ref,tracking_url=p_payload->>'url' where id=p_flight_id;
    when 'book' then
      if v.permission_ref is null or v.budget_approval_ref is null or v.creative_ref is null
        or v.capacity_ref is null or v.tracking_ref is null or v.approved_budget_cents<v.total_budget_cents
      then raise exception 'Required booking gates incomplete' using errcode='22023'; end if;
      update public.ooh_flights set booking_ref=v_ref,status='Booked' where id=p_flight_id;
    when 'install' then
      if v.status<>'Booked' then raise exception 'Booking required' using errcode='22023'; end if;
      update public.ooh_flights set install_proof_ref=v_ref,status='Live' where id=p_flight_id;
    when 'inspect' then
      if v.status<>'Live' then raise exception 'Live placement required' using errcode='22023'; end if;
      update public.ooh_flights set inspection_ref=v_ref where id=p_flight_id;
    when 'outcome' then
      if v.status not in ('Live','Closed') then raise exception 'Live or closed flight required' using errcode='22023'; end if;
      if (p_payload->>'responses') !~ '^[0-9]{1,9}$'
        or (p_payload->>'qualified') !~ '^[0-9]{1,9}$'
        or (p_payload->>'spend_cents') !~ '^[0-9]{1,15}$'
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.

        or coalesce(p_payload->>'spend_cents','') !~ '^[0-9]{1,15}
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.
 then
        raise exception 'Invalid amount' using errcode='22023';
      end if;
      v_amount := (p_payload->>'amount_cents')::bigint;
      if v_amount<v.total_budget_cents then
        raise exception 'Insufficient approved budget' using errcode='22023';
      end if;
      update public.ooh_flights set budget_approval_ref=v_ref,approved_budget_cents=v_amount where id=p_flight_id;
    when 'creative' then
      update public.ooh_flights set creative_ref=v_ref where id=p_flight_id;
    when 'capacity' then
      update public.ooh_flights set capacity_ref=v_ref where id=p_flight_id;
    when 'tracking' then
      if (p_payload->>'url') not like 'https://%' then
        raise exception 'HTTPS tracking URL required' using errcode='22023';
      end if;
      update public.ooh_flights set tracking_ref=v_ref,tracking_url=p_payload->>'url' where id=p_flight_id;
    when 'book' then
      if v.permission_ref is null or v.budget_approval_ref is null or v.creative_ref is null
        or v.capacity_ref is null or v.tracking_ref is null or v.approved_budget_cents<v.total_budget_cents
      then raise exception 'Required booking gates incomplete' using errcode='22023'; end if;
      update public.ooh_flights set booking_ref=v_ref,status='Booked' where id=p_flight_id;
    when 'install' then
      if v.status<>'Booked' then raise exception 'Booking required' using errcode='22023'; end if;
      update public.ooh_flights set install_proof_ref=v_ref,status='Live' where id=p_flight_id;
    when 'inspect' then
      if v.status<>'Live' then raise exception 'Live placement required' using errcode='22023'; end if;
      update public.ooh_flights set inspection_ref=v_ref where id=p_flight_id;
    when 'outcome' then
      if v.status not in ('Live','Closed') then raise exception 'Live or closed flight required' using errcode='22023'; end if;
      if (p_payload->>'responses') !~ '^[0-9]{1,9}$'
        or (p_payload->>'qualified') !~ '^[0-9]{1,9}$'
        or (p_payload->>'spend_cents') !~ '^[0-9]{1,15}$'
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.

      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.
 then
        raise exception 'Invalid amount' using errcode='22023';
      end if;
      v_amount := (p_payload->>'amount_cents')::bigint;
      if v_amount<v.total_budget_cents then
        raise exception 'Insufficient approved budget' using errcode='22023';
      end if;
      update public.ooh_flights set budget_approval_ref=v_ref,approved_budget_cents=v_amount where id=p_flight_id;
    when 'creative' then
      update public.ooh_flights set creative_ref=v_ref where id=p_flight_id;
    when 'capacity' then
      update public.ooh_flights set capacity_ref=v_ref where id=p_flight_id;
    when 'tracking' then
      if (p_payload->>'url') not like 'https://%' then
        raise exception 'HTTPS tracking URL required' using errcode='22023';
      end if;
      update public.ooh_flights set tracking_ref=v_ref,tracking_url=p_payload->>'url' where id=p_flight_id;
    when 'book' then
      if v.permission_ref is null or v.budget_approval_ref is null or v.creative_ref is null
        or v.capacity_ref is null or v.tracking_ref is null or v.approved_budget_cents<v.total_budget_cents
      then raise exception 'Required booking gates incomplete' using errcode='22023'; end if;
      update public.ooh_flights set booking_ref=v_ref,status='Booked' where id=p_flight_id;
    when 'install' then
      if v.status<>'Booked' then raise exception 'Booking required' using errcode='22023'; end if;
      update public.ooh_flights set install_proof_ref=v_ref,status='Live' where id=p_flight_id;
    when 'inspect' then
      if v.status<>'Live' then raise exception 'Live placement required' using errcode='22023'; end if;
      update public.ooh_flights set inspection_ref=v_ref where id=p_flight_id;
    when 'outcome' then
      if v.status not in ('Live','Closed') then raise exception 'Live or closed flight required' using errcode='22023'; end if;
      if (p_payload->>'responses') !~ '^[0-9]{1,9}$'
        or (p_payload->>'qualified') !~ '^[0-9]{1,9}$'
        or (p_payload->>'spend_cents') !~ '^[0-9]{1,15}$'
      then raise exception 'Invalid campaign outcomes' using errcode='22023'; end if;
      v_responses:=(p_payload->>'responses')::int;
      v_qualified:=(p_payload->>'qualified')::int;
      v_spend:=(p_payload->>'spend_cents')::bigint;
      if v_qualified>v_responses then raise exception 'Qualified count exceeds responses' using errcode='22023'; end if;
      update public.ooh_flights set response_count=v_responses,qualified_count=v_qualified,spend_cents=v_spend where id=p_flight_id;
    when 'close' then
      if v.status<>'Live' or v.inspection_ref is null then
        raise exception 'Live inspection required' using errcode='22023'; end if;
      update public.ooh_flights set removal_ref=v_ref,status='Closed' where id=p_flight_id;
    when 'cancel' then
      if v.status not in ('Draft','Booked') then raise exception 'Cannot cancel at this stage' using errcode='22023'; end if;
      update public.ooh_flights set cancel_reason=v_ref,status='Cancelled' where id=p_flight_id;
  end case;

  update public.ooh_flights set version=version+1,updated_at=now() where id=p_flight_id returning * into v;
  insert into public.ooh_flight_events(organisation_id,flight_id,actor_id,action,payload)
  values(v.organisation_id,v.id,p_actor_id,p_action,p_payload);
  insert into public.client_ooh_updates(flight_id,organisation_id,title,format,status,starts_on,ends_on,updated_at)
  values(v.id,v.organisation_id,v.name,v.format,v.status,v.starts_on,v.ends_on,now())
  on conflict(flight_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  return v;
end;
$body$;

revoke all on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.progress_ooh_flight(uuid,bigint,text,jsonb,uuid) to service_role;

-- Historical evidence must not be editable by client sessions.
-- Confirm all policies and grants in staging, and run Supabase security advisors
-- before promoting the migration.
