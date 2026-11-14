# Omega Amplify — Client & Staff Feature-Gap Audit
Date: 14 November 2026 | Branch: feat/staff-client-portals | Status: research / build backlog, NOT live implementation.

## 1. Sources and scope

**Authoritative operating rules**
- [Operating Model & Service Catalogue](https://docs.google.com/document/d/1VzLU4fq4vle7SDqhfvgnk6LC2c-DYCl_XeuDFcz6L5A/edit): Paid, Organic and Lead Engine; Leads Only / Leads + Closing; scope, client obligations, prices and handoffs.
- [Service Delivery & QA](https://docs.google.com/document/d/1N8FQxFBpYPRfQocPonF8eTrDAnktIfFcnjeanC3f8rM/edit): launch gates, evidence, QA, client acceptance, complaints, reporting, change control.
- [MD](https://docs.google.com/document/d/18gIKv2sckFCxewpdKGYkiNMKk45bnixUiC_-cQIiKfA/edit), [BM](https://docs.google.com/document/d/1pRShp2iUYk3A0uFgF7I886RR00_0xBtlWJPrAUHl10Q/edit), [Client Delivery Manager](https://docs.google.com/document/d/1Soy3u7SmxDJOS8Mzi3DgSIEcQLm4ejVlSp4HwcaijVQ/edit), [Account Manager](https://docs.google.com/document/d/1FRyIYcW7lqKuFJN_ssb8kH68BwosLruEB4U7LFO-l4k/edit), [Finance](https://docs.google.com/document/d/1uWq54rE_2U8MCd6xcMOmKDY89vGGX0CUpbzCX9Jlaqs/edit), [Admin](https://docs.google.com/document/d/1ZVio9R6btvvKAgL6k-t2R5vuLj8Lwx1m5ZfHxYLEQ44/edit), [Compliance](https://docs.google.com/document/d/1xx5lia9w7F8ZPKxbUNVkFq0t5asmjP3L3se4b2KI1pk/edit).
- [Lead Gen Manager](https://docs.google.com/document/d/1logD_-sk0V0W2W1XAaOwKxyJTN8rKlpAlYfgVfZbKU8/edit), [Lead Strategist](https://docs.google.com/document/d/1XWUrALdrybIFPAU7tUTErjGkJ2-Pbe_C2gJX2je1Gzo/edit), [Setter](https://docs.google.com/document/d/1DhI9jlD47tA0CZSvFlOfDuotjwRMPXXN0K49c6WK8uk/edit), [SDR](https://docs.google.com/document/d/1amtNFHVw2HoojsFPerjWgCQ6MQSy2vimcpxI7DP94Ec/edit), [Closer](https://docs.google.com/document/d/1RuYxzFZbAiqNmTz3s8QekP7FMnJWX2Xi7p-M3WK8Rcs/edit), [Sales Manager](https://docs.google.com/document/d/16--Dke5e-be9hrDJx1n9bohU9uNcENAwjnw4_pTVi_c/edit).
- [Content Production](https://docs.google.com/document/d/1OLj_WqNZmCx1_t822ybUMWZkqh6W4WFLq8QDBiEmaUY/edit), [Paid LLM](https://docs.google.com/document/d/1iKYpyXLmcMhsjdnb4Sw5hn_tWcq5VgKI3Aw8WFQCAHM/edit), relevant Paid/Organic Closer and supporting Omega Agency specialist role summaries and templates.
- [Client Portfolio](https://docs.google.com/spreadsheets/d/1XPP4raE-uOq0AAiHhSbjUHMEU0PYRsWqoEn8sex8ZaA/edit): 10 tabs; Clients, Onboarding, Paid, Organic, Leads, Closing, Deliverables, QA, Renewals, Issues.
- [CRM & Sales](https://docs.google.com/spreadsheets/d/1hPu_BxsAKHNF1-diZ-ww6V5KmuRgPU6dO4OHX_pQaf0/edit): 8 stages/tabs; prospects, qualified, meetings, proposals, won/lost, handover, sources.
- [Pricing & Commission](https://docs.google.com/spreadsheets/d/15zM733kyd2jN0SRRXo69GqWiNryz2XuWOtjQYnAwEjs/edit): 6 tabs; catalogue, models, cost, margin, commission, guarantee/risk.
- [KPI Scorecard](https://docs.google.com/spreadsheets/d/168ki6dFqUt05UMno3pYt3GWpap6mRBpdVqGYH9gaFsg/edit): 7 areas; Executive, Marketing, Lead Gen, Sales, AM, Finance, Quality.
- [Opportunity/ICP](https://docs.google.com/spreadsheets/d/1TWPRX3zk2UwKdaROWK7yK8ncIzF2AWPpyO2UfnLzsz8/edit): Opportunities, Verticals, Geo, Experiments, Actual Performance.
- [OOH direct-mail index](https://docs.google.com/document/d/1qBMoo4AGLt30xJQI0A0HGfEEQPnzSJ4rhp_bOEkM4qg/edit): 16,987 draft letters in 30 volumes; one source volume sampled. Drafts and addresses NOT independently verified.

Reviewed core/current handbook content, specialist descriptions, template descriptions and the operational sheets' tab/field headers. Historical backups, duplicate personal profiles, and all remaining individual bulk-letter texts were not exhaustively validated.

## 2. What is already in GitHub — correct status

- Management/staff/client portal layouts and role preview in app.js: DEMO only, not authenticated.
- Staff OS in src/staff/staff-os.js: 23 role/work pages, localStorage forms and task-linked timer/summary demo.
- Agency OS in src/agency/agency-os.js: 20 pages, 28 channel categories, local OOH booking/evidence gates, fictional data.
- Public website in public/: static copy and locally prepared enquiry brief, no actual enquiry intake.
- src/data/portal-api.js: future authenticated API helper, not wired into the demo.
- supabase/migrations/: original tenant schema drafts, unapplied and unverified.
- supabase/drafts/: new OOH/marketing schema draft, unapplied.
- src/server/ooh-api.mjs: localhost-only OOH authenticated API scaffold, not connected or deployed.
- No functioning live Stripe, advertising OAuth, lead-delivery platform, CRM dialler, email/SMS publisher, file upload, signed contract, payroll or staff records.

**Screens are not evidence of production capability.** Repo is public. Do not use actual client/staff data.

## 3. P0 shared platform to build first

| ID | Feature / backend | Required behaviour |
|---|---|---|
| A01 | Dedicated Amplify Supabase, auth and invitations | Tenant creation, invite, accept, session renewal, user suspension and separate production/staging data. Never use the Omega Education database. |
| A02 | RBAC, staff assignments and entitlements | MD/BM/AM/QA/specialist/finance/SDR/closer/client-approver/client-viewer privileges enforced in API, RLS and storage. Staff only see assigned authorised clients. |
| A03 | Contracted service workstreams | Paid, Organic, Lead Engine with explicit Leads Only or Leads + Closing mode; separately owned scope, timeline, pricing, KPI and client dependencies. |
| A04 | Signed SOW and change-control versioning | Current terms, exclusions, client duties, offer/mode, fee basis, lead acceptance, closing stopping point, geo/volume/cadence, signatures, revisions, audit. |
| A05 | Real launch acceptance gate | No delivery until contract, payment readiness, owners, accesses, inputs, budget/measurement and required approvals pass. |
| A06 | Secure evidence and client file storage | Versioned asset uploads, permissioned reads, QA links, audit, signed download access, retention and privacy rules. |
| A07 | Unified notifications, approval engine and escalation | Due dates, role-specific approvals, stale-response guard, audit actor/timestamp, blocked work, reminders, incident recovery. |
| A08 | Real shared CRM data model | Canonical business/site/contact identities, provenance, source dates, dedupe, opportunities and client workstreams rather than disconnected local boards. |
| A09 | Consent/suppression and outreach controls | Authorised sender/channel, script/version, permitted times, suppression across records, unsubscribe/complaint processing; independently check jurisdiction rules. |
| A10 | Billing, media spend and commission foundation | Stripe reconciliation; separate agency fees from pass-through media/data; contractual performance triggers, credits/replacements, margins and clawbacks. |

## 4. Missing client-facing capabilities

| ID | Priority | Module | Acceptance outcome |
|---|---|---|---|
| C01 | P0 | Real account and permissions | Client can sign in and invite approver/viewer colleagues; unrelated/unsubscribed/unauthorised data is inaccessible at DB/API level. |
| C02 | P0 | Scope, contracts and subscriptions | Current signed scope, offer/mode, owner, exclusions, promises, fees, renewal terms, change request and approval history. |
| C03 | P0 | Interactive onboarding | Business goals, ICP/geography, offer details, brand kit, access/analytics/CRM invitations, contact rights, funds, fulfilment capacity and kickoff; client-owned blockers and due dates. |
| C04 | P0 | Client approvals | Genuine versioned creative, copy, list, funnel and claim reviews with comments, revision history, deadlines and a named authorised decision maker. |
| C05 | P1 | Workstream delivery centre | Paid/Organic/Lead Engine separately show milestones, ownership, evidence, next action, risk, client dependencies and accepted work. |
| C06 | P1 | Paid results | Real campaign/platform IDs, verified ad spend separate from service fee, attribution/source quality, creative versions, budget alerts, conversion/lead quality and optimisation log. |
| C07 | P1 | Organic content and growth | Reviewable multi-channel editorial calendar, asset previews, source rights, SEO/AEO projects, newsletter workflows and published URL/proof. |
| C08 | P0 | Leads Only deliveries | Real verified batches, contract-specific field schema, source/freshness, duplicate/exclusion status, accepted/rejected with reasons, disputes, replacements/credits and safe export. |
| C09 | P1 | Leads + Closing visibility | Approved outreach status, actual buyer-fit qualification, booked/held/accepted meetings, no-shows, handover and client-reported wins/evidence. No hidden uncontracted closing. |
| C10 | P1 | OOH client view | Planned/active physical placements, approved artwork, dated installation proof, flight dates, agreed tracking and outcomes without supplier terms/internal management evidence. |
| C11 | P1 | Verified reports | Contract metric definitions, source/date, lead accepted vs rejected, sales outcomes, client inputs, spend, fees, narrative, decisions, issues, downloadable review packet. |
| C12 | P0 | Real billing | Payment setup, scheduled invoice lines and status, receipts, credits, dispute records and evidenced performance charges. |
| C13 | P1 | Messages, tickets and notifications | Actual secure threads and attachments, time-bound approval/support alerts, escalations, clients' own history. |
| C14 | P2 | Add-ons/renewals and service changes | Approved SOW variation for new geography, channel, volume, assets, ICP or closing responsibility; price and capacity impact before activation. |
| C15 | P2 | Security/settings | Delegated authority, external account access, consent controls, data requests, export and revocation. |

## 5. Missing staff-facing capabilities

| ID | Priority | Module | Acceptance outcome |
|---|---|---|---|
| S01 | P0 | Real staff daily workspace | Assigned client portfolio and Task Centre with schedule/capacity, deadline, dependencies, blockers, time logs and evidence-backed completion. |
| S02 | P0 | Sales and qualification CRM | Prospect→Qualified→Booked→Proposal→Won/Lost→Client Handover, stage rules, actual buyer/decision path, source, next action, reminders, loss reason. |
| S03 | P1 | Opportunity and ICP intelligence | Scored vertical/geo hypotheses, evidence, opportunity economics, experiments, predicted vs actual quality and stop/scale decisions. |
| S04 | P0 | Governed SDR and appointment outreach | Campaign launch authorisation, approved script/version/sender/channel, suppression check, call/email attempt history, replies, follow-up consent, meeting acceptance, stop rules. |
| S05 | P0 | Closer and proposal/SOW builder | Accepted SDR handoff, diagnostic findings, pricing authority, proposal versions, approval, signature, deal won/lost, signed handoff to AM/BM. |
| S06 | P0 | Lead research and enrichment | Source URL/date, canonical company/site identity, buyer relevance, verified fields, duplicate and exclusion handling, age/freshness, QA confidence. |
| S07 | P0 | Batch QA and client acceptance | Check against contracted ICP and columns, sample validation, evidence, secure delivery, actual client acceptance/rejection, valid replacement/credit. |
| S08 | P1 | Leads + Closing engine | Contracted outreach → qualification → appointment → proposal/close, approved price/authority, call/message proof, client follow-up and attribution. |
| S09 | P1 | Paid channel operations | OAuth/account IDs, budgets and pacing, ad/creative versions, funnel/CRO and conversion tracking, QA, optimisation log, reporting sources and platform-specific rules. |
| S10 | P1 | Organic production system | Idea→brief→research→script→produce→edit→QA→client approval→publish→distribute→repurpose→measure, including video, live, podcast and short-form workstreams. |
| S11 | P1 | OOH/field operations | Supplier/site inventory, written permission, artwork specifications, schedule, proof with date/site, live check, safety incident, removal, invoice and attribution. |
| S12 | P2 | Personalised letter/mail workflow | Separate intake for 16,987 DRAFT letters, validation of business/address and suppression, print-ready approval, batch fulfilment, delivery evidence and enquiries. |
| S13 | P0 | Independent QA/incident workflow | Reviewer assignment and segregation, proof, critical defects, revisions, retest, complaint, root cause, corrective work and release lock. |
| S14 | P1 | BM/CDM capacity and operations | Real staffing/capacity by offer, task hours vs budget, client dependencies, milestone health, margin flags and escalations; daily/weekly/monthly rhythms. |
| S15 | P1 | Account manager and retention | Onboarding/first-value, reports, client health, approvals, client calls/notes, dependencies, upsell, renewal and change requests. |
| S16 | P0 | Finance/RevOps console | Offer unit economics, invoice/collection truth, media/data fees, direct labour/tools, margin, commission triggers/clawback, source attribution and KPI reconciliation. |
| S17 | P1 | Staff OS real persistence | Private timesheets, weekly reviews, rostering, leave, employee growth, assessment evidence, training, team chat and HR controls; demo state must be removed. |
| S18 | P2 | Role competency and certification | Role-specific supervised training and evidence ratings (including 40-hour programmes where required), assessor/reassessment, promotion/certification gating. |
| S19 | P2 | Executive and branch oversight | Delegated authority, exception reviews, client/offer profitability, quality, retention, staff utilisation, forecast, governance, franchise expansion when ready. |

## 6. Required data structure (from operating sheets)

Client Portfolio: clients, onboarding, campaigns by offer, leads vs closing, deliverables, QA, renewals, escalations.  
CRM: prospects, qualified, meetings, proposals, won, lost, handover, source attribution.  
Pricing: offer catalogue, price structures, delivery cost, margin, commission, guarantee/risk approval.  
KPI: executive, marketing, lead-gen, sales, account management, finance, quality snapshots, with period, denominators and evidence.  
ICP: opportunity hypotheses, vertical scoring, geography, experiments, actual outcomes.

The current limited base schema lacks signed SOW/version, structured source/provenance and dedupe, client lead acceptance, contact permission/suppression, real outreach logs, meeting evidence, product-level economics, QA evidence/revision history, client approver role, staff assignment/entitlements and activity-level audit.

## 7. Important taxonomy and design decisions

- Preserve **three top-level offer families**: Paid, Organic and Lead Engine. Leads Only and Leads + Closing are explicitly different modes. Four sales cards are fine, but do not create four incompatible backends.
- OOH is a *channel / physical execution method* scoped under the purchased offer (bought media, local organic/partnerships, direct mail/lead acquisition as appropriate). The canonical catalogue sometimes places local/OOH under Organic, so it should not be treated as an automatic fourth purchased offer.
- Pricing model must be per signed scope: retainer/project, per lead/accepted lead, per appointment, performance commission or approved hybrid. Pricing workbook tab names exist but many economics/commission grids are not populated; do not hardcode prices or commissions from draft letters as live universal policy.
- Separate Amplify's own marketing/outbound CRM from a client's contracted Lead Engine outreach. The same business/site may be known to Omega Supply/Facilities, but reuse stable identity and source without assuming buyer, consent or offer-fit transfer.
- Some supporting specialist notes are titled Omega Agency and are only one paragraph; use them to outline specialist roles, not override the Amplify service catalogue.
- The OOH letter index contains **drafts**, not verified addresses, approved campaign inventory or a sent-mail ledger.
- Review existing deliverable-review RPC: the current membership-only check is broader than the required authorised client-approver decision; implement approver role/assignment enforcement.

## 8. Recommended GitHub build sequence

1. **Foundation (P0):** private repository, independent Amplify Supabase staging, auth, tenant isolation, staff assignments, offer entitlements, audit and secure file storage.
2. **Commercial truth (P0):** SOW/contract/pricing version → won deal → BM handoff → readiness checklist → client onboarding → per-workstream delivery plan.
3. **Lead Engine (P0/P1):** internal opportunity/intelligence and lead sourcing → batch QA/delivery/acceptance → compliant, specifically contracted setter/closer workflow → attribution and commission reconciliation.
4. **Paid / Organic / OOH (P1):** actual provider integrations; creative/funnel/editorial production and approval; tracking, publishing, evidence and client reporting; physical site/field workflows.
5. **Support and economics (P1):** client success, reports, billing, finance, retention, staff capacity/QA and operating scorecards.
6. **Enhancements (P2):** personalisation of large direct-mail draft programme, role certification, expansion/franchising, cross-service experiments and advanced automations.

## 9. Release acceptance tests

- Two organisations with client approver/viewer, staff assigned/unassigned and outsider: deny cross-tenant, unassigned and unsubscribed reads/writes/exports at API, DB and storage.
- Cannot launch work with unsigned scope, incomplete payment/access/approval/measurement conditions.
- Versioned deliverable QA must track evidence; only authorised client approvers can approve. Viewer and staff cannot impersonate client approval.
- Leads Only can accept/reject and request contracted replacement but cannot activate outreach. Leads + Closing can proceed only within authority, scripts, suppression and stopping point.
- Every message/call verifies applicable lawful contact basis and suppression; unsubscribe and complaint stop subsequent permitted campaign paths.
- Paid media spend and service fees remain distinct. Lead/revenue numbers carry source and period. Commission and credits require contracted trigger and evidence.
- OOH cannot book/install without verified permission, budget, creative, tracking, supplier reference, dated proof and close-out evidence. Client must not see supplier terms/internal references.
- Employee private feedback/pay/leave documents are not accessible to unrelated staff or clients; time and records survive browser changes.
- Execute Node, browser/accessibility, actual staging migrations, RLS, integration, storage, concurrency and deployment tests before marking release ready.

## 10. Explicit limitations of this audit
This is a documented feature backlog, not code implementation. The local browser demos were reviewed in GitHub; provider/system operations were not verified live. The 30-volume personalised letter source was assessed through its index and a sample, not a manual audit of all 16,987 letters. Backups, duplicate personal profiles and third-party lead-list data are not treated as feature-specification authorities.
