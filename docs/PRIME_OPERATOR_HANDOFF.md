# Amplify staff connection to the Nexus Prime module of Omega Systems — P0 handoff

**Correct boundary:** Omega Systems owns the website, `/prime` login, Auth, customer organisations, plans, AI Agents and the Nexus Prime customer experience. Nexus Prime is **not** another GitHub repository, Supabase project or independent account system. Omega Amplify owns only its staff operations.

The customer signs into **Omega Systems**, connects their own marketing accounts in Nexus Prime when OAuth is implemented, and explicitly authorises Omega Amplify for selected marketing channels. Amplify staff use their **Omega Systems Auth identities** and per-customer assignments; they never receive the customer's password or a parallel customer account.

## Code in this draft
- `src/integrations/prime-operator.mjs` accepts `systemsUrl`, `systemsPublishableKey` and `getSystemsAccessToken`. These point to the **same Omega Systems Supabase backend and auth authority** used by the Nexus Prime module.
- Staff can request assigned customer access, read/write permitted marketing drafts and use guarded operator-manager assignment RPCs.
- Database table names `prime_*` identify an **Omega Systems module** only. No second Prime database is expected.
- Access and revocation are checked by Omega Systems tenant RLS on each request. No service-role key, bypass, automatic approval, publishing or ad spending.

## Remaining integration work
1. Confirm the actual **Omega Systems Supabase project**, current auth configuration, organisation schema and existing customer/agent entitlement models. Only `omega-education-sydney` is accessible through the connected Supabase account at present; leave it untouched.
2. Review and stage the Omega Systems module migration in the **Omega Systems database**, after checking for conflicting existing models.
3. Register the verified Omega Amplify operator organisation and its staff as members in the Systems identity authority. Customer grants and operator-manager staff assignments must both be required.
4. Wire the real Amplify staff application to shared Omega Systems login/SSO, inject the signed-in user's Systems access token and connect the staff screens. The API client alone does **not** make the existing demo portal live.
5. Validate allowed/revoked/expired/unauthorised access and cross-business isolation in real staging.
6. Add external marketing-provider OAuth and publishing only after customer authorisation and compliance checks.

Amplify's internal operational data may continue using a separate Amplify database. It must **not** duplicate the customer-facing canonical marketing records in Omega Systems. The old Amplify client portal is only a fictional localhost demo and should be retired *after* feature parity in Omega Systems.

Run local tests with Node 20+: `node --test tests/prime-operator.test.mjs`. No deployment, production migration or GitHub Actions execution without reviewed staging verification.
