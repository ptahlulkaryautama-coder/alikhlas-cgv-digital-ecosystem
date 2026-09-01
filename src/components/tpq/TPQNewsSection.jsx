import React from 'react';
import { Link } from 'react-router-dom';
import { tpqRepository } from '../../repositories/tpqRepository.js';

export default function TPQNewsSection() {
  // Filter articles matching:
  // (category === "TPQ" || tags include "TPQ" || title mentions TPQ/santri)
  // && visibility === "Publik" && status === "Siap publik"
  const tpqArticles = tpqRepository.getPublicNews().filter((article) => {
    if (article.visibility !== 'Publik' || article.status !== 'Siap publik') {
      return false;
    }
    const lowerTitle = article.title.toLowerCase();
    const isCategoryTPQ = article.category === 'TPQ';
    const hasTagTPQ = article.tags && article.tags.includes('TPQ');
    const mentionsTPQOrSantri = lowerTitle.includes('tpq') || lowerTitle.includes('santri');

    return isCategoryTPQ || hasTagTPQ || mentionsTPQOrSantri;
  });

  if (tpqArticles.length === 0) {
    return (
      <div className="tpq-sec-wrapper">
        <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
          F. Kabar TPQ Terbaru
        </div>
        <div
          style={{
            padding: '24px 20px',
            background: '#fdfcf9',
            border: '1px dashed rgba(12,43,29,0.18)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
          role="status"
          aria-live="polite"
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }} aria-hidden="true">📭</div>
          <p style={{ fontSize: '13px', color: '#556b5e', margin: 0, fontWeight: 500 }}>
            Belum ada artikel Kabar TPQ yang dipublikasikan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tpq-sec-wrapper">
      <div className="db-sec-eyebrow" style={{ marginBottom: '14px' }}>
        F. Kabar TPQ Terbaru
      </div>
      <div className="tpq-faq-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {tpqArticles.map((article) => (
          <div 
            className="tpq-faq-card" 
            key={article.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            {/* Article Cover Image */}
            {article.coverImage && (
              <div style={{ height: '140px', overflow: 'hidden', background: '#f7f5ef' }}>
                <img 
                  src={article.coverImage} 
                  alt={`Ilustrasi artikel: ${article.title}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="archive-card-badge ended" style={{ background: '#e8f5ee', color: '#0f6130', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    📰 {article.category}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#6b7f74' }}>
                    📅 {article.date}
                  </span>
                </div>

                <h4 className="tpq-faq-q" style={{ fontSize: '16px', marginBottom: '8px' }}>
                  {article.title}
                </h4>

                <p className="tpq-faq-a" style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                  {article.excerpt}
                </p>
              </div>

              <div>
                <Link
                  to={`/kabar/${article.slug}`}
                  className="button button-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: '6px',
                    color: '#0c2b1d',
                    borderColor: 'rgba(12,43,29,0.2)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Baca Selengkapnya</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
