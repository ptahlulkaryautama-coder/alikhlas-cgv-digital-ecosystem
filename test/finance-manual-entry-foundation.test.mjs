import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('manual finance foundation defaults both switches off and exposes no browser mutations',async()=>{
  const sql=await readFile('supabase/migrations/202608030011_finance_manual_entry_foundation.sql','utf8');
  assert.match(sql,/finance_manual_writes_enabled',false/);
  assert.match(sql,/finance_manual_test_mode_enabled',false/);
  assert.match(sql,/enable row level security/);
  assert.match(sql,/revoke all on table public\.finance_manual_entries/);
  assert.doesNotMatch(sql,/grant (insert|update|delete).*finance_manual_entries/i);
  assert.match(sql,/from public,anon/);
});

test('manual finance command enforces workflow, version, idempotency, categories, and audit',async()=>{
  const sql=await readFile('supabase/migrations/202608030011_finance_manual_entry_foundation.sql','utf8');
  for(const token of ['p_idempotency_key','p_expected_version','FINANCE_MANUAL_VERSION_CONFLICT','finance_category_catalog','SELF_APPROVAL_OR_INVALID_TRANSITION','finance.manual.']) assert.match(sql,new RegExp(token.replaceAll('.','\\.')));
  assert.match(sql,/p_action='update'/);
  assert.match(sql,/p_action='publish'/);
  assert.match(sql,/source_kind/);
  assert.doesNotMatch(sql,/p_action='delete'/);
});

test('finance read hook merges one canonical import with published manual batches',async()=>{
  const hook=await readFile('src/hooks/useSupabaseFinanceReadModel.js','utf8');
  assert.match(hook,/source_kind/);
  assert.match(hook,/manualBatches/);
  assert.match(hook,/workflow_status === 'published'/);
  assert.match(hook,/\.in\('batch_id'/);
  assert.match(hook,/importBatch\?\.opening_balance \?\? 0/);
});

test('manual finance verification is read-only',async()=>{
  const sql=await readFile('supabase/rehearsal/finance_manual_foundation_verification.sql','utf8');
  assert.match(sql,/manual command anonymous blocked/);
  assert.doesNotMatch(sql,/^\s*(insert|update|delete|alter|drop|create|truncate)\b/im);
});

test('manual finance trial activation gates RLS, RPC, and browser grants and has shutdown',async()=>{
  const [on,off]=await Promise.all([readFile('supabase/rehearsal/finance_manual_trial_enable.sql','utf8'),readFile('supabase/rehearsal/finance_manual_trial_disable.sql','utf8')]);
  assert.match(on,/MANUAL_FINANCE_RLS_NOT_READY/);assert.match(on,/MANUAL_FINANCE_RPC_EXPOSED/);assert.match(on,/MANUAL_FINANCE_BROWSER_MUTATION_EXPOSED/);assert.match(on,/set enabled=true/);
  assert.match(off,/set enabled=false/);
});
