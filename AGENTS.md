# Repository Map

- `src/App.jsx`: public and PIN-gated route map.
- `src/services/api.js`: browser-side, same-origin, read-only Sheets client. Keep browser traffic on `/api/sheets`; never put a backend URL in a Vite variable.
- `netlify/functions/`: server-side integrations. `sheets-proxy.mjs` is currently GET-only and permits Program and Agenda only.
- `netlify/functions/_lib/`: shared read-proxy and signed-session primitives; never import these into `src/`.
- `src/hooks/usePrograms.js`, `src/hooks/useAgendaData.js`: remote-read hooks with local fallback.
- `src/data/siteContent.js`, `src/data/dashboardMockData.js`, `src/data/newsData.js`, `src/data/tpqData.js`: repository/fallback/prototype datasets. Finance figures are disputed and frozen.
- `src/pages/*Admin.jsx`, `src/components/{program,agenda,newsAdmin}/`: protected read-only admin views.
- `src/components/website/Header.jsx`, `src/styles/home.css`, `src/styles/liveKajian.css`: public banner/navigation/header behavior.
- `docs/`: release, finance, privacy, integration, and audit records.
- `test/`: Node built-in contract/security tests; `npm test` builds before scanning the frontend bundle.
- `Legacy/`: reference-only source. Do not modify, delete, import into runtime, or treat its client-side security as production-ready.

## Safety Boundaries

- Do not change finance numbers or transaction arrays without verified Bendahara source approval.
- Do not expose individual TPQ/student/guardian/teacher/attendance/grade/payment/report data.
- Keep admin mutations disabled until server authentication and authorization exist.
- The frontend PIN/sessionStorage gate is prototype navigation gating, not backend authorization.
- Never call `script.google.com` from the browser or expose `GAS_URL` through a `VITE_` variable.
- Use test Sheets for integration trials; never test writes against production Sheets.
- Do not push to `main` or deploy without explicit authorization.
