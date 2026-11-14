# Omega Amplify

Responsive agency operating system UI for management, staff and client workspaces, built without Lovable credits.

## Preview
Open `index.html` in a modern browser — no installation or build step required. All accounts, campaigns, leads, messages and financials are **fictional demo records**. Interactions are saved locally in your browser.

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
