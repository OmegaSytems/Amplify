# Amplify implementation and release gates

## Status
The browser UI is demo-only. The SQL migration is an **unapplied draft** and has not been executed or verified against a Supabase project. The repository is currently public. Never commit API keys, credentials, private client data or customer records.

## Offer modules
1. Paid: ad accounts, campaigns, creative, spend, leads, attribution, reporting, approval.
2. Organic: social publishing calendar, SEO/AEO, Substack, content assets, review and approval.
3. Leads Only: prospect research, validation, deduplication, batches, export, replacement requests.
4. Leads + Closing: outbound sequences, appointments, pipeline, follow-up, closed revenue.

## Shared client portal
Overview, subscriptions, campaigns, leads, content, approvals, tasks, messages, assets, invoices, support and settings.

## Staff and management
CRM, account assignment, delivery boards, quality control, approvals, financial performance, renewals, reporting and audit events.

## Required before real use
- Make repository private or explicitly accept public source visibility.
- Set up a dedicated Supabase project and environment-separated credentials.
- Review schema with a security engineer; implement membership invitation flow, org provisioning and server-side RBAC.
- Add cross-tenant foreign-key consistency constraints, immutable organisation ownership and strict column-level approval RPCs.
- Apply migration in staging; test RLS with separate staff, client and outsider identities, including cross-organisation reads and writes.
- Replace demo role switcher with actual Supabase Auth sessions; never trust client-selected roles or organisation IDs.
- Restrict service visibility per subscribed offer and per staff assignment.
- Build backend endpoints with input validation, idempotency and audit events.
- Implement Stripe webhooks with signature verification and idempotent event processing.
- Add external advertising/analytics connections with secure server-side OAuth token storage.
- Run unit, integration, end-to-end, accessibility and responsive tests locally before review.
- Configure deployment secrets, backups, logging and incident handling.
- Do not mark this as deployed or production-ready until authenticated end-to-end checks pass.

## GitHub workflow
Develop on feature branches; open draft PRs; run tests locally; avoid unnecessary pushes and CI runs; never push to main.
