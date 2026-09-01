import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const MIGRATION = 'supabase/migrations/202608020002_finance_import_foundation.sql';
const CLASSIFICATION_MIGRATION = 'supabase/migrations/202608020003_finance_classification_reconciliation.sql';

test('finance import migration keeps writes disabled and requires scoped permissions', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  assert.match(sql, /finance_import_writes_enabled', false/);
  assert.match(sql, /public\.has_permission\('finance:write'\)/);
  assert.match(sql, /public\.has_permission\('tpq:write'\)/);
  assert.match(sql, /security definer/i);
  assert.match(sql, /jsonb_array_length\(p_rows\)/);
  assert.match(sql, /ROW_LIMIT_EXCEEDED/);
  assert.match(sql, /DUPLICATE_IMPORT_OR_REFERENCE/);
});

test('finance tables are private, RLS protected, and only RPC writes', async () => {
  const sql = await readFile(MIGRATION, 'utf8');
  for (const table of ['finance_import_batches', 'finance_transactions']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
    assert.match(sql, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`));
  }
  assert.doesNotMatch(sql, /grant insert on table public\.finance_/i);
  assert.doesNotMatch(sql, /grant (?:select, )?insert.*public\.finance_/i);
});

test('frontend importer has preview and explicit confirmation safeguards', async () => {
  const [panel, parser] = await Promise.all([
    readFile('src/components/finance/FinanceImportPanel.jsx', 'utf8'),
    readFile('src/services/financeImportParser.js', 'utf8'),
  ]);
  assert.match(panel, /Konfirmasi import/);
  assert.match(panel, /writes_enabled/);
  assert.match(panel, /preview\.errors\.length === 0/);
  assert.match(parser, /Ukuran file maksimal 5 MB/);
  assert.match(parser, /studentCodeRequired/);
  assert.match(parser, /Referensi duplikat dalam file/);
  assert.match(panel, /Pastikan selisih Rp 0/);
  assert.match(panel, /template standar/);
  assert.match(panel, /fin-operator-steps/);
});

test('classification migration standardizes category, subcategory, and fund purpose', async () => {
  const sql = await readFile(CLASSIFICATION_MIGRATION, 'utf8');
  assert.match(sql, /create table public\.finance_category_catalog/);
  assert.match(sql, /add column subcategory text not null/);
  assert.match(sql, /add column fund_purpose text not null/);
  assert.match(sql, /c\.student_code_required/);
  assert.match(sql, /FINANCE_IMPORT_WRITES_DISABLED/);
  assert.doesNotMatch(sql, /update public\.integration_feature_flags\s+set enabled\s*=\s*true/i);
});

test('frontend commit requires a zero-difference reconciliation', async () => {
  const panel = await readFile('src/components/finance/FinanceImportPanel.jsx', 'utf8');
  assert.match(panel, /expectedClosingBalance !== ''/);
  assert.match(panel, /reconciliation\?\.isReconciled/);
  assert.match(panel, /Saldo belum cocok/);
});

test('frontend explains when a workbook is uploaded to the wrong finance scope', async () => {
  const parser = await readFile('src/services/financeImportParser.js', 'utf8');
  assert.match(parser, /Kategori TPQ terdeteksi; unggah file melalui menu TPQ & Pendidikan/);
  assert.match(parser, /Kategori DKM terdeteksi; unggah file melalui menu Keuangan DKM/);
});

test('frontend locks the confirmation button during and after a successful import', async () => {
  const panel = await readFile('src/components/finance/FinanceImportPanel.jsx', 'utf8');
  assert.match(panel, /!isCommitting && !committedBatchId/);
  assert.match(panel, /Tombol dikunci untuk mencegah import ganda/);
  assert.match(panel, /Import tersimpan/);
});

test('finance action buttons use an active pointer and reserve blocked cursor for disabled state', async () => {
  const css = await readFile('src/styles/financeAdmin.css', 'utf8');
  assert.match(css, /\.fin-btn\s*\{[\s\S]*?cursor:\s*pointer;[\s\S]*?opacity:\s*1;/);
  assert.match(css, /\.fin-btn:disabled\s*\{[^}]*cursor:\s*not-allowed;/);
});
