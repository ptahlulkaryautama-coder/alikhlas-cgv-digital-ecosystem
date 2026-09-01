# Codex Takeover and Integration Audit

Audit date: 2026-07-31  
Repository: `alikhlas-cgv-digital-ecosystem`  
Audit branch: `codex/integration-audit`  
Scope: read/data flow, proxy, admin capability, pre-CRUD security, and public header regression. No writes, deployment, push, finance changes, TPQ private data, or Legacy modifications were performed.

## Repository status

- The checkout began on `main` with pre-existing staged/uncommitted changes across the public UI, hooks, API client, `netlify.toml`, and an untracked `netlify/` directory. They were preserved and the required audit branch was created from that working state.
- Stack: React 18, React Router 6, Vite 6, Netlify redirects/functions (`package.json:1-19`, `netlify.toml:1-12`).
- Route protection wraps every `/app/*` route, with `/tpq` redirecting to protected `/app/tpq` (`src/App.jsx:42-139`). The gate is explicitly a client-side prototype (`src/components/common/ProtectedRoute.jsx:1-29`, `src/services/auth.js:1-72`).
- At audit time, `README.md:8-36` was stale and incorrectly directed deployment of a client-side backend URL variable. Phase 0 removes that guidance.
- Legacy sources were inspected read-only and remain isolated from runtime imports.

## Actual data-flow matrix

| Module | Canonical/runtime source | Local fallback | Remote endpoint | Hook/components and filters | Admin behavior | Redeploy required? | Classification / synchronization / writes |
|---|---|---|---|---|---|---|---|
| Program Kajian | When successful, GAS `01_Program_Kajian`; backend source filters `status === "Active"`, `website === "Yes"`, excludes category `TPQ`, sorts ID descending, limits 6 (`Legacy/scripts/Code_v1_7.gs:42-46,77-80`). | `programs` in `src/data/siteContent.js:47-92`, normalized by `src/services/api.js:145-195`. | Browser GET `/api/sheets?sheet=01_Program_Kajian` (`src/services/api.js:105-126`); Netlify forwards to server `GAS_URL` (`netlify/functions/sheets-proxy.mjs:12-50`). | `usePrograms` starts with fallback and replaces it only on successful non-empty JSON (`src/hooks/usePrograms.js:1-37`). Used by public Program/Home and protected Program admin (`src/pages/PublicProgram.jsx:50-66,138-141`; `src/components/website/ProgramKegiatan.jsx:15-47`; `src/pages/ProgramAdmin.jsx:17-94`). UI category/search filters are display-only. | Search/filter, summaries, schedule and website preview; Add disabled; no form/validation/mutation (`src/components/program/ProgramNotice.jsx:53-81`, `ProgramTable.jsx:11,227`). | Remote row changes do not require redeploy if production proxy/env works; fallback edits do. | **Remote read with local fallback.** Conditional synchronization is implemented, but production synchronization was not proven in this environment. Browser writes: no. |
| Agenda Kegiatan | When successful, GAS `09_Agenda_Kalender`; backend excludes `Dibatalkan`, requires `website === "Yes"`, sorts date ascending, limits 6 (`Legacy/scripts/Code_v1_7.gs:48-52,77-80`). | `mockAgenda` in `src/data/dashboardMockData.js:103-152`. | GET `/api/sheets?sheet=09_Agenda_Kalender`. | `useAgendaData` normalizes/enriches dates, badges, and sort keys (`src/hooks/useAgendaData.js:24-120`). Public page computes upcoming items using the local runtime date (`src/pages/PublicAgenda.jsx:25-49`); Home/calendar/list apply display filters (`src/components/website/ProgramKegiatan.jsx:15-16,70-86`). | Search/category filtering, summary, calendar and three-card preview; Add disabled; no form/validation/mutation (`src/components/agenda/AgendaNotice.jsx:53-81`, `AgendaList.jsx:8,206`). | Remote row changes do not require redeploy if production proxy/env works; fallback edits do. | **Remote read with local fallback.** Conditional synchronization is implemented, not proven live here. Browser writes: no. |
| Kabar Masjid | `src/data/newsData.js:5-174`. | Same repository dataset; no remote tier. | None. | Public list/detail/preview require `visibility === "Publik"` and `status === "Siap publik"` (`src/pages/PublicNews.jsx:22-24`, `PublicNewsDetail.jsx:23-41`, `src/components/news/KabarMasjidPreview.jsx:33-37`). Admin consumes all entries (`src/pages/NewsAdmin.jsx:20-39`). | Search/category/status overview and read-only preview. Write/upload/publish buttons disabled (`src/components/newsAdmin/NewsActionButtons.jsx:3-39`); notice says developers edit `newsData.js` (`NewsNotice.jsx:20-28`). | Yes, content changes require repository edit/build/deploy. | **Static repository data.** Not synchronized; no writes. |
| TPQ | Privacy-safe aggregate/config prototype in `src/data/tpqData.js:1-280`; TPQ Kabar reuses already-public Kabar entries. | Same local prototype data. | None. | Protected route `/app/tpq` (`src/App.jsx:126-139`); components render aggregate class/team/curriculum/agenda/document information. Dates are locally classified. | Protected read-only prototype; document/report and future private actions disabled (`src/pages/TPQ.jsx:55-98`, `src/components/tpq/TPQDocumentsSection.jsx:43-51`). | Yes. | **Prototype mock data** and **Protected read-only** UI. Not integrated; no writes. No individual student/guardian/grade/attendance/payment/report data is in the runtime model. |
| Finance transparency | Deliberately frozen repository summaries/mock data (`src/data/siteContent.js:134-236`, `src/data/dashboardMockData.js:20-63,182+`). No authoritative source exists (`docs/FINANCE_SOURCE_AUDIT.md`). | The repository data is the only active source. | None at runtime: `getPublicFinanceSummary` unconditionally returns fallback (`src/services/api.js:254-261`). Proxy does not allow `02_Keuangan` (`netlify/functions/sheets-proxy.mjs:12`). | `useFinanceSummary` and `useFinanceData` call the disabled service and receive fallback (`src/hooks/useFinanceSummary.js:5-35`, `src/hooks/useFinanceData.js:19-42`). | Protected finance controls are disabled/read-only; disputed figures remain withheld/marked for verification. | Yes, but figures must remain frozen pending verified source approval. | **Not integrated** (repository fallback only). No remote synchronization and no frontend writes. |

### Canonical-source qualification

“Canonical” above means the source actually selected by current runtime control flow, not proof that the source is authoritative DKM data. Program/Agenda remote data is preferred only after a successful non-empty proxy response. Finance has no authoritative source. Kabar and TPQ are repository-owned prototypes.

## Previous claims: confirmed, inaccurate, or incomplete

Confirmed:

- Program and Agenda have a working code path for same-origin remote reads with local fallback.
- The GAS source contains `doGet` contracts and public filters for both sheets.
- Admin Program, Agenda, and Kabar pages are protected and read-only; active CRUD controls are absent.

Inaccurate or incomplete:

- “Program and Agenda are synchronized” is too strong. They are **conditionally remote-read with fallback**. With plain Vite, the `/api/sheets` request receives Vite's HTML SPA response; JSON parsing fails and the hooks use local fallback. This machine had no server-side `GAS_URL`, no Netlify CLI, and no discoverable production URL, so live production data equality/freshness could not be independently proven.
- “Enable trial CRUD through GAS `doPost`” omits critical security facts. `Legacy/scripts/Code_v1_7.gs:140-246` already has generic create/update/delete, but it has no authentication/authorization, accepts all configured sheets including production names, trusts client payloads, hard-deletes rows, lacks validation/versioning/idempotency/rate limits/audit, and uses sheet row mutation. It is unsuitable as a trial write boundary.
- At audit time, API comments still described an obsolete client-side backend URL variable and a finance remote contract, while executable code used same-origin `/api/sheets` and disabled finance fetching.
- At audit time, Settings labeled the database “Tersambung / Live Cache” regardless of actual connection and could display a client-bundled backend URL. Phase 0 replaces this with privacy-safe health state.

## Sheets proxy audit and tests

### Static verification

- Frontend sheet traffic: the only sheet fetch constructs same-origin `/api/sheets` and uses GET (`src/services/api.js:105-126`). No executable browser call to `script.google.com` was found.
- At audit time, stale client-side backend URL references remained in README, API/hook comments, Settings, and finance rollback documentation. Phase 0 removes them and removes browser GAS hosts from CSP `connect-src`.
- Allowed proxy sheets are exactly Program and Agenda (`netlify/functions/sheets-proxy.mjs:12`); invalid/missing sheet yields JSON `400` (`:17-26`).
- `GAS_URL` is read server-side (`:29`); absent configuration yields JSON `503` (`:30-39`).
- Timeout is 6000 ms via `AbortController`; timeout returns JSON `504` (`:13,42-44,69-82`). The same `504` is also used for other thrown fetch/JSON errors, with a different message.
- Redirects are explicitly followed (`:47-51`). This is operationally compatible with GAS redirects but does not constrain final host/protocol; validate the configured base URL and redirect destination before production writes.
- Non-2xx upstream becomes JSON `502`; successful upstream is parsed as JSON and returned with a 5-minute browser/10-minute shared cache (`:53-68`). Upstream `ok:false` with HTTP 200 is passed through as HTTP 200.
- Redirect order is correct: `/api/sheets` precedes `/*` (`netlify.toml:5-12`), so Netlify should route API before SPA fallback.
- Production requires the function directory to be deployed, the redirect configuration to be active, a valid server-only `GAS_URL`, GAS read permissions, and network access to the deployment. A backend URL is never a permitted Vite variable.

### Actual local results

| Test | Status | Content-Type | Response shape |
|---|---:|---|---|
| `npm run build` | success | n/a | Vite 6.4.3; 153 modules; completed in 2.30 s |
| Plain Vite `/` | 200 | `text/html` | app HTML |
| Plain Vite `/program` | 200 | `text/html` | SPA HTML |
| Plain Vite `/agenda` | 200 | `text/html` | SPA HTML |
| Plain Vite `/api/sheets?sheet=01_Program_Kajian` | 200 | `text/html` | Vite SPA HTML, not JSON; `response.json()` rejects and Program falls back |
| Direct function invocation, Program | 503 | `application/json` | `{ok:false,error:string}` because server `GAS_URL` is absent |
| Direct function invocation, Agenda | 503 | `application/json` | `{ok:false,error:string}` because server `GAS_URL` is absent |
| Direct function invocation, INVALID | 400 | `application/json` | `{ok:false,error:string}` |

`netlify dev` could not be run because Netlify CLI is absent. No secret was printed. Browser automation was unavailable, so console/network UI inspection could not be completed; source and HTTP behavior establish that plain Vite performs a same-origin request (therefore no cross-origin CORS request) and falls back after the HTML-to-JSON parse failure. This is clean fallback control flow, although the dev server still returns an avoidable 200 HTML response for the API path rather than a dedicated dev proxy/error.

## Admin capability matrix

| Route | Current controls | Forms/validation | Preview | Mutation code | Missing backend requirements |
|---|---|---|---|---|---|
| `/app/program` | Search and pillar/category filters; disabled “Tambah Program”; quick links | No create/edit form and no mutation validation | Weekly schedule and public card preview | None | AuthN/AuthZ, test environment, command/schema allowlist, stable IDs, versioning, idempotency, audit, archive, limits, rollback |
| `/app/agenda` | Search/category filters; calendar navigation; disabled “Tambah Agenda” | No create/edit form and no mutation validation | Calendar and first-three public cards | None | Same controls plus strict date/gallery validation |
| `/app/kabar` | Search/category/status views; active Review modal; disabled write/upload/publish actions | No editable/publish form and no mutation validation | Read-only article preview and public link for publishable entries | None | Editorial workflow, media storage/security decision, AuthN/AuthZ, versioning/audit/archive, content/media validation |

Scoped searches found no POST/PUT/DELETE fetches and no localStorage mutations in these modules. The only relevant persistence is prototype authentication in `sessionStorage` (`src/services/auth.js:33-71`) and unrelated appearance settings in `localStorage` (`src/pages/SettingsAdmin.jsx:87-156`). The Legacy GAS `doPost` is backend mutation code, but it is neither called by current React code nor exposed through the current Netlify proxy.

## Security gaps before CRUD

Trial CRUD is **not ready**. Exact blockers:

1. No server-side authentication or authorization; the frontend PIN is spoofable client state.
2. No separate test GAS deployment/spreadsheet/credentials and no test-only sheet allowlist.
3. Legacy `doPost` accepts production Program/Agenda/Finance names and hard delete.
4. No strict input schema, field allowlist, length/enum/URL/date checks, formula-injection defense, or body limit.
5. IDs are numeric/client-influenced and row lookup is mutable; no opaque stable identifier.
6. No version field, compare-and-set behavior, or optimistic conflict response.
7. No idempotency keys; retries can duplicate creates.
8. No append-only audit trail or trustworthy actor fields.
9. No archive/restore contract; current delete removes rows.
10. No rate limiting, abuse monitoring, or emergency write kill switch.
11. No backup/restore rehearsal or verified rollback time.
12. At audit time, secret/endpoint guidance was inconsistent and Settings could expose a client-configured backend URL.
13. Error mapping is incomplete: successful upstream `ok:false`, non-JSON, and non-timeout exceptions need distinct stable handling.
14. Privacy and module-scope policies are not enforced at a mutation boundary.

The required architecture and gates are specified in `docs/INTEGRATION_TRIAL_ARCHITECTURE.md` and `docs/INTEGRATION_SECURITY_CHECKLIST.md`.

## Header regression findings

### DOM hierarchy

`Header` returns a fragment with `LiveKajianBanner` first, followed by `<header class="site-header">`. The header contains `<Container as="nav" class="site-nav">` (brand, desktop links, CTA, menu toggle) and then the fixed mobile-menu sibling (`src/components/website/Header.jsx:53-159`). On Home, this entire fragment precedes `<main>` and Hero (`src/pages/Home.jsx:55-65`). This hierarchy correctly permits the banner to scroll away while the following header becomes sticky.

### Positioning and conflicts

- Banner: `position: relative`, normal flow, no transform, `z-index:20` (`src/styles/liveKajian.css:7-22`).
- Header: `position: sticky; top:0; z-index:1000`, `pointer-events:none`, padding, and `margin-bottom:-80px`; the capsule restores pointer events (`src/styles/home.css:9-35`).
- Hero: `position:relative; min-height:100vh; overflow:hidden` (`src/styles/home.css:266-270`). It is a following sibling, not a sticky ancestor.
- No overflow or transform exists on `.home-page`/header ancestors (`src/styles/home.css:1-5`); the transform animations are on descendants or later sections. Therefore the common ancestor-based sticky blocker is absent.
- No duplicate `.site-header` or `.site-nav` selector was found outside `home.css`. `.app-header` in `global.css:48-60` is a distinct dashboard/general selector and does not conflict.
- Desktop hiding/menu switch occurs at 980 px (`home.css:1629-1637`). At 720 px the capsule width/padding/logo are adjusted (`:1662-1675`). The mobile drawer is `position:fixed; inset:0`, toggled by `.is-open`, closes on route changes and Escape (`home.css:186-200`; `Header.jsx:24-49,95-158`). The live banner stacks into a column at 430 px (`liveKajian.css:516-526`).

### Likely regression and decision

No unambiguous sticky blocker exists in the inspected CSS. The negative `margin-bottom:-80px` intentionally overlays/pulls the Hero under the header and can make the Hero appear covered, especially as header/banner heights vary; it does not itself disable sticky positioning. The public navigation layout has also changed structurally by adding “Live” as the first navigation item (`Header.jsx:9-17`) and rendering the banner outside the header (`:53-56`).

No header correction was applied: the requested fix was conditional on an unambiguous root cause that could be verified locally, and browser automation was unavailable. Removing the negative margin or changing the sticky container without visual breakpoint verification could alter the intended capsule/hero composition or drawer stacking. Recommended verification is a focused browser test at 375, 430, 768, 1024, and 1440 px: banner top enters/exits normal flow, capsule top remains 0 through scroll, Hero content bounding box remains below visible capsule, drawer opens/closes and traps no obscured controls.

## Final assessment

- Program/Agenda: remote-read-with-local-fallback code is real; live production synchronization remains unverified here.
- Kabar: static repository content.
- TPQ: protected, privacy-safe prototype mock/aggregate content.
- Finance: intentionally non-integrated fallback; disputed figures remain frozen.
- Proxy: sound read-only allowlist and redirect ordering, with documented error/redirect/cache limitations and stale direct-GAS configuration residue.
- CRUD readiness: blocked. Do not connect admin controls to the Legacy `doPost`.
- Recommended next implementation task was Phase 0 security foundation: remove client backend-URL references/diagnostics, define the authenticated test-only boundary and schemas, provision `TEST_01_Program_Kajian`, and add contract/security tests. Do not enable UI writes until those gates pass.

## Files inspected

Required files were read: `README.md`, `package.json`, `netlify.toml`, `src/App.jsx`, `src/main.jsx`, `src/services/api.js`, `netlify/functions/sheets-proxy.mjs`, Program/Agenda hooks/pages/components/fallback data, `src/data/newsData.js`, `src/data/tpqData.js`, `src/components/common/ProtectedRoute.jsx`, and all named QA/finance/TPQ/performance reports. Supporting inspection included `src/services/auth.js`, `src/pages/Login.jsx`, public Program/Agenda/Kabar pages, finance hooks/data/components, TPQ page/components/date utility, Header/Banner/Hero/Home and relevant CSS, `src/pages/SettingsAdmin.jsx`, `vite.config.js`, and read-only `Legacy/scripts/Code_v1_7.gs`.
