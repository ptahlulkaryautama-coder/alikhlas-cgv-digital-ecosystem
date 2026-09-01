import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('finance batch history is read-only, scope-filtered, and privacy-safe', async () => {
  const history = await readFile('src/components/finance/FinanceBatchHistory.jsx', 'utf8');
  assert.match(history, /from\('finance_import_batches'\)/);
  assert.match(history, /\.eq\('scope', scope\)/);
  assert.match(history, /from\('audit_events'\)/);
  assert.match(history, /hasPermission\(permissions, 'audit:read'\)/);
  assert.doesNotMatch(history, /student_code|internal_note|before_snapshot|after_snapshot/);
  assert.doesNotMatch(history, /\.insert\(|\.update\(|\.delete\(|\.rpc\(/);
});

test('DKM and TPQ pages expose their own batch history', async () => {
  const [finance, tpq] = await Promise.all([
    readFile('src/pages/Finance.jsx', 'utf8'),
    readFile('src/pages/TPQ.jsx', 'utf8'),
  ]);
  assert.match(finance, /<FinanceBatchHistory scope="dkm"/);
  assert.match(tpq, /<FinanceBatchHistory scope="tpq"/);
});
