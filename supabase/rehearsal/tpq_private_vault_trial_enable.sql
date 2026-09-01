do $$
begin
  if not (select relrowsecurity from pg_class where oid='public.tpq_private_records'::regclass) then
    raise exception 'TPQ_PRIVATE_RLS_NOT_READY';
  end if;
  if has_function_privilege('anon','public.command_tpq_private_record(text,uuid,integer,jsonb)','EXECUTE') then
    raise exception 'TPQ_PRIVATE_RPC_EXPOSED';
  end if;
  if exists(
    select 1 from information_schema.role_table_grants
    where table_schema='public'
      and table_name='tpq_private_records'
      and grantee in('anon','authenticated')
      and privilege_type in('INSERT','UPDATE','DELETE')
  ) then
    raise exception 'TPQ_PRIVATE_BROWSER_MUTATION_EXPOSED';
  end if;
end$$;

update public.integration_feature_flags
set enabled=true,updated_at=now(),updated_by=auth.uid()
where key in('tpq_private_read_enabled','tpq_private_writes_enabled');

select key,enabled
from public.integration_feature_flags
where key in('tpq_private_read_enabled','tpq_private_writes_enabled')
order by key;
