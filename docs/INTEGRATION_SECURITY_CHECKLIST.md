# Integration Security Checklist

Status: pre-CRUD gate. A checked item must have implementation evidence and an acceptance test; documentation alone is not completion.

## Identity and access

- [ ] Production-grade server-side authentication is selected and implemented.
- [ ] Every mutation verifies a signed, short-lived server credential; the frontend PIN/sessionStorage flag is never accepted as authorization.
- [ ] Role-based authorization defines who may create, update, and archive each module.
- [ ] Unauthorized, expired, malformed, and replayed credentials have negative tests.
- [ ] Authentication failures do not disclose secrets, deployment URLs, or row data.

## Environment and secrets

- [ ] Test and production use separate GAS deployments, spreadsheets, IDs, credentials, and audit logs.
- [ ] Phase 1 permits only `TEST_01_Program_Kajian`; production sheet names are rejected server-side.
- [ ] `GAS_URL` remains server-side and no Vite variable contains a backend URL or secret.
- [ ] Browser code calls only same-origin `/api/*`; CSP does not need `script.google.com` in `connect-src`.
- [ ] Secrets are stored in platform secret management, rotated, access-scoped, and absent from logs/responses.

## Command and data safety

- [ ] HTTP method and command allowlists reject unknown methods/actions and unexpected sheet names.
- [ ] Phase 1 supports exactly `create`, `update`, and `archive`; hard delete is unavailable.
- [ ] Request schemas reject unknown fields, oversized bodies, invalid dates/URLs/enums, control characters, and formula-injection prefixes.
- [ ] Server derives protected fields (`id`, `version`, audit actor/timestamps); clients cannot override them.
- [ ] Stable opaque IDs are independent of spreadsheet row numbers and are uniqueness-constrained.
- [ ] Updates/archive require the expected `version`; stale writes return `409 conflict`.
- [ ] Idempotency keys are required for creates and retained long enough to make retries safe.
- [ ] Archive is reversible and records who/when/why; no row deletion occurs.

## Operations and evidence

- [ ] Append-only audit events capture request ID, actor ID, command, entity ID, before/after hashes, timestamp, result, and environment without sensitive payload logging.
- [ ] Rate limits exist per user and per origin/IP, with stricter mutation limits.
- [ ] Timeouts, upstream redirects, non-JSON responses, partial failures, and GAS errors map to stable JSON error envelopes.
- [ ] Monitoring alerts on authentication failures, elevated error rates, repeated conflicts, and unusual mutation volume.
- [ ] Backup/export is taken before each trial; restoration is rehearsed and timed.
- [ ] Rollback disables the mutation route independently of read availability.
- [ ] Privacy review confirms Program/Agenda fields are public-safe and Kabar media metadata cannot expose private data.
- [ ] Security review explicitly confirms finance and TPQ are outside the trial mutation scope.

## Current blockers (2026-07-31)

- No server-side identity, authorization, rate limiting, audit log, idempotency, or optimistic concurrency exists.
- `Legacy/scripts/Code_v1_7.gs` has a generic unauthenticated `doPost`, accepts production sheet names, performs hard deletion, trusts client-provided records, and uses mutable row positions.
- No separate test GAS deployment or `TEST_01_Program_Kajian` integration exists in this repository.
- The current Netlify function is deliberately GET-only; there is no authenticated mutation boundary.
- Phase 0 removes stale client-side backend URL references from README, API/hook comments, Settings, and finance rollback documentation.
