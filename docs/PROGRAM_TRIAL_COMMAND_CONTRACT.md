# Program Trial Command Contract

Status: design only. No command route, mutation function, GAS writer, or enabled control exists.

The future server route is bound internally to `TEST_01_Program_Kajian`; clients never supply a spreadsheet or sheet name. Supported commands are exactly:

- `CREATE_PROGRAM`
- `UPDATE_PROGRAM`
- `ARCHIVE_PROGRAM`
- `RESTORE_PROGRAM`

There is no `DELETE_PROGRAM`.

## Envelope

```json
{
  "command": "UPDATE_PROGRAM",
  "requestId": "req_01K...",
  "idempotencyKey": "idem_01K...",
  "expectedVersion": 3,
  "actor": { "id": "usr_01K...", "role": "super_admin_trial" },
  "payload": { "id": "prg_01K...", "title": "Kajian keluarga" },
  "timestamp": "2026-08-01T10:00:00.000Z"
}
```

`command`, `requestId`, `idempotencyKey`, `actor`, `payload`, and `timestamp` are required. `expectedVersion` is required for update/archive/restore and omitted for create. The server must replace or verify client actor/timestamp using the authenticated session and server clock; the client values are never trusted audit identity.

Create accepts the public-safe content fields in `PROGRAM_TRIAL_DATA_CONTRACT.md`. Update uses a strict allowlisted patch plus immutable `id`. Archive accepts `id` and a bounded reason. Restore accepts `id` and the intended non-archive status. Unknown fields and formula-prefixed/control-character text are rejected.

## Response model

Success (`200` or `201`):

```json
{
  "ok": true,
  "requestId": "req_01K...",
  "command": "UPDATE_PROGRAM",
  "record": { "id": "prg_01K...", "version": 4, "status": "Draft", "archivedAt": null }
}
```

Errors always use `{ "ok": false, "requestId": "...", "error": { "code": "...", "message": "..." } }` with no stack trace or upstream payload.

| Condition | HTTP | Code |
|---|---:|---|
| Validation error | 400 | `VALIDATION_ERROR` |
| Missing/invalid/expired session | 401 | `UNAUTHORIZED` |
| Insufficient role | 403 | `FORBIDDEN` |
| Archived record cannot accept requested update | 409 | `ARCHIVED_RECORD` |
| Expected version differs | 409 | `VERSION_CONFLICT` |
| Duplicate idempotency key with same request | 200 | return original result |
| Duplicate idempotency key with different request | 409 | `IDEMPOTENCY_CONFLICT` |
| Server/test writer unavailable | 503 | `SERVER_UNAVAILABLE` |

All commands require the future server-side role check, schema validation, body limit, idempotency retention, atomic version check, append-only audit event, test-sheet allowlist, and kill-switch check. `PROGRAM_TRIAL_WRITES_ENABLED` absent or anything other than exact `true` must reject commands before any upstream call.
