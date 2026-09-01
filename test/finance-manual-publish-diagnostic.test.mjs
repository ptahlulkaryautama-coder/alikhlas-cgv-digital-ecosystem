import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('manual publish diagnostic is read-only and checks ledger projection',async()=>{const sql=await readFile('supabase/rehearsal/finance_manual_publish_diagnostic.sql','utf8');assert.match(sql,/ledger_batch_exists/);assert.match(sql,/ledger_transaction_count/);assert.match(sql,/manual_audit_count/);assert.doesNotMatch(sql,/^\s*(insert|update|delete|alter|drop|create|truncate)\b/im);});
