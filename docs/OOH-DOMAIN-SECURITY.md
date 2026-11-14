# OOH domain policy and server contract

`src/domain/ooh-workflow.mjs` is a pure, dependency-free OOH flight state machine with input, role and booking validations. It enforces evidence gates in code independently from the UI, and has Node tests in `tests/ooh-domain.test.mjs`.

Important: a pure function is **not** security by itself. The server must obtain a verified Supabase Auth user, resolve their organisation membership and role from the database, enforce per-offer entitlements, and commit any updates with optimistic concurrency and atomic audit. Never accept a request-body role or unverified organisation ID as authority.

A separate independent Amplify Supabase database is needed; the connected project belongs to Omega Education and MUST NOT be used.
