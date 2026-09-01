import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('finance correction UI is mounted in both DKM and TPQ finance flows', async () => {
  const [finance, tpq] = await Promise.all([
    readFile('src/pages/Finance.jsx', 'utf8'),
    readFile('src/pages/TPQ.jsx', 'utf8'),
  ]);
  assert.match(finance, /FinanceCorrectionPanel/);
  assert.match(finance, /<FinanceCorrectionPanel scope="dkm"/);
  assert.match(tpq, /FinanceCorrectionPanel/);
  assert.match(tpq, /<FinanceCorrectionPanel scope="tpq"/);
});

test('finance correction UI is RPC-only, reversible, and operator-friendly', async () => {
  const component = await readFile('src/components/finance/FinanceCorrectionPanel.jsx', 'utf8');
  assert.match(component, /finance_correction_capabilities/);
  assert.match(component, /command_finance_correction/);
  assert.match(component, /Fitur koreksi ledger belum tersedia/);
  assert.match(component, /Koreksi pembalik/);
  assert.match(component, /Publikasikan reversal/);
  assert.match(component, /finance-ledger-updated/);
  assert.match(component, /Kode santri opaque/);
  assert.doesNotMatch(component, /\.from\('finance_correction_entries'\)\.(insert|update|delete)/);
  assert.doesNotMatch(component, /\.from\('finance_transactions'\)\.(insert|update|delete)/);
});

test('finance correction styling uses shared operator primitives', async () => {
  const css = await readFile('src/styles/financeAdmin.css', 'utf8');
  assert.match(css, /\.fin-correction-panel/);
  assert.match(css, /\.fin-correction-source/);
  assert.match(css, /\.fin-correction-replacement/);
});
