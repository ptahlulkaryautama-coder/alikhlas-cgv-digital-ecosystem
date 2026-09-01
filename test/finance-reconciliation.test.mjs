import assert from 'node:assert/strict';
import test from 'node:test';
import { FINANCE_CATEGORY_CATALOG, findFinanceCategory } from '../src/data/financeCategoryCatalog.js';
import { reconcileFinance } from '../src/services/financeReconciliation.js';

test('reconciliation separates opening balance from current-period income', () => {
  const result = reconcileFinance({
    openingBalance: 2_000_000,
    expectedClosingBalance: 2_750_000,
    rows: [
      { direction: 'income', amount: 1_000_000, errors: [] },
      { direction: 'expense', amount: 250_000, errors: [] },
    ],
  });
  assert.equal(result.totalIncome, 1_000_000);
  assert.equal(result.totalExpense, 250_000);
  assert.equal(result.calculatedClosingBalance, 2_750_000);
  assert.equal(result.difference, 0);
  assert.equal(result.isReconciled, true);
});

test('reconciliation reports a difference and ignores invalid preview rows', () => {
  const result = reconcileFinance({
    openingBalance: 500_000,
    expectedClosingBalance: 650_000,
    rows: [
      { direction: 'income', amount: 200_000, errors: [] },
      { direction: 'expense', amount: 25_000, errors: ['Nominal tidak valid'] },
    ],
  });
  assert.equal(result.calculatedClosingBalance, 700_000);
  assert.equal(result.difference, 50_000);
  assert.equal(result.isReconciled, false);
  assert.equal(result.validTransactionCount, 1);
});

test('TPQ student-linked income categories require an opaque student code', () => {
  for (const category of ['SPP', 'Pendaftaran', 'Buku Prestasi', 'Seragam']) {
    assert.equal(findFinanceCategory('tpq', 'income', category)?.studentCodeRequired, true);
  }
  assert.equal(findFinanceCategory('tpq', 'income', 'Infaq TPQ')?.studentCodeRequired, false);
  assert.ok(FINANCE_CATEGORY_CATALOG.dkm.income.some((item) => item.category === 'Zakat'));
  assert.ok(FINANCE_CATEGORY_CATALOG.dkm.income.some((item) => item.category === 'Wakaf'));
});
