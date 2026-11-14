# Staging-only database draft

File: `supabase/drafts/amplify_marketing_and_ooh.sql`

**Unapplied SQL.** The connected Supabase project is Omega Education; this SQL must not be run against it.

The draft adds organisation-scoped media campaigns, private staff-only OOH flights and event history, and a separate minimal client-facing OOH status projection. It revokes direct authenticated writes and exposes an **atomic service-role-only** transition function with optimistic locking and an internal role-membership check.

The backend must validate an actual access token and derive the actor ID from it. It must never accept a body-supplied actor ID or grant service-role credentials to a browser. The function does not independently inspect physical artwork or media supplier systems: the referenced evidence must be verified by authorised staff and stored securely.

**Before use:** Apply prior schema drafts in a disposable environment; confirm function SQL compiles; test client/staff/outsider and cross-org access; run Supabase advisors, then migration apply through approved workflow. Review foreign key consistency, provider cost visibility, version conflicts, concurrency and audit retention. No live write may be enabled without this evidence.
