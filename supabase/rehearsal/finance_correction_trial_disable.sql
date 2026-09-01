update public.integration_feature_flags
set enabled=false,updated_at=now(),updated_by=auth.uid()
where key in('finance_correction_writes_enabled','finance_correction_test_mode_enabled');
