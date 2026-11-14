# Omega Amplify Staff Operating System — Supply adaptation

This implements the shared staff capability model from Omega Supply/Nexus, replacing supply-specific product, purchasing and warehouse workflows with agency work.

## Functional workspaces (demo UI)

- **Daily delivery:** Staff home, Task Centre, task-linked work tracker, timer, timesheets, shift summaries, weekly reflection, manager productivity review.
- **Scheduling:** Rosters, staff availability, leave requests and manager approvals, meetings, outcomes, follow-up records.
- **People:** Directory, role matrix, recruitment pipeline, onboarding checklist, personal goals, recognition, feedback and team skills.
- **Performance:** KPI scorecards, evidence, self-evaluation, manager reviews, workload and productivity reflections.
- **Learning:** Staff onboarding, role-specific training and competency paths, SOPs, service playbooks.
- **Communication:** Team chat, shared inbox, announcements, client chat (existing), notifications.
- **Delivery:** Paid campaign QA, organic editorial QA, lead batch QA, closing script QA; account handovers and client reporting (existing workspaces).
- **Administration:** Expense and software purchase requests, asset and licence register, internal helpdesk/incident request, approvals and audit report.

## Omega Supply → Amplify equivalence

| Supply | Amplify |
|---|---|
| Product discovery & supplier sourcing | Campaign research, creative briefs and target niche discovery |
| Purchase orders, vendor comparison | Freelancers, ad platform subscriptions, media budget and supplier approvals |
| Goods receiving and warehouse stock | Digital asset intake, client brand materials, software access and licence register |
| Inventory QA and fulfilment | Creative QA, campaign launch checks, verified lead batch delivery, appointment handover |
| B2B account applications | Agency proposals, signed client onboarding and scope verification |
| Staff tasks, time, shifts, training, approvals | Shared operational Staff OS, directly linked to client service tasks |

## End-to-end task time workflow

Task Centre task → start timer → stop work → shift created with task link → employee summary (accomplishments, remaining work, blockers, questions, productivity self-rating) → manager review and optional rating. Weekly reflections collect links to tasks from that week's shifts and support manager review.

## Safety and delivery status

This **is a static browser demonstration**. The role preview selector is not authentication; localStorage is not secure employee storage. No real hiring, payroll, leave approval, chat delivery, payments, staff permission changes, staff scheduling invitations or AI are connected. Backend tenant/role validation, confidentiality, legally compliant employment handling and end-to-end testing are release gates. This repository is public; do not put real employee/client records or secrets here.
