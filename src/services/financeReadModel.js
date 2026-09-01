const number = (value) => Number(value ?? 0);

export function buildFinanceReadModel(batch, transactionRows = []) {
  if (!batch?.id) throw new Error('Batch keuangan tidak tersedia.');
  const openingBalance = number(batch.opening_balance);
  const transactions = [...transactionRows]
    .sort((a, b) => String(a.transaction_date).localeCompare(String(b.transaction_date)) || String(a.id).localeCompare(String(b.id)))
    .map((row) => ({
      id: row.id,
      date: row.transaction_date,
      direction: row.direction,
      category: row.category,
      subcategory: row.subcategory,
      fundPurpose: row.fund_purpose,
      description: row.public_description || 'Tanpa keterangan publik',
      paymentMethod: row.payment_method || null,
      amount: number(row.amount),
      recordStatus: row.record_status,
    }));

  let runningBalance = openingBalance;
  const categoryTotals = { income: new Map(), expense: new Map() };
  const rows = transactions.map((row) => {
    runningBalance += row.direction === 'income' ? row.amount : -row.amount;
    const bucket = categoryTotals[row.direction];
    bucket.set(row.category, (bucket.get(row.category) || 0) + row.amount);
    return { ...row, runningBalance };
  });
  const totalIncome = rows.filter((row) => row.direction === 'income').reduce((sum, row) => sum + row.amount, 0);
  const totalExpense = rows.filter((row) => row.direction === 'expense').reduce((sum, row) => sum + row.amount, 0);
  const toBreakdown = (direction) => [...categoryTotals[direction]].map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount || a.category.localeCompare(b.category));

  return {
    batchId: batch.id,
    scope: batch.scope,
    period: batch.period,
    environment: batch.environment || 'test',
    workflowStatus: batch.workflow_status || 'draft',
    openingBalance,
    totalIncome,
    totalExpense,
    endingBalance: runningBalance,
    transactionCount: rows.length,
    transactions: rows,
    dailyBalances: rows.map((row) => ({ date: row.date, balance: row.runningBalance })),
    incomeBreakdown: toBreakdown('income'),
    expenseBreakdown: toBreakdown('expense'),
  };
}
