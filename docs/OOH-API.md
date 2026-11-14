# Amplify OOH API foundation

The independent Node 20+ server foundation is `src/server/ooh-api.mjs`, started with `node src/server/start.mjs`.

Required server-only environment variables:

- `SUPABASE_URL`: Dedicated Amplify Supabase project URL.
- `SUPABASE_PUBLISHABLE_KEY`: Publishable or legacy anon API key for token verification.
- `SUPABASE_SERVER_KEY`: Server-only secret/service-role API key. Never expose in static HTML, client bundles or browser requests.
- `AMPLIFY_ALLOWED_ORIGIN`: Allowed browser origin, e.g. your Amplify domain.
- `PORT`: HTTP port (defaults to 8788).

Endpoints:
- `GET /health`: Fails closed until configured.
- `GET /api/me`: Verified user and their organisation memberships.
- `GET /api/ooh?organisation_id=UUID`: Staff read private OOH records; clients receive a separate safe status projection.
- `POST /api/ooh`: Authenticated staff creates a draft flight after membership and schema validation.
- `POST /api/ooh/:flightId/actions`: Authenticated staff submits a validated event with expected version, using the server-only RPC and audit trail.

Token verification calls the Supabase Auth `/auth/v1/user` endpoint. The server derives the authenticated user ID from that response and does not trust a role or actor ID supplied in the request body.

**Not deployed.** Requires the separately reviewed OOH draft schema, a dedicated Amplify database, staging tests, operating controls, secrets management, rate limiting, monitoring and security review before use. Do not expose server keys, and do not deploy this foundation as a public production server until verification is complete.
