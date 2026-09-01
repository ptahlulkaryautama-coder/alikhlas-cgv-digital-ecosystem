update public.integration_feature_flags set enabled=false,updated_at=now() where key='content_production_release_enabled';
select key,enabled from public.integration_feature_flags where key='content_production_release_enabled';
