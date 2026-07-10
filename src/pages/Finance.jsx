/**
 * Finance.jsx — Protected read-only Keuangan module page
 *
 * Route: /app/keuangan  (protected by ProtectedRoute)
 *
 * Phase 5: Read-only finance overview.
 *   - GET 02_Keuangan ringkasan → KPI cards
 *   - Category breakdown → static illustrative data (GAS has no per-category array)
 *   - Monthly report list → static from siteContent.js
 *   - No POST, no write, no edit, no delete
 *   - No donor names, private notes, or raw spreadsheet columns
 *
 * ⚠️  PROTOTYPE INTERNAL — belum untuk produksi ⚠️
 */

import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import FinanceCategoryBreakdown from '../components/finance/FinanceCategoryBreakdown.jsx';
import FinanceKpiSummary from '../components/finance/FinanceKpiSummary.jsx';
import FinanceMonthlyReport from '../components/finance/FinanceMonthlyReport.jsx';
import FinanceNotice from '../components/finance/FinanceNotice.jsx';
import useFinanceData from '../hooks/useFinanceData.js';
import '../styles/dashboard.css';

export default function Finance() {
  const { data, source, isLoading } = useFinanceData();
  const period = data?.period ?? 'Mei 2026';

  return (
    <DashboardLayout
      title="Keuangan"
      subtitle={`Buku Kas Masjid · ${period}`}
      activeId="keuangan"
    >
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="db-pg-header">
        <div>
          <div className="db-pg-eyebrow">Pengelolaan Keuangan</div>
          <h1 className="db-pg-title">
            Buku Kas Masjid<br />
            <em>Al Ikhlas CGV</em>
          </h1>
          <p className="db-pg-desc">
            {isLoading
              ? 'Memuat data keuangan dari Google Sheets…'
              : `Ringkasan kas · ${period} · Read-only prototype`}
          </p>
        </div>
        <div className="db-pg-period">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1" />
            <path d="M5.5 3v2.5L7 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          {period}
        </div>
      </div>

      {/* ── Notice: data source + disabled action ─────────────────── */}
      <FinanceNotice source={source} isLoading={isLoading} />

      {/* ── KPI row ──────────────────────────────────────────────────── */}
      <FinanceKpiSummary data={data} isLoading={isLoading} />

      {/* ── Category breakdown ────────────────────────────────────── */}
      <FinanceCategoryBreakdown period={period} />

      {/* ── BSI Bank account info ─────────────────────────────────── */}
      <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Rekening Masjid</div>
            <div className="db-card-sub">Informasi transfer dan pembayaran</div>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            { label: 'Bank', value: 'Bank Syariah Indonesia (BSI)' },
            { label: 'No. Rekening', value: '1500600069' },
            { label: 'Atas Nama', value: 'Masjid Al Ikhlas Cipta Green Ville' },
            { label: 'QRIS', value: 'MASJID AL IKHLAS CGV · ID1024337942592' },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                background: 'var(--db-bg-inset)',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid rgba(12,24,16,.06)',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--db-text-4)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '4px' }}>
                {row.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text-1)', lineHeight: 1.4 }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Monthly report list ───────────────────────────────────── */}
      <FinanceMonthlyReport />

      {/* ── Amanah statement ──────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--db-bg-inset)',
          borderRadius: 'var(--db-r-xl)',
          border: '1px solid rgba(12,24,16,.07)',
          padding: '20px 24px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <div
          lang="ar"
          style={{
            fontSize: '20px',
            color: 'var(--db-gold)',
            letterSpacing: '.04em',
            marginBottom: '8px',
          }}
        >
          إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا
        </div>
        <div style={{ fontSize: '12px', color: 'var(--db-text-4)', lineHeight: 1.6 }}>
          "Sesungguhnya Allah memerintahkan kalian untuk menunaikan amanah kepada yang berhak." — QS An-Nisa: 58
        </div>
      </div>

      {/* ── Page footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong>
          {' '}· Keuangan · Prototype v1 ·{' '}
          {isLoading
            ? 'Memuat…'
            : source === 'api'
              ? 'Data live dari Google Sheets ✓'
              : 'Data ringkasan sementara'}
        </div>
        <div className="db-pg-footer-quote">
          "Transparansi adalah amanah; laporan ini disajikan untuk menjaga kepercayaan jamaah."
        </div>
      </div>
    </DashboardLayout>
  );
}
