import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationPath = 'supabase/migrations/202608030007_content_articles_workflow.sql';

test('article workflow defaults writes off and exposes no direct browser mutations', async () => {
  const sql = await readFile(migrationPath, 'utf8');
  assert.match(sql, /content_article_writes_enabled', false/);
  assert.match(sql, /revoke all on table public\.content_articles from anon, authenticated/i);
  assert.doesNotMatch(sql, /grant\s+(insert|update|delete)[^;]*content_articles/i);
  assert.doesNotMatch(sql, /create policy[^;]+for\s+(insert|update|delete|all)/i);
});

test('article commands require auth, permissions, idempotency, versioning, and audit', async () => {
  const sql = await readFile(migrationPath, 'utf8');
  for (const contract of ['AUTHENTICATION_REQUIRED','IDEMPOTENCY_KEY_REQUIRED','ARTICLE_VERSION_CONFLICT','SELF_APPROVAL','audit_events','content_article_command_receipts']) {
    assert.match(sql, new RegExp(contract, 'i'));
  }
  assert.match(sql, /v_article\.created_by = auth\.uid\(\)/);
});

test('article removal is archive and restore with no hard delete command', async () => {
  const sql = await readFile(migrationPath, 'utf8');
  assert.match(sql, /p_action = 'archive'/);
  assert.match(sql, /p_action = 'restore'/);
  assert.doesNotMatch(sql, /p_action\s*=\s*'delete'/i);
  assert.doesNotMatch(sql, /delete\s+from\s+public\.content_articles/i);
});

test('public article policy only exposes published public non-archived content', async () => {
  const sql = await readFile(migrationPath, 'utf8');
  assert.match(sql, /workflow_status = 'Siap publik' and visibility = 'Publik' and archived_at is null/);
});

test('article commands have abuse limits and validated public media', async () => {
  const sql = await readFile(migrationPath, 'utf8');
  assert.match(sql,/ARTICLE_RATE_LIMITED/);
  assert.match(sql,/created_at > now\(\)-interval '15 minutes'/);
  assert.match(sql,/cardinality\(tags\) <= 12/);
  assert.match(sql,/cover_image_url ~ '\^https:\/\/'/);
  assert.match(sql,/ARTICLE_ARCHIVE_FORBIDDEN/);
});
