/**
 * Dashboard.jsx — Protected DKM admin dashboard page
 *
 * Route: /app  (protected by ProtectedRoute)
 *
 * Phase: Dashboard overview with read-only API wiring.
 * - Programs and Agenda use live GAS data when VITE_GAS_URL is set.
 * - Finance KPIs use live ringkasan summary when available.
 * - All sections fall back to mock data silently when API is unavailable.
 * - No write actions. No real donor/jemaah/TPQ private data surfaced.
 *
 * ⚠️  PROTOTYPE INTERNAL — belum untuk produksi ⚠️
 */

import AgendaOverview from '../components/dashboard/AgendaOverview.jsx';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import FinanceOverview from '../components/dashboard/FinanceOverview.jsx';
import KpiCards from '../components/dashboard/KpiCards.jsx';
import ProgramOverview from '../components/dashboard/ProgramOverview.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import useDashboardData from '../hooks/useDashboardData.js';
import { mockPeriod } from '../data/dashboardMockData.js';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { programs, agenda, finance, isAnyLoading } = useDashboardData();

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Ringkasan Operasional · ${mockPeriod}`}
      activeId="overview"
    >
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="db-pg-header">
        <div>
          <div className="db-pg-eyebrow">DKM Al Ikhlas Cipta Greenville</div>
          <h1 className="db-pg-title">
            Ringkasan Operasional<br />
            <em>Masjid Al Ikhlas</em>
          </h1>
          <p className="db-pg-desc">
            {isAnyLoading
              ? 'Memuat data dari Google Sheets…'
              : `Data overview · Prototype UI · ${mockPeriod}`}
          </p>
        </div>
        <div className="db-pg-period">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1" />
            <path d="M5.5 3v2.5L7 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          {mockPeriod}
        </div>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────── */}
      <KpiCards
        liveFinanceKpi={finance.kpi}
        financeSource={finance.source}
        programCount={programs.isLoading ? null : programs.data.length}
        agendaCount={agenda.isLoading ? null : agenda.data.length}
        isLoading={finance.isLoading}
      />

      {/* ── Finance: bar chart + income sources + budget bars ─────── */}
      {/*
       * FinanceOverview always uses mock chart data — the GAS endpoint
       * does not expose historical monthly series, only the ringkasan.
       * Individual transaction rows are intentionally not fetched here.
       */}
      <FinanceOverview />

      {/* ── Program + Recent Activity ─────────────────────────────── */}
      <div className="db-grid-2-1">
        <ProgramOverview
          programs={programs.data}
          source={programs.source}
          isLoading={programs.isLoading}
        />
        <RecentActivity />
      </div>

      {/* ── Agenda + Donasi placeholder ───────────────────────────── */}
      <div className="db-grid-2">
        <AgendaOverview
          agenda={agenda.data}
          source={agenda.source}
          isLoading={agenda.isLoading}
        />

        {/* Donasi Aktif placeholder — not yet wired */}
        <div className="db-card db-cp">
          <div className="db-card-head">
            <div>
              <div className="db-card-title">Donasi Aktif</div>
              <div className="db-card-sub">Kampanye sedang berjalan</div>
            </div>
            <span className="db-chip o" style={{ fontSize: '10px', padding: '2px 8px' }}>
              Segera
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '140px',
              color: 'var(--db-text-4)',
              textAlign: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '32px', opacity: 0.4 }}>💰</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text-3)' }}>
                Modul Donasi
              </div>
              <div style={{ fontSize: '11.5px', marginTop: '4px', lineHeight: 1.5 }}>
                Akan tersedia di fase berikutnya
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ecosystem portal links ────────────────────────────────── */}
      <div className="db-sec-eyebrow" style={{ marginTop: '8px' }}>
        Ekosistem Digital Al Ikhlas
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {[
          { icon: '🌐', bg: 'var(--db-up-bg)',   name: 'Website Publik',    desc: 'Informasi masjid, program, dan layanan untuk masyarakat umum.', href: '/' },
          { icon: '🔍', bg: 'var(--db-warn-bg)', name: 'Transparansi',      desc: 'Laporan keuangan bulanan terbuka — amanah kepada jamaah.',       href: '/transparansi' },
          { icon: '👥', bg: 'var(--db-info-bg)', name: 'Portal Jamaah',     desc: 'Jadwal kajian, materi, dan donasi online.',                       href: '#' },
        ].map((portal) => (
          <a
            key={portal.name}
            href={portal.href}
            style={{
              background: 'var(--db-bg-card)',
              borderRadius: 'var(--db-r-xl)',
              border: '1px solid rgba(12,24,16,.07)',
              padding: '16px 18px',
              boxShadow: 'var(--db-sh-sm)',
              transition: 'transform 0.22s, box-shadow 0.22s',
              textDecoration: 'none',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--db-sh-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = 'var(--db-sh-sm)';
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: portal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>{portal.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--db-text-1)', marginBottom: 3 }}>{portal.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--db-text-3)', lineHeight: 1.55 }}>{portal.desc}</div>
          </a>
        ))}
      </div>

      {/* ── Page footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong>
          {' '}· Prototype v1 ·{' '}
          {isAnyLoading
            ? 'Memuat…'
            : [programs.source, agenda.source, finance.source].every((s) => s === 'api')
              ? 'Data live dari Google Sheets ✓'
              : 'Sebagian data sementara'}
        </div>
        <div className="db-pg-footer-quote">
          "Memakmurkan Masjid, melayani umat, mencerdaskan masyarakat, dan menebar keberkahan."
        </div>
      </div>
    </DashboardLayout>
  );
}
