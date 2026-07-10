/**
 * KpiCards.jsx — Dashboard KPI metric cards row
 *
 * Accepts optional `liveFinanceKpi` prop from useDashboardData.
 * When live KPI is available (source=api), live values replace mock finance figures.
 * Program count and Agenda count are always derived from live data when available.
 *
 * Props:
 *   liveFinanceKpi {object|null}  — from finance.kpi (null = use mock)
 *   financeSource  {string}       — 'api' | 'fallback'
 *   programCount   {number}       — count from live or mock programs
 *   agendaCount    {number}       — count from live or mock agenda
 *   isLoading      {boolean}
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
  isLoading = false,
}) {
  // Merge live finance into the KPI config, falling back to mock
  const finance = liveFinanceKpi ?? {
    kasMasuk:   { value: mockKpi.kasMasuk.value,   hint: mockKpi.kasMasuk.hint },
    kasKeluar:  { value: mockKpi.kasKeluar.value,  hint: mockKpi.kasKeluar.hint },
    saldoAkhir: { value: mockKpi.saldoAkhir.value, hint: mockKpi.saldoAkhir.hint },
  };

  const KPI_CONFIG = [
    {
      variant: 'v-green',
      watermark: '↑',
      tag: 'Kas Masuk',
      prefix: 'Rp',
      value: finance.kasMasuk.value,
      hint: finance.kasMasuk.hint,
      isFinance: true,
    },
    {
      variant: 'v-red',
      watermark: '↓',
      tag: 'Kas Keluar',
      prefix: 'Rp',
      value: finance.kasKeluar.value,
      hint: finance.kasKeluar.hint,
      isFinance: true,
    },
    {
      variant: 'v-featured',
      watermark: '✦',
      tag: 'Saldo Kas',
      prefix: 'Rp',
      value: finance.saldoAkhir.value,
      hint: finance.saldoAkhir.hint,
      isFinance: true,
    },
    {
      variant: 'v-blue',
      watermark: '◼',
      tag: 'Program Aktif',
      suffix: 'program',
      value: programCount !== null ? String(programCount) : mockKpi.programAktif.value,
      hint: programCount !== null
        ? `${programCount} kajian dari sheet`
        : mockKpi.programAktif.hint,
    },
    {
      variant: 'v-teal',
      watermark: '◉',
      tag: 'Agenda Bulan Ini',
      suffix: 'kegiatan',
      value: agendaCount !== null ? String(agendaCount) : mockKpi.agendaBulanIni.value,
      hint: agendaCount !== null
        ? `${agendaCount} kegiatan dijadwalkan`
        : mockKpi.agendaBulanIni.hint,
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
            marginBottom: '8px',
            width: 'fit-content',
          }}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          Menampilkan data keuangan sementara
        </div>
      )}

      <div className="db-kpi-grid" role="list" aria-label="Ringkasan KPI">
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
