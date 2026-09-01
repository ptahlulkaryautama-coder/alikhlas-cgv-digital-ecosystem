import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608020006_finance_test_import_rpc.sql';

test('Phase 3 replaces the legacy commit RPC with a test-only RPC', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /drop function if exists public\.commit_finance_import/);
  assert.match(sql, /create or replace function public\.commit_finance_test_import/);
  assert.match(sql, /finance_import_test_mode_enabled', false/);
  assert.match(sql, /environment text not null default 'test'/);
  assert.doesNotMatch(sql, /finance_import_test_mode_enabled'[^;]+true/i);
});

test('test import enforces new TPQ finance permission and server reconciliation', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /public\.has_permission\('tpq_finance:write'\)/);
  assert.doesNotMatch(sql, /p_scope = 'tpq' and not public\.has_permission\('tpq:write'\)/);
  assert.match(sql, /RECONCILIATION_MISMATCH/);
  assert.match(sql, /p_opening_balance \+ v_total_income - v_total_expense/);
  assert.match(sql, /date_trunc\('month', r\.transaction_date\)::date <> p_period/);
});

test('test import rejects abuse, duplicates, and non-draft source rows', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /FINANCE_IMPORT_RATE_LIMITED/);
  assert.match(sql, /DUPLICATE_IMPORT_OR_REFERENCE/);
  assert.match(sql, /ROW_LIMIT_EXCEEDED/);
  assert.match(sql, /r\.record_status <> 'Draft'/);
  assert.match(sql, /when unique_violation/);
});

test('test batches are hidden from ordinary finance and TPQ readers', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /drop policy if exists finance_batches_read_by_scope/);
  assert.match(sql, /finance_batches_read_test_by_scope/);
  assert.match(sql, /tpq_finance:approve/);
  assert.doesNotMatch(sql, /scope = 'tpq' and public\.has_permission\('tpq:read'\)/);
});

test('frontend calls only the test import RPC and requires test mode capability', async () => {
  const panel = await readFile('src/components/finance/FinanceImportPanel.jsx', 'utf8');
  assert.match(panel, /commit_finance_test_import/);
  assert.match(panel, /p_expected_closing_balance/);
  assert.match(panel, /capability\.test_mode_enabled/);
  assert.doesNotMatch(panel, /rpc\('commit_finance_import'/);
});
