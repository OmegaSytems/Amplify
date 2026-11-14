# Client delivery workflow — implementation and release notes

## Browser implementation (interactive, fictional)
- src/domain/delivery-workflows.mjs: three offer families, Leads Only vs Leads + Closing mode, launch prerequisite evaluation, staff-verified onboarding, manager-accepted handoffs, QA-gated lead batches and versioned client acceptance/rejection.
- src/delivery/delivery-os.js and .css: five new workspaces for staff and clients: Scopes & launch gates, Onboarding inputs, Commercial handoffs (staff only), Lead batches & acceptance, Scope changes.
- Staff records fictional prerequisite evidence; client submits input descriptions; staff independently verify. Manager actions cannot launch until checks pass.
- Clients can review fictional delivered leads exactly once and must provide a reason when rejecting. Batch QA and delivery require staff roles. Scope-change requests require a new SOW instead of silently expanding service.
- All data lives in the browser's demo localStorage. Preview roles are chosen in a drop-down. **This is not authenticated and must never contain real client data.**

## Database design, pending staging
- Base migration and hardening drafts already exist in supabase/migrations.
- Review-only sql: supabase/drafts/amplify_client_approvals_hardening.sql.
- This draft specifically replaces membership-only approval with explicit client-approver authorisation, an active service/project check, non-exposed privileged implementation, dated reviews, and removal of direct authenticated UPDATE(status) on deliverables.
- Requires a dedicated Amplify Supabase project, reproducible migration generation, RLS/grant review, end-to-end authenticated tests and audit review. **Do not apply to Omega Education.**
- Creation/revocation of approvers and signed scope ingestion must be through independently authenticated, audited administration tools (not directly exposed in the demo).
- Status update policies for staff submit/publish must use a distinct controlled RPC later; this draft intentionally restricts generic direct edits to prevent a bypass.

## Test matrix (must run on an actual dedicated staging database)
1. Client A approver can approve an A submitted deliverable linked to an active A subscribed project, and a review/audit row appears once.
2. Client A viewer (membership only, no approver authority) cannot approve; staff cannot impersonate client review; client B cannot approve for A.
3. Revoked approver cannot approve, and a stale/second review is rejected without rewriting history.
4. Changes requested requires a non-empty note. Direct authenticated UPDATE(status) and INSERT(status=approved) are denied.
5. Missing service, out-of-scope project, cancelled service or unsigned engagement cannot be presented as client-approved.
6. Cross-org lead batch records and onboarding inputs must remain invisible/unwritable by unrelated users (new dedicated schema/RLS still required).
7. Storage policies, staff-assignment restrictions and client offer entitlements must be verified separately.
8. Generate and run SQL/RLS pgTAP tests in the isolated project; run security/performance advisers. No tests have run against a live Amplify database yet.

## Remaining core P0 work
- Actual auth sessions, invitation and client-approver management.
- Contract, SOW revision, deliverable/project entitlement and readiness tables.
- Tenant/staff assignment RLS for every workstream and batch.
- Secure evidence uploads and verified source/date checks.
- Client batch/acceptance stored procedures, notifications, support and reporting.
- Stripe and ad/CRM system integration and production deployment.

## Sources
- Google Drive Omega Amplify Operating Model, Service Delivery & QA, Account Manager, Lead Gen Manager, Compliance & Privacy, MD/BM and Finance handbooks.
- docs/CLIENT-STAFF-FEATURE-GAP-AUDIT.md
- Supabase RLS, database functions and column-privileges documentation (reviewed November 2026).
