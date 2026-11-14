# Security verification plan (not yet executed)

## Required staging tests
1. Create two organisations A and B and three users: A-client, A-staff and B-client.
2. Confirm A-client can SELECT only A records across services, projects, leads, deliverables, tasks, messages and invoices.
3. Confirm A-client cannot INSERT/UPDATE/DELETE leads, projects, tasks, services or invoices.
4. Confirm A-client can call review_deliverable only on submitted A deliverables, changing only the status to approved or changes_requested.
5. Confirm A-client cannot call review_deliverable for B, or alter project_id, organisation_id, title or description through review.
6. Confirm A-staff cannot create an A lead referencing a B project; check foreign-key rejection.
7. Confirm A-staff cannot reassign any existing project, lead, task, service or deliverable to B.
8. Confirm unauthenticated sessions cannot read organisation records or invoke review RPC.
9. Confirm only trusted provisioning paths can create organisations and memberships.
10. Confirm client-specific service subscriptions and staff assignments are enforced by application-level and database authorisation before production.

## Caveats
The initial schema's staff policy allows any staff member of an organisation to manage all records of that organisation. A dedicated staff assignment model is still needed.
RLS and SQL must be tested against the exact Supabase/Postgres version used in staging.
The demo role selector is not an authentication system and must be replaced.
