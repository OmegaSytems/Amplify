# Amplify build and release status — 14 November 2026

## Browser demo features — implemented
- Nexus-style management, staff and client UI, responsive themes, dashboards, client portfolio, CRM, tasks, calendar, campaigns, content, leads, closing, billing, approvals, reports and files.
- Separate responsive public website with four service offers, OOH introduction, operating process and a local-only enquiry brief (no submission service).
- 23 Supply-style staff operating system workspaces, including linked work timer, timesheets, shift/weekly reviews, rosters, leave, training, goals, coaching, QA and people reporting.
- 20 agency/omnichannel operational workspaces, 28 channel catalogue, OOH planning and evidence gates, creatives, budgets, attribution, SEO/AEO, email, publishing, supplier registers, onboarding and retention.
- Fictional sample records are kept in local browser storage. The demo role switcher is not authentication.

## Backend foundations — code only
- Supabase organisation schema/migrations, not applied or verified.
- Independent marketing/OOH SQL draft with restrictive grants, RLS, event log and atomic transition RPC, not applied.
- Pure OOH domain state machine, plus Node HTTP API scaffold checking Supabase user tokens, actual organisation membership, role and optimistic event versions.
- CLI test commands added. Live browser, Supabase and provider integration tests have not been run.

## Outstanding release gates
1. Provision dedicated Amplify Supabase project; the connected one is Omega Education and must remain separate.
2. Run staging migrations and adviser reports; test cross-organisation access, RLS, staff/client permissions and atomic event transitions.
3. Replace demo localStorage, preview roles and mock data with authenticated client/staff experiences and per-service access.
4. Add secure OOH supplier/venue bookings, real written permission and installation evidence storage; claims and campaign measurement validation.
5. Add actual advertising platform OAuth, analytics ingestion, attribution, content publishing, email/SMS and consent enforcement.
6. Finish Stripe/webhook billing, contracts, signed proposals, approvals, staff/HR confidentiality and payroll integrations.
7. Complete access auditing, monitoring, backups, incident response, rate limits, privacy and Australian legal review.
8. Run Node suites, automated browser/accessibility tests, performance tests and manual cross-role QA, then reviewed merge and deployment.

## Operating rules
In code is not equal to staged, verified, merged or deployed. Never push directly to main, add GitHub Actions workflows or publish credentials/client data in this public repository.

## Most recent isolated checks
- 137 management/staff/client/agency page renders passed in a mocked DOM.
- Five mocked API checks passed for unauthenticated, unconfigured, outsider, client and staff read behaviour.
- OOH domain transition and demo booking-to-close-out path passed isolated checks.
- These are not live browser, installed Node suite or hosted Supabase integration tests.

## 14 November — P0 delivery increment
- Shared workstream domain policy with 3 offer families, Lead Engine modes, documented launch-gate blockers, versioned manager transitions, client-input submission/staff verification, QA/delivery and client lead acceptance.
- Five additional staff/client workflow screens wired into the existing localhost preview. All records remain fictional in localStorage; role-switching is not authentication.
- New review-only SQL for explicit client approver authority and immutable review/audit records. It has not been applied or tested in a dedicated database.
- Isolated tests: seven new domain-rule checks and 17 route/interaction checks passed in an isolated V8 environment, not a live browser, Postgres or provider integration.
