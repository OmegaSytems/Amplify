# Amplify internal staff operations — Nexus Prime separation

## Ownership boundary

Amplify owns internal sales, proposals, BM handoffs, staff allocation, independent QA, incidents, authorised outreach, unit economics, account management, renewals and executive exceptions. Nexus Prime owns the shared customer marketing account, connected platforms, publishing, studio and client agents. Amplify will later act through scoped Nexus Prime APIs rather than duplicating client accounts.

## Implemented in the draft branch

Seven internal screens: Agency Control Centre, Sales Qualification, SDR Authorisations, Independent QA & Incidents, Agency Finance & Margin, Team Capacity, Account Health & Renewals. Shared pure transition rules validate CRM stages, signed scope/pricing approvals, outbound suppression, independent QA, release blocks, margin excluding pass-through media, capacity and health flags. Fictional records persist only in the browser demo.

## Still required before live use

- Dedicated Amplify database, authenticated staff roles, assignment enforcement, immutable audit and private evidence files.
- Actual canonical CRM records, lead provenance, dedupe, batch acceptance, consent/suppression and outreach service.
- Contract signature, pricing authority, billing and Stripe reconciliation, actual time logs and commission ledger.
- Nexus Prime account links, scoped delegated access, event synchronisation and provider integrations.
- Real staff rosters, HR/leave, notifications, SLA escalation, report data and release testing.

The public repository and role-switching demo must not contain actual staff/client information.