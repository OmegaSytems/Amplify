# Omega Amplify

Responsive agency operating system UI for management, staff and client workspaces, built without Lovable credits.

## Preview
Use **Node.js 20+** and run `npm run preview`; open `http://127.0.0.1:8790/app` for the portal and `/` for the public site. Opening `index.html` directly from `file://` is not supported because the portal now imports a shared ES module. No package installation is required for this local preview. All accounts, campaigns, leads, messages and financials are **fictional demo records**. Interactions are saved locally in your browser.

## Included
Management: client portfolio and profiles, CRM, projects, paid ads, organic production, lead engine, closing deals, approvals, tasks, files, messages, reports, billing, team and support.

Staff: assigned client delivery workspaces, task boards, campaigns, content calendar, leads, deals, approvals, files and communication.

Client: services, performance, content, approvals, projects, files, messages, invoices and support. Offer navigation is filtered by demo subscriptions.

UI includes forms, workflow actions, responsive side navigation, dark/light themes, command search (Ctrl/Cmd+K), notifications, CSV exports, calendar, tables, kanban, charts and sample approval flows.

## Important limitation
**This is a static preview, not a production-ready portal.** The role selector is not authentication. The existing Supabase migrations are unexecuted drafts and are not connected to this UI. Real clients, payment processing, advertising accounts, storage, invitations and access security must be implemented and tested separately. Never enter real client data.

## Verification
Run `node tests/ui-smoke.mjs` (Node 20+). The test checks all primary role/page combinations using a mocked DOM. Browser-based accessibility and visual testing are still required.

Keep all development in feature branches with draft pull requests. Do not push to main.

## Omnichannel and backend foundation

Additional screens include OOH, digital and traditional media, creative review, attribution, suppliers, proposals, publishing and client success. See docs/OMNICHANNEL-OOH.md and docs/BUILD-STATUS.md.
Use Node 20+ to run npm run test:all. The isolated API scaffold uses npm run start:api, but is not ready for deployment without the separately reviewed Amplify database and production hardening. Browser preview is not connected to that API.

## Run local previews

Run `npm run preview` with Node 20+ to start a localhost-only preview at `http://127.0.0.1:8790` (public website) and `http://127.0.0.1:8790/app` (unauthenticated staff/client demo). This deliberately does **not** expose private SQL, environment variables or any production data. It is a preview only, never host it publicly.

## Client-delivery workflows (P0 demo implementation)

The new workspaces are **Scopes & launch gates**, **Onboarding inputs**, **Commercial handoffs**, **Lead batches & acceptance** and **Scope changes**. They share the domain policy in `src/domain/delivery-workflows.mjs`, use versioned demo transitions and are documented in [`docs/DELIVERY-WORKFLOWS.md`](docs/DELIVERY-WORKFLOWS.md).

Only fictional browser-local records are used; signed SOWs, client approval identities, billing state and QA evidence are **simulated**, not real or independently verified. Actual production requires a dedicated Amplify Supabase project. Do not run any Amplify SQL against Omega Education.

## Amplify-only staff operations

Seven new staff-only workspaces cover CRM, governed outreach, independent QA, finance, capacity, account health and executive exceptions. See [`docs/AMPLIFY-STAFF-OPERATIONS.md`](docs/AMPLIFY-STAFF-OPERATIONS.md). These are fictional demo workflows, not live backend services.


## Nexus Prime operator connection (P0 draft)
Customer identity, marketing permissions and shared campaigns belong to Nexus Prime in Omega Systems. The new staff-side API client is in src/integrations/prime-operator.mjs with tests and the handoff plan in docs/PRIME_OPERATOR_HANDOFF.md. It is not yet wired to live staff SSO, a Prime database or external marketing providers. The historical Amplify client UI remains an unauthenticated local-only demo and must not be deployed as a customer portal.
