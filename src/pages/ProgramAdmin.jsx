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
import usePrograms from '../hooks/usePrograms.js';
import '../styles/dashboard.css';

export default function ProgramAdmin() {
  const { programs, isLoading, source } = usePrograms();

  return (
    <DashboardLayout
      title="Program & Kegiatan"
      subtitle="Manajemen Kajian · Sheet 01_Program_Kajian"
      activeId="program"
    >
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
              : `${programs.length} program · Sheet 01_Program_Kajian · Read-only prototype`}
          </p>
        </div>

        {/* Sheet badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--db-text-4)',
            background: 'var(--db-bg-inset)',
            border: '1px solid rgba(12,24,16,.08)',
            borderRadius: '10px',
            padding: '6px 12px',
            flexShrink: 0,
            alignSelf: 'flex-start',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 4h4M3.5 6h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          01_Program_Kajian
        </div>
      </div>

      {/* ── Notice: data source + disabled action ─────────────────── */}
      <ProgramNotice source={source} isLoading={isLoading} total={programs.length} />

      {/* ── KPI summary + pilar breakdown ────────────────────────── */}
      <ProgramSummaryCards programs={programs} isLoading={isLoading} />

      {/* ── Program table with filter + search ───────────────────── */}
      <ProgramTable programs={programs} isLoading={isLoading} />

      {/* ── Schedule grid + website preview ──────────────────────── */}
      <ProgramSchedulePreview programs={programs} isLoading={isLoading} />

      {/* ── Context links ──────────────────────────────────────────── */}
      <div className="db-sec-eyebrow" style={{ marginTop: '4px' }}>
        Tautan Cepat
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { icon: '🌐', label: 'Section Program (Website)', href: '/#program',       desc: 'Lihat tampilan publik section Program & Kegiatan' },
          { icon: '🔍', label: 'Transparansi',              href: '/transparansi',   desc: 'Laporan keuangan publik terhubung ke jamaah' },
          { icon: '📊', label: 'Dashboard Utama',           href: '/app',            desc: 'Kembali ke ringkasan operasional utama' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              display: 'block',
              background: 'var(--db-bg-card)',
              borderRadius: 'var(--db-r-xl)',
              border: '1px solid rgba(12,24,16,.07)',
              padding: '14px 16px',
              textDecoration: 'none',
              boxShadow: 'var(--db-sh-sm)',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--db-sh-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--db-sh-sm)'; }}
          >
            <div style={{ fontSize: 18, marginBottom: 8 }}>{link.icon}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--db-text-1)', marginBottom: 3 }}>{link.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--db-text-3)', lineHeight: 1.5 }}>{link.desc}</div>
          </a>
        ))}
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
