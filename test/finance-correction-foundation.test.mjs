import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608120026_finance_correction_reversal_foundation.sql';
const VERIFY = 'supabase/rehearsal/finance_correction_foundation_verification.sql';
const ENABLE = 'supabase/rehearsal/finance_correction_trial_enable.sql';
const DISABLE = 'supabase/rehearsal/finance_correction_trial_disable.sql';

test('finance correction foundation is locked by default and RPC-only', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /finance_correction_writes_enabled',false/);
  assert.match(sql, /finance_correction_test_mode_enabled',false/);
  assert.match(sql, /create table public\.finance_correction_entries/);
  assert.match(sql, /alter table public\.finance_correction_entries enable row level security/);
  assert.match(sql, /revoke all on table public\.finance_correction_entries,public\.finance_correction_command_receipts from anon,authenticated/);
  assert.match(sql, /revoke all on function public\.command_finance_correction/);
  assert.match(sql, /grant execute on function public\.command_finance_correction\(text,uuid,uuid,integer,jsonb,text\) to authenticated/);
  assert.doesNotMatch(sql, /grant (insert|update|delete).*finance_correction_entries/i);
  assert.doesNotMatch(sql, /grant (insert|update|delete).*finance_transactions/i);
});

test('finance correction publishes reversal and optional replacement without editing source transaction', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /source_kind in\('import','manual','correction'\)/);
  assert.match(sql, /correction_kind text check/);
  assert.match(sql, /source_transaction_id uuid references public\.finance_transactions\(id\)/);
  assert.match(sql, /Koreksi pembalik/);
  assert.match(sql, /'reversal',src\.id/);
  assert.match(sql, /'replacement',src\.id/);
  assert.match(sql, /SOURCE_ALREADY_CORRECTED/);
  assert.doesNotMatch(sql, /^\s*delete\s+from\s+public\.finance_transactions\b/im);
  assert.doesNotMatch(sql, /^\s*update\s+public\.finance_transactions\b/im);
});

test('finance correction command is idempotent, versioned, audited, and scoped', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /finance_correction_command_receipts/);
  assert.match(sql, /p_expected_version/);
  assert.match(sql, /FINANCE_CORRECTION_VERSION_CONFLICT/);
  assert.match(sql, /'finance\.correction\.'\s*\|\|\s*p_action/);
  assert.match(sql, /public\.has_permission\('finance:write'\)/);
  assert.match(sql, /public\.has_permission\('tpq_finance:write'\)/);
  assert.match(sql, /public\.has_permission\('finance:publish'\)/);
  assert.match(sql, /public\.has_permission\('tpq_finance:publish'\)/);
  assert.match(sql, /FINANCE_CORRECTION_RATE_LIMITED/);
});

test('finance correction verification and trial switches are safe and repeatable', async () => {
  const [verify, enable, disable] = await Promise.all([
    readFile(VERIFY, 'utf8'),
    readFile(ENABLE, 'utf8'),
    readFile(DISABLE, 'utf8'),
  ]);
  assert.match(verify, /correction writes disabled/);
  assert.match(verify, /correction command anonymous blocked/);
  assert.match(verify, /transaction correction linkage installed/);
  assert.doesNotMatch(verify, /^\s*(insert|update|delete|alter|drop|create|truncate)\b/im);
  assert.match(enable, /FINANCE_CORRECTION_RLS_NOT_READY/);
  assert.match(enable, /FINANCE_CORRECTION_BROWSER_MUTATION_EXPOSED/);
  assert.match(enable, /enabled=true/);
  assert.match(disable, /enabled=false/);
});
