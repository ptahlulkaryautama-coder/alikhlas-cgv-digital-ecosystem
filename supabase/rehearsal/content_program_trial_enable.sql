do $$ begin
  if not (select relrowsecurity from pg_class where oid='public.content_programs'::regclass) then raise exception 'PROGRAM_RLS_NOT_READY'; end if;
  if has_function_privilege('anon','public.command_content_program(text,uuid,uuid,integer,jsonb,text)','EXECUTE') then raise exception 'PROGRAM_RPC_EXPOSED'; end if;
end $$;
update public.integration_feature_flags set enabled=true,updated_at=now() where key in('content_program_writes_enabled','content_program_test_mode_enabled');
select key,enabled from public.integration_feature_flags where key in('content_program_writes_enabled','content_program_test_mode_enabled') order by key;
