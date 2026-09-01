import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('article storage policies resolve private feature flags through protected predicates', async () => {
  const sql = await read('supabase/migrations/202608120024_fix_article_storage_flag_predicates.sql');
  assert.match(sql, /content_article_media_upload_allowed/);
  assert.match(sql, /content_article_public_media_release_allowed/);
  assert.match(sql, /security definer/);
  assert.match(sql, /content_article_test_media_insert/);
  assert.match(sql, /content_article_public_media_insert/);
  const policyBodies = sql.match(/create policy[\s\S]*?;\r?\n/g).join('\n');
  assert.doesNotMatch(policyBodies, /integration_feature_flags/);
  assert.match(policyBodies, /content_article_media_upload_allowed\(\)/);
  assert.match(policyBodies, /content_article_public_media_release_allowed\(\)/);
});

test('article storage predicate verification checks direct flag reads are removed', async () => {
  const sql = await read('supabase/rehearsal/content_article_storage_flag_predicates_verification.sql');
  assert.match(sql, /storage policies no direct feature flag reads/);
  assert.match(sql, /content_article_test_media_insert/);
  assert.match(sql, /content_article_public_media_insert/);
  assert.match(sql, /integration_feature_flags/);
});
