import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { hasPermission } from '../../services/accessPolicy.js';
import { getSupabaseBrowserClient } from '../../services/supabaseClient.js';
import { downloadFinancePilotEvidence } from '../../services/financePilotEvidence.js';
import { assessFinancePilotBatches } from '../../services/financePilotReadiness.js';

const STATUS_LABELS = {
  draft: 'Draft',
  under_review: 'Menunggu pemeriksaan',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  published: 'Dipublikasikan',
};

const ACTION_LABELS = {
  'finance.workflow.submit_review': 'Diajukan untuk pemeriksaan',
  'finance.workflow.approve': 'Disetujui',
  'finance.workflow.reject': 'Ditolak',
  'finance.workflow.publish': 'Dipublikasikan',
};

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
});
const dateTime = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta',
});

export default function FinanceBatchHistory({ scope }) {
  const { permissions } = useAuth();
  const [batches, setBatches] = useState([]);
  const [events, setEvents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [state, setState] = useState({ loading: true, error: '' });
  const mayAudit = hasPermission(permissions, 'audit:read');
  const mayReadBatches = scope === 'tpq'
    ? ['tpq_finance:write', 'tpq_finance:approve', 'tpq_finance:publish'].some((item) => hasPermission(permissions, item))
    : ['finance:write', 'finance:approve', 'finance:publish'].some((item) => hasPermission(permissions, item));

  const load = useCallback(async () => {
    if (!mayReadBatches) {
      setState({ loading: false, error: '' });
      return;
    }
    setState({ loading: true, error: '' });
    const client = getSupabaseBrowserClient();
    const batchResult = await client.from('finance_import_batches')
      .select('id,period,file_name,row_count,opening_balance,total_income,total_expense,expected_closing_balance,calculated_closing_balance,workflow_status,created_at,rejection_reason')
      .eq('scope', scope).order('created_at', { ascending: false }).limit(50);
    if (batchResult.error) {
      setState({ loading: false, error: 'Riwayat batch belum dapat dimuat.' });
      return;
    }
    const nextBatches = batchResult.data ?? [];
    setBatches(nextBatches);
    if (mayAudit && nextBatches.length > 0) {
      const auditResult = await client.from('audit_events')
        .select('id,action,entity_id,actor_user_id,occurred_at')
        .eq('entity_type', 'finance_import_batch')
        .in('entity_id', nextBatches.map((batch) => batch.id))
        .order('occurred_at', { ascending: false }).limit(200);
      if (!auditResult.error) setEvents(auditResult.data ?? []);
    } else {
      setEvents([]);
    }
    setState({ loading: false, error: '' });
  }, [mayAudit, mayReadBatches, scope]);

  useEffect(() => { void load(); }, [load]);
  const eventsByBatch = useMemo(() => events.reduce((result, event) => {
    (result[event.entity_id] ??= []).push(event);
    return result;
  }, {}), [events]);
  const readiness = useMemo(() => assessFinancePilotBatches(batches, events), [batches, events]);

  if (!mayReadBatches) return null;

  return (
    <section className="fin-history-card" aria-labelledby={`finance-history-${scope}`}>
      <div className="fin-import-heading">
        <div>
          <div className="db-sec-eyebrow">RIWAYAT &amp; KETERTELUSURAN</div>
          <h2 id={`finance-history-${scope}`}>Riwayat Batch Keuangan {scope === 'tpq' ? 'TPQ' : 'DKM'}</h2>
          <p>Arsip hanya-baca untuk memeriksa sumber, rekonsiliasi, status, dan jejak keputusan.</p>
        </div>
        <div className="fin-history-header-actions">
          <button className="fin-btn" type="button" onClick={() => downloadFinancePilotEvidence({ scope, batches, events })} disabled={state.loading || batches.length === 0}>Unduh bukti CSV</button>
          <button className="fin-btn" type="button" onClick={load} disabled={state.loading}>Muat ulang</button>
        </div>
      </div>
      {state.error && <p className="fin-import-message" role="alert">{state.error}</p>}
      {state.loading ? <p className="fin-import-footnote">Memuat riwayat batch...</p> : batches.length === 0 ? <p className="fin-import-footnote">Belum ada riwayat batch.</p> : (
        <>
        <div className="fin-readiness-grid" aria-label="Ringkasan kesiapan pilot">
          <div><span>Total batch</span><strong>{readiness.total}</strong></div>
          <div className={readiness.hasReconciliationProblem ? 'has-warning' : 'is-good'}><span>Rekonsiliasi Rp 0</span><strong>{readiness.reconciled}/{readiness.total}</strong></div>
          <div><span>Disetujui</span><strong>{readiness.approved}</strong></div>
          <div className={readiness.pending ? 'has-warning' : ''}><span>Menunggu tindakan</span><strong>{readiness.pending}</strong></div>
        </div>
        {(readiness.hasReconciliationProblem || readiness.hasPilotPublication || readiness.rejected > 0 || (mayAudit && readiness.missingAudit > 0)) && <div className="fin-readiness-alert" role="status"><strong>Perlu perhatian sebelum persetujuan pilot</strong><ul>{readiness.hasReconciliationProblem && <li>Ada batch dengan selisih rekonsiliasi.</li>}{readiness.hasPilotPublication && <li>Ada batch pilot berstatus dipublikasikan.</li>}{readiness.rejected > 0 && <li>{readiness.rejected} batch ditolak perlu ditinjau.</li>}{mayAudit && readiness.missingAudit > 0 && <li>{readiness.missingAudit} keputusan belum ditemukan pada audit timeline.</li>}</ul></div>}
        <div className="fin-history-list">
          {batches.map((batch) => {
            const isExpanded = expandedId === batch.id;
            const difference = Number(batch.calculated_closing_balance) - Number(batch.expected_closing_balance);
            return (
              <article className="fin-history-item" key={batch.id}>
                <div className="fin-history-summary">
                  <div className="fin-history-title"><strong>{batch.file_name}</strong><span>{batch.period} · {batch.row_count} transaksi</span></div>
                  <span className={`fin-pill fin-status-${batch.workflow_status}`}>{STATUS_LABELS[batch.workflow_status] ?? batch.workflow_status}</span>
                  <button className="fin-btn fin-history-toggle" type="button" aria-expanded={isExpanded} onClick={() => setExpandedId(isExpanded ? null : batch.id)}>{isExpanded ? 'Tutup detail' : 'Lihat detail'}</button>
                </div>
                {isExpanded && (
                  <div className="fin-history-detail">
                    <dl className="fin-history-metrics">
                      <div><dt>Saldo awal</dt><dd>{rupiah.format(batch.opening_balance)}</dd></div>
                      <div><dt>Kas masuk</dt><dd>{rupiah.format(batch.total_income)}</dd></div>
                      <div><dt>Kas keluar</dt><dd>{rupiah.format(batch.total_expense)}</dd></div>
                      <div><dt>Selisih rekonsiliasi</dt><dd className={difference === 0 ? 'is-balanced' : 'is-difference'}>{rupiah.format(difference)}</dd></div>
                    </dl>
                    <p className="fin-history-created">Dibuat {dateTime.format(new Date(batch.created_at))} · ID {batch.id}</p>
                    {batch.rejection_reason && <p className="fin-rejection-reason">Alasan penolakan: {batch.rejection_reason}</p>}
                    {mayAudit && <div className="fin-history-audit"><strong>Jejak keputusan</strong>{(eventsByBatch[batch.id] ?? []).length === 0 ? <p>Belum ada perubahan status tercatat.</p> : <ol>{eventsByBatch[batch.id].map((event) => <li key={event.id}><span>{ACTION_LABELS[event.action] ?? event.action}</span><time dateTime={event.occurred_at}>{dateTime.format(new Date(event.occurred_at))}</time></li>)}</ol>}</div>}
                  </div>
                )}
              </article>
            );
          })}
        </div></>
      )}
    </section>
  );
}
