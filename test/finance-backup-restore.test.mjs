import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('finance backup rehearsal SQL is read-only and produces deterministic hashes', async () => {
  const manifest = await readFile('supabase/rehearsal/finance_backup_manifest.sql', 'utf8');
  assert.match(manifest, /digest\(/i);
  assert.match(manifest, /order by x\.id/i);
  assert.match(manifest, /finance_import_batches/);
  assert.match(manifest, /finance_transactions/);
  assert.match(manifest, /finance_manual_entries/);
  assert.match(manifest, /finance_manual_command_receipts/);
  assert.match(manifest, /order by x\.actor_user_id, x\.idempotency_key/);
  assert.match(manifest, /audit_events/);
  assert.match(manifest, /extensions\.digest/i);
  assert.doesNotMatch(manifest, /^\s*(insert|update|delete|truncate|alter|drop|create)\b/im);
});

test('restore gate verifies kill switches, integrity, reconciliation, and browser grants', async () => {
  const gate = await readFile('supabase/rehearsal/finance_restore_gate.sql', 'utf8');
  for (const check of ['finance_import_writes_enabled', 'finance_import_test_mode_enabled', 'finance_manual_writes_enabled', 'finance_manual_test_mode_enabled', 'transaction scope matches batch scope', 'batch totals match transactions', 'published manual entries have one ledger transaction', 'manual ledger batches carry source marker', 'role_table_grants']) {
    assert.match(gate, new RegExp(check));
  }
  assert.doesNotMatch(gate, /^\s*(insert|update|delete|truncate|alter|drop|create)\b/im);
});

test('correction contract prohibits hard delete and requires separation of duties', async () => {
  const contract = await readFile('docs/FINANCE_CORRECTION_CONTRACT.md', 'utf8');
  assert.match(contract, /tidak diubah atau dihapus/i);
  assert.match(contract, /tidak boleh menyetujui koreksinya sendiri/i);
  assert.match(contract, /Idempotency key/i);
  assert.match(contract, /Latihan backup\/restore dinyatakan lulus/i);
});
