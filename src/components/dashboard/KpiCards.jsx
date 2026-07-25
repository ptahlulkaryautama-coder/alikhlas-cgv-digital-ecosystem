/**
 * KpiCards.jsx — Dashboard KPI metric cards row (4 cards aligned)
 */

import { mockKpi } from '../../data/dashboardMockData.js';

// Loading skeleton pulse for a single value
function KpiSkeleton() {
  return (
    <div
      style={{
        height: '28px',
        width: '80%',
        borderRadius: '6px',
        background: 'rgba(12,24,16,.07)',
        animation: 'dbSkeletonPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

export default function KpiCards({
  liveFinanceKpi = null,
  financeSource = 'fallback',
  programCount = null,
  agendaCount = null,
  kabarCount = null,
  isLoading = false,
}) {
  const finance = liveFinanceKpi ?? {
    saldoAkhir: { value: mockKpi.saldoAkhir.value, hint: mockKpi.saldoAkhir.hint },
  };

  const KPI_CONFIG = [
    {
      variant: 'v-featured',
      watermark: '✦',
      tag: 'Saldo Kas',
      prefix: '',
      value: 'Belum diverifikasi',
      hint: 'Menunggu laporan Bendahara',
      isFinance: true,
    },
    {
      variant: 'v-teal',
      watermark: '◉',
      tag: 'Agenda Aktif',
      suffix: 'kegiatan',
      value: agendaCount !== null ? String(agendaCount) : mockKpi.agendaBulanIni.value,
      hint: agendaCount !== null
        ? `${agendaCount} kegiatan aktif`
        : mockKpi.agendaBulanIni.hint,
    },
    {
      variant: 'v-blue',
      watermark: '◼',
      tag: 'Program Berjalan',
      suffix: 'program',
      value: programCount !== null ? String(programCount) : mockKpi.programAktif.value,
      hint: programCount !== null
        ? `${programCount} kajian berjalan`
        : mockKpi.programAktif.hint,
    },
    {
      variant: 'v-green',
      watermark: '📰',
      tag: 'Kabar Publik',
      suffix: 'artikel',
      value: kabarCount !== null ? String(kabarCount) : '6',
      hint: 'Warta warta jamaah',
    },
  ];

  return (
    <>
      {/* Finance fallback indicator */}
      {!isLoading && financeSource === 'fallback' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'var(--db-warn-text)',
            background: 'var(--db-warn-bg)',
            border: '1px solid rgba(122,75,10,.12)',
            borderRadius: '8px',
            padding: '5px 10px',
            marginBottom: '12px',
            width: 'fit-content',
          }}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          Menampilkan data keuangan sementara
        </div>
      )}

      <div className="db-kpi-4-grid" role="list" aria-label="Ringkasan KPI">
        {KPI_CONFIG.map((kpi) => (
          <div
            key={kpi.tag}
            className={`db-kpi ${kpi.variant}`}
            role="listitem"
            aria-label={`${kpi.tag}: ${kpi.value}`}
          >
            <div className="db-kpi-wm" aria-hidden="true">{kpi.watermark}</div>
            <div className="db-kpi-tag">{kpi.tag}</div>
            <div className="db-kpi-num">
              {isLoading && kpi.isFinance ? (
                <KpiSkeleton />
              ) : (
                <>
                  {kpi.prefix && <span className="db-prefix">{kpi.prefix}</span>}
                  {kpi.value}
                  {kpi.suffix && <span className="db-suffix"> {kpi.suffix}</span>}
                </>
              )}
            </div>
            <div className="db-kpi-hint">
              {isLoading && kpi.isFinance ? 'Memuat…' : kpi.hint}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
