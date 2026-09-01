import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608120027_tpq_private_vault_foundation.sql';
const VERIFY = 'supabase/rehearsal/tpq_private_vault_foundation_verification.sql';
const ENABLE = 'supabase/rehearsal/tpq_private_vault_trial_enable.sql';
const DISABLE = 'supabase/rehearsal/tpq_private_vault_trial_disable.sql';
const CONTRACT = 'docs/TPQ_PRIVATE_DATA_VAULT_CONTRACT.md';

test('TPQ private vault is locked by default and separate from public projection', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /tpq_private_read_enabled',false/);
  assert.match(sql, /tpq_private_writes_enabled',false/);
  assert.match(sql, /create table if not exists public\.tpq_private_records/i);
  assert.match(sql, /alter table public\.tpq_private_records enable row level security/i);
  assert.match(sql, /revoke all on table public\.tpq_private_records from anon,authenticated/i);
  assert.doesNotMatch(sql, /grant\s+(insert|update|delete)[^;]*tpq_private_records/i);
  assert.doesNotMatch(sql, /grant select on table public\.tpq_private_records to anon/i);
});

test('TPQ private vault stores sealed opaque records and avoids raw personal schema fields', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /opaque_code/);
  assert.match(sql, /sealed_payload/);
  assert.match(sql, /ciphertext/);
  assert.match(sql, /key_version/);
  assert.doesNotMatch(sql, /student_name|santri_name|guardian_name|parent_phone|home_address|birth_date|report_card|honorarium/i);
});

test('TPQ private vault commands are RPC-only, audited, and anonymous-blocked', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /create or replace function public\.tpq_private_capabilities/);
  assert.match(sql, /create or replace function public\.command_tpq_private_record/);
  assert.match(sql, /insert into public\.audit_events/);
  assert.match(sql, /revoke all on function public\.command_tpq_private_record\(text,uuid,integer,jsonb\) from public,anon/i);
  assert.match(sql, /grant execute on function public\.command_tpq_private_record\(text,uuid,integer,jsonb\) to authenticated/i);
});

test('TPQ private vault verification and trial switches are safe and repeatable', async () => {
  const [verify, enable, disable] = await Promise.all([
    readFile(VERIFY, 'utf8'),
    readFile(ENABLE, 'utf8'),
    readFile(DISABLE, 'utf8'),
  ]);
  for (const label of [
    'tpq private read disabled',
    'tpq private writes disabled',
    'tpq private RLS enabled',
    'no tpq private browser mutations',
    'tpq private command anonymous blocked',
    'sealed payload required',
  ]) assert.match(verify, new RegExp(label, 'i'));
  assert.match(enable, /TPQ_PRIVATE_RLS_NOT_READY/);
  assert.match(enable, /TPQ_PRIVATE_RPC_EXPOSED/);
  assert.match(enable, /set enabled=true/);
  assert.match(disable, /set enabled=false/);
});

test('TPQ private vault contract keeps public website out of scope', async () => {
  const contract = await readFile(CONTRACT, 'utf8');
  assert.match(contract, /Website publik tetap hanya membaca projection aman\/agregat/);
  assert.match(contract, /Payload sensitif harus disegel\/encrypted/);
  assert.match(contract, /belum dipasang ke UI operator/i);
  assert.match(contract, /belum boleh diisi sebelum aturan penyimpanan data anak disepakati/i);
});
