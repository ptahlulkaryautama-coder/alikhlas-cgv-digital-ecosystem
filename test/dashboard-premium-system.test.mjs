import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('premium dashboard shell has shared tokens and accessible interaction states', async () => {
  const [layout, css, docs] = await Promise.all([
    readFile('src/components/dashboard/DashboardLayout.jsx', 'utf8'),
    readFile('src/styles/dashboardPremium.css', 'utf8'),
    readFile('docs/DASHBOARD_PREMIUM_DESIGN_SYSTEM.md', 'utf8'),
  ]);
  assert.match(layout, /db-skip-link/);
  assert.match(layout, /id="dashboard-main-content"/);
  assert.match(layout, /db-mobile-scrim/);
  assert.match(layout, /dashboardPremium\.css/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /@media \(max-width:768px\)/);
  assert.match(docs, /quiet premium, trustworthy, operational/);
});

test('premium dashboard shell does not remove focus outlines', async () => {
  const css = await readFile('src/styles/dashboardPremium.css', 'utf8');
  assert.doesNotMatch(css, /outline\s*:\s*none/);
});

test('sidebar icons keep fixed sizing and App Pengampu icon is featured', async () => {
  const [baseCss, premiumCss] = await Promise.all([
    readFile('src/styles/dashboard.css', 'utf8'),
    readFile('src/styles/dashboardPremium.css', 'utf8'),
  ]);
  for (const css of [baseCss, premiumCss]) {
    assert.match(css, /db-sb-icon-wrap/);
    assert.match(css, /db-sb-item-featured/);
    assert.match(css, /db-sb-label/);
    assert.match(css, /max-width:\s*16px/);
    assert.match(css, /max-height:\s*16px/);
    assert.match(css, /max-width:\s*22px/);
    assert.match(css, /max-height:\s*22px/);
  }
  assert.match(premiumCss, /Sidebar containment guard/);
  assert.match(premiumCss, /flex-direction:\s*column !important/);
  assert.match(premiumCss, /white-space:\s*nowrap !important/);
  assert.match(premiumCss, /background:\s*transparent !important/);
});

test('TPQ app command bar is responsive and privacy-safe', async () => {
  const css = await readFile('src/styles/tpqPortal.css', 'utf8');
  assert.match(css, /tpq-standalone-app-shell/);
  assert.match(css, /tpq-standalone-topbar/);
  assert.match(css, /tpq-standalone-actions/);
  assert.match(css, /tpq-standalone-bottom-nav/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /tpq-app-command/);
  assert.match(css, /tpq-app-command__status/);
  assert.match(css, /tpq-app-command__quick/);
  assert.match(css, /grid-template-columns:\s*repeat\(4/);
  assert.match(css, /grid-template-columns:\s*repeat\(2/);
  assert.match(css, /grid-template-columns:\s*1fr/);
});

test('premium primitives cover finance data, forms, permissions, and TPQ cards', async () => {
  const css = await readFile('src/styles/dashboardPremium.css', 'utf8');
  for (const selector of ['fin-kpi-card', 'fin-table-container', 'fin-import-card', 'fin-permission-admin', 'fin-pill', 'tpq-kelas-card']) {
    assert.match(css, new RegExp(`\\.dashboard-root \\.${selector}`));
  }
  assert.match(css, /font-variant-numeric:tabular-nums/);
  assert.match(css, /min-width:720px/);
  assert.match(css, /@media \(max-width:460px\)/);
});

test('premium operational primitives cover cards, controls, tables, grids, and page footers', async () => {
  const css = await readFile('src/styles/dashboardPremium.css', 'utf8');
  for (const selector of ['db-card', 'db-card-head', 'db-sec-eyebrow', 'fin-tx-table', 'db-pg-footer']) {
    assert.match(css, new RegExp(`\\.dashboard-root \\.${selector}`));
  }
  assert.match(css, /\.db-card textarea \{ min-height:112px; resize:vertical;/);
  assert.match(css, /@media \(max-width:640px\)/);
  assert.doesNotMatch(css, /outline\s*:\s*none/);
});

test('Program and Agenda pages no longer use inline style objects', async () => {
  const [program, agenda] = await Promise.all([
    readFile('src/pages/ProgramAdmin.jsx', 'utf8'),
    readFile('src/pages/AgendaAdmin.jsx', 'utf8'),
  ]);
  assert.doesNotMatch(program, /style=\{\{/);
  assert.doesNotMatch(agenda, /style=\{\{/);
  assert.match(program, /db-source-badge/);
  assert.match(agenda, /db-source-badge/);
});

test('Reports page substantially reduces inline style debt and uses report primitives', async () => {
  const reports = await readFile('src/pages/ReportsAdmin.jsx', 'utf8');
  const inlineCount = (reports.match(/style=\{\{/g) || []).length;
  assert.ok(inlineCount <= 5, `expected at most 5 inline styles, received ${inlineCount}`);
  for (const className of ['db-pg-header-actions', 'db-action-cluster', 'db-notice-card', 'db-report-card', 'db-report-footer']) {
    assert.match(reports, new RegExp(className));
  }
});

test('Settings page keeps only data-driven theme styles and uses responsive settings primitives', async () => {
  const [settings, css] = await Promise.all([
    readFile('src/pages/SettingsAdmin.jsx', 'utf8'),
    readFile('src/styles/dashboardPremium.css', 'utf8'),
  ]);
  const inlineCount = (settings.match(/style=\{\{/g) || []).length;
  assert.ok(inlineCount <= 5, `expected at most 5 dynamic inline styles, received ${inlineCount}`);
  for (const className of ['settings-theme-card', 'settings-form-grid', 'settings-info-row', 'settings-info-value']) {
    assert.match(settings, new RegExp(className));
    assert.match(css, new RegExp(`\\.${className}`));
  }
  assert.match(css, /settings-form-grid-3 \{ grid-template-columns:1fr;/);
});
