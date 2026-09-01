-- The Super Admin release confirmation is the explicit consent to create a public clone.
-- Source trial rows remain unchanged and may retain Pengurus visibility.
begin;

do $$
declare ddl text; changed text;
begin
  select pg_get_functiondef('public.release_content_to_production(text,uuid,integer,uuid)'::regprocedure) into ddl;
  changed:=replace(ddl,' and visibility = ''Publik''','');
  changed:=replace(changed,' and visibility=''Publik''','');
  if changed=ddl then raise exception 'PRODUCTION_RELEASE_VISIBILITY_PATCH_FAILED';end if;
  execute changed;
end$$;

revoke all on function public.release_content_to_production(text,uuid,integer,uuid) from public,anon;
grant execute on function public.release_content_to_production(text,uuid,integer,uuid) to authenticated;

commit;
