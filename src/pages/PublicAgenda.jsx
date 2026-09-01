import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import ProgramKegiatan from '../components/website/ProgramKegiatan.jsx';
import Container from '../components/common/Container.jsx';
import useAgendaData from '../hooks/useAgendaData.js';
import '../styles/home.css';

// ── Category badge colour map ─────────────────────────────────────────────
const CAT_STYLES = {
  'ag-hbi':    { bg: '#FEF3E2', text: '#8A6200', label: 'Hari Besar Islam', icon: '🌙' },
  'ag-goro':   { bg: '#E8F5EE', text: '#1A7A50', label: 'Kerja Bakti',      icon: '🏡' },
  'ag-rapat':  { bg: '#E0EEFF', text: '#2B6CB0', label: 'Rapat DKM',        icon: '📋' },
  'ag-sosial': { bg: '#FDF4E3', text: '#8A6200', label: 'Sosial',            icon: '🤝' },
  'ag-lain':   { bg: '#F3F4F6', text: '#6B7280', label: 'Lainnya',           icon: '📌' },
};

// Indonesian month short-names
const MONTH_ID = [
  'Jan','Feb','Mar','Apr','Mei','Jun',
  'Jul','Agu','Sep','Okt','Nov','Des',
];

export default function PublicAgenda() {
  const { agenda, isLoading } = useAgendaData();

  // Derive quick stats
  const stats = useMemo(() => {
    if (!agenda || agenda.length === 0) {
      return { total: 0, upcoming: 0, nearestLabel: null, nearestName: null };
    }
    const now = new Date();
    const upcomingList = agenda.filter((a) => {
      if (!a._sortKey || a._sortKey.startsWith('9999')) return false;
      const [y, m, d] = a._sortKey.split('-').map(Number);
      return new Date(y, m - 1, d) >= now;
    });
    const nearest = upcomingList[0] ?? null;
    const nearestLabel = nearest
      ? `${nearest.displayDay} ${nearest.displayMonth}`
      : null;
    return {
      total: agenda.length,
      upcoming: upcomingList.length,
      nearestLabel,
      nearestName: nearest?.nama ?? null,
    };
  }, [agenda]);

  // Category distribution for the visual strip
  const catDistrib = useMemo(() => {
    if (!agenda) return [];
    const counts = {};
    agenda.forEach((a) => {
      const k = a.badgeClass ?? 'ag-lain';
      counts[k] = (counts[k] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [agenda]);

  return (
    <div className="home-page">
      <Header />
      <main>

        {/* ── Page Hero ── */}
        <section
          className="page-hero page-hero--agenda"
          aria-labelledby="agenda-page-title"
        >
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                <span>Agenda Masjid</span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">جدول الفعاليات</span>
              </div>
              <h1 id="agenda-page-title">
                {stats.upcoming > 0 ? 'Agenda dan Kegiatan Mendatang' : 'Jadwal Agenda dan Kegiatan Masjid'}
              </h1>
              <p>
                Catat tanggal gotong royong perumahan, shalat Id, dan kegiatan warga
                di Masjid Al Ikhlas Cipta Greenville.
              </p>

              {/* Inline quick-stats strip */}
              <div className="program-hero-stats" aria-label="Ringkasan agenda">
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value">
                    {isLoading ? '…' : stats.total}
                  </span>
                  <span className="program-hero-stat-label">Total Agenda</span>
                </div>
                <div className="program-hero-stat-divider" aria-hidden="true" />
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value">
                    {isLoading ? '…' : stats.upcoming}
                  </span>
                  <span className="program-hero-stat-label">Agenda Mendatang</span>
                </div>
                {stats.nearestLabel && (
                  <>
                    <div className="program-hero-stat-divider" aria-hidden="true" />
                    <div className="program-hero-stat">
                      <span className="program-hero-stat-value program-hero-stat-value--date">
                        {stats.nearestLabel}
                      </span>
                      <span className="program-hero-stat-label">Agenda Terdekat</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Category visual strip ── */}
        {catDistrib.length > 0 && (
          <section className="agenda-category-strip" aria-label="Kategori agenda">
            <Container>
              <div className="agenda-cat-strip-row">
                {catDistrib.map(([key, count]) => {
                  const style = CAT_STYLES[key] ?? CAT_STYLES['ag-lain'];
                  return (
                    <div
                      key={key}
                      className="agenda-cat-chip"
                      style={{ '--chip-bg': style.bg, '--chip-text': style.text }}
                    >
                      <span className="agenda-cat-chip-icon" aria-hidden="true">
                        {style.icon}
                      </span>
                      <div className="agenda-cat-chip-text">
                        <strong>{style.label}</strong>
                        <span>
                          {count} {count === 1 ? 'agenda' : 'agenda'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        )}

        {/* ── Nearest Event Spotlight (if available) ── */}
        {!isLoading && stats.nearestName && (
          <section className="agenda-nearest-spotlight">
            <Container>
              <div className="agenda-spotlight-card animate-fade-in">
                <div className="agenda-spotlight-badge">
                  <span>📍</span> Agenda Terdekat
                </div>
                <p className="agenda-spotlight-name">{stats.nearestName}</p>
                {stats.nearestLabel && (
                  <p className="agenda-spotlight-date">{stats.nearestLabel}</p>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── Main Content (grid + calendar view) ── */}
        <div className="program-page-content">
          <ProgramKegiatan hideProgram={true} />
        </div>



        {/* ── Page CTA Block ── */}
        <section style={{ paddingBottom: '80px' }}>
          <Container>
            <div className="page-cta-block animate-fade-in">
              <h3>Ada pertanyaan atau mau ikut serta?</h3>
              <p>
                Ada acara yang ingin ditanyakan, atau mau ikut bantu gotong royong? Hubungi DKM.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '20px',
                }}
              >
                <Link to="/kontak" className="button button-gold">
                  Hubungi Pengurus
                </Link>
                <a
                  href="https://wa.me/6281375410997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Tanya via WhatsApp</span>
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
