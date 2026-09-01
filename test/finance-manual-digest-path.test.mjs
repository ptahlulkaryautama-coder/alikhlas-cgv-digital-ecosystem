import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('manual finance publish resolves pgcrypto only through extensions schema',async()=>{const [base,fix]=await Promise.all([readFile('supabase/migrations/202608030011_finance_manual_entry_foundation.sql','utf8'),readFile('supabase/migrations/202608040012_fix_manual_finance_digest_path.sql','utf8')]);assert.match(base,/extensions\.digest/);assert.match(fix,/set search_path=public,extensions/);assert.doesNotMatch(fix,/insert|update|delete/i);});
