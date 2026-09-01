export function reconcileFinance({ openingBalance, rows, expectedClosingBalance = null }) {
  const opening = Number(openingBalance);
  if (!Number.isFinite(opening) || opening < 0) throw new Error('Saldo awal harus berupa angka nol atau lebih.');

  const validRows = (rows ?? []).filter((row) => !row.errors?.length);
  const totalIncome = validRows.filter((row) => row.direction === 'income').reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const totalExpense = validRows.filter((row) => row.direction === 'expense').reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const calculatedClosingBalance = opening + totalIncome - totalExpense;
  const expected = expectedClosingBalance === null || expectedClosingBalance === '' ? null : Number(expectedClosingBalance);
  if (expected !== null && !Number.isFinite(expected)) throw new Error('Saldo akhir pembanding tidak valid.');

  return {
    openingBalance: opening,
    totalIncome,
    totalExpense,
    calculatedClosingBalance,
    expectedClosingBalance: expected,
    difference: expected === null ? null : calculatedClosingBalance - expected,
    isReconciled: expected === null ? null : calculatedClosingBalance === expected,
    validTransactionCount: validRows.length,
  };
}

