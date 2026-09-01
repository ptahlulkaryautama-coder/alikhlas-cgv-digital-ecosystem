import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

test('article test media is private, constrained, permissioned, and disabled by default',async()=>{
  const sql=await readFile('supabase/migrations/202608040013_content_article_private_test_media.sql','utf8');
  assert.match(sql,/content_article_media_test_enabled',false/);
  assert.match(sql,/content-article-test-media','content-article-test-media',false,5242880/);
  for(const type of ['image/jpeg','image/png','image/webp']) assert.match(sql,new RegExp(type));
  assert.match(sql,/storage\.foldername\(name\).*auth\.uid/i);
  assert.match(sql,/ARTICLE_MEDIA_PATH_INVALID/);
  assert.match(sql,/ARTICLE_MEDIA_NOT_EDITABLE/);
  assert.doesNotMatch(sql,/grant\s+(insert|update|delete)\s+on\s+storage\.objects/i);
});

test('media attach is RPC-only, versioned, audited, and isolated to test articles',async()=>{
  const sql=await readFile('supabase/migrations/202608040013_content_article_private_test_media.sql','utf8');
  assert.match(sql,/attach_content_article_test_media/);
  assert.match(sql,/ARTICLE_VERSION_CONFLICT/);
  assert.match(sql,/content_article_command_receipts/);
  assert.match(sql,/a\.environment<>'test'/);
  assert.match(sql,/content\.article\.media\.attach/);
  assert.match(sql,/revoke all on function public\.attach_content_article_test_media.*public,anon/i);
});

test('media trial has guarded activation and repeatable shutdown',async()=>{
  const [on,off]=await Promise.all([readFile('supabase/rehearsal/content_article_media_trial_enable.sql','utf8'),readFile('supabase/rehearsal/content_article_media_trial_disable.sql','utf8')]);
  assert.match(on,/ARTICLE_MEDIA_BUCKET_MUST_BE_PRIVATE/);
  assert.match(on,/content_article_media_test_enabled/);
  assert.match(off,/enabled=false/);
});

test('post-migration media verification is read-only and checks private storage boundary',async()=>{
  const sql=await readFile('supabase/rehearsal/content_article_media_verification.sql','utf8');
  for(const check of ['media bucket private','media bucket size limited to 5 MB','media MIME types constrained','no media update policy','media attach anonymous blocked']) assert.match(sql,new RegExp(check));
  assert.doesNotMatch(sql,/^\s*(insert|update|delete|alter|drop|create|truncate)\b/im);
});

test('storage policy reads private switches only through a protected predicate',async()=>{
  const sql=await readFile('supabase/migrations/202608050014_fix_content_media_storage_policy.sql','utf8');
  assert.match(sql,/content_article_media_upload_allowed/);
  assert.match(sql,/security definer/);
  assert.match(sql,/revoke all on function public\.content_article_media_upload_allowed\(\) from public,anon/);
  assert.doesNotMatch(sql,/with check\([\s\S]*?select enabled from public\.integration_feature_flags/i);
});

test('media trial evidence checks private object, reviewer separation, public isolation, and audit without writes',async()=>{
  const sql=await readFile('supabase/rehearsal/content_article_media_trial_evidence.sql','utf8');
  for(const token of ['storage_object_exists','bucket_is_private','separation_of_duties','excluded_from_public_projection','media_attach_audit_count']) assert.match(sql,new RegExp(token));
  assert.doesNotMatch(sql,/^\s*(insert|update|delete|alter|drop|create|truncate)\b/im);
});
