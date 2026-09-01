import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('article trial enablement verifies isolation before enabling both switches', async () => {
  const sql = await readFile('supabase/rehearsal/content_article_trial_enable.sql','utf8');
  assert.match(sql,/PUBLIC_ARTICLE_TEST_ISOLATION_NOT_READY/);
  assert.match(sql,/ARTICLE_TEST_MODE_TRIGGER_NOT_READY/);
  assert.match(sql,/content_article_writes_enabled/);
  assert.match(sql,/content_article_test_mode_enabled/);
  assert.match(sql,/set enabled = true/);
});

test('article trial has a repeatable emergency disable script', async () => {
  const sql = await readFile('supabase/rehearsal/content_article_trial_disable.sql','utf8');
  assert.match(sql,/set enabled = false/);
  assert.match(sql,/content_article_writes_enabled/);
  assert.match(sql,/content_article_test_mode_enabled/);
});
