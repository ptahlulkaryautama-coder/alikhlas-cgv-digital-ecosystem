import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('article trial evidence is read-only and checks isolation, reviewers, and audit',async()=>{
  const sql=await readFile('supabase/rehearsal/content_article_trial_evidence.sql','utf8');
  assert.match(sql,/environment='test'/);
  assert.match(sql,/separation_of_duties/);
  assert.match(sql,/excluded_from_public_projection/);
  assert.match(sql,/audit_event_count/);
  assert.doesNotMatch(sql,/^\s*(insert|update|delete|alter|drop|create|truncate)\b/im);
});
