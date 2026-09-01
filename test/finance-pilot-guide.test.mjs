import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('pilot guide enforces reconciliation, separation of duties, and closed publication', async () => {
  const guide = await readFile('src/components/finance/FinancePilotGuide.jsx', 'utf8');
  assert.match(guide, /Selisih = Rp 0/);
  assert.match(guide, /akun pemeriksa yang berbeda/);
  assert.match(guide, /Jangan publikasikan batch pilot/);
  assert.match(guide, /mematikan kembali kedua finance switch/);
  assert.match(guide, /aria-expanded/);
  assert.doesNotMatch(guide, /supabase|\.rpc\(|\.insert\(|\.update\(|\.delete\(/i);
});

test('pilot guide is available in both finance scopes', async () => {
  const [finance, tpq] = await Promise.all([readFile('src/pages/Finance.jsx', 'utf8'), readFile('src/pages/TPQ.jsx', 'utf8')]);
  assert.match(finance, /<FinancePilotGuide scope="dkm"/);
  assert.match(tpq, /<FinancePilotGuide scope="tpq"/);
});
