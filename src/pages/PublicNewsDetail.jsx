import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/website/Footer.jsx';
import Header from '../components/website/Header.jsx';
import Container from '../components/common/Container.jsx';
import usePublicArticles from '../hooks/usePublicArticles.js';
import '../styles/home.css';
import '../styles/news.css';

// Category colour accent map — restrained, editorial
const CAT_COLORS = {
  TPQ:      { bg: '#E8F5EE', text: '#1A7A50' },
  Kajian:   { bg: '#FEF3E2', text: '#8A6200' },
  Sosial:   { bg: '#FDF4E3', text: '#8A6200' },
  Kegiatan: { bg: '#F0F4FF', text: '#2B4CB0' },
  Ramadhan: { bg: '#F5E8FE', text: '#6B2BA6' },
  Qurban:   { bg: '#FFF0E8', text: '#A63D1A' },
};

export default function PublicNewsDetail() {
  const { slug } = useParams();
  const { articles: publicArticles } = usePublicArticles();

  const article = useMemo(() => {
    return publicArticles.find((item) => item.slug === slug) ?? null;
  }, [slug]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    
    // Explicitly related articles excluding current article and enforcing public status
    let list = (article.relatedSlugs || [])
      .map((s) => publicArticles.find((a) => a.slug === s && a.slug !== article.slug))
      .filter(Boolean);

    // Fallback matching category if list is short
    if (list.length < 2) {
      const categoryMatches = publicArticles.filter(
        (a) => a.category === article.category && a.slug !== article.slug && !list.some((existing) => existing.slug === a.slug)
      );
      list = [...list, ...categoryMatches];
    }

    return list.slice(0, 3);
  }, [article]);

  const galleryImages = useMemo(() => {
    if (!article?.galleryImages) return [];
    return article.galleryImages.filter((url) => typeof url === 'string' && url.length > 0);
  }, [article]);

  // Dynamic Contextual CTA block — based on article category
  const ctaData = useMemo(() => {
    if (!article) return null;
    if (article.category === 'TPQ') {
      return {
        title: 'Tertarik Mendaftarkan Santri ke TPQ?',
        description: 'TPQ Al Ikhlas CGV membuka kelas mengaji untuk anak-anak warga perumahan Cipta Greenville.',
        label: 'Lihat Program TPQ',
        href: '/program',
      };
    }
    if (article.category === 'Kajian') {
      return {
        title: 'Ikuti Jadwal Pengajian Rutin',
        description: 'Lihat jadwal kajian dan pengajian keluarga di Masjid Al Ikhlas Cipta Greenville.',
        label: 'Lihat Jadwal Kajian',
        href: '/program',
      };
    }
    if (article.category === 'Sosial' || article.category === 'Donasi') {
      return {
        title: 'Salurkan Donasi & Sedekah Warga',
        description: 'Setiap infaq jamaah dipakai langsung untuk operasional TPQ anak-anak dan kegiatan sosial warga Cipta Greenville.',
        label: 'Lihat Kanal Donasi',
        href: '/donasi',
      };
    }
    return {
      title: 'Ikuti Agenda Kegiatan Masjid',
      description: 'Ikut kerja bakti, shalat Id, dan kegiatan warga lainnya di Masjid Al Ikhlas.',
      label: 'Lihat Agenda Masjid',
      href: '/agenda',
    };
  }, [article]);

  // ── Not-found state ──────────────────────────────────────────────────────────
  if (!article) {
    return (
      <div className="home-page">
        <Header />
        <main>
          <section className="page-hero">
            <Container>
              <div className="page-hero-content news-notfound-content">
                <span className="news-notfound-icon" aria-hidden="true">🔍</span>
                <h1>Kabar Belum Tersedia</h1>
                <p>Kabar ini belum tersedia atau masih dalam peninjauan.</p>
                <Link to="/kabar" className="button button-gold" style={{ marginTop: '24px', textDecoration: 'none' }}>
                  Kembali ke Kabar Masjid
                </Link>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const catStyle = CAT_COLORS[article.category];

  // Format paragraphs from body text
  const bodyParagraphs = article.body
    ? article.body.trim().split(/\n\s*\n/).filter(Boolean)
    : [];

  return (
    <div className="home-page">
      <Header />
      <main>

        {/* ── Article Hero ── */}
        <section className="page-hero page-hero--kabar" aria-labelledby="article-title">
          <Container>
            <div className="page-hero-content animate-fade-in">
              <div className="page-hero-kicker">
                <span
                  className="news-detail-cat-badge"
                  style={{
                    background: catStyle?.bg ?? '#E8F5EE',
                    color: catStyle?.text ?? '#1A7A50',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  {article.category}
                </span>
                <span className="kicker-sep" aria-hidden="true">·</span>
                <span style={{ fontWeight: 600, letterSpacing: '0.04em', fontSize: '0.85rem' }}>
                  {article.date}
                </span>
              </div>
              <h1 id="article-title">{article.title}</h1>
              <p>{article.excerpt}</p>
              {article.author && (
                <p className="news-detail-author-line">
                  Ditulis oleh <strong>{article.author}</strong>
                </p>
              )}
            </div>
          </Container>
        </section>

        {/* ── Cover Image — lifts out from hero ── */}
        {(article.coverImage || article.image) && (
          <div className="news-detail-cover-wrap">
            <img
              src={article.coverImage || article.image}
              alt={article.title}
              className="news-detail-cover-img"
            />
          </div>
        )}

        {/* ── Article Body ── */}
        <section className="news-detail-body-section">
          <Container>

            {/* Back link */}
            <Link to="/kabar" className="news-detail-back-link">
              <span aria-hidden="true">←</span> Kembali ke Kabar Masjid
            </Link>

            {/* Excerpt pull-quote */}
            {article.excerpt && (
              <blockquote className="news-detail-pullquote">
                "{article.excerpt}"
              </blockquote>
            )}

            {/* Body content — cleanly parsed paragraphs */}
            <article className="news-detail-content" aria-label={`Isi artikel: ${article.title}`}>
              {bodyParagraphs.map((paraText, idx) => (
                <p key={idx}>{paraText}</p>
              ))}
            </article>

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="news-detail-tags" aria-label="Tag artikel">
                {article.tags.map((tag) => (
                  <span key={tag} className="news-detail-tag-chip">#{tag}</span>
                ))}
              </div>
            )}

            {/* Gallery — Render ONLY when valid galleryImages exist */}
            {galleryImages.length > 0 && (
              <section className="news-detail-gallery" aria-label="Foto kegiatan">
                <h3 className="news-detail-gallery-title">Dokumentasi Foto Kegiatan</h3>
                <div className="news-detail-gallery-grid">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="news-detail-gallery-item">
                      <img
                        src={imgUrl}
                        alt={`Dokumentasi ${article.title} - Foto ${idx + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contextual CTA */}
            {ctaData && (
              <div className="page-cta-block animate-fade-in news-detail-cta">
                <h3>{ctaData.title}</h3>
                <p>{ctaData.description}</p>
                <div className="news-detail-cta-buttons">
                  <Link to={ctaData.href} className="button button-gold" style={{ textDecoration: 'none' }}>
                    {ctaData.label}
                  </Link>
                  <Link to="/kabar" className="button button-outline" style={{ textDecoration: 'none' }}>
                    Kembali ke Kabar Masjid
                  </Link>
                </div>
              </div>
            )}

          </Container>
        </section>

        {/* ── Related Articles ── */}
        {relatedArticles.length > 0 && (
          <section className="news-related-section" aria-label="Kabar terkait">
            <Container>
              <h2 className="news-related-title">Kabar Terkait</h2>
              <div className="kabar-grid news-related-grid">
                {relatedArticles.map((rel) => {
                  const relCat = CAT_COLORS[rel.category];
                  return (
                    <Link
                      key={rel.id}
                      to={`/kabar/${rel.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <article className="kabar-card">
                        {(rel.image || rel.coverImage) && (
                          <img
                            src={rel.image || rel.coverImage}
                            alt={rel.title}
                            className="kabar-card-image"
                            loading="lazy"
                          />
                        )}
                        <div className="kabar-card-body">
                          <div className="kabar-card-meta">
                            <span
                              className="kabar-card-category"
                              style={{
                                background: relCat?.bg ?? '#E8F5EE',
                                color: relCat?.text ?? '#1A7A50',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontWeight: 700,
                              }}
                            >
                              {rel.category}
                            </span>
                            <span className="kabar-card-date">{rel.date}</span>
                          </div>
                          <h3 className="kabar-card-title">{rel.title}</h3>
                          <p className="kabar-card-excerpt">{rel.excerpt}</p>
                        </div>
                        <span className="kabar-card-link">
                          Baca selengkapnya <span aria-hidden="true">→</span>
                        </span>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
