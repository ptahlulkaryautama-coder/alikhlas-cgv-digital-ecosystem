import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFinanceReadModel } from '../src/services/financeReadModel.js';
import { readFile } from 'node:fs/promises';

test('Phase 4 finance read model derives every visual from one transaction dataset', () => {
  const model = buildFinanceReadModel(
    { id: 'batch-test', scope: 'tpq', period: '2026-08-01', opening_balance: 1000000, environment: 'test', workflow_status: 'under_review' },
    [
      { id: '2', transaction_date: '2026-08-05', direction: 'expense', category: 'ATK', subcategory: 'Alat Tulis', fund_purpose: 'Operasional TPQ', public_description: 'ATK fiktif', amount: 75000, record_status: 'Draft', internal_note: 'rahasia', student_code: 'PRIVATE' },
      { id: '1', transaction_date: '2026-08-03', direction: 'income', category: 'SPP', subcategory: 'SPP Bulanan', fund_purpose: 'Operasional TPQ', public_description: 'SPP fiktif', amount: 200000, record_status: 'Draft', internal_note: 'rahasia', student_code: 'PRIVATE' },
    ],
  );
  assert.equal(model.totalIncome, 200000);
  assert.equal(model.totalExpense, 75000);
  assert.equal(model.endingBalance, 1125000);
  assert.deepEqual(model.dailyBalances, [{ date: '2026-08-03', balance: 1200000 }, { date: '2026-08-05', balance: 1125000 }]);
  assert.equal(model.incomeBreakdown[0].category, 'SPP');
  assert.ok(model.transactions.every((row) => !('studentCode' in row) && !('internalNote' in row)));
});

test('Phase 4 finance read model rejects a missing batch', () => {
  assert.throws(() => buildFinanceReadModel(null, []), /Batch keuangan tidak tersedia/);
});

test('Phase 4 Supabase hook selects only privacy-safe transaction columns and exposes retry states', async () => {
  const hook = await readFile('src/hooks/useSupabaseFinanceReadModel.js', 'utf8');
  assert.match(hook, /SAFE_TRANSACTION_COLUMNS/);
  assert.doesNotMatch(hook, /SAFE_TRANSACTION_COLUMNS\s*=.*student_code/);
  assert.doesNotMatch(hook, /SAFE_TRANSACTION_COLUMNS\s*=.*internal_note/);
  assert.match(hook, /source: 'empty'/);
  assert.match(hook, /source: 'error'/);
  assert.match(hook, /retry: load/);
  assert.match(hook, /finance-ledger-updated/);
});

test('Phase 4 TPQ snapshot is labeled as test data and renders one read model', async () => {
  const [component, page] = await Promise.all([
    readFile('src/components/finance/FinanceSupabaseSnapshot.jsx', 'utf8'),
    readFile('src/pages/TPQ.jsx', 'utf8'),
  ]);
  assert.match(component, /Data uji/);
  assert.match(component, /data\.incomeBreakdown/);
  assert.match(component, /data\.transactions/);
  assert.match(component, /Coba lagi/);
  assert.doesNotMatch(component, /student_code|internal_note/);
  assert.match(page, /<FinanceSupabaseSnapshot scope="tpq"/);
});

test('Phase 4 DKM dashboard passes one Supabase read model to every finance visual', async () => {
  const [page, chart, categories, table] = await Promise.all([
    readFile('src/pages/Finance.jsx', 'utf8'),
    readFile('src/components/finance/FinanceDailyBalanceChart.jsx', 'utf8'),
    readFile('src/components/finance/FinanceCategoryBreakdown.jsx', 'utf8'),
    readFile('src/components/finance/FinanceTransactionTable.jsx', 'utf8'),
  ]);
  assert.match(page, /useSupabaseFinanceReadModel\('dkm', periodIso\)/);
  assert.match(page, /FinanceDailyBalanceChart[^>]*data=\{financeLive\.data\}/);
  assert.match(page, /FinanceCategoryBreakdown[^>]*data=\{financeLive\.data\}/);
  assert.match(page, /FinanceTransactionTable[^>]*data=\{financeLive\.data\}/);
  assert.match(page, /Sumber saat ini: repository\/fallback/);
  assert.match(chart, /data\?\.dailyBalances/);
  assert.match(categories, /data\.incomeBreakdown/);
  assert.match(table, /Data Uji Supabase/);
});
