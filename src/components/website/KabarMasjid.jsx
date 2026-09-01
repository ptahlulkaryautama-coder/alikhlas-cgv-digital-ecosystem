import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { kabarRepository } from '../../repositories/kabarRepository.js';
import { tpqRepository } from '../../repositories/tpqRepository.js';
import Container from '../common/Container.jsx';

export default function KabarMasjid() {
  const navigate = useNavigate();
  // Display only the latest 3 articles
  const tpqSlugs = new Set(tpqRepository.getPublicNews().map((article) => article.slug));
  const latestArticles = kabarRepository.getPublic()
    .filter((article) => article.category !== 'TPQ' || tpqSlugs.has(article.slug))
    .slice(0, 3);

  const CAT_COLORS = {
    TPQ:      { bg: '#E8F5EE', text: '#1A7A50' },
    Kajian:   { bg: '#FEF3E2', text: '#8A6200' },
    Sosial:   { bg: '#FDF4E3', text: '#8A6200' },
    Kegiatan: { bg: '#F0F4FF', text: '#2B4CB0' },
    Ramadhan: { bg: '#F5E8FE', text: '#6B2BA6' },
    Qurban:   { bg: '#FFF0E8', text: '#A63D1A' },
  };

  return (
    <section id="kabar" className="kabar-section" aria-labelledby="kabar-title">
      <Container>
        <div className="section-kicker-block wide" style={{ marginBottom: '40px' }}>
          <p className="label" style={{ color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '12px', margin: '0 0 8px 0' }}>Warta Warga dan DKM</p>
          <h2 id="kabar-title" className="section-title" style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: 'var(--color-forest)', margin: 0 }}>
            Kabar &amp; Cerita Masjid
          </h2>
          <p style={{ color: '#6b7f74', fontSize: '15px', marginTop: '10px', maxWidth: '640px', lineHeight: 1.6 }}>
            Cerita kegiatan warga, catatan pengajian, dan pengumuman resmi DKM Al Ikhlas.
          </p>
        </div>
        <div className="kabar-grid">
          {latestArticles.map((artikel) => {
            const catStyle = CAT_COLORS[artikel.category];
            return (
              <article 
                className="kabar-card" 
                key={artikel.id}
                onClick={() => navigate(`/kabar/${artikel.slug}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/kabar/${artikel.slug}`)}
                aria-label={`Baca artikel: ${artikel.title}`}
              >
                <div>
                  {artikel.image && (
                    <img 
                      src={artikel.image} 
                      alt={artikel.title} 
                      className="kabar-card-image"
                      loading="lazy" 
                    />
                  )}
                  <div className="kabar-card-meta">
                    <span 
                      className="kabar-card-category"
                      style={{
                        background: catStyle?.bg ?? '#E8F5EE',
                        color: catStyle?.text ?? '#1A7A50',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      {artikel.category}
                    </span>
                    <span className="kabar-card-date">{artikel.date}</span>
                  </div>
                  <h3 className="kabar-card-title">
                    {artikel.title}
                  </h3>
                  <p className="kabar-card-excerpt">
                    {artikel.excerpt}
                  </p>
                </div>
                <span className="kabar-card-link">
                  Baca selengkapnya <span aria-hidden="true">→</span>
                </span>
              </article>
            );
          })}
        </div>
        <div className="kabar-section-footer">
          <Link to="/kabar" className="button button-primary" style={{ textDecoration: 'none' }}>
            Lihat Semua Kabar Masjid
          </Link>
        </div>
      </Container>
    </section>
  );
}
