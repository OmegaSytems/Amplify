# Omega Amplify — UI/UX system v1

## Experience architecture
- **Management:** agency portfolio, opportunities, delivery workstreams, finance, staff and support.
- **Staff:** assigned accounts, content planning, campaign execution, lead pipelines, tasks, approvals and messages.
- **Client:** results, active subscriptions, deliverable reviews, projects, messages, billing and support.
- **Offers:** Amplify Paid; Amplify Organic; Lead Engine (Leads Only); Lead Engine (Leads + Closing).
- Client navigation automatically hides unsubscribed offer workspaces in the demo. Production must also enforce this at the server and database layers.

## Implemented screens
Overview; Accounts + Account Detail; Agency CRM; Projects; Content Calendar; Paid Advertising; Organic Studio; Lead Engine; Closing Pipeline; Approvals; Task Centre; Messages; Analytics; Billing; Team; Support; Settings; My Services.

## Interaction patterns
- Sidebar navigation, responsive mobile drawer, command search (Cmd/Ctrl+K), role and client preview switchers, dark/light theme.
- Tables, KPI cards, lead/deal/task kanban boards, editorial cards, two-week content calendar and trend charts.
- Functional demo forms for new client, campaign, task, lead, deal, agency opportunity, content, approval, invoice and support request.
- Approve/request changes, advance stage, export demo CSV, send demo messages, resolve support requests.
- Demo data persisted in browser localStorage; reset available under Settings.
- User-entered strings are HTML escaped. CSV export escapes formula-like values.

## Quality & accessibility
- Page title and descriptive subtitle, consistently placed primary action.
- Colour-coded status labels with text (not colour alone), focus outlines, button labels and semantic table headings.
- Responsive 320px+ layout, keyboard Escape and search shortcut, reduced motion CSS.
- Consistent empty states, success notifications, input labels and validation.
- All figures are labelled as examples; no fake claims of live integrations.

## Remaining production integration
This UI is a static demo. Replace the role selector with authenticated sessions. The separately committed Supabase migrations have NOT been applied, security audited or connected to this UI. The application still requires account invitations, project assignment permissions, per-offer subscription gates enforced by the backend, file storage, robust approval/version history, Stripe, ads/social OAuth, reporting ingestion, testing and deployment.

**Never enter real client information into this prototype.**
