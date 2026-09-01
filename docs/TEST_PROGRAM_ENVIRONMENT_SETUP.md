# Test Program Environment Setup

Status: manual specification only. No spreadsheet, credential, URL, deployment, or write is created by this repository.

## Isolation requirements

- Create a new spreadsheet dedicated to the trial. Never reuse or copy permissions from the production spreadsheet without review.
- Create exactly one trial sheet named `TEST_01_Program_Kajian`.
- Use a separate test-only Apps Script project/deployment and least-privilege identity.
- Store deployment configuration only in server secret management; never in Vite variables, frontend source, screenshots, tickets, or documentation.
- Keep production names, finance, Agenda, Kabar, and TPQ outside the future writer allowlist.

## Columns, in exact order

1. `id`
2. `version`
3. `title`
4. `category`
5. `schedule`
6. `location`
7. `audience`
8. `description`
9. `visibility`
10. `status`
11. `createdAt`
12. `createdBy`
13. `updatedAt`
14. `updatedBy`
15. `archivedAt`
16. `idempotencyKey`

Allowed status values: `Draft`, `Dalam peninjauan`, `Siap publik`, `Arsip`.

Allowed visibility values: `Publik`, `Pengurus`.

## Manual provisioning

1. An authorized owner creates the separate test spreadsheet and records ownership/access in the approved private inventory.
2. Add `TEST_01_Program_Kajian`; enter the exact header row above and freeze row 1.
3. Apply spreadsheet validation lists for `status` and `visibility`. These are operator guardrails, not a substitute for future server validation.
4. Protect the header row and restrict spreadsheet editors to the named trial operators and test service identity.
5. Create a separate test Apps Script project bound only to this spreadsheet. Do not copy the legacy generic `doPost`.
6. Provision a test-only deployment with access limited as narrowly as the platform permits. Record the deployment ID privately; do not place its URL in the browser configuration.
7. Seed only public-safe synthetic Program rows. Use opaque IDs such as `prg_<ULID>`; never use row numbers as identity.
8. Set every initial version to `1`. Server-generated audit timestamps and actor fields are required for future commands.
9. Take an export snapshot, calculate a checksum, and record restore duration before any future write trial.
10. Set `PROGRAM_TRIAL_WRITES_ENABLED=false` or leave it absent. Do not enable it until Phase 1 implementation and review are complete.
11. Verify the production read deployment and test deployment are different projects/credentials/targets.
12. Obtain DKM/security sign-off and attach evidence to the integration checklist.

## Record rules

- `id` is stable, opaque, immutable, unique, and independent of row position.
- `version` begins at 1 and increments on every accepted state change.
- Hard delete is prohibited. Only explicit archive and restore commands are permitted.
- `createdAt/By`, `updatedAt/By`, `archivedAt`, request ID, and idempotency metadata must be server-derived or server-validated and auditable.
- Trial data must contain no attendee identity or other private data.
