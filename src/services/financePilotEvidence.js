const COLUMNS = [
  'scope', 'batch_id', 'period', 'file_name', 'workflow_status', 'created_at',
  'row_count', 'opening_balance', 'total_income', 'total_expense',
  'expected_closing_balance', 'calculated_closing_balance', 'reconciliation_difference',
  'rejection_reason', 'audit_timeline',
];

function safeCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function createFinancePilotEvidenceCsv({ scope, batches, events = [] }) {
  const eventsByBatch = events.reduce((result, event) => {
    (result[event.entity_id] ??= []).push(event);
    return result;
  }, {});
  const rows = batches.map((batch) => {
    const difference = Number(batch.calculated_closing_balance ?? 0) - Number(batch.expected_closing_balance ?? 0);
    const timeline = (eventsByBatch[batch.id] ?? [])
      .map((event) => `${event.occurred_at} ${event.action}`)
      .join(' | ');
    return [
      scope, batch.id, batch.period, batch.file_name, batch.workflow_status, batch.created_at,
      batch.row_count, batch.opening_balance, batch.total_income, batch.total_expense,
      batch.expected_closing_balance, batch.calculated_closing_balance, difference,
      batch.rejection_reason, timeline,
    ];
  });
  return `\uFEFF${[COLUMNS, ...rows].map((row) => row.map(safeCell).join(',')).join('\r\n')}\r\n`;
}

export function downloadFinancePilotEvidence({ scope, batches, events = [] }) {
  const csv = createFinancePilotEvidenceCsv({ scope, batches, events });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bukti-pilot-keuangan-${scope}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

