-- READ-ONLY: run before backup and again after restore.
-- Save the result as CSV. A successful rehearsal has identical row_count and content_hash.

with manifest as (
  select
    'finance_import_batches'::text as table_name,
    count(*)::bigint as row_count,
    encode(extensions.digest(coalesce(string_agg(to_jsonb(x)::text, '' order by x.id), ''), 'sha256'), 'hex') as content_hash
  from public.finance_import_batches x

  union all

  select
    'finance_transactions',
    count(*)::bigint,
    encode(extensions.digest(coalesce(string_agg(to_jsonb(x)::text, '' order by x.id), ''), 'sha256'), 'hex')
  from public.finance_transactions x

  union all

  select
    'finance_audit_events',
    count(*)::bigint,
    encode(extensions.digest(coalesce(string_agg(to_jsonb(x)::text, '' order by x.id), ''), 'sha256'), 'hex')
  from public.audit_events x
  where x.entity_type in ('finance_import_batch', 'finance_manual_entry')

  union all

  select
    'finance_manual_entries',
    count(*)::bigint,
    encode(extensions.digest(coalesce(string_agg(to_jsonb(x)::text, '' order by x.id), ''), 'sha256'), 'hex')
  from public.finance_manual_entries x

  union all

  select
    'finance_manual_command_receipts',
    count(*)::bigint,
    encode(extensions.digest(coalesce(string_agg(to_jsonb(x)::text, '' order by x.actor_user_id, x.idempotency_key), ''), 'sha256'), 'hex')
  from public.finance_manual_command_receipts x

  union all

  select
    'finance_feature_flags',
    count(*)::bigint,
    encode(extensions.digest(coalesce(string_agg(to_jsonb(x)::text, '' order by x.key), ''), 'sha256'), 'hex')
  from public.integration_feature_flags x
  where x.key like 'finance_%'
)
select table_name, row_count, content_hash
from manifest
order by table_name;
