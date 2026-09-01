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
import AgendaWorkflowPanel from '../components/agenda/AgendaWorkflowPanel.jsx';
import useAgendaData from '../hooks/useAgendaData.js';
import '../styles/dashboard.css';
import '../styles/newsAdmin.css';
import '../styles/financeAdmin.css';

export default function AgendaAdmin() {
  const { agenda, isLoading, source, sourceStatus, retry } = useAgendaData({ scope: 'admin' });

  // Current month label for subtitle
  const now = new Date();
  const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const periodLabel = `${MONTH_ID[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <DashboardLayout
      title="Agenda & Kalender"
      subtitle={`Kalender Kegiatan · ${periodLabel}`}
      activeId="agenda"
      period={periodLabel}
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">📅</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Kalender Kegiatan &amp; Agenda</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

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
              : `${agenda.length} agenda · ${sourceStatus.label}`}
          </p>
        </div>

        {/* Sheet badge */}
        <div className="db-source-badge">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 4h4M3.5 6h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          09_Agenda_Kalender
        </div>
      </div>

      {/* ── Notice: data source + disabled action ─────────────────── */}
      <AgendaNotice source={source} isLoading={isLoading} total={agenda.length} />

      <AgendaWorkflowPanel agenda={agenda} onRefresh={retry} />

      {/* ── KPI summary + category breakdown ─────────────────────── */}
      <AgendaSummaryCards agenda={agenda} isLoading={isLoading} />

      {/* ── Interactive calendar + website card preview ───────────── */}
      <AgendaCalendarPreview agenda={agenda} isLoading={isLoading} />

      {/* ── Filterable agenda list ────────────────────────────────── */}
      <AgendaList agenda={agenda} isLoading={isLoading} />

      {/* ── Context links ─────────────────────────────────────────── */}
      <div className="db-sec-eyebrow db-sec-eyebrow-spaced">
        Tautan Cepat
      </div>
      <div className="db-quick-link-grid">
        {[
          { icon: '🌐', label: 'Agenda Masjid (Website)', href: '/#agenda',       desc: 'Lihat tampilan publik section Agenda & Kegiatan' },
          { icon: '📋', label: 'Program & Kegiatan',      href: '/app/program',    desc: 'Kelola daftar program kajian rutin' },
          { icon: '📊', label: 'Dashboard Utama',         href: '/app',            desc: 'Kembali ke ringkasan operasional utama' },
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
