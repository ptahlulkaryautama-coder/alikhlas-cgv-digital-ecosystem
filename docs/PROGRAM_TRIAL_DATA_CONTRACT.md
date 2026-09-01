# Program Trial Data Contract

Status: Phase 0 schema only. No mutation endpoint exists and no Sheet write is authorized.

## Environment and storage target

- The future trial target is exactly `TEST_01_Program_Kajian`.
- Production sheet names must be rejected by the future mutation boundary.
- The browser must never select or submit a sheet name; the server binds the route to the test target.
- A Sheet row number is storage metadata, never an entity identifier.

## Record schema

```json
{
  "id": "prg_01K4Q7S8Y2ZP6E2H8A4V9M3T1N",
  "version": 1,
  "title": "Kajian keluarga",
  "category": "Kajian Keluarga",
  "schedule": "Ahad pekan ke-2 | Ba'da Maghrib",
  "location": "Aula Utama",
  "audience": "Jamaah umum",
  "description": "Deskripsi publik program.",
  "visibility": "Pengurus",
  "status": "Draft",
  "createdAt": "2026-07-31T10:00:00.000Z",
  "createdBy": "usr_01K4Q7...",
  "updatedAt": "2026-07-31T10:00:00.000Z",
  "updatedBy": "usr_01K4Q7...",
  "archivedAt": null
}
```

## Field rules

| Field | Type | Rule |
|---|---|---|
| `id` | string | Required, server-generated opaque stable ID, suggested `prg_` + ULID. Immutable and unique. Never a row number or client-selected maximum. |
| `version` | integer | Required, starts at `1`, server increments on every accepted update/archive. |
| `title` | string | Required, trimmed, 1–160 characters, formula-injection-safe. |
| `category` | string | Required, trimmed, 1–80 characters; category taxonomy must be approved before Phase 1. |
| `schedule` | string | Required, trimmed, 1–160 characters. A structured schedule may replace this after product review. |
| `location` | string | Required, trimmed, 1–120 characters. |
| `audience` | string | Required, public-safe, trimmed, 1–120 characters; no attendee identities. |
| `description` | string | Required, trimmed, 1–2000 characters, plain text. |
| `visibility` | enum | Exactly `Publik` or `Pengurus`. |
| `status` | enum | Exactly `Draft`, `Dalam peninjauan`, `Siap publik`, or `Arsip`. |
| `createdAt` | ISO timestamp | Server-generated UTC timestamp; immutable. |
| `createdBy` | string | Server-derived authenticated actor ID; immutable. |
| `updatedAt` | ISO timestamp | Server-generated UTC timestamp. |
| `updatedBy` | string | Server-derived authenticated actor ID. |
| `archivedAt` | ISO timestamp/null | Server-generated on archive; null otherwise. |

Unknown fields are rejected. Clients may not set IDs, versions, or audit fields on create. Public reads may include a record only when `visibility` is `Publik`, `status` is `Siap publik`, and `archivedAt` is null.

## Lifecycle and deletion policy

Allowed lifecycle: `Draft` → `Dalam peninjauan` → `Siap publik` → `Arsip`. Returning an archived record to a non-archive status requires a future explicit restore command and audit event. Hard delete is prohibited. Archive preserves the record, stable ID, version history, and audit history.

Phase 1 must add JSON Schema or equivalent server validation, optimistic concurrency using `expectedVersion`, idempotency for create, and contract tests before any UI control is enabled.

