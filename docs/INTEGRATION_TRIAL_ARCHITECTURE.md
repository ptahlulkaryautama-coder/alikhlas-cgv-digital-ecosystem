# Integration Trial Architecture

## Goals and boundaries

Introduce writes incrementally without exposing the GAS deployment to browsers or writing to production Sheets. The existing `/api/sheets` read path remains GET-only. A separate authenticated mutation function should mediate trial commands. Finance, TPQ, and all Legacy files remain out of scope.

## Phase 0 — audit and baseline

- Preserve the current read-only behavior and record build/runtime baselines.
- Remove stale client-side backend URL diagnostics/documentation before any integration release.
- Create separate test spreadsheet, GAS deployment, platform secrets, identities, roles, and audit sink.
- Capture a versioned backup of the empty/seeded test sheet and document restore time.
- Add automated contract, authorization, validation, conflict, retry, and rollback tests.

Exit gate: every item in `docs/INTEGRATION_SECURITY_CHECKLIST.md` that applies to Phase 1 is evidenced and passing.

## Phase 1 — Program test only

Scope: `TEST_01_Program_Kajian`, with `create`, `update`, and `archive`. No hard delete and no production Sheet writes.

Proposed route: `POST /api/integration/program/commands`. Netlify authenticates and authorizes the caller, validates the command, adds trusted metadata, then invokes a test-only backend credential/deployment. The server rejects production sheet names even if supplied; ideally the client contract contains no sheet parameter at all.

### Request contract

```json
{
  "command": "create",
  "requestId": "req_01K...",
  "idempotencyKey": "idem_01K...",
  "expectedVersion": null,
  "data": {
    "kategori": "Kajian Kitab",
    "pilar": "Ilmu",
    "nama": "Judul program",
    "deskripsi": "Deskripsi publik",
    "hari": "Senin",
    "waktu": "Ba'da Maghrib",
    "lokasi": "Aula Utama",
    "pemateri": "",
    "poster": "https://example.invalid/poster.jpg",
    "status": "Active",
    "website": "Yes"
  }
}
```

For `update` and `archive`, include `entityId` and a required integer `expectedVersion`. Archive also includes a bounded `reason`. Unknown properties are rejected.

### Success response

```json
{
  "ok": true,
  "requestId": "req_01K...",
  "command": "update",
  "entity": {
    "id": "prg_01K...",
    "version": 4,
    "archivedAt": null,
    "updatedAt": "2026-07-31T10:00:00.000Z"
  }
}
```

### Error response

```json
{
  "ok": false,
  "requestId": "req_01K...",
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "The program changed after it was loaded. Refresh and retry."
  }
}
```

Use `400` schema/command errors, `401` unauthenticated, `403` unauthorized, `404` unknown entity, `409` version/idempotency conflict, `413` oversized body, `429` rate limit, `502` upstream rejection, and `504` timeout. Responses are always JSON.

### Stable ID, version, and audit fields

- ID: server-generated opaque sortable identifier such as `prg_<ULID>`; never use a row number or client-selected numeric maximum.
- Version: positive integer incremented atomically on every update/archive.
- Entity fields: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `archivedAt`, `archivedBy`, `archiveReason`.
- Audit event fields: `requestId`, `idempotencyKeyHash`, `environment`, `actorId`, `command`, `entityId`, `previousVersion`, `newVersion`, `beforeHash`, `afterHash`, `occurredAt`, `result`.

Because Sheets does not provide database transactions, the backend must serialize mutations with a script lock, re-read the entity/version inside the lock, apply one command, append the audit event, and return the committed version.

## Phase 2 — Agenda trial

Start only after Program passes soak testing, restore rehearsal, audit review, and DKM sign-off. Use a distinct `TEST_09_Agenda_Kalender` allowlist and Agenda-specific schema. Retain the same identity, authorization, idempotency, versioning, archive, audit, rate-limit, and rollback controls. Validate ISO dates and public-safe gallery URLs; do not accept participant/private-note fields.

## Phase 3 — Kabar backend and media decision

Design the article model, editorial state machine, and media lifecycle before enabling writes. Decide between managed object storage/media CDN and an approved repository workflow; do not store binary images or unrestricted external URLs in Sheets. Define MIME/size/dimension checks, malware scanning, EXIF stripping, rights/consent metadata, immutable media IDs, alt text, draft/review/publish/archive permissions, and orphan cleanup. Kabar remains repository-static until this design is approved.

## Phase 4 — production authentication and controlled rollout

- Complete production identity provider integration, role assignment, revocation, session expiry, and server-side token verification.
- Provision new production-only credentials with least privilege; never promote test secrets or deployment URLs.
- Deploy mutations behind a disabled-by-default feature flag and an explicit module allowlist.
- Run read-only shadow validation, then a small authorized cohort, then staged enablement with monitoring and an emergency kill switch.
- Require an approved backup, rollback rehearsal, security review, audit review, and DKM change window before the first production write.

## Rollback strategy

1. Disable the mutation feature flag/function route while leaving reads available.
2. Revoke the mutation credential/deployment permission.
3. Export the affected test sheet and audit log; identify the last accepted audit event.
4. Restore the baseline snapshot or replay inverse update/archive commands in a new test copy.
5. Compare entity/version/audit counts and hashes, then document the incident before re-enabling.

Never roll back by hard-deleting rows or by pointing the frontend directly at GAS.

## Acceptance tests

- Valid authorized create/update/archive succeeds only on the test Program sheet.
- Production names, Agenda during Phase 1, finance, TPQ, unknown commands, hard delete, and extra fields are rejected.
- Missing/invalid/expired credentials yield `401`; insufficient role yields `403`.
- Duplicate create with one idempotency key returns the original result and creates one row/audit event.
- Two updates with the same expected version produce one success and one `409`.
- Archive hides the entity from public reads but preserves/restores the record and audit history.
- Formula injection, invalid URL/date/status, overlong text, and oversized bodies are rejected.
- Timeout/upstream HTML/redirect/error cases return stable JSON without secrets.
- Rate limits activate predictably and recover after the window.
- Browser network logs contain only same-origin `/api/*`, never `script.google.com`.
- Restore rehearsal returns the test dataset to its baseline with verified counts/hashes.
- Existing Program/Agenda reads and local fallback behavior remain functional; build and smoke tests pass.
