import React from 'react';
import { useNavigate } from 'react-router-dom';
import { newsArticles } from '../../data/newsData.js';
import Container from '../common/Container.jsx';
import Button from '../common/Button.jsx';

const CAT_COLORS = {
  TPQ:      { bg: '#E8F5EE', text: '#1A7A50' },
  Kajian:   { bg: '#FEF3E2', text: '#8A6200' },
  Sosial:   { bg: '#FDF4E3', text: '#8A6200' },
  Kegiatan: { bg: '#F0F4FF', text: '#2B4CB0' },
  Ramadhan: { bg: '#F5E8FE', text: '#6B2BA6' },
  Qurban:   { bg: '#FFF0E8', text: '#A63D1A' },
};

export default function KabarMasjidPreview() {
  const navigate = useNavigate();

  // Filter only public and published articles, sorted by date desc
  const latestArticles = React.useMemo(() => {
    const parseIndoDate = (dateStr) => {
      const months = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      const parts = dateStr.split(' ');
      if (parts.length !== 3) return new Date(0);
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]] ?? 0;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    };

    return [...newsArticles]
      .filter((a) => a.visibility === 'Publik' && a.status === 'Siap publik')
      .sort((a, b) => parseIndoDate(b.date) - parseIndoDate(a.date))
      .slice(0, 3);
  }, []);

  return (
    <section id="kabar" className="kabar-section" aria-labelledby="kabar-title">
      <Container>
        <div className="section-kicker-block wide">
          <p className="label">Warta &amp; Aktivitas</p>
          <h2 id="kabar-title" className="section-title">
            Kabar Terbaru
          </h2>
          <p className="section-copy">
            Cerita kegiatan warga, catatan pengajian, dan pengumuman DKM Masjid Al Ikhlas Cipta Greenville.
          </p>
        </div>
        <div className="kabar-grid">
          {latestArticles.map((artikel, idx) => {
            const catStyle = CAT_COLORS[artikel.category];
            return (
              <article 
                className={`kabar-card ${idx === 0 ? 'kabar-card-featured' : ''}`} 
                key={artikel.id}
                onClick={() => navigate(`/kabar/${artikel.slug}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/kabar/${artikel.slug}`);
                  }
                }}
                aria-label={`Baca artikel: ${artikel.title}`}
              >
                <div className="kabar-card-body">
                  <img 
                    className="kabar-card-image"
                    src={artikel.coverImage || artikel.image} 
                    alt={artikel.title} 
                    loading="lazy"
                  />
                  <div className="kabar-card-meta">
                    <span 
                      className="kabar-card-category"
                      style={{
                        background: catStyle?.bg ?? '#E8F5EE',
                        color: catStyle?.text ?? '#1A7A50',
                        padding: '3px 10px',
                        borderRadius: '999px',
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
          <Button href="/kabar" variant="primary">
            Lihat Semua Kabar
          </Button>
        </div>
      </Container>
    </section>
  );
}

