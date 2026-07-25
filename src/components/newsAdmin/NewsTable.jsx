import React, { useState, useMemo } from 'react';

export default function NewsTable({ articles, onReviewArticle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Derive unique categories
  const categories = useMemo(() => {
    const list = new Set(articles.map((a) => a.category));
    return ['Semua', ...Array.from(list)];
  }, [articles]);

  // Filter based on search & category
  const filtered = useMemo(() => {
    return articles.filter((article) => {
      const matchCat = activeCategory === 'Semua' || article.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.author ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.tags ?? []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  // Helper to determine status badge class
  const getStatusBadgeClass = (status) => {
    switch (String(status).toLowerCase()) {
      case 'draft':
        return 'status-badge-draft';
      case 'dalam peninjauan':
        return 'status-badge-peninjauan';
      case 'siap publik':
        return 'status-badge-publik';
      default:
        return 'status-badge-draft';
    }
  };

  // Helper to determine visibility icon/emoji
  const getVisibilityIcon = (visibility) => {
    switch (String(visibility).toLowerCase()) {
      case 'publik':
        return '🌐';
      case 'internal':
        return '👥';
      case 'privat':
        return '🔒';
      default:
        return '🌐';
    }
  };

  return (
    <div className="news-table-card">
      {/* Search & Filter Bar */}
      <div className="news-table-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filter:
          </span>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 500,
                  padding: '4px 12px',
                  borderRadius: '99px',
                  border: '1px solid rgba(12,24,16,.10)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all .12s',
                  ...(activeCategory === cat
                    ? { background: 'var(--db-forest-mid)', color: '#fff', borderColor: 'var(--db-forest-mid)' }
                    : { background: 'var(--db-bg-card)', color: 'var(--db-text-2)' }),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="search"
            placeholder="Cari warta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              fontSize: '12.5px',
              padding: '6px 12px 6px 30px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
              fontFamily: 'inherit',
              width: '200px',
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
            🔍
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="news-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Cover</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksesibilitas</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((article) => (
                <tr key={article.id}>
                  {/* Thumbnail cover */}
                  <td style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '36px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: 'rgba(12,24,16,.05)',
                        border: '1px solid rgba(12,24,16,.08)',
                        margin: '0 auto',
                      }}
                    >
                      <img
                        src={article.image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>

                  {/* Title & author */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--db-text-1)', marginBottom: '2px' }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--db-text-3)', marginBottom: '4px' }}>
                      Penulis: {article.author} · <span style={{ fontFamily: 'monospace' }}>/{article.slug}</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {article.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-text-3)', background: 'rgba(12,24,16,.05)', padding: '1px 5px', borderRadius: '3px' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--db-info-bg)',
                        color: 'var(--db-info-text)',
                      }}
                    >
                      {article.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ color: 'var(--db-text-2)', fontSize: '12.5px' }}>{article.date}</td>

                  {/* Status */}
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(article.status)}`}>
                      {article.status ?? 'Draft'}
                    </span>
                  </td>

                  {/* Visibility */}
                  <td>
                    <span className="visibility-badge">
                      <span>{getVisibilityIcon(article.visibility)}</span>
                      <span>{article.visibility ?? 'Publik'}</span>
                    </span>
                  </td>

                  {/* Actions (disabled / read-only review trigger) */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => onReviewArticle(article)}
                      style={{
                        background: 'var(--db-bg-card)',
                        border: '1px solid rgba(12,24,16,.15)',
                        color: 'var(--db-text-2)',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-gold)';
                        e.currentTarget.style.background = 'var(--db-forest-mid)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(12,24,16,.15)';
                        e.currentTarget.style.background = 'var(--db-bg-card)';
                        e.currentTarget.style.color = 'var(--db-text-2)';
                      }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--db-text-3)' }}>
                  Tidak ada warta yang cocok dengan filter pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer statistics */}
      <div
        style={{
          padding: '10px 24px',
          borderTop: '1px solid rgba(12,24,16,.06)',
          background: 'var(--db-bg-hover)',
          fontSize: '11.5px',
          color: 'var(--db-text-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>
          Menampilkan <strong>{filtered.length}</strong> dari <strong>{articles.length}</strong> warta
        </span>
        <span style={{ fontStyle: 'italic' }}>Modul Kabar Masjid · Read-only</span>
      </div>
    </div>
  );
}
