export function assessFinancePilotBatches(batches = [], events = []) {
  const reviewedStatuses = new Set(['approved', 'rejected', 'published']);
  const decisionActions = new Set(['finance.workflow.approve', 'finance.workflow.reject', 'finance.workflow.publish']);
  const reconciled = batches.filter((batch) => Number(batch.calculated_closing_balance) === Number(batch.expected_closing_balance)).length;
  const approved = batches.filter((batch) => batch.workflow_status === 'approved').length;
  const pending = batches.filter((batch) => ['draft', 'under_review'].includes(batch.workflow_status)).length;
  const rejected = batches.filter((batch) => batch.workflow_status === 'rejected').length;
  const published = batches.filter((batch) => batch.workflow_status === 'published').length;
  const reviewedIds = new Set(batches.filter((batch) => reviewedStatuses.has(batch.workflow_status)).map((batch) => batch.id));
  const auditedIds = new Set(events.filter((event) => decisionActions.has(event.action)).map((event) => event.entity_id));
  const missingAudit = [...reviewedIds].filter((id) => !auditedIds.has(id)).length;
  return {
    total: batches.length, reconciled, approved, pending, rejected, published, missingAudit,
    hasReconciliationProblem: reconciled !== batches.length,
    hasPilotPublication: published > 0,
  };
}

