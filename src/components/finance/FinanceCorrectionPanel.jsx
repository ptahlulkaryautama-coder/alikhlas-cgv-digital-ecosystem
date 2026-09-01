import { useCallback, useEffect, useMemo, useState } from 'react';
import { FINANCE_CATEGORY_CATALOG, findFinanceCategory } from '../../data/financeCategoryCatalog.js';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const EMPTY = {
  reason: '',
  evidenceLabel: '',
  replace: true,
  transactionDate: '',
  direction: 'income',
  category: '',
  subcategory: '',
  fundPurpose: '',
  studentCode: '',
  publicDescription: '',
  paymentMethod: '',
  amount: '',
  externalReference: '',
  internalNote: '',
};

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const STATUS = { draft: 'Draft', under_review: 'Menunggu validasi', approved: 'Disetujui', rejected: 'Ditolak', published: 'Dipublikasikan', archived: 'Diarsipkan' };

function opposite(direction) {
  return direction === 'income' ? 'expense' : 'income';
}

function normalizeSource(row) {
  return {
    id: row.id,
    batchId: row.batch_id,
    scope: row.scope,
    transactionDate: row.transaction_date,
    direction: row.direction,
    category: row.category,
    subcategory: row.subcategory,
    fundPurpose: row.fund_purpose,
    studentCode: row.student_code ?? '',
    publicDescription: row.public_description ?? '',
    paymentMethod: row.payment_method ?? '',
    amount: Number(row.amount ?? 0),
    externalReference: row.external_reference ?? '',
    internalNote: row.internal_note ?? '',
  };
}

function buildInitialReplacement(source) {
  if (!source) return EMPTY;
  return {
    ...EMPTY,
    transactionDate: source.transactionDate,
    direction: source.direction,
    category: source.category,
    subcategory: source.subcategory,
    fundPurpose: source.fundPurpose,
    studentCode: source.studentCode,
    publicDescription: source.publicDescription,
    paymentMethod: source.paymentMethod,
    amount: String(source.amount || ''),
    externalReference: '',
    internalNote: '',
  };
}

export default function FinanceCorrectionPanel({ scope = 'dkm' }) {
  const [cap, setCap] = useState({ writes_enabled: false, test_mode_enabled: false, can_prepare: false, can_approve: false, can_publish: false });
  const [sources, setSources] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');

  const enabled = cap.writes_enabled && cap.test_mode_enabled;
  const selected = sources.find((item) => item.id === selectedId) ?? null;
  const categories = FINANCE_CATEGORY_CATALOG[scope]?.[form.direction] ?? [];
  const selectedCategory = findFinanceCategory(scope, form.direction, form.category);

  const errors = useMemo(() => {
    const result = {};
    if (!selectedId) result.source = 'Pilih transaksi ledger yang akan dikoreksi.';
    if (form.reason.trim().length < 10) result.reason = 'Alasan koreksi minimal 10 karakter.';
    if (form.replace) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(form.transactionDate)) result.transactionDate = 'Tanggal pengganti wajib diisi.';
      if (!form.category) result.category = 'Kategori pengganti wajib dipilih.';
      if (!form.subcategory.trim()) result.subcategory = 'Subkategori wajib diisi.';
      if (!form.fundPurpose.trim()) result.fundPurpose = 'Dana/tujuan wajib diisi.';
      if (selectedCategory?.studentCodeRequired && !form.studentCode.trim()) result.studentCode = 'Kode santri opaque wajib untuk kategori ini.';
      if (scope === 'dkm' && form.studentCode.trim()) result.studentCode = 'Kode santri hanya boleh untuk TPQ.';
      if (form.publicDescription.trim().length < 3) result.publicDescription = 'Uraian publik minimal 3 karakter.';
      if (Number(form.amount) <= 0) result.amount = 'Nominal pengganti harus lebih dari nol.';
    }
    return result;
  }, [form, scope, selectedCategory, selectedId]);

  const load = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    const [capability, sourceRows, correctionRows] = await Promise.all([
      client.rpc('finance_correction_capabilities', { p_scope: scope }),
      client.from('finance_transactions')
        .select('id,batch_id,scope,transaction_date,direction,category,subcategory,fund_purpose,student_code,public_description,payment_method,amount,external_reference,record_status,internal_note,created_at')
        .eq('scope', scope)
        .eq('record_status', 'Terverifikasi')
        .order('transaction_date', { ascending: false })
        .limit(20),
      client.from('finance_correction_entries')
        .select('id,scope,source_transaction_id,period,reason,evidence_label,workflow_status,rejection_reason,version,ledger_batch_id,updated_at')
        .eq('scope', scope)
        .order('updated_at', { ascending: false })
        .limit(20),
    ]);
    if (capability.error) {
      setMessage('Fitur koreksi ledger belum tersedia. Jalankan migration finance correction terlebih dahulu.');
      return;
    }
    setCap(capability.data ?? { writes_enabled: false, test_mode_enabled: false, can_prepare: false, can_approve: false, can_publish: false });
    setSources((sourceRows.data ?? []).map(normalizeSource));
    setCorrections(correctionRows.data ?? []);
    if (sourceRows.error || correctionRows.error) setMessage(formatSupabaseError(sourceRows.error || correctionRows.error));
    else setMessage('');
  }, [scope]);

  useEffect(() => { void load(); }, [load]);

  function chooseSource(id) {
    const source = sources.find((item) => item.id === id);
    setSelectedId(id);
    setForm({ ...buildInitialReplacement(source), reason: form.reason, evidenceLabel: form.evidenceLabel });
  }

  function update(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'direction') {
        const first = FINANCE_CATEGORY_CATALOG[scope]?.[value]?.[0];
        next.category = first?.category ?? '';
        next.subcategory = first?.suggestedSubcategories?.[0] ?? '';
        next.fundPurpose = first?.defaultFundPurpose ?? current.fundPurpose;
      }
      if (field === 'category') {
        const item = findFinanceCategory(scope, next.direction, value);
        next.subcategory = item?.suggestedSubcategories?.[0] ?? next.subcategory;
        next.fundPurpose = item?.defaultFundPurpose || next.fundPurpose;
      }
      return next;
    });
  }

  function replacementPayload() {
    if (!form.replace) return null;
    return {
      transaction_date: form.transactionDate,
      direction: form.direction,
      category: form.category,
      subcategory: form.subcategory,
      fund_purpose: form.fundPurpose,
      student_code: form.studentCode,
      public_description: form.publicDescription,
      payment_method: form.paymentMethod,
      amount: Number(form.amount),
      external_reference: form.externalReference,
      internal_note: form.internalNote,
    };
  }

  async function save(event) {
    event.preventDefault();
    if (!enabled || !cap.can_prepare || Object.keys(errors).length) return;
    setBusy('create');
    setMessage('Menyimpan draft koreksi…');
    const { error } = await getSupabaseBrowserClient().rpc('command_finance_correction', {
      p_action: 'create',
      p_idempotency_key: crypto.randomUUID(),
      p_payload: {
        source_transaction_id: selectedId,
        reason: form.reason,
        evidence_label: form.evidenceLabel,
        replacement: replacementPayload(),
      },
    });
    setMessage(error ? `Draft koreksi gagal disimpan: ${formatSupabaseError(error)}` : 'Draft koreksi tersimpan. Lanjut validasi/publikasi dari daftar koreksi.');
    if (!error) {
      setSelectedId('');
      setForm(EMPTY);
      await load();
    }
    setBusy('');
  }

  async function act(item, action) {
    if (!enabled || busy) return;
    setBusy(item.id);
    setMessage('Memproses koreksi…');
    const chain = action === 'publish_now'
      ? (item.workflow_status === 'approved' ? ['publish'] : item.workflow_status === 'under_review' ? ['approve', 'publish'] : ['submit_review', 'approve', 'publish'])
      : [action];
    let version = item.version;
    for (const nextAction of chain) {
      const { data, error } = await getSupabaseBrowserClient().rpc('command_finance_correction', {
        p_action: nextAction,
        p_idempotency_key: crypto.randomUUID(),
        p_correction_id: item.id,
        p_expected_version: version,
        p_reason: null,
      });
      if (error) {
        setMessage(`Koreksi gagal: ${formatSupabaseError(error)}`);
        setBusy('');
        return;
      }
      version = data.version;
    }
    setMessage(action === 'publish_now' ? 'Koreksi berhasil dipublikasikan ke ledger.' : 'Status koreksi berhasil diperbarui.');
    await load();
    if (action === 'publish_now') window.dispatchEvent(new CustomEvent('finance-ledger-updated', { detail: { scope } }));
    setBusy('');
  }

  return (
    <section className="db-card fin-correction-panel" aria-labelledby={`finance-correction-${scope}`}>
      <div className="fin-import-heading">
        <div>
          <div className="db-sec-eyebrow">KOREKSI LEDGER</div>
          <h2 id={`finance-correction-${scope}`}>Koreksi Keuangan {scope === 'tpq' ? 'TPQ' : 'DKM'}</h2>
          <p>Koreksi pembalik untuk transaksi yang sudah masuk ledger. Sistem membuat reversal otomatis, bukan menghapus transaksi lama.</p>
        </div>
        <span className={`fin-pill ${enabled ? 'fin-pill-green' : 'fin-pill-red'}`}>{enabled ? 'Mode uji aktif' : 'Terkunci aman'}</span>
      </div>

      <div className="fin-operator-steps" aria-label={`Alur koreksi keuangan ${scope}`}>
        <span><strong>1</strong> Pilih transaksi</span>
        <span><strong>2</strong> Isi alasan</span>
        <span><strong>3</strong> Simpan draft</span>
        <span><strong>4</strong> Publikasikan reversal</span>
      </div>

      {message && <p className="fin-import-message" role="status">{message}</p>}

      <form className="fin-manual-form fin-correction-form" onSubmit={save}>
        <label>Transaksi sumber
          <select value={selectedId} onChange={(event) => chooseSource(event.target.value)}>
            <option value="">Pilih transaksi terverifikasi…</option>
            {sources.map((item) => (
              <option key={item.id} value={item.id}>
                {item.transactionDate} · {item.direction === 'income' ? 'Masuk' : 'Keluar'} · {item.category} · {rupiah.format(item.amount)}
              </option>
            ))}
          </select>
          {errors.source && <small>{errors.source}</small>}
        </label>

        {selected && (
          <div className="fin-correction-source" role="note">
            <strong>Transaksi lama tetap disimpan.</strong>
            <span>Reversal otomatis: {opposite(selected.direction) === 'income' ? 'Pemasukan' : 'Pengeluaran'} {rupiah.format(selected.amount)} untuk membalik transaksi sumber.</span>
          </div>
        )}

        <label>Alasan koreksi *
          <textarea value={form.reason} rows="3" maxLength="500" onChange={(event) => update('reason', event.target.value)} />
          {errors.reason && <small>{errors.reason}</small>}
        </label>
        <label>Bukti/referensi koreksi
          <input value={form.evidenceLabel} maxLength="160" placeholder="Contoh: konfirmasi Bendahara / kuitansi / nomor WA" onChange={(event) => update('evidenceLabel', event.target.value)} />
        </label>
        <label className="fin-correction-checkbox">
          <input type="checkbox" checked={form.replace} onChange={(event) => update('replace', event.target.checked)} />
          Buat transaksi pengganti setelah reversal
        </label>

        {form.replace && (
          <div className="fin-correction-replacement">
            <div className="article-form-row">
              <label>Tanggal pengganti *<input type="date" value={form.transactionDate} onChange={(event) => update('transactionDate', event.target.value)} />{errors.transactionDate && <small>{errors.transactionDate}</small>}</label>
              <label>Jenis *<select value={form.direction} onChange={(event) => update('direction', event.target.value)}><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></label>
            </div>
            <div className="article-form-row">
              <label>Kategori *<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((item) => <option key={item.category}>{item.category}</option>)}</select>{errors.category && <small>{errors.category}</small>}</label>
              <label>Subkategori *<input value={form.subcategory} onChange={(event) => update('subcategory', event.target.value)} />{errors.subcategory && <small>{errors.subcategory}</small>}</label>
            </div>
            <div className="article-form-row">
              <label>Dana/Tujuan *<input value={form.fundPurpose} onChange={(event) => update('fundPurpose', event.target.value)} />{errors.fundPurpose && <small>{errors.fundPurpose}</small>}</label>
              <label>Kode santri opaque<input value={form.studentCode} onChange={(event) => update('studentCode', event.target.value)} />{errors.studentCode && <small>{errors.studentCode}</small>}</label>
            </div>
            <label>Uraian publik *<input value={form.publicDescription} maxLength="240" onChange={(event) => update('publicDescription', event.target.value)} />{errors.publicDescription && <small>{errors.publicDescription}</small>}</label>
            <div className="article-form-row">
              <label>Nominal pengganti *<input type="number" min="1" value={form.amount} onChange={(event) => update('amount', event.target.value)} />{errors.amount && <small>{errors.amount}</small>}</label>
              <label>Referensi unik opsional<input value={form.externalReference} maxLength="120" onChange={(event) => update('externalReference', event.target.value)} /></label>
            </div>
          </div>
        )}

        <div className="article-editor-actions">
          <button className="fin-btn fin-btn-primary" type="submit" disabled={!enabled || !cap.can_prepare || busy === 'create' || Object.keys(errors).length > 0}>
            {busy === 'create' ? 'Menyimpan…' : 'Simpan draft koreksi'}
          </button>
        </div>
      </form>

      <div className="fin-manual-list">
        {corrections.length === 0 ? (
          <div className="fin-empty-state">
            <strong>Belum ada koreksi ledger.</strong>
            <span>Koreksi hanya dipakai jika transaksi sudah terlanjur dipublikasikan ke ledger.</span>
          </div>
        ) : corrections.map((item) => (
          <article className="fin-manual-item" key={item.id}>
            <div>
              <span className="fin-manual-date">{item.period}</span>
              <strong>{item.reason}</strong>
              <span>Sumber transaksi: {item.source_transaction_id}</span>
            </div>
            <span className={`fin-pill fin-status-${item.workflow_status}`}>{STATUS[item.workflow_status] ?? item.workflow_status}</span>
            <div className="fin-manual-item-actions">
              {['draft', 'rejected'].includes(item.workflow_status) && <button className="fin-btn" disabled={Boolean(busy)} onClick={() => act(item, 'submit_review')}>Validasi</button>}
              {item.workflow_status === 'under_review' && <button className="fin-btn" disabled={Boolean(busy)} onClick={() => act(item, 'approve')}>Setujui</button>}
              {['draft', 'under_review', 'approved'].includes(item.workflow_status) && <button className="fin-btn fin-btn-primary" disabled={Boolean(busy)} onClick={() => act(item, 'publish_now')}>Publikasikan reversal</button>}
              {['draft', 'rejected'].includes(item.workflow_status) && <button className="fin-btn article-danger-button" disabled={Boolean(busy)} onClick={() => act(item, 'archive')}>Arsipkan</button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
