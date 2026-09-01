/**
 * ProgramAdmin.jsx — Protected read-only Program & Kegiatan module page
 *
 * Route: /app/program  (protected by ProtectedRoute)
 *
 * Phase 6: Read-only program overview.
 *   - GET 01_Program_Kajian via usePrograms hook
 *   - Pilar filter + search on the table
 *   - Weekly schedule grid
 *   - Website card preview
 *   - Link to homepage #program
 *   - No POST, no add/edit/delete, no private jemaah data
 *
 * ⚠️  PROTOTYPE INTERNAL — belum untuk produksi ⚠️
 */

import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import ProgramNotice from '../components/program/ProgramNotice.jsx';
import ProgramSummaryCards from '../components/program/ProgramSummaryCards.jsx';
import ProgramTable from '../components/program/ProgramTable.jsx';
import ProgramSchedulePreview from '../components/program/ProgramSchedulePreview.jsx';
import ProgramWorkflowPanel from '../components/program/ProgramWorkflowPanel.jsx';
import usePrograms from '../hooks/usePrograms.js';
import '../styles/dashboard.css';
import '../styles/newsAdmin.css';
import '../styles/financeAdmin.css';

export default function ProgramAdmin() {
  const { programs, isLoading, source, sourceStatus, retry } = usePrograms({ scope: 'admin' });

  return (
    <DashboardLayout
      title="Program & Kegiatan"
      subtitle="Manajemen Kajian · Sheet 01_Program_Kajian"
      activeId="program"
      period="Mei 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">📋</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Manajemen Program Kajian</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="db-pg-header">
          <div>
            <div className="db-pg-eyebrow">Pengelolaan Konten</div>
          <h1 className="db-pg-title">
            Program &amp; <em>Kegiatan</em>
          </h1>
          <p className="db-pg-desc">
            {isLoading
              ? 'Memuat daftar program dari Google Sheets…'
              : `${programs.length} program · ${sourceStatus.label} · Read-only`}
          </p>
        </div>

        {/* Sheet badge */}
        <div className="db-source-badge">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 4h4M3.5 6h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          01_Program_Kajian
        </div>
      </div>

      {/* ── Notice: data source + disabled action ─────────────────── */}
      <ProgramNotice source={source} isLoading={isLoading} total={programs.length} />

      <ProgramWorkflowPanel programs={programs} onRefresh={retry} />

      {/* ── KPI summary + pilar breakdown ────────────────────────── */}
      <ProgramSummaryCards programs={programs} isLoading={isLoading} />

      {/* ── Program table with filter + search ───────────────────── */}
      <ProgramTable programs={programs} isLoading={isLoading} />

      {/* ── Schedule grid + website preview ──────────────────────── */}
      <ProgramSchedulePreview programs={programs} isLoading={isLoading} />

      {/* ── Context links ──────────────────────────────────────────── */}
      <div className="db-sec-eyebrow db-sec-eyebrow-spaced">
        Tautan Cepat
      </div>
      <div className="db-quick-link-grid">
        {[
          { icon: '🌐', label: 'Section Program (Website)', href: '/#program',       desc: 'Lihat tampilan publik section Program & Kegiatan' },
          { icon: '🔍', label: 'Transparansi',              href: '/transparansi',   desc: 'Laporan keuangan publik terhubung ke jamaah' },
          { icon: '📊', label: 'Dashboard Utama',           href: '/app',            desc: 'Kembali ke ringkasan operasional utama' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="db-quick-link-card"
          >
            <div className="card-icon-wrapper">
              {link.icon}
            </div>
            <div className="card-title">{link.label}</div>
            <div className="card-desc">{link.desc}</div>
          </a>
        ))}
      </div>

      </div>

      {/* ── Page footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong>
          {' '}· Program & Kegiatan · Prototype v1 ·{' '}
          {isLoading ? 'Memuat…' : source === 'api' ? 'Data live dari Google Sheets ✓' : 'Data sementara'}
        </div>
        <div className="db-pg-footer-quote">
          "Ilmu itu kehidupan Islam dan tiang agama." — Imam Ali radhiyallahu 'anhu
        </div>
      </div>
    </DashboardLayout>
  );
}
