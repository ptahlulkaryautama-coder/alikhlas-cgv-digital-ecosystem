import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('article editor provides labeled fields, live preview, and a kill-switch-guarded save', async () => {
  const editor = await readFile('src/components/newsAdmin/ArticleEditor.jsx','utf8');
  assert.match(editor,/content_article_capabilities/);
  assert.match(editor,/capability\.writes_enabled && capability\.test_mode_enabled && capability\.can_write/);
  assert.match(editor,/command_content_article/);
  assert.match(editor,/content-article-test-media/);
  assert.match(editor,/attach_content_article_test_media/);
  assert.match(editor,/image\/jpeg,image\/png,image\/webp/);
  assert.match(editor,/5\*1024\*1024/);
  assert.match(editor,/editSlug/);
  assert.match(editor,/article-media-inline-preview/);
  assert.match(editor,/p_action:article\?'update':'create'/);
  assert.match(editor,/PREVIEW WEBSITE/);
  assert.match(editor,/crypto\.randomUUID\(\)/);
  assert.match(editor,/role="dialog"/);
});

test('article admin reads Supabase with a repository fallback', async () => {
  const [hook,page] = await Promise.all([readFile('src/hooks/useArticlesAdmin.js','utf8'),readFile('src/pages/NewsAdmin.jsx','utf8')]);
  assert.match(hook,/from\('content_articles'\)/);
  assert.match(hook,/environment: row\.environment/);
  assert.match(hook,/kabarRepository\.getAll\(\)/);
  assert.match(page,/useArticlesAdmin/);
  assert.match(page,/ArticleEditor/);
});

test('article capability RPC reports the disabled switch and permissions', async () => {
  const sql = await readFile('supabase/migrations/202608030007_content_articles_workflow.sql','utf8');
  assert.match(sql,/content_article_capabilities/);
  assert.match(sql,/'writes_enabled'/);
  assert.match(sql,/'can_write'/);
  assert.match(sql,/'can_approve'/);
});

test('article UI supports direct publish, edit, archive, and restore through one RPC', async () => {
  const [editor,actions,page] = await Promise.all([
    readFile('src/components/newsAdmin/ArticleEditor.jsx','utf8'),
    readFile('src/components/newsAdmin/ArticleWorkflowActions.jsx','utf8'),
    readFile('src/pages/NewsAdmin.jsx','utf8'),
  ]);
  assert.match(editor,/article\?'update':'create'/);
  for (const action of ['approve','archive','restore']) assert.match(actions,new RegExp(`act\\('${action}'\\)`));
  assert.match(actions,/Publikasikan/);
  assert.match(page,/ArticleWorkflowActions/);
});

test('post-migration article verification is read-only and checks the kill switch', async () => {
  const sql = await readFile('supabase/rehearsal/content_article_verification.sql','utf8');
  assert.match(sql,/content_article_writes_enabled/);
  assert.match(sql,/relrowsecurity/);
  assert.match(sql,/role_table_grants/);
  assert.doesNotMatch(sql,/^\s*(insert|update|delete|truncate|alter|drop|create)\b/im);
});

test('public website reads only explicitly published public non-archived Supabase articles', async () => {
  const [hook,list,detail] = await Promise.all([
    readFile('src/hooks/usePublicArticles.js','utf8'),readFile('src/pages/PublicNews.jsx','utf8'),readFile('src/pages/PublicNewsDetail.jsx','utf8'),
  ]);
  assert.match(hook,/\.eq\('workflow_status','Siap publik'\)/);
  assert.match(hook,/\.eq\('visibility','Publik'\)/);
  assert.match(hook,/\.is\('archived_at',null\)/);
  assert.match(hook,/kabarRepository\.getPublic\(\)/);
  assert.match(list,/usePublicArticles/);
  assert.match(detail,/usePublicArticles/);
});
