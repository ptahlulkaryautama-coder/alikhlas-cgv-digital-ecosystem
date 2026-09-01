import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('article trials are test-only and blocked from public reads',async()=>{
  const sql=await readFile('supabase/migrations/202608030008_content_article_test_isolation.sql','utf8');
  assert.match(sql,/content_article_test_mode_enabled',false/);
  assert.match(sql,/environment='production' and workflow_status='Siap publik'/);
  assert.match(sql,/ARTICLE_TEST_MODE_DISABLED/);
  assert.match(sql,/before insert or update/);
});

test('article UI requires both write and test switches',async()=>{
  const [editor,actions,publicHook]=await Promise.all([readFile('src/components/newsAdmin/ArticleEditor.jsx','utf8'),readFile('src/components/newsAdmin/ArticleWorkflowActions.jsx','utf8'),readFile('src/hooks/usePublicArticles.js','utf8')]);
  assert.match(editor,/capability\.writes_enabled && capability\.test_mode_enabled/);
  assert.match(actions,/!capability\.test_mode_enabled/);
  assert.match(publicHook,/\.eq\('environment','production'\)/);
});
