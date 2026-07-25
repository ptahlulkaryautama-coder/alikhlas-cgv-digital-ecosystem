/**
 * KabarAdmin.jsx — Protected read-only Warta & Kabar Masjid module page
 *
 * Route: /app/kabar  (protected by ProtectedRoute)
 *
 * Visual style matches the other admin dashboard subpages with:
 * - DKM Al Ikhlas CGV signature color palette
 * - Search + Category filters
 * - Dynamic KPI summary cards
 * - Details modal for reviewing article content (read-only)
 */

import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import { newsArticles } from '../data/newsData.js';
import '../styles/dashboard.css';

export default function KabarAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Derive unique categories from articles
  const categories = useMemo(() => {
    const list = new Set(newsArticles.map((a) => a.category));
    return ['Semua', ...Array.from(list)];
  }, []);

  // Filter articles based on search query and category
  const filteredArticles = useMemo(() => {
    return newsArticles.filter((article) => {
      const matchCat = activeCategory === 'Semua' || article.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.author ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DashboardLayout
      title="Kabar &amp; Warta"
      subtitle="Manajemen Konten Publik · Artikel &amp; Cerita"
      activeId="kabar"
      period="Juli 2026"
    >
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="db-pg-header">
        <div>
          <div className="db-pg-eyebrow">Pengelolaan Konten</div>
          <h1 className="db-pg-title">
            Warta &amp; <em>Kabar Masjid</em>
          </h1>
          <p className="db-pg-desc">
            {newsArticles.length} artikel terdaftar · Menampilkan warta, dokumentasi kegiatan, dan cerita jamaah.
          </p>
        </div>

        {/* Source Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--db-text-4)',
            background: 'var(--db-bg-inset)',
            border: '1px solid rgba(12,24,16,.08)',
            borderRadius: '10px',
            padding: '6px 12px',
            flexShrink: 0,
            alignSelf: 'flex-start',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 4h4M3.5 6h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          Dataset: newsData.js
        </div>
      </div>

      {/* ── Notice: Read-only Prototype Info ────────────────────────── */}
      <div
        className="db-card"
        style={{
          border: '1px solid var(--db-gold-border)',
          background: 'var(--db-warn-bg)',
          color: 'var(--db-warn-text)',
          padding: '16px 20px',
          borderRadius: 'var(--db-r-lg)',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          boxShadow: 'var(--db-sh-sm)',
        }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>
            Prototype Internal — Fitur Terbatas (Read-Only)
          </div>
          <div style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.5 }}>
            Semua data artikel saat ini tersimpan dalam dataset lokal. Penambahan, penyuntingan, dan penghapusan 
            artikel dari panel admin akan tersedia di fase berikutnya setelah integrasi database / sheet selesai.
          </div>
        </div>
      </div>

      {/* ── KPI Summary Cards ────────────────────────────────────────── */}
      <div className="db-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '20px' }}>
        {/* Card 1: Total Articles */}
        <div className="db-kpi v-green">
          <div className="db-kpi-wm">📰</div>
          <div className="db-kpi-tag">Artikel</div>
          <div className="db-kpi-num">
            {newsArticles.length} <span className="db-suffix">Post</span>
          </div>
          <div className="db-kpi-hint">Total warta terpublikasi</div>
        </div>

        {/* Card 2: Categories Count */}
        <div className="db-kpi v-blue">
          <div className="db-kpi-wm">🏷️</div>
          <div className="db-kpi-tag">Kategori</div>
          <div className="db-kpi-num">
            {categories.filter(c => c !== 'Semua').length} <span className="db-suffix">Kategori</span>
          </div>
          <div className="db-kpi-hint">{categories.filter(c => c !== 'Semua').join(', ')}</div>
        </div>

        {/* Card 3: Status */}
        <div className="db-kpi v-teal">
          <div className="db-kpi-wm">✓</div>
          <div className="db-kpi-tag">Status</div>
          <div className="db-kpi-num">
            100<span className="db-suffix">% Publik</span>
          </div>
          <div className="db-kpi-hint">Semua artikel aktif di web utama</div>
        </div>
      </div>

      {/* ── Main List Card ──────────────────────────────────────────── */}
      <div className="db-card" style={{ marginBottom: '24px' }}>
        {/* Filter & Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(12,24,16,.06)',
            background: 'var(--db-bg-hover)',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Kategori
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 500,
                  padding: '5px 14px',
                  borderRadius: '99px',
                  border: '1px solid rgba(12,24,16,.10)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background .12s, color .12s, border-color .12s',
                  ...(activeCategory === cat
                    ? { background: 'var(--db-forest-mid)', color: '#fff', borderColor: 'var(--db-forest-mid)' }
                    : { background: 'var(--db-bg-card)', color: 'var(--db-text-2)' }),
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="search"
              placeholder="Cari judul, penulis, isi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari artikel"
              style={{
                fontSize: '12.5px',
                padding: '7px 12px 7px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(12,24,16,.15)',
                background: 'var(--db-bg-card)',
                color: 'var(--db-text-1)',
                fontFamily: 'inherit',
                width: '240px',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(12,24,16,.15)'}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '13px' }}>
              🔍
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--db-bg-hover)', borderBottom: '1px solid rgba(12,24,16,.08)' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--db-text-3)', width: '80px' }}>Cover</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--db-text-3)' }}>Judul &amp; Slug</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--db-text-3)', width: '120px' }}>Kategori</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--db-text-3)', width: '130px' }}>Penulis</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--db-text-3)', width: '120px' }}>Tanggal</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--db-text-3)', width: '110px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    style={{
                      borderBottom: '1px solid rgba(12,24,16,.05)',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,165,90,.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = ''}
                  >
                    {/* Cover Thumbnail */}
                    <td style={{ padding: '12px 20px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '42px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          background: 'rgba(12,24,16,.05)',
                          border: '1px solid rgba(12,24,16,.08)',
                        }}
                      >
                        <img
                          src={article.image}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--db-text-1)', marginBottom: '3px', fontSize: '13.5px' }}>
                        {article.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--db-text-4)', fontFamily: 'monospace' }}>
                        /{article.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 20px' }}>
                      <span
                        className="db-chip"
                        style={{
                          fontSize: '11px',
                          padding: '2px 9px',
                          borderRadius: '12px',
                          background:
                            article.category === 'TPQ'
                              ? '#e0eeff'
                              : article.category === 'Sosial'
                              ? 'var(--db-warn-bg)'
                              : article.category === 'Kajian'
                              ? 'var(--db-up-bg)'
                              : 'var(--db-info-bg)',
                          color:
                            article.category === 'TPQ'
                              ? '#1034a6'
                              : article.category === 'Sosial'
                              ? 'var(--db-warn-text)'
                              : article.category === 'Kajian'
                              ? 'var(--db-up-text)'
                              : 'var(--db-info-text)',
                        }}
                      >
                        {article.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td style={{ padding: '12px 20px', color: 'var(--db-text-2)' }}>{article.author}</td>

                    {/* Date */}
                    <td style={{ padding: '12px 20px', color: 'var(--db-text-3)', fontSize: '12px' }}>{article.date}</td>

                    {/* Actions */}
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedArticle(article)}
                        style={{
                          background: 'var(--db-bg-card)',
                          border: '1px solid rgba(12,24,16,.15)',
                          color: 'var(--db-text-2)',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          padding: '5px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all .12s',
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
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--db-text-3)' }}>
                    Tidak ada artikel yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid rgba(12,24,16,.06)',
            background: 'var(--db-bg-hover)',
            fontSize: '11.5px',
            color: 'var(--db-text-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>
            Menampilkan{' '}
            <strong style={{ color: 'var(--db-text-2)' }}>{filteredArticles.length}</strong> dari{' '}
            <strong style={{ color: 'var(--db-text-2)' }}>{newsArticles.length}</strong> artikel
          </span>
          <span style={{ fontStyle: 'italic' }}>Modul warta masjid · Berita terbit publik</span>
        </div>
      </div>

      {/* ── Context Navigation / Quick Links ─────────────────────────── */}
      <div className="db-sec-eyebrow" style={{ marginTop: '4px' }}>
        Tautan Cepat
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          {
            icon: '🌐',
            label: 'Kabar Masjid (Website)',
            href: '/kabar',
            desc: 'Lihat tampilan halaman warta publik untuk jamaah.',
          },
          {
            icon: '📋',
            label: 'Program & Kegiatan',
            href: '/app/program',
            desc: 'Kelola jadwal program kajian dan tabligh akbar.',
          },
          {
            icon: '📊',
            label: 'Dashboard Utama',
            href: '/app',
            desc: 'Kembali ke ringkasan ekosistem operasional.',
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              display: 'block',
              background: 'var(--db-bg-card)',
              borderRadius: 'var(--db-r-xl)',
              border: '1px solid rgba(12,24,16,.07)',
              padding: '14px 16px',
              textDecoration: 'none',
              boxShadow: 'var(--db-sh-sm)',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--db-sh-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = 'var(--db-sh-sm)';
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 8 }}>{link.icon}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--db-text-1)', marginBottom: 3 }}>
              {link.label}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--db-text-3)', lineHeight: 1.5 }}>{link.desc}</div>
          </a>
        ))}
      </div>

      {/* ── Details Review Modal ────────────────────────────────────── */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8,25,18,.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'dbFadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fdfcf9',
              borderRadius: '16px',
              border: '1px solid var(--db-gold-border)',
              boxShadow: 'var(--db-sh-lg)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              animation: 'dbFadeIn 0.25s ease',
            }}
          >
            {/* Modal Cover Image */}
            <div style={{ position: 'relative', width: '100%', height: '240px', background: '#0c2b1d' }}>
              <img
                src={selectedArticle.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(8,25,18,.6)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(8,25,18,.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(8,25,18,.6)'}
                aria-label="Tutup"
              >
                ✕
              </button>

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  background: 'var(--db-forest-mid)',
                  color: '#f0dda8',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(240, 221, 168, 0.3)',
                }}
              >
                {selectedArticle.category}
              </div>
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Meta information */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--db-text-3)', marginBottom: '12px' }}>
                <div>
                  ✍️ <strong style={{ color: 'var(--db-text-2)' }}>{selectedArticle.author}</strong>
                </div>
                <div>📅 {selectedArticle.date}</div>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: '22px',
                  fontWeight: 'normal',
                  color: 'var(--color-forest)',
                  margin: '0 0 12px 0',
                  lineHeight: 1.35,
                }}
              >
                {selectedArticle.title}
              </h2>

              {/* Excerpt */}
              <div
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'var(--db-text-2)',
                  fontStyle: 'italic',
                  background: 'rgba(201, 165, 90, 0.06)',
                  borderLeft: '3px solid var(--color-gold)',
                  padding: '10px 14px',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '20px',
                }}
              >
                "{selectedArticle.excerpt}"
              </div>

              {/* Body text */}
              <div
                style={{
                  fontSize: '13px',
                  lineHeight: 1.7,
                  color: '#2c3e35',
                  whiteSpace: 'pre-line',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {selectedArticle.body}
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div
              style={{
                padding: '16px 28px',
                borderTop: '1px solid rgba(12,24,16,.08)',
                background: 'var(--db-bg-hover)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                borderRadius: '0 0 16px 16px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--db-text-4)',
                  alignSelf: 'center',
                  marginRight: 'auto',
                }}
              >
                Mode Peninjauan (Read-Only)
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  background: 'var(--db-forest-mid)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '7px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                Selesai Meninjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Footer ────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong> · Kabar &amp; Warta · Prototype v1 · Data lokal
        </div>
        <div className="db-pg-footer-quote">
          "Sampaikanlah dariku walau hanya satu ayat." — HR. Bukhari
        </div>
      </div>
    </DashboardLayout>
  );
}
