import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { hasPermission } from '../../services/accessPolicy.js';
import { formatSupabaseError, getSupabaseBrowserClient } from '../../services/supabaseClient.js';

const STATUS_LABELS = {
  draft: 'Draft', under_review: 'Menunggu pemeriksaan', approved: 'Disetujui',
  rejected: 'Ditolak', published: 'Dipublikasikan',
};
const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export default function FinanceApprovalPanel({ scope }) {
  const { user, permissions } = useAuth();
  const [batches, setBatches] = useState([]);
  const [capabilities, setCapabilities] = useState({ can_prepare: false, can_approve: false, can_publish: false });
  const [reasonById, setReasonById] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mayView = hasPermission(permissions, scope === 'tpq' ? 'tpq:read' : 'finance:read');
  const relevantPermission = scope === 'tpq'
    ? ['tpq_finance:write', 'tpq_finance:approve', 'tpq_finance:publish']
    : ['finance:write', 'finance:approve', 'finance:publish'];
  const mayAct = relevantPermission.some((permission) => hasPermission(permissions, permission));

  const load = useCallback(async () => {
    if (!mayView || !mayAct) return;
    setIsLoading(true);
    const client = getSupabaseBrowserClient();
    const [batchResult, capabilityResult] = await Promise.all([
      client.from('finance_import_batches')
        .select('id,scope,period,file_name,row_count,total_income,total_expense,workflow_status,created_by,created_at,rejection_reason')
        .eq('scope', scope).order('created_at', { ascending: false }).limit(30),
      client.rpc('finance_workflow_capabilities', { p_scope: scope }),
    ]);
    if (batchResult.error || capabilityResult.error) {
      setMessage('Daftar persetujuan belum dapat dimuat. Pastikan migration Phase 2 sudah dijalankan.');
    } else {
      setBatches(batchResult.data ?? []);
      setCapabilities(capabilityResult.data ?? capabilities);
      setMessage('');
    }
    setIsLoading(false);
  }, [mayView, mayAct, scope]);

  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => batches.filter((batch) => batch.workflow_status !== 'published' || capabilities.can_publish), [batches, capabilities.can_publish]);
  if (!mayView || !mayAct) return null;

  async function transition(batch, action) {
    const reason = reasonById[batch.id]?.trim() || null;
    if (action === 'reject' && (!reason || reason.length < 5)) {
      setMessage('Alasan penolakan minimal 5 karakter.');
      return;
    }
    setMessage('Memproses perubahan status...');
    const { error } = await getSupabaseBrowserClient().rpc('transition_finance_import_batch', {
      p_batch_id: batch.id, p_action: action, p_reason: reason,
    });
    setMessage(error ? `Perubahan status gagal: ${formatSupabaseError(error)}` : 'Status berhasil diperbarui dan dicatat pada audit trail.');
    if (!error) await load();
  }

  async function publishNow(batch) {
    setMessage('Memvalidasi dan mempublikasikan batch...');
    const actions = batch.workflow_status === 'approved' ? ['publish'] : batch.workflow_status === 'under_review' ? ['approve', 'publish'] : ['submit_review', 'approve', 'publish'];
    for (const action of actions) {
      const { error } = await getSupabaseBrowserClient().rpc('transition_finance_import_batch', { p_batch_id: batch.id, p_action: action, p_reason: null });
      if (error) { setMessage(`Publikasi gagal: ${formatSupabaseError(error)}`); return; }
    }
    setMessage('Batch berhasil dipublikasikan dan tercatat pada audit trail.');
    await load();
  }

  return (
    <section className="fin-approval-card" aria-labelledby={`finance-approval-${scope}`}>
      <div className="fin-import-heading">
        <div><div className="db-sec-eyebrow">VALIDASI &amp; PUBLIKASI</div><h2 id={`finance-approval-${scope}`}>Workflow Keuangan {scope === 'tpq' ? 'TPQ' : 'DKM'}</h2><p>Satu akun dapat memvalidasi dan mempublikasikan; audit tetap aktif.</p></div>
        <span className="fin-pill fin-pill-blue">Audit aktif</span>
      </div>
      {message && <p className="fin-import-message" role="status">{message}</p>}
      {isLoading ? <p>Memuat daftar batch...</p> : visible.length === 0 ? <p className="fin-import-footnote">Belum ada batch keuangan untuk diperiksa.</p> : (
        <div className="fin-approval-list">{visible.map((batch) => (
          <article className="fin-approval-item" key={batch.id}>
            <div className="fin-approval-main"><strong>{batch.file_name}</strong><span>{batch.period} · {batch.row_count} transaksi</span><span>Masuk {rupiah.format(batch.total_income)} · Keluar {rupiah.format(batch.total_expense)}</span></div>
            <span className={`fin-pill fin-status-${batch.workflow_status}`}>{STATUS_LABELS[batch.workflow_status] ?? batch.workflow_status}</span>
            <div className="fin-approval-actions">
              {batch.created_by === user?.id && ['draft','rejected','under_review','approved'].includes(batch.workflow_status) && capabilities.can_prepare && <button className="fin-btn fin-btn-primary" onClick={() => publishNow(batch)}>Validasi &amp; publikasikan</button>}
            </div>
            {batch.rejection_reason && <p className="fin-rejection-reason">Alasan terakhir: {batch.rejection_reason}</p>}
          </article>
        ))}</div>
      )}
    </section>
  );
}
