import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import Container from '../components/common/Container.jsx';
import { articles } from '../data/newsData.js';
import '../styles/home.css';
import '../styles/news.css';

const NEWS_CATEGORIES = ['Semua', 'TPQ', 'Kajian', 'Sosial', 'Kegiatan', 'Ramadhan', 'Qurban'];

// Category colour accent map — warm, editorial, community-driven
const CAT_COLORS = {
  TPQ:      { bg: '#E8F5EE', text: '#1A7A50' },
  Kajian:   { bg: '#FEF3E2', text: '#8A6200' },
  Sosial:   { bg: '#FDF4E3', text: '#8A6200' },
  Kegiatan: { bg: '#F0F4FF', text: '#2B4CB0' },
  Ramadhan: { bg: '#F5E8FE', text: '#6B2BA6' },
  Qurban:   { bg: '#FFF0E8', text: '#A63D1A' },
};

const publicArticles = articles
  .filter((a) => a.visibility === 'Publik' && a.status === 'Siap publik')
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function PublicNews() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'Semua') return publicArticles;
    return publicArticles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  // Derive quick stats from all public articles (not filtered)
  const stats = useMemo(() => {
    const total = publicArticles.length;
    // Top category by count
    const catCount = {};
    publicArticles.forEach((a) => { catCount[a.category] = (catCount[a.category] ?? 0) + 1; });
    const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    // Latest article date (already sorted desc)
    const latestDate = publicArticles[0]?.date ?? '—';
    return { total, topCat, latestDate };
  }, []);

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="home-page">
      <Header />
      <main>

        {/* ── Page Hero ── */}
        <section className="page-hero page-hero--kabar" aria-labelledby="kabar-page-title">
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                <span>Warta Warga dan DKM</span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span className="kicker-arabic">أخبار المسجد</span>
              </div>

              <h1 id="kabar-page-title">Kabar dari Masjid Al Ikhlas</h1>
              <p>
                Cerita kegiatan warga, catatan pengajian, dan pengumuman resmi DKM Al Ikhlas.
              </p>

              {/* Quick stats strip */}
              <div className="program-hero-stats" aria-label="Ringkasan kabar">
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value">{stats.total}</span>
                  <span className="program-hero-stat-label">Artikel Publik</span>
                </div>
                <div className="program-hero-stat-divider" aria-hidden="true" />
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value program-hero-stat-value--date">{stats.topCat}</span>
                  <span className="program-hero-stat-label">Kategori Terbanyak</span>
                </div>
                <div className="program-hero-stat-divider" aria-hidden="true" />
                <div className="program-hero-stat">
                  <span className="program-hero-stat-value program-hero-stat-value--date">{stats.latestDate}</span>
                  <span className="program-hero-stat-label">Kabar Terbaru</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Filter Bar ── */}
        <section className="news-filter-bar" aria-label="Filter kategori">
          <Container>
            <div className="news-filter-chips" role="tablist" aria-label="Kategori kabar">
              {NEWS_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveCategory(cat);
                      }
                    }}
                    className={`news-filter-chip ${isActive ? 'active' : ''}`}
                    aria-pressed={isActive}
                    role="tab"
                    aria-selected={isActive}
                    id={`filter-${cat.toLowerCase()}`}
                  >
                    {isActive ? `✓ ${cat}` : cat}
                  </button>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Featured & Grid Content ── */}
        <section className="news-grid-section">
          <Container>
            {filteredArticles.length === 0 ? (
              <div className="news-empty-state">
                <span className="news-empty-icon" aria-hidden="true">📄</span>
                <p>Belum ada kabar untuk kategori ini.</p>
              </div>
            ) : (
              <>
                {/* Featured article — visually dominant editorial card */}
                {featuredArticle && (
                  <article
                    className="featured-article-card animate-fade-in"
                    onClick={() => navigate(`/kabar/${featuredArticle.slug}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/kabar/${featuredArticle.slug}`);
                      }
                    }}
                    aria-label={`Baca artikel utama: ${featuredArticle.title}`}
                  >
                    <div className="featured-img-wrapper">
                      <img
                        src={featuredArticle.coverImage || featuredArticle.image}
                        alt={featuredArticle.title}
                        loading="eager"
                      />
                      <div className="featured-img-overlay" aria-hidden="true" />
                      {/* Category badge overlaid on image */}
                      <span
                        className="featured-cat-badge"
                        style={{
                          background: CAT_COLORS[featuredArticle.category]?.bg ?? '#E8F5EE',
                          color: CAT_COLORS[featuredArticle.category]?.text ?? '#1A7A50',
                        }}
                      >
                        {featuredArticle.category}
                      </span>
                    </div>
                    <div className="featured-content">
                      <div className="featured-meta">
                        <span className="featured-date">{featuredArticle.date}</span>
                        {featuredArticle.author && (
                          <span className="featured-author">oleh {featuredArticle.author}</span>
                        )}
                      </div>
                      <h2 className="featured-title">{featuredArticle.title}</h2>
                      <p className="featured-desc">{featuredArticle.excerpt}</p>
                      <span className="featured-link">
                        Baca Kabar <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </article>
                )}

                {/* Article grid */}
                {gridArticles.length > 0 && (
                  <div className="kabar-grid kabar-grid--page">
                    {gridArticles.map((artikel) => {
                      const catStyle = CAT_COLORS[artikel.category];
                      return (
                        <article
                          className="kabar-card"
                          key={artikel.id}
                          onClick={() => navigate(`/kabar/${artikel.slug}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              navigate(`/kabar/${artikel.slug}`);
                            }
                          }}
                          aria-label={`Baca artikel: ${artikel.title}`}
                        >
                          {(artikel.image || artikel.coverImage) && (
                            <img
                              src={artikel.image || artikel.coverImage}
                              alt={artikel.title}
                              className="kabar-card-image"
                              loading="lazy"
                            />
                          )}
                          <div className="kabar-card-body">
                            <div className="kabar-card-meta">
                              <span
                                className="kabar-card-category"
                                style={{
                                  background: catStyle?.bg ?? '#E8F5EE',
                                  color: catStyle?.text ?? '#1A7A50',
                                  padding: '3px 10px',
                                  borderRadius: '999px',
                                  fontWeight: 700,
                                }}
                              >
                                {artikel.category}
                              </span>
                              <span className="kabar-card-date">{artikel.date}</span>
                            </div>
                            <h3 className="kabar-card-title">{artikel.title}</h3>
                            <p className="kabar-card-excerpt">{artikel.excerpt}</p>
                          </div>
                          <span className="kabar-card-link">
                            Baca Selengkapnya <span aria-hidden="true">→</span>
                          </span>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </Container>
        </section>

        {/* ── Documentation CTA ── */}
        <section className="news-cta-section">
          <Container>
            <div className="page-cta-block animate-fade-in">
              <h3>Punya foto atau catatan kegiatan Masjid Al Ikhlas?</h3>
              <p>
                Kirimkan kepada tim Humas DKM melalui WhatsApp untuk diperiksa sebelum diterbitkan.
              </p>
              <a
                href="https://wa.me/6281375410997"
                className="button button-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kirim ke Pengurus
              </a>
            </div>
          </Container>
        </section>


      </main>
      <Footer />
    </div>
  );
}


