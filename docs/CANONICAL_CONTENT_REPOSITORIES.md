# Canonical Content Repositories

## Boundary

Page components do not fetch canonical content and do not select raw fallback arrays. Repositories own normalization, public/admin projection, fallback selection, source metadata, and stable identifier lookup. React hooks are thin lifecycle adapters.

| Repository | Read methods | Source behavior |
|---|---|---|
| `programRepository` | `getAll`, `getPublic`, `getById`, `getSourceStatus` | Same-origin proxy in proxy mode; approved local fallback in local/error mode |
| `agendaRepository` | `getAll`, `getPublic`, `getById`, `getSourceStatus` | Same-origin proxy in proxy mode; approved local fallback in local/error mode; ISO date and runtime temporal grouping |
| `kabarRepository` | `getAll`, `getPublic`, `getById`, `getSourceStatus` | Static `newsData.js`; public editorial filter; rebuild/deploy required |
| `tpqRepository` | `getAll`, `getPublic`, `getById`, four public projection getters, `getSourceStatus` | Protected prototype plus explicit public allowlist; rebuild/deploy required |

## Local and proxy modes

`npm run dev` resolves to local mode and performs no Sheets request. `netlify dev` runs Vite in proxy mode and may call `/api/sheets`; the function returns structured JSON or a safe configuration error. Production also uses only `/api/sheets`. Browser code contains no GAS backend URL and never calls `script.google.com`.

The shared API client retains in-flight request deduplication, rejects non-JSON proxy content before parsing, uses GET with same-origin credentials, and falls back safely. A remote label is recorded only after a successful runtime response.

## Agenda semantics

Dates normalize to ISO where supported. `temporalGroup` is runtime-derived as `upcoming`, `archive`, or `unknown`; this is display classification only. A past date never changes the editorial `status` to `Terlaksana`.

## Remaining blockers before writes

Server authentication and role authorization, a separate test spreadsheet/deployment, strict schemas and field allowlists, opaque stable IDs, optimistic concurrency, idempotency, append-only audit, archive/restore semantics, rate limits, backups/rollback rehearsal, monitoring, and a write kill switch. The legacy unauthenticated GAS `doPost` is prohibited.
