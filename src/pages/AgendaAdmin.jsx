/**
 * AgendaAdmin.jsx — Protected read-only Agenda & Kalender module page
 *
 * Route: /app/agenda  (protected by ProtectedRoute)
 *
 * Phase 7: Read-only agenda overview.
 *   - GET 09_Agenda_Kalender via useAgendaData hook
 *   - Category filter + search on the list
 *   - Interactive monthly calendar with event dots
 *   - Website card preview (first 3 items)
 *   - No POST, no add/edit/delete, no private notes or participant data
 *
 * ⚠️  PROTOTYPE INTERNAL — belum untuk produksi ⚠️
 */

import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import AgendaNotice from '../components/agenda/AgendaNotice.jsx';
import AgendaSummaryCards from '../components/agenda/AgendaSummaryCards.jsx';
import AgendaList from '../components/agenda/AgendaList.jsx';
import AgendaCalendarPreview from '../components/agenda/AgendaCalendarPreview.jsx';
import useAgendaData from '../hooks/useAgendaData.js';
import '../styles/dashboard.css';

export default function AgendaAdmin() {
  const { agenda, isLoading, source } = useAgendaData();

  // Current month label for subtitle
  const now = new Date();
  const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const periodLabel = `${MONTH_ID[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <DashboardLayout
      title="Agenda & Kalender"
      subtitle={`Kalender Kegiatan · ${periodLabel}`}
      activeId="agenda"
    >
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="db-pg-header">
        <div>
          <div className="db-pg-eyebrow">Pengelolaan Konten</div>
          <h1 className="db-pg-title">
            Agenda &amp; <em>Kalender Kegiatan</em>
          </h1>
          <p className="db-pg-desc">
            {isLoading
              ? 'Memuat data agenda dari Google Sheets…'
              : `${agenda.length} agenda · Sheet 09_Agenda_Kalender · Read-only prototype`}
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
          09_Agenda_Kalender
        </div>
      </div>

      {/* ── Notice: data source + disabled action ─────────────────── */}
      <AgendaNotice source={source} isLoading={isLoading} total={agenda.length} />

      {/* ── KPI summary + category breakdown ─────────────────────── */}
      <AgendaSummaryCards agenda={agenda} isLoading={isLoading} />

      {/* ── Interactive calendar + website card preview ───────────── */}
      <AgendaCalendarPreview agenda={agenda} isLoading={isLoading} />

      {/* ── Filterable agenda list ────────────────────────────────── */}
      <AgendaList agenda={agenda} isLoading={isLoading} />

      {/* ── Context links ─────────────────────────────────────────── */}
      <div className="db-sec-eyebrow" style={{ marginTop: '4px' }}>
        Tautan Cepat
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { icon: '🌐', label: 'Agenda Masjid (Website)', href: '/#agenda',       desc: 'Lihat tampilan publik section Agenda & Kegiatan' },
          { icon: '📋', label: 'Program & Kegiatan',      href: '/app/program',    desc: 'Kelola daftar program kajian rutin' },
          { icon: '📊', label: 'Dashboard Utama',         href: '/app',            desc: 'Kembali ke ringkasan operasional utama' },
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
          {' '}· Agenda & Kalender · Prototype v1 ·{' '}
          {isLoading ? 'Memuat…' : source === 'api' ? 'Data live dari Google Sheets ✓' : 'Data sementara'}
        </div>
        <div className="db-pg-footer-quote">
          "Waktu bagaikan pedang; jika engkau tidak memanfaatkannya, ia akan memotongmu." — Imam Syafi'i
        </div>
      </div>
    </DashboardLayout>
  );
}
