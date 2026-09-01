update public.integration_feature_flags set enabled=false,updated_at=now() where key in('content_program_writes_enabled','content_program_test_mode_enabled');
select key,enabled from public.integration_feature_flags where key in('content_program_writes_enabled','content_program_test_mode_enabled') order by key;
