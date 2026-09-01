import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('manual finance UI supports both scopes and is guarded by both switches',async()=>{
  const [component,dkm,tpq]=await Promise.all([readFile('src/components/finance/FinanceManualEntryPanel.jsx','utf8'),readFile('src/pages/Finance.jsx','utf8'),readFile('src/pages/TPQ.jsx','utf8')]);
  assert.match(component,/finance_manual_capabilities/);
  assert.match(component,/cap\.writes_enabled&&cap\.test_mode_enabled/);
  assert.match(component,/FINANCE_CATEGORY_CATALOG/);
  assert.match(dkm,/<FinanceManualEntryPanel scope="dkm"/);
  assert.match(tpq,/<FinanceManualEntryPanel scope="tpq"/);
});

test('manual finance UI implements draft edit and full audited workflow',async()=>{
  const component=await readFile('src/components/finance/FinanceManualEntryPanel.jsx','utf8');
  assert.match(component,/editing\?'update':'create'/);
  for(const action of ['submit_review','approve','publish']) assert.match(component,new RegExp(`'${action}'`));
  for(const action of ['archive','restore']) assert.match(component,new RegExp(`act\\(entry,'${action}'\\)`));
  assert.match(component,/publishNow/);
  assert.match(component,/p_expected_version/);
  assert.match(component,/crypto\.randomUUID/);
  assert.doesNotMatch(component,/\.from\('finance_manual_entries'\)\.insert/);
  assert.match(component,/finance-ledger-updated/);
  assert.match(component,/fin-manual-inline-message/);
});

test('manual TPQ form requires opaque student code only for catalog categories',async()=>{
  const component=await readFile('src/components/finance/FinanceManualEntryPanel.jsx','utf8');
  assert.match(component,/selectedCategory\?\.studentCodeRequired/);
  assert.match(component,/Kode santri opaque/);
  assert.doesNotMatch(component,/nama santri|nama siswa|nama wali/i);
});

test('manual finance UI gives operators clear next-step guidance without exposing TPQ private data',async()=>{
  const [component,css]=await Promise.all([
    readFile('src/components/finance/FinanceManualEntryPanel.jsx','utf8'),
    readFile('src/styles/financeAdmin.css','utf8'),
  ]);
  assert.match(component,/fin-operator-steps/);
  assert.match(component,/Simpan draft/);
  assert.match(component,/Validasi/);
  assert.match(component,/Publikasikan ke ledger/);
  assert.match(component,/Privasi TPQ/);
  assert.match(component,/Jangan tulis nama anak, wali, nilai, atau data pribadi/);
  assert.match(component,/Belum ada transaksi manual/);
  assert.match(css,/\.fin-empty-state/);
  assert.match(css,/\.fin-operator-steps/);
});
