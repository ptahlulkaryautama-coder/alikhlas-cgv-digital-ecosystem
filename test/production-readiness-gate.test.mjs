import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('production readiness gate is read-only and checks deployment blockers', async () => {
  const hook = await read('src/hooks/useProductionReadiness.js');
  for (const token of [
    'list_content_production_candidates',
    'content_articles',
    'content_programs',
    'content_agenda',
    'environment',
    'production',
    'workflow_status',
    'Siap publik',
  ]) assert.match(hook, new RegExp(token));
  assert.doesNotMatch(hook, /insert\(/i);
  assert.doesNotMatch(hook, /update\(/i);
  assert.doesNotMatch(hook, /delete\(/i);
  assert.doesNotMatch(hook, /student|guardian|payment|attendance|grade|report/i);
});

test('production readiness gate explains no deploy or data mutation', async () => {
  const component = await read('src/components/settings/ProductionReadinessGate.jsx');
  assert.match(component, /Kunci Kesiapan Rilis Sistem/);
  assert.match(component, /Tidak deploy, tidak publish, dan tidak mengubah data/);
  assert.match(component, /Belum siap produksi/);
  assert.match(component, /Siap produksi/);
});

test('settings places production gate after integration map', async () => {
  const settings = await read('src/pages/SettingsAdmin.jsx');
  assert.match(settings, /ProductionReadinessGate/);
  assert.match(settings, /OperatorWorkflowGuide/);
  assert.match(settings, /ProjectCompletionPhasesPanel/);
  assert.ok(settings.indexOf('<IntegrationReadinessPanel />') < settings.indexOf('<ProductionReadinessGate />'));
  assert.ok(settings.indexOf('<ProductionReadinessGate />') < settings.indexOf('<OperatorWorkflowGuide />'));
  assert.ok(settings.indexOf('<OperatorWorkflowGuide />') < settings.indexOf('<ProjectCompletionPhasesPanel />'));
  assert.ok(settings.indexOf('<ProjectCompletionPhasesPanel />') < settings.indexOf('<OperationalRoleAdminPanel />'));
});

test('settings diagnostics do not show stale single-module trial status', async () => {
  const settings = await read('src/pages/SettingsAdmin.jsx');
  assert.doesNotMatch(settings, /Program trial writes/);
  assert.match(settings, /Mode aman penulisan/);
  assert.match(settings, /Peta integrasi/);
  assert.match(settings, /Gate production/);
});

test('operator guide explains cross-line workflows without mutations', async () => {
  const guide = await read('src/components/settings/OperatorWorkflowGuide.jsx');
  assert.match(guide, /Konten website/);
  assert.match(guide, /Keuangan/);
  assert.match(guide, /Akses pengguna/);
  assert.match(guide, /Portal TPQ/);
  assert.match(guide, /Tanpa SQL/);
  assert.doesNotMatch(guide, /insert\(|update\(|delete\(/i);
});

test('project completion phases panel exposes six safe phases in Settings', async () => {
  const component = await read('src/components/settings/ProjectCompletionPhasesPanel.jsx');
  assert.match(component, /6 phase sampai ecosystem complete/);
  assert.match(component, /Fondasi selesai/);
  assert.match(component, /App TPQ stand-alone tanpa membuka private vault/);
  assert.match(component, /Fondasi integrasi/);
  assert.match(component, /Polish operator/);
  assert.match(component, /Rilis konten asli/);
  assert.match(component, /Finance production/);
  assert.match(component, /App TPQ private/);
  assert.match(component, /Deploy production/);
  assert.match(component, /simulasi App TPQ dummy/);
  assert.match(component, /update docs tanpa membuka data privat/);
  assert.match(component, /206\/206 test/);
  assert.doesNotMatch(component, /insert\(|update\(|delete\(/i);
});
