import assert from 'node:assert/strict';
import test from 'node:test';
import { assessFinancePilotBatches } from '../src/services/financePilotReadiness.js';

test('pilot readiness reports reconciliation, workflow, publication, and audit gaps', () => {
  const result = assessFinancePilotBatches([
    { id: 'a', workflow_status: 'approved', expected_closing_balance: 100, calculated_closing_balance: 100 },
    { id: 'b', workflow_status: 'under_review', expected_closing_balance: 200, calculated_closing_balance: 190 },
    { id: 'c', workflow_status: 'published', expected_closing_balance: 300, calculated_closing_balance: 300 },
  ], [{ entity_id: 'a', action: 'finance.workflow.approve' }]);
  assert.deepEqual(result, {
    total: 3, reconciled: 2, approved: 1, pending: 1, rejected: 0, published: 1,
    missingAudit: 1, hasReconciliationProblem: true, hasPilotPublication: true,
  });
});

test('history maps the exact workflow audit action names emitted by SQL', async () => {
  const { readFile } = await import('node:fs/promises');
  const history = await readFile('src/components/finance/FinanceBatchHistory.jsx', 'utf8');
  for (const action of ['submit_review', 'approve', 'reject', 'publish']) assert.match(history, new RegExp(`finance\\.workflow\\.${action}`));
});
