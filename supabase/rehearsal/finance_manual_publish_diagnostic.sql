-- Read-only diagnostic for the latest TPQ manual entry and its ledger projection.
with latest as (
  select id,scope,period,transaction_date,direction,category,amount,external_reference,
    workflow_status,version,created_by,reviewed_by,published_by,ledger_batch_id,updated_at
  from public.finance_manual_entries where scope='tpq'
  order by updated_at desc limit 1
)
select
  l.id,l.period,l.transaction_date,l.direction,l.category,l.amount,l.external_reference,
  l.workflow_status,l.version,l.ledger_batch_id,
  (l.created_by is distinct from l.reviewed_by) as separation_of_duties,
  (b.id is not null) as ledger_batch_exists,
  b.source_kind,b.workflow_status as batch_status,b.environment,
  (select count(*) from public.finance_transactions t where t.batch_id=l.ledger_batch_id) as ledger_transaction_count,
  (select count(*) from public.audit_events a where a.entity_type='finance_manual_entry' and a.entity_id=l.id) as manual_audit_count,
  (select enabled from public.integration_feature_flags where key='finance_manual_writes_enabled') as writes_enabled,
  (select enabled from public.integration_feature_flags where key='finance_manual_test_mode_enabled') as test_mode_enabled
from latest l left join public.finance_import_batches b on b.id=l.ledger_batch_id;
