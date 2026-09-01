import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608020004_finance_approval_workflow.sql';

test('legacy finance transitions remain valid and are superseded by audited single-account policy', async () => {
  const [sql,policy] = await Promise.all([readFile(MIGRATION, 'utf8'),readFile('supabase/migrations/202608100017_single_account_workflows.sql','utf8')]);
  assert.match(sql, /SELF_APPROVAL_FORBIDDEN/);
  assert.match(sql, /ONLY_CREATOR_CAN_SUBMIT/);
  assert.match(sql, /INVALID_WORKFLOW_TRANSITION/);
  assert.match(sql, /REJECTION_REASON_REQUIRED/);
  assert.match(sql, /where id = p_batch_id for update/i);
  assert.match(policy,/finance:write/);
});

test('finance workflow separates TPQ academic writes from TPQ finance writes', async () => {
  const [sql, panel] = await Promise.all([
    readFile(MIGRATION, 'utf8'),
    readFile('src/components/finance/FinanceImportPanel.jsx', 'utf8'),
  ]);
  assert.match(sql, /'kepala_tpq', 'tpq_finance:write'/);
  assert.doesNotMatch(sql, /'guru_tpq', 'tpq_finance:write'/);
  assert.match(panel, /tpq_finance:write/);
  assert.match(sql, /revoke execute on function public\.commit_finance_import[^;]+from authenticated/i);
});

test('workflow mutations are RPC-only and atomically audited', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /security definer/i);
  assert.match(sql, /insert into public\.audit_events/);
  assert.match(sql, /before_snapshot, after_snapshot/);
  assert.doesNotMatch(sql, /grant (?:insert|update|delete)[^;]*finance_import_batches/i);
});

test('finance UI chains validation and publication for one account', async () => {
  const ui = await readFile('src/components/finance/FinanceApprovalPanel.jsx', 'utf8');
  for (const action of ['submit_review', 'approve', 'publish']) assert.match(ui, new RegExp(`'${action}'`));
  assert.match(ui, /publishNow/);
  assert.match(ui, /Validasi &amp; publikasikan/);
});
