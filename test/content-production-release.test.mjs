import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=(path)=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('production release is disabled, authenticated, idempotent, audited, and preserves test rows',async()=>{
  const sql=await read('supabase/migrations/202608100019_content_production_release_center.sql');
  assert.match(sql,/content_production_release_enabled',false/);
  assert.match(sql,/revoke all on function public\.release_content_to_production\(text,uuid,integer,uuid\) from public,anon/i);
  assert.match(sql,/content_production_release_receipts/);
  assert.match(sql,/content\.production\.release/);
  assert.match(sql,/released_from_test_id/);
  assert.doesNotMatch(sql,/delete\s+from\s+public\.content_/i);
});

test('release center confirms public impact and handles private media promotion',async()=>{
  const ui=await read('src/components/settings/ContentProductionReleasePanel.jsx');
  assert.match(ui,/window\.confirm/);
  assert.match(ui,/bucket publik terlebih dahulu/i);
  assert.match(ui,/content-article-public-media/);
  assert.match(ui,/Rilis ke website/);
  assert.match(ui,/content:release/);
  assert.doesNotMatch(ui,/item\.visibility!==['"]Publik['"]/);
});
