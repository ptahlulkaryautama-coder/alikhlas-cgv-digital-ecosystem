/**
 * FinanceKpiSummary.jsx — 4-card KPI row for the Keuangan module
 *
 * Shows: Kas Masuk · Kas Keluar · Saldo Akhir · Jumlah Transaksi
 *
 * Props:
 *   data      {object}  — finance summary (from useFinanceData or fallback)
 *   isLoading {boolean}
 */

import { mockKpi } from '../../data/dashboardMockData.js';

// Skeleton bar for loading state
function Skeleton({ w = '75%' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: '26px',
        width: w,
        borderRadius: '6px',
        background: 'rgba(12,24,16,.07)',
        animation: 'dbSkeletonPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

export default function FinanceKpiSummary({ data, isLoading = false }) {
  // Strip "Rp " prefix if present; keep number string
  const strip = (s) => String(s ?? '').replace(/^Rp\s*/i, '').trim() || '—';

  const cards = [
    {
      variant: 'v-green',
      watermark: '↑',
      tag: 'Total Kas Masuk',
      prefix: 'Rp',
      value: isLoading ? null : strip(data?.totalIn ?? mockKpi.kasMasuk.value),
      hint: isLoading ? 'Memuat…' : (data?.transactionCount ? `${data.transactionCount} transaksi` : mockKpi.kasMasuk.hint),
    },
    {
      variant: 'v-red',
      watermark: '↓',
      tag: 'Total Kas Keluar',
      prefix: 'Rp',
      value: isLoading ? null : strip(data?.totalOut ?? mockKpi.kasKeluar.value),
      hint: isLoading ? 'Memuat…' : mockKpi.kasKeluar.hint,
    },
    {
      variant: 'v-featured',
      watermark: '✦',
      tag: 'Saldo Akhir',
      prefix: 'Rp',
      value: isLoading ? null : strip(data?.endingBalance ?? mockKpi.saldoAkhir.value),
      hint: isLoading ? 'Memuat…' : (data?.period ? `Per ${data.period}` : 'Saldo akhir periode'),
    },
    {
      variant: 'v-blue',
      watermark: '◼',
      tag: 'Jumlah Transaksi',
      suffix: 'entri',
      value: isLoading ? null : (data?.transactionCount ?? '—'),
      hint: isLoading ? 'Memuat…' : (data?.updatedAt ? `Diperbarui ${data.updatedAt}` : 'Total entri kas'),
    },
  ];

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}
      role="list"
      aria-label="Ringkasan keuangan"
    >
      {cards.map((card) => (
        <div
          key={card.tag}
          className={`db-kpi ${card.variant}`}
          style={{ padding: '16px 18px' }}
          role="listitem"
          aria-label={`${card.tag}${card.value ? ': ' + card.value : ''}`}
        >
          <div className="db-kpi-wm" aria-hidden="true">{card.watermark}</div>
          <div className="db-kpi-tag">{card.tag}</div>
          <div className="db-kpi-num">
            {isLoading
              ? <Skeleton />
              : (
                <>
                  {card.prefix && <span className="db-prefix">{card.prefix}</span>}
                  {card.value}
                  {card.suffix && <span className="db-suffix"> {card.suffix}</span>}
                </>
              )}
          </div>
          <div className="db-kpi-hint">{card.hint}</div>
        </div>
      ))}
    </div>
  );
}
