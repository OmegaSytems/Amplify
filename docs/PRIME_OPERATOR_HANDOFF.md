# Amplify staff access to Nexus Prime — P0 handoff

The customer signs into Nexus Prime at Omega Systems, connects their own marketing
accounts, and explicitly grants scopes to the listed Omega Amplify operator organisation.
Omega Amplify staff do NOT get their credentials or a separate copy of their marketing data.

Implemented: src/integrations/prime-operator.mjs
- Accepts a short-lived user access token from the shared Nexus Prime identity authority.
- Lists only grants visible to that signed-in staff user in Prime.
- Reads and edits customer marketing drafts through Prime's tenant-level RLS.
- Operator managers can assign/remove verified staff using protected Prime RPCs.
- Never accepts service-role credentials, auto-approves campaigns, spends advertising
  budgets, books out-of-home inventory or publishes social posts.

Setup needed: actual Prime Supabase project and migration in Omega Systems;
verified staff users registered as members of the trusted Omega Amplify operator
organisation in Prime; true cross-domain SSO/session integration; a private
staff dashboard connection and accessible audit/status UI; staging permission tests.

Important: Amplify's own Supabase project is for the agency's internal operations.
Do not duplicate Prime records or write to Prime using Amplify service-role keys.
The legacy /app client role in Amplify is fictional browser-local preview data.
It must be retired only AFTER Prime's real customer screens cover those workflows.
Do not deploy the existing demo role switcher to real customers.

Run locally with Node 20+: node --test tests/prime-operator.test.mjs
Release blockers: integration end-to-end browser test, actual session source,
RLS security matrix, revocation propagation, CSP/CORS, rate limits and logs.
