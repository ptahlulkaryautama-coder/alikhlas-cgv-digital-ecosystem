import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('integration readiness panel summarizes all integration lines without mutations', async () => {
  const hook = await read('src/hooks/useIntegrationReadiness.js');
  for (const token of [
    'content_article_capabilities',
    'content_program_capabilities',
    'content_agenda_capabilities',
    'content_production_release_capabilities',
    'finance_import_capabilities',
    'finance_manual_capabilities',
    'tpq_public_schedule',
    'tpq_public_agenda',
    'tpq_public_learning_focus',
  ]) assert.match(hook, new RegExp(token));
  assert.doesNotMatch(hook, /insert\(/i);
  assert.doesNotMatch(hook, /update\(/i);
  assert.doesNotMatch(hook, /delete\(/i);
  assert.doesNotMatch(hook, /student|guardian|payment|attendance|grade|report/i);
});

test('settings loads the integration readiness panel before access management', async () => {
  const settings = await read('src/pages/SettingsAdmin.jsx');
  assert.match(settings, /IntegrationReadinessPanel/);
  assert.ok(settings.indexOf('<IntegrationReadinessPanel />') < settings.indexOf('<OperationalRoleAdminPanel />'));
});

test('integration readiness UI exposes status and privacy copy', async () => {
  const component = await read('src/components/settings/IntegrationReadinessPanel.jsx');
  assert.match(component, /Kesiapan Web, Dashboard, dan TPQ/);
  assert.match(component, /Read-only/);
  assert.match(component, /data santri, wali, nilai, absensi, atau transaksi privat/);
  assert.match(component, /Refresh/);
});
