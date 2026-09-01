do $$begin
 if has_function_privilege('anon','public.release_content_to_production(text,uuid,integer,uuid)','EXECUTE') then raise exception 'RELEASE_RPC_EXPOSED';end if;
end$$;
update public.integration_feature_flags set enabled=true,updated_at=now() where key='content_production_release_enabled';
select key,enabled from public.integration_feature_flags where key='content_production_release_enabled';
