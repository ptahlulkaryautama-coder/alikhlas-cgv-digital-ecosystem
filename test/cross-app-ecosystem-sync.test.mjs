import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608250028_cross_app_ecosystem_sync.sql';

test('cross-app ecosystem sync migration file exists and contains valid SQL views', async () => {
  assert.equal((await stat(MIGRATION)).isFile(), true);
  const sql = await readFile(MIGRATION, 'utf8');

  assert.match(sql, /create or replace view public\.v_jemaah_portal_summary/i);
  assert.match(sql, /create or replace view public\.v_transparency_summary/i);
  assert.match(sql, /create or replace function public\.get_ecosystem_health\(\)/i);
  assert.match(sql, /grant select on public\.v_jemaah_portal_summary to anon, authenticated/i);
  assert.match(sql, /grant select on public\.v_transparency_summary to anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.get_ecosystem_health\(\) to anon, authenticated/i);
});

test('cross-app sync views do not expose sensitive personal fields or finance arrays', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.doesNotMatch(sql, /tpq_students|tpq_guardians|student_name|guardian_phone|credit_card|bank_account_number/i);
});
