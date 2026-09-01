update public.integration_feature_flags
set enabled=false,updated_at=now(),updated_by=auth.uid()
where key in('tpq_private_read_enabled','tpq_private_writes_enabled');

select key,enabled
from public.integration_feature_flags
where key in('tpq_private_read_enabled','tpq_private_writes_enabled')
order by key;
