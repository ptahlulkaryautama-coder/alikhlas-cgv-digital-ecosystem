/**
 * Dashboard.jsx — Protected DKM Command Center page
 *
 * Route: /app (protected by ProtectedRoute)
 *
 * Provides:
 * - Kicker: PUSAT KENDALI DKM
 * - Title: Ringkasan Masjid Al Ikhlas
 * - Subtitle: Ringkasan keuangan, kegiatan, laporan, dan publikasi untuk pengurus.
 * - Read-only badge
 * - 4 KPIs: Saldo Kas, Program Berjalan, Agenda Terdekat, Kabar Publik
 * - Quick module cards (Keuangan, Laporan, Program, Agenda, Kabar Masjid, Donasi) with concise descriptions, status, route link, NO write buttons
 * - 6 distinct operational snapshots: Finance, Agenda, Program, Kabar Publishing, Latest Report, Recent Activity
 */

import AgendaOverview from '../components/dashboard/AgendaOverview.jsx';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import FinanceOverview from '../components/dashboard/FinanceOverview.jsx';
import KpiCards from '../components/dashboard/KpiCards.jsx';
import ProgramOverview from '../components/dashboard/ProgramOverview.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import LatestReportSnapshot from '../components/dashboard/LatestReportSnapshot.jsx';
import useDashboardData from '../hooks/useDashboardData.js';
import { mockPeriod } from '../data/dashboardMockData.js';
import { kabarRepository } from '../repositories/kabarRepository.js';
import '../styles/dashboard.css';

export default function Dashboard() {
  const newsArticles = kabarRepository.getAll();
  const { programs, agenda, finance, isAnyLoading } = useDashboardData();
  const kabarCount = newsArticles.filter(a => a.status === 'Siap publik').length;

  return (
    <DashboardLayout
      title="Pusat Kendali DKM"
      subtitle={`Ringkasan Masjid Al Ikhlas · ${mockPeriod}`}
      activeId="overview"
      period={mockPeriod}
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">🕌</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Pusat Kendali DKM Masjid Al Ikhlas</div>
            <div className="db-banner-sub">Sistem Informasi Digital &amp; Manajemen Ekosistem Masjid · Cipta Greenville</div>
          </div>
        </div>

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="db-pg-eyebrow">PUSAT KENDALI DKM</div>
            <h1 className="db-pg-title">
              Ringkasan Masjid<br />
              <em>Al Ikhlas CGV</em>
            </h1>
            <p className="db-pg-desc">
              Ringkasan keuangan, kegiatan, laporan, dan publikasi untuk pengurus.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span 
              className="db-chip o" 
              style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              🔒 Read-only
            </span>
            <div className="db-pg-period">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1" />
                <path d="M5.5 3v2.5L7 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              {mockPeriod}
            </div>
          </div>
        </div>

        {/* ── 4 KPI summary cards ──────────────────────────────────────── */}
        <KpiCards
          liveFinanceKpi={finance.kpi}
          financeSource={finance.source}
          programCount={programs.isLoading ? null : programs.data.length}
          agendaCount={agenda.isLoading ? null : agenda.data.length}
          kabarCount={kabarCount}
          isLoading={finance.isLoading}
        />

        {/* ── Quick Module Cards Grid ──────────────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '24px' }}>
          Akses Modul Pengurus DKM
        </div>
        <div className="db-quick-link-grid" style={{ marginBottom: '28px' }}>
          {[
            { 
              icon: '💵', 
              bg: 'var(--db-up-bg)', 
              name: 'Keuangan', 
              desc: 'Buku kas keuangan, ringkasan kas masuk/keluar, &amp; saldo BSI.', 
              status: finance.source === 'api' ? 'Live API' : 'Read-only',
              href: '/app/keuangan' 
            },
            { 
              icon: '📂', 
              bg: 'var(--db-info-bg)', 
              name: 'Laporan & Arsip', 
              desc: 'Dokumen transparansi bulanan, LPJ kegiatan, &amp; SK pengurus.', 
              status: 'Arsip Aktif',
              href: '/app/laporan' 
            },
            { 
              icon: '📋', 
              bg: 'var(--db-warn-bg)', 
              name: 'Program & Kegiatan', 
              desc: 'Jadwal pengajian rutin, 4 pilar dakwah, &amp; pemateri ustaz.', 
              status: programs.source === 'api' ? 'Live API' : '3 Program',
              href: '/app/program' 
            },
            { 
              icon: '📅', 
              bg: 'var(--db-teal-bg)', 
              name: 'Agenda & Kalender', 
              desc: 'Jadwal gotong royong perumahan, rapat DKM, &amp; hari besar Islam.', 
              status: agenda.source === 'api' ? 'Live API' : '4 Agenda',
              href: '/app/agenda' 
            },
            { 
              icon: '📰', 
              bg: 'var(--db-bg-inset)', 
              name: 'Kabar Masjid', 
              desc: 'Manajemen artikel berita warga, dokumentasi, &amp; warta jamaah.', 
              status: `${kabarCount} Terbit`,
              href: '/app/kabar' 
            },
            { 
              icon: '💝', 
              bg: 'var(--db-down-bg)', 
              name: 'Donasi & Infaq', 
              desc: 'Monitoring infaq bulanan, QRIS BSI resmi, &amp; konfirmasi WA.', 
              status: 'Donasi Terbuka',
              href: '/app/donasi' 
            },
          ].map((mod) => (
            <a
              key={mod.name}
              href={mod.href}
              className="db-quick-link-card"
              style={{ textDecoration: 'none', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '8px' }}>
                <div className="card-icon-wrapper" style={{ background: mod.bg }}>
                  {mod.icon}
                </div>
                <span className="db-chip" style={{ fontSize: '9px', padding: '2px 6px', fontWeight: 600 }}>
                  {mod.status}
                </span>
              </div>
              <div className="card-title" style={{ fontSize: '14px', fontWeight: 700 }}>{mod.name}</div>
              <div className="card-desc" style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--db-text-3)', marginTop: '4px' }}>
                {mod.desc}
              </div>
            </a>
          ))}
        </div>

        {/* ── 6 Distinct Snapshots Section ────────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '32px' }}>
          Snapshot Operasional DKM
        </div>

        {/* Snapshot 1: Finance Overview */}
        <FinanceOverview />

        {/* Snapshot 2 & 3: Agenda + Program */}
        <div className="db-grid-2-1" style={{ marginTop: '24px' }}>
          <ProgramOverview
            programs={programs.data}
            source={programs.source}
            isLoading={programs.isLoading}
          />
          <AgendaOverview
            agenda={agenda.data}
            source={agenda.source}
            isLoading={agenda.isLoading}
          />
        </div>

        {/* Snapshot 4 & 5: Kabar Publishing + Latest Report Snapshot */}
        <div className="db-grid-2" style={{ marginTop: '24px' }}>
          {/* Snapshot 4: Kabar & Warta Snapshot */}
          <div className="db-card">
            <div className="db-card-head">
              <div>
                <div className="db-card-title">Publikasi Warta Jamaah</div>
                <div className="db-card-sub">Rasio artikel terbit ke portal warga</div>
              </div>
              <a 
                href="/app/kabar"
                className="db-chip g"
                style={{ fontSize: '10px', padding: '3px 10px', textDecoration: 'none', fontWeight: 600 }}
              >
                Kelola Kabar →
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
              {newsArticles.slice(0, 3).map((art) => (
                <div 
                  key={art.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    paddingBottom: '10px', 
                    borderBottom: '1px solid rgba(12,24,16,.05)' 
                  }}
                >
                  <img 
                    src={art.image} 
                    alt="" 
                    style={{ width: '44px', height: '33px', borderRadius: '4px', objectFit: 'cover', background: 'rgba(12,24,16,.05)' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--db-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {art.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--db-text-3)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span>{art.date}</span>
                      <span>·</span>
                      <span>{art.category}</span>
                    </div>
                  </div>
                  <span 
                    className={`db-chip ${art.status === 'Siap publik' ? 'g' : 'o'}`} 
                    style={{ fontSize: '9px', padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    {art.status === 'Siap publik' ? 'Publik' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Snapshot 5: Latest Report Snapshot */}
          <LatestReportSnapshot />
        </div>

        {/* Snapshot 6: Recent Operational Activity */}
        <div style={{ marginTop: '24px' }}>
          <RecentActivity />
        </div>
      </div>

      {/* ── Page Footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong>
          {' '}· Command Center · Read-only ·{' '}
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
