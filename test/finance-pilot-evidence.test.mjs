import assert from 'node:assert/strict';
import test from 'node:test';
import { createFinancePilotEvidenceCsv } from '../src/services/financePilotEvidence.js';

test('pilot evidence CSV reconciles balances and contains no private transaction fields', () => {
  const csv = createFinancePilotEvidenceCsv({
    scope: 'tpq',
    batches: [{
      id: 'batch-1', period: '2026-08-01', file_name: 'pilot.xlsx', workflow_status: 'approved',
      created_at: '2026-08-03T10:00:00Z', row_count: 3, opening_balance: 1000000,
      total_income: 350000, total_expense: 75000, expected_closing_balance: 1275000,
      calculated_closing_balance: 1275000, rejection_reason: null,
    }],
    events: [{ entity_id: 'batch-1', occurred_at: '2026-08-03T11:00:00Z', action: 'finance_batch_approved' }],
  });
  assert.match(csv, /reconciliation_difference/);
  assert.match(csv, /finance_batch_approved/);
  assert.match(csv, /"0"/);
  assert.doesNotMatch(csv, /student_code|internal_note|before_snapshot|after_snapshot/);
});

test('pilot evidence CSV neutralizes spreadsheet formulas and quotes', () => {
  const csv = createFinancePilotEvidenceCsv({
    scope: 'dkm',
    batches: [{ id: '1', file_name: '=HYPERLINK("bad")', rejection_reason: '+formula' }],
  });
  assert.match(csv, /"'=HYPERLINK\(""bad""\)"/);
  assert.match(csv, /"'\+formula"/);
});

