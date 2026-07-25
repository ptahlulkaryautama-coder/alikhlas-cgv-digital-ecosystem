import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import ProgramKegiatan from '../components/website/ProgramKegiatan.jsx';
import YouTubeLiveKajian from '../components/website/YouTubeLiveKajian.jsx';
import Container from '../components/common/Container.jsx';
import usePrograms from '../hooks/usePrograms.js';
import '../styles/home.css';

// ── Category visual identity strips ─────────────────────────────────────────
const CATEGORY_STRIPS = [
  {
    icon: '📚',
    label: 'Kajian Kitab',
    sublabel: 'Kajian rutin',
    color: '#0e3828',
    accent: 'rgba(14,56,40,0.10)',
  },
  {
    icon: '📖',
    label: 'Tafsir Al-Qur\'an',
    sublabel: 'Kajian rutin',
    color: '#17593a',
    accent: 'rgba(23,89,58,0.10)',
  },
  {
    icon: '🎙️',
    label: 'Tahsin & Qira\'at',
    sublabel: 'Kelas belajar',
    color: '#8A6200',
    accent: 'rgba(201,165,90,0.12)',
  },
  {
    icon: '🗣️',
    label: 'Bahasa Arab',
    sublabel: 'Kelas dari nol',
    color: '#1a3d6e',
    accent: 'rgba(26,61,110,0.10)',
  },
  {
    icon: '🏠',
    label: 'Kajian Keluarga',
    sublabel: 'Kajian rutin',
    color: '#5c2d0a',
    accent: 'rgba(92,45,10,0.10)',
  },
];

export default function PublicProgram() {
  const { programs, isLoading } = usePrograms();

  const stats = useMemo(() => {
    if (!programs) return { total: 0, kajianCount: 0, kelasCount: 0 };
    const kajianCount = programs.filter((p) =>
      ['kitab', 'tafsir', 'keluarga'].some((k) =>
        (p.kategori ?? '').toLowerCase().includes(k)
      )
    ).length;
    const kelasCount = programs.filter((p) =>
      ['bahasa arab', 'tahsin'].some((k) =>
        (p.kategori ?? '').toLowerCase().includes(k)
      )
    ).length;
    return { total: programs.length, kajianCount, kelasCount };
  }, [programs]);

  return (
    <div className="home-page">
      <Header />
      <main>

        {/* ── Page Hero ── */}
        <section className="page-hero page-hero--program" aria-labelledby="program-page-title">
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                <span>Program Rutin</span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">طلب العلم</span>
              </div>
              <h1 id="program-page-title">Kajian Rutin &amp; Kelas Belajar</h1>
              <p>
                Jadwal pengajian pekanan, kelas tahsin Al-Qur'an, TPQ anak,
                dan Bahasa Arab dari nol di Masjid Al Ikhlas Cipta Greenville.
              </p>

              {/* Inline quick-stats strip */}
              <div className="program-hero-stats" aria-label="Ringkasan program">
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value">
                    {isLoading ? '…' : stats.total}
                  </span>
                  <span className="program-hero-stat-label">Program Aktif</span>
                </div>
                <div className="program-hero-stat-divider" aria-hidden="true" />
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value">
                    {isLoading ? '…' : stats.kajianCount}
                  </span>
                  <span className="program-hero-stat-label">Kajian Rutin</span>
                </div>
                <div className="program-hero-stat-divider" aria-hidden="true" />
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value">
                    {isLoading ? '…' : stats.kelasCount}
                  </span>
                  <span className="program-hero-stat-label">Kelas Belajar</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Category visual strip ── */}
        <section className="program-category-strip" aria-label="Kategori program">
          <Container>
            <div className="program-cat-strip-grid">
              {CATEGORY_STRIPS.map((cat) => (
                <div
                  key={cat.label}
                  className="program-cat-chip"
                  style={{ '--chip-accent': cat.accent, '--chip-color': cat.color }}
                >
                  <span className="program-cat-chip-icon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <div className="program-cat-chip-text">
                    <strong>{cat.label}</strong>
                    <span>{cat.sublabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Main Content (search, filter, program cards) ── */}
        <div className="program-page-content">
          <ProgramKegiatan hideAgenda={true} />
        </div>

        {/* ── YouTube Live & Rekaman Kajian Feature Section ── */}
        <YouTubeLiveKajian />

        {/* ── How to Join — contextual info block ── */}
        <section className="program-how-to-join">
          <Container>
            <div className="how-to-join-grid">
              <div className="htj-card">
                <span className="htj-icon" aria-hidden="true">🕌</span>
                <h3>Datang Langsung</h3>
                <p>
                  Semua kajian terbuka untuk warga Cipta Greenville. Tidak perlu daftar
                  khusus — cukup datang ke masjid sesuai jadwal.
                </p>
              </div>
              <div className="htj-card">
                <span className="htj-icon" aria-hidden="true">📝</span>
                <h3>Kelas Tahsin &amp; Bahasa Arab</h3>
                <p>
                   Untuk kelas yang perlu daftar dulu, hubungi pengurus DKM — biar kursinya bisa disiapkan.
                </p>
              </div>
              <div className="htj-card">
                <span className="htj-icon" aria-hidden="true">👦</span>
                <h3>TPQ Anak-anak</h3>
                <p>
                   Orang tua bisa daftarkan anak langsung ke ustadz/ustadzah TPQ, atau tanya dulu di grup WhatsApp warga CGV.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Page CTA Block ── */}
        <section style={{ paddingBottom: '80px' }}>
          <Container>
            <div className="page-cta-block animate-fade-in">
              <h3>Mau lihat kegiatan khusus minggu ini?</h3>
              <p>
                Dari shalat Id sampai rapat DKM — cek semua jadwalnya di kalender agenda.
              </p>
              <div
                className="cta-button-group"
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <Link to="/agenda" className="button button-gold">
                  Lihat Agenda Mendatang
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
                  <span>Hubungi Pengurus</span>
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
