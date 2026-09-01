-- pgcrypto is installed in Supabase's extensions schema.
begin;
alter function public.command_finance_manual_entry(text,uuid,uuid,integer,jsonb,text)
  set search_path=public,extensions;
commit;
