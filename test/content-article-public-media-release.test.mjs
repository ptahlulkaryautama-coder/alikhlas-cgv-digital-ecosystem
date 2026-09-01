import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('article public media release keeps production bucket constrained and audited', async () => {
  const sql = await read('supabase/migrations/202608120023_content_article_public_media_release.sql');
  assert.match(sql, /content-article-public-media/);
  assert.match(sql, /public=true/);
  assert.match(sql, /file_size_limit=5242880/);
  assert.match(sql, /image\/jpeg/);
  assert.match(sql, /image\/png/);
  assert.match(sql, /image\/webp/);
  assert.match(sql, /public\.has_permission\('content:release'\)/);
  assert.match(sql, /content_production_release_enabled/);
  assert.match(sql, /ARTICLE_PUBLIC_MEDIA_REQUIRED/);
  assert.match(sql, /supabase-storage:\/\/content-article-public-media\//);
  assert.doesNotMatch(sql, /service_role/i);
});

test('release center promotes private article media before production release', async () => {
  const ui = await read('src/components/settings/ContentProductionReleasePanel.jsx');
  assert.match(ui, /content-article-test-media/);
  assert.match(ui, /content-article-public-media/);
  assert.match(ui, /createSignedUrl/);
  assert.match(ui, /fetch\(signed\.data\.signedUrl\)/);
  assert.match(ui, /sistem akan menyalin foto ke bucket publik terlebih dahulu/);
  assert.doesNotMatch(ui, /item\.media_blocked\|\|item\.already_released/);
});

test('public articles resolve promoted Supabase storage URLs', async () => {
  const hook = await read('src/hooks/usePublicArticles.js');
  assert.match(hook, /supabase-storage:\/\/content-article-public-media\//);
  assert.match(hook, /getSupabasePublicStorageUrl/);
  assert.match(hook, /coverImage:image/);
});
