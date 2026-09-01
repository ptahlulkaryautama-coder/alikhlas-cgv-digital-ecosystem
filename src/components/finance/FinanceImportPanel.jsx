import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { hasPermission } from '../../services/accessPolicy.js';
import { reconcileFinance } from '../../services/financeReconciliation.js';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export default function FinanceImportPanel({ scope }) {
  const { permissions } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [period, setPeriod] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [expectedClosingBalance, setExpectedClosingBalance] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [committedBatchId, setCommittedBatchId] = useState('');
  const [message, setMessage] = useState('');
  const [capability, setCapability] = useState({ writes_enabled: false, test_mode_enabled: false, can_commit: false });
  const requiredPermission = scope === 'tpq' ? 'tpq_finance:write' : 'finance:write';
  const mayPrepare = hasPermission(permissions, requiredPermission);

  useEffect(() => {
    if (!mayPrepare) return;
    getSupabaseBrowserClient().rpc('finance_import_capabilities', { p_scope: scope })
      .then(({ data }) => setCapability(data ?? { writes_enabled: false, test_mode_enabled: false, can_commit: false }));
  }, [mayPrepare, scope]);

  const summary = useMemo(() => preview ? {
    valid: preview.validRows.length,
    invalid: preview.rows.length - preview.validRows.length,
  } : null, [preview]);
  const reconciliation = useMemo(() => {
    if (!preview || openingBalance === '') return null;
    try {
      return reconcileFinance({ openingBalance, rows: preview.rows, expectedClosingBalance });
    } catch {
      return null;
    }
  }, [preview, openingBalance, expectedClosingBalance]);
  const canCommit = Boolean(
    preview?.validRows.length && preview.errors.length === 0 && period &&
    openingBalance !== '' && expectedClosingBalance !== '' && reconciliation?.isReconciled &&
    capability.writes_enabled && capability.test_mode_enabled && capability.can_commit &&
    !isCommitting && !committedBatchId
  );

  if (!mayPrepare) return null;

  async function handleFile(nextFile) {
    setFile(nextFile ?? null);
    setPreview(null);
    setMessage('');
    setCommittedBatchId('');
    if (!nextFile) return;
    setIsReading(true);
    try {
      const { parseFinanceWorkbook } = await import('../../services/financeImportParser.js');
      setPreview(await parseFinanceWorkbook(nextFile, scope));
    } catch (error) {
      setMessage(error.message || 'File belum dapat dibaca.');
    } finally {
      setIsReading(false);
    }
  }

  async function commitImport() {
    if (!canCommit) return;
    setIsCommitting(true);
    setMessage('Menyimpan satu batch transaksi…');
    const rows = preview.validRows.map(({ rowNumber, errors, ...row }) => ({
      transaction_date: row.transactionDate,
      direction: row.direction,
      category: row.category,
      subcategory: row.subcategory,
      fund_purpose: row.fundPurpose,
      student_code: row.studentCode || null,
      public_description: row.publicDescription || null,
      payment_method: row.paymentMethod || null,
      amount: row.amount,
      external_reference: row.externalReference || null,
      record_status: row.recordStatus,
      internal_note: row.internalNote || null,
    }));
    try {
      const { sha256File } = await import('../../services/financeImportParser.js');
      const { data, error } = await getSupabaseBrowserClient().rpc('commit_finance_test_import', {
        p_scope: scope,
        p_period: `${period}-01`,
        p_opening_balance: Number(openingBalance),
        p_expected_closing_balance: Number(expectedClosingBalance),
        p_file_name: file.name,
        p_file_sha256: await sha256File(file),
        p_rows: rows,
      });
      if (error) {
        setMessage(`Import gagal: ${formatSupabaseError(error)}`);
      } else {
        setCommittedBatchId(data);
        setMessage(`Import berhasil. ID batch: ${data}. Tombol dikunci untuk mencegah import ganda.`);
      }
    } catch (error) {
      setMessage(`Import gagal: ${formatSupabaseError(error, 'Terjadi gangguan saat menyimpan.')}`);
    } finally {
      setIsCommitting(false);
    }
  }

  return (
    <section className="fin-import-card" aria-labelledby={`finance-import-${scope}`}>
      <div className="fin-import-heading">
        <div>
          <div className="db-sec-eyebrow">IMPORT DATA KEUANGAN</div>
          <h2 id={`finance-import-${scope}`}>Upload Excel {scope === 'tpq' ? 'TPQ' : 'DKM'}</h2>
          <p>Pilih file, cek validasi dan saldo. Data baru tersimpan setelah tombol konfirmasi ditekan.</p>
        </div>
        <span className={`fin-pill ${capability.writes_enabled ? 'fin-pill-green' : 'fin-pill-red'}`}>
          {capability.writes_enabled && capability.test_mode_enabled ? 'Mode uji aktif' : 'Mode preview aman'}
        </span>
      </div>

      <div className="fin-import-controls">
        <label>Periode bulan<input type="month" value={period} onChange={(event) => setPeriod(event.target.value)} /></label>
        <label>Saldo awal (Rp)<input type="number" min="0" step="1" value={openingBalance} onChange={(event) => setOpeningBalance(event.target.value)} /></label>
        <label>Saldo akhir pembanding (Rp)<input type="number" min="0" step="1" value={expectedClosingBalance} onChange={(event) => setExpectedClosingBalance(event.target.value)} /></label>
        <label className="fin-file-picker">File Excel (.xlsx)<input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => handleFile(event.target.files?.[0])} /></label>
      </div>

      <div className="fin-operator-steps" aria-label={`Alur import keuangan ${scope}`}>
        <span><strong>1</strong> Isi periode & saldo</span>
        <span><strong>2</strong> Upload Excel</span>
        <span><strong>3</strong> Pastikan selisih Rp 0</span>
        <span><strong>4</strong> Konfirmasi import</span>
      </div>

      {isReading && <p className="fin-import-message">Membaca dan memvalidasi file…</p>}
      {message && <p className="fin-import-message" role="status">{message}</p>}
      {summary && (
        <>
          <div className="fin-import-summary">
            <span>Total baris <strong>{preview.rows.length}</strong></span>
            <span>Valid <strong>{summary.valid}</strong></span>
            <span>Bermasalah <strong>{summary.invalid}</strong></span>
            <span>Kas masuk <strong>{rupiah.format(preview.totalIncome)}</strong></span>
            <span>Kas keluar <strong>{rupiah.format(preview.totalExpense)}</strong></span>
            {reconciliation && <span>Saldo akhir hitung <strong>{rupiah.format(reconciliation.calculatedClosingBalance)}</strong></span>}
            {reconciliation?.difference !== null && <span>Selisih <strong>{rupiah.format(reconciliation.difference)}</strong></span>}
          </div>
          {reconciliation?.isReconciled === false && <p className="fin-import-message" role="alert">Saldo belum cocok. Periksa saldo awal, transaksi, atau saldo akhir pembanding sebelum melanjutkan.</p>}
          <div className="fin-import-preview">
            <table className="fin-table">
              <thead><tr><th>Baris</th><th>Tanggal</th><th>Jenis</th><th>Kategori</th><th>Subkategori</th><th>Dana/Tujuan</th><th>Keterangan</th><th className="fin-text-right">Nominal</th><th>Validasi</th></tr></thead>
              <tbody>{preview.rows.slice(0, 20).map((row) => (
                <tr key={row.rowNumber}>
                  <td>{row.rowNumber}</td><td>{row.transactionDate || '—'}</td><td>{row.direction === 'income' ? 'Pemasukan' : row.direction === 'expense' ? 'Pengeluaran' : '—'}</td>
                  <td>{row.category || '—'}</td><td>{row.subcategory || '—'}</td><td>{row.fundPurpose || '—'}</td><td>{row.publicDescription || '—'}</td><td className="fin-text-right">{rupiah.format(row.amount)}</td>
                  <td><span className={`fin-pill ${row.errors.length ? 'fin-pill-red' : 'fin-pill-green'}`}>{row.errors.length ? row.errors.join('; ') : 'OK'}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {preview.rows.length > 20 && <p className="fin-import-footnote">Preview menampilkan 20 baris pertama dari {preview.rows.length} baris.</p>}
          <div className="fin-import-actions">
            <button type="button" className="fin-btn" onClick={() => { setFile(null); setPreview(null); setMessage(''); setCommittedBatchId(''); }}>Batalkan preview</button>
            <button type="button" className="fin-btn fin-btn-primary" disabled={!canCommit} onClick={commitImport}>
              {isCommitting ? 'Menyimpan…' : committedBatchId ? 'Import tersimpan' : 'Konfirmasi import'}
            </button>
          </div>
          {!capability.writes_enabled && <p className="fin-import-footnote">Konfirmasi belum aktif sampai migration, pengujian rekonsiliasi, dan kill-switch disetujui.</p>}
        </>
      )}
      {!preview && !isReading && (
        <p className="fin-import-footnote">
          Belum ada file dipilih. Gunakan template standar agar kategori terbaca dan tidak salah masuk DKM/TPQ.
        </p>
      )}
    </section>
  );
}
