import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';

const mediaCategories = [
  { id: 'video', label: '🎥 Rekaman Kajian (Facebook)' },
  { id: 'buletin', label: '📜 Buletin & Risalah Khutbah' },
  { id: 'pustaka', label: '📚 Pustaka Islam Digital' },
];

const sampleVideos = [
  {
    id: 'v1',
    title: 'Adab Berkeluarga & Keikhlasan Membangun Peradaban Umat',
    speaker: 'Ust. H. Ahmad Farhan, M.Ag',
    date: 'Jumat, 22 Aug 2026',
    duration: '45:20',
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=800&q=80',
    category: 'Kajian Rutin',
  },
  {
    id: 'v2',
    title: 'Keutamaan Menjaga Salat Berjamaah & Ukhuwah Islamiyah',
    speaker: 'Ust. Muhammad Rizky, Lc',
    date: 'Rabu, 20 Aug 2026',
    duration: '38:15',
    thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    category: 'Kajian Subuh',
  },
  {
    id: 'v3',
    title: 'Mendidik Generasi Rabbani di Era Digital',
    speaker: 'Dr. H. Faisal Basri',
    date: 'Minggu, 17 Aug 2026',
    duration: '52:10',
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    category: 'Tabligh Akbar',
  },
];

const sampleBulletins = [
  {
    id: 'b1',
    title: 'Buletin Al Ikhlas Ed. 42: Menyempurnakan Keikhlasan Niat',
    date: 'Edisi Agustus 2026',
    pages: '8 Halaman (PDF)',
    summary: 'Ulasan topik khutbah Jumat seputar memperbarui ikhlas dalam beramal dan bermasyarakat.',
  },
  {
    id: 'b2',
    title: 'Panduan Praktis Manajemen Infaq & Wakaf Produktif',
    date: 'Edisi Juli 2026',
    pages: '12 Halaman (PDF)',
    summary: 'Artikel lengkap seputar tata kelola keuangan masjid transparan dan amanah.',
  },
];

export default function MediaHubSection() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <section className="media-hub-section" aria-labelledby="media-hub-title">
      <Container size="xl">
        <div className="media-hub-header">
          <div className="media-hub-title-block">
            <span className="section-eyebrow">Al-Ikhlas Media & Knowledge Hub</span>
            <h2 id="media-hub-title" className="section-title">
              Pustaka Ilmu & Dokumentasi Dakwah
            </h2>
            <p className="section-lead">
              Akses rekaman kajian rutin, risalah khutbah Jumat, serta materi literasi Islam digital secara mudah & terbuka untuk seluruh jamaah.
            </p>
          </div>

          <div className="media-hub-tabs" role="tablist" aria-label="Kategori Media Hub">
            {mediaCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeTab === cat.id}
                className={`media-tab-btn ${activeTab === cat.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'video' && (
          <div className="media-video-grid">
            {sampleVideos.map((vid) => (
              <article key={vid.id} className="media-video-card">
                <div className="video-thumb-wrap">
                  <img src={vid.thumbnail} alt={vid.title} loading="lazy" />
                  <div className="video-duration-badge">{vid.duration}</div>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-play-overlay"
                    aria-label={`Putar rekaman di Facebook: ${vid.title}`}
                  >
                    <span className="play-icon">▶</span>
                  </a>
                  <span className="video-category-tag">{vid.category}</span>
                </div>
                <div className="video-card-body">
                  <p className="video-speaker">{vid.speaker}</p>
                  <h3 className="video-card-title">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                      {vid.title}
                    </a>
                  </h3>
                  <div className="video-card-footer">
                    <span className="video-date">📅 {vid.date}</span>
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link-action"
                    >
                      Buka Siaran Facebook →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'buletin' && (
          <div className="media-bulletin-grid">
            {sampleBulletins.map((b) => (
              <article key={b.id} className="media-bulletin-card">
                <div className="bulletin-icon-box">📜</div>
                <div className="bulletin-content">
                  <span className="bulletin-meta">{b.date} · {b.pages}</span>
                  <h3 className="bulletin-title">{b.title}</h3>
                  <p className="bulletin-summary">{b.summary}</p>
                </div>
                <div className="bulletin-action">
                  <a href="#download" onClick={(e) => { e.preventDefault(); alert('Unduh PDF Buletin ' + b.title); }} className="btn-bulletin-download">
                    Download PDF 📥
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'pustaka' && (
          <div className="media-pustaka-box">
            <div className="pustaka-hero-card">
              <div className="pustaka-badge">Digital Library Al-Ikhlas</div>
              <h3>Kumpulan Kitab, Artikel, & Panduan Ibadah Harian</h3>
              <p>
                Akses bacaan dzikir pagi-petang, tata cara shalat jenazah, panduan zakat fitrah & maal, serta kajian fiqh praktis.
              </p>
              <div className="pustaka-cta-row">
                <Link to="/kabar" className="btn-pustaka-main">
                  Baca Artikel Kabar Masjid →
                </Link>
                <Link to="/tpq" className="btn-pustaka-sub">
                  Kurikulum TPQ Al-Mardhotillah
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="media-hub-footer-cta">
          <span>Ingin menyaksikan siaran langsung kajian berikutnya?</span>
          <Link to="/live" className="media-live-channel-link">
            Buka Al-Ikhlas Live TV Broadcast & Archive →
          </Link>
        </div>
      </Container>
    </section>
  );
}
