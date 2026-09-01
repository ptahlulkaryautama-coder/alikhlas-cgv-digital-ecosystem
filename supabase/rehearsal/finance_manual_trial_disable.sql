-- Emergency/closing switch for manual-finance trial. Safe to run repeatedly.
update public.integration_feature_flags
set enabled=false,updated_at=now()
where key in('finance_manual_writes_enabled','finance_manual_test_mode_enabled');

select key,enabled
from public.integration_feature_flags
where key in('finance_manual_writes_enabled','finance_manual_test_mode_enabled')
order by key;
