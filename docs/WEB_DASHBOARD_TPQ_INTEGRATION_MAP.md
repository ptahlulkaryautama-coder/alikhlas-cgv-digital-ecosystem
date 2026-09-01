# Web, Dashboard, and TPQ Read Integration Map

This map describes the current read-only architecture. “Remote” means a successful runtime response from the same-origin Netlify proxy; it is never inferred from build configuration.

| Module | Canonical source | Repository / adapter | Endpoint | Local fallback | Public consumer | Dashboard consumer | Public filter | Admin filter | Privacy boundary | Redeploy | Future mutation path |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Program | `01_Program_Kajian` when proxy read succeeds | `programRepository` / `usePrograms` | GET `/api/sheets?sheet=01_Program_Kajian` | `siteContent.programs` | Home and `/program`, scope `public` | `/app/program`, scope `admin` | Ready/active plus public visibility | All safe rows returned by the approved read adapter | Normalizer excludes internal participant/material fields | Remote: no; fallback: yes | Authenticated, authorized test-only command boundary after all security gates |
| Agenda | `09_Agenda_Kalender` when proxy read succeeds | `agendaRepository` / `useAgendaData` | GET `/api/sheets?sheet=09_Agenda_Kalender` | `dashboardMockData.mockAgenda` | Home and `/agenda`, scope `public` | `/app/agenda`, scope `admin` | Public visibility; cancelled/draft/internal excluded | All safe rows returned by the approved read adapter | No participant/private-note fields | Remote: no; fallback: yes | Same test-only command boundary; archive must be explicit, never date-inferred |
| Kabar | `newsData.js` | `kabarRepository` | None | Same static repository | Home, `/kabar`, `/kabar/:slug` | `/app/kabar` and dashboard summary | `visibility=Publik` and `status=Siap publik` | All static records, including Draft, review, Internal, and Privat | Public consumers only receive editorially public records | Yes | Server-authenticated editorial service and media policy; not implemented |
| TPQ public projection | Privacy-safe projection generated from aggregate prototype data plus public Kabar | `tpqRepository` / `tpqPublicProjection` | RPC `tpq_private_capabilities` & `command_tpq_private_record` | Protected prototype | Only schedule, agenda, learning focus, public TPQ Kabar, and verification state where relevant | `/app/tpq` uses protected aggregate/internal-safe repository projection | Explicit allowlist; no rosters, contacts, personal academic/payment data, staff PII, or photos | Protected aggregate/config prototype + sealed vault records when enabled | Child/family/staff PII must remain outside public bundles and future public APIs | Yes | Authenticated `command_tpq_private_record` RPC with sealed payload, opaque codes, and `tpq:private_write` authorization |
| Finance status only | Frozen repository values pending Bendahara approval | Existing finance read service | None | Frozen repository only | Existing transparency views | Existing protected finance views | No new data or integration | No new data or integration | Disputed figures and transaction arrays remain frozen | Yes | Blocked on verified Bendahara source approval and secure server authorization |

## Runtime source labels

- `Google Sheets via proxy`: set only after a successful same-origin JSON proxy read.
- `Local fallback`: local Program or Agenda repository selected, including plain `npm run dev`.
- `Static repository data`: Kabar from `newsData.js`; edits require rebuild and deployment.
- `Protected prototype data`: TPQ aggregate/config prototype.
- `Integrasi belum diverifikasi`: attached to TPQ prototype state; it is not a connectivity claim.

The current upstream Sheets read may already apply public filtering. Therefore “all safe rows” in Program/Agenda admin means all rows delivered by the approved read endpoint, not a claim that hidden production rows are available.
