import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { DATA_SOURCE_SUPABASE, resolveDataSourceMode } from '../src/services/dataSource.js';

const MIGRATION = 'supabase/migrations/202608020001_shared_content_read_foundation.sql';

test('shared content migration creates only public-safe content tables with RLS', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  for (const table of [
    'content_programs', 'content_agenda', 'tpq_public_schedule',
    'tpq_public_agenda', 'tpq_public_learning_focus',
  ]) {
    assert.match(sql, new RegExp(`create table public\\.${table}`, 'i'));
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
    assert.match(sql, new RegExp(`grant select on table public\\.${table} to anon, authenticated`, 'i'));
  }
});

test('TPQ shared schema excludes personal, academic, attendance, and payment fields', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.doesNotMatch(sql, /student_name|santri_name|guardian|parent_phone|teacher_name|grade|attendance|payment|spp|honorarium/i);
});

test('shared content browser roles receive no mutation grants or policies', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.doesNotMatch(sql, /grant\s+(?:insert|update|delete|all)\s+on table public\.(?:content_|tpq_public_)/i);
  assert.doesNotMatch(sql, /on public\.(?:content_|tpq_public_)\w+ for (?:insert|update|delete|all)/i);
});

test('supabase is an explicit supported data source mode', () => {
  assert.equal(resolveDataSourceMode({ configuredMode: 'supabase' }), DATA_SOURCE_SUPABASE);
});

test('TPQ page consumes asynchronous privacy-safe Supabase projections', async () => {
  const files = ['src/pages/TPQ.jsx', 'src/hooks/useTpqIntegration.js', 'src/services/supabaseContent.js'];
  const content = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  assert.match(content, /useTpqIntegration/);
  assert.match(content, /tpq_public_schedule/);
  assert.match(content, /tpq_public_agenda/);
  assert.match(content, /tpq_public_learning_focus/);
});
