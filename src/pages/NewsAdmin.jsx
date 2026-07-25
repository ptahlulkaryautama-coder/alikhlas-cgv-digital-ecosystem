/**
 * NewsAdmin.jsx — Protected Kabar Masjid editorial control center page
 *
 * Route: /app/kabar (protected by ProtectedRoute)
 *
 * Provides:
 * - Kicker: DOKUMENTASI & WARTA
 * - Title: Pengelolaan Kabar Masjid
 * - Subtitle: Manajemen artikel berita, dokumentasi kegiatan, dan informasi publik.
 * - Read-only status overview (Siap publik, Dalam peninjauan, Draft, Internal/Privat)
 * - Article status summary & publishing ratio bar
 * - Searchable article table with category and visibility filters
 * - Read-only article preview panel
 * - Public article link (/kabar/:slug) ONLY for articles with status "Siap publik"
 * - All write actions disabled (Tulis artikel, Upload foto, Publish, Hapus)
 */

import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import NewsNotice from '../components/newsAdmin/NewsNotice.jsx';
import NewsActionButtons from '../components/newsAdmin/NewsActionButtons.jsx';
import NewsTable from '../components/newsAdmin/NewsTable.jsx';
import { newsArticles } from '../data/newsData.js';
import '../styles/dashboard.css';
import '../styles/newsAdmin.css';

export default function NewsAdmin() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Status counts
  const totalCount = newsArticles.length;
  const siapPublikCount = newsArticles.filter(a => a.status === 'Siap publik').length;
  const peninjauanCount = newsArticles.filter(a => a.status === 'Dalam peninjauan').length;
  const draftCount = newsArticles.filter(a => a.status === 'Draft').length;
  const privateCount = newsArticles.filter(a => a.visibility === 'Privat' || a.visibility === 'Internal').length;
  const ratio = totalCount > 0 ? Math.round((siapPublikCount / totalCount) * 100) : 0;

  return (
    <DashboardLayout
      title="Kabar Masjid"
      subtitle="Pengelolaan Warta &amp; Publikasi Kegiatan"
      activeId="kabar"
      period="Juli 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">📰</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Pusat Pengelolaan Warta &amp; Kabar Masjid</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="db-pg-eyebrow">DOKUMENTASI &amp; WARTA</div>
            <h1 className="db-pg-title">
              Pengelolaan Kabar<br />
              <em>Masjid Al Ikhlas</em>
            </h1>
            <p className="db-pg-desc">
              Manajemen artikel berita, dokumentasi kegiatan, dan informasi publik.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span 
              className="db-chip o" 
              style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              🔒 Read-only
            </span>
          </div>
        </div>

        {/* ── Kabar Metrics Summary Row ─────────────────────────────── */}
        <div className="db-kpi-4-grid">
          {[
            { label: 'Siap Publik', value: siapPublikCount, bg: 'var(--db-up-bg)', border: 'rgba(15,97,48,.12)', color: 'var(--db-up-text)', sub: 'Diterbitkan ke portal warga' },
            { label: 'Dalam Peninjauan', value: peninjauanCount, bg: 'var(--db-info-bg)', border: 'rgba(27,58,122,.12)', color: 'var(--db-info-text)', sub: 'Menunggu review DKM' },
            { label: 'Draft', value: draftCount, bg: 'var(--db-warn-bg)', border: 'rgba(122,75,10,.12)', color: 'var(--db-warn-text)', sub: 'Draf tulisan internal' },
            { label: 'Internal / Privat', value: privateCount, bg: 'var(--db-bg-card)', border: 'rgba(12,24,16,.08)', color: 'var(--db-text-1)', sub: 'Akses internal pengurus' },
          ].map((item) => (
            <div 
              key={item.label}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: 'var(--db-sh-sm)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: item.color, margin: '6px 0 2px 0' }}>
                {item.value} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>artikel</span>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Publishing Snapshot Bar ──────────────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '28px' }}>Rasio Terbit Warta</div>
        <div className="db-card db-cp" style={{ marginBottom: '24px' }}>
          <div className="db-card-head" style={{ marginBottom: '12px' }}>
            <div>
              <div className="db-card-title">Status Publikasi Artikel</div>
              <div className="db-card-sub">Persentase warta yang dipublikasikan ke jamaah</div>
            </div>
            <span className="db-chip g" style={{ fontSize: '10.5px', padding: '3px 10px', fontWeight: 600 }}>{ratio}% Terbit</span>
          </div>
          <div style={{ margin: '8px 0 16px 0' }}>
            <div className="db-pb-wrap" style={{ height: '8px' }}>
              <div 
                className="db-pb g" 
                style={{ width: `${ratio}%` }} 
                role="progressbar" 
                aria-valuenow={ratio} 
                aria-valuemin={0} 
                aria-valuemax={100} 
                aria-label={`Progress Publikasi: ${ratio}%`} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--db-text-3)', fontWeight: 500 }}>
            <span>{siapPublikCount} Warta Diterbitkan (Publik)</span>
            <span>{peninjauanCount + draftCount + privateCount} Draf / Peninjauan / Privat</span>
          </div>
        </div>

        {/* ── Read-Only Notice ─────────────────────────────────────────── */}
        <NewsNotice />

        {/* ── Disabled Action Buttons ──────────────────────────────────── */}
        <div className="db-sec-eyebrow">Aksi Penerbitan</div>
        <NewsActionButtons />

        {/* ── Articles Table with Filters ──────────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '28px' }}>Daftar Artikel Warta (Read-Only)</div>
        <NewsTable articles={newsArticles} onReviewArticle={setSelectedArticle} />

        {/* ── Context Navigation / Quick Links ─────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '32px' }}>Tautan Cepat</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '🌐',
              label: 'Warta Publik (Website)',
              href: '/kabar',
              desc: 'Lihat portal publik Kabar Masjid untuk warga.',
            },
            {
              icon: '📋',
              label: 'Program & Kegiatan',
              href: '/app/program',
              desc: 'Lihat panel manajemen program kajian rutin.',
            },
            {
              icon: '📊',
              label: 'Dashboard Utama',
              href: '/app',
              desc: 'Kembali ke ringkasan panel admin utama.',
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="db-quick-link-card"
            >
              <div className="card-icon-wrapper">
                {link.icon}
              </div>
              <div className="card-title">{link.label}</div>
              <div className="card-desc">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Read-Only Article Preview Panel Modal ────────────────────── */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8,25,18,.5)',
            backdropFilter: 'none',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
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
            }}
          >
            {/* Cover Image */}
            <div style={{ position: 'relative', width: '100%', height: '220px', background: '#0c2b1d' }}>
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
                  background: 'rgba(8,25,18,.7)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Tutup Pratinjau"
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

            {/* Content Details */}
            <div style={{ padding: '24px 28px 20px' }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--db-text-3)', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div>
                  ✍️ <strong style={{ color: 'var(--db-text-2)' }}>{selectedArticle.author}</strong>
                </div>
                <div>📅 {selectedArticle.date}</div>
                <div>
                  Status: <span className="db-chip g" style={{ fontSize: '10px', padding: '1px 6px' }}>{selectedArticle.status}</span>
                </div>
                <div>
                  Akses: <strong>{selectedArticle.visibility}</strong>
                </div>
              </div>

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

              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '0 0 16px 0' }}>
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--db-forest-mid)',
                        background: 'rgba(201, 165, 90, 0.12)',
                        border: '1px solid rgba(201, 165, 90, 0.2)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

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

            {/* Read-only Footer */}
            <div
              style={{
                padding: '16px 28px',
                borderTop: '1px solid rgba(12,24,16,.08)',
                background: 'var(--db-bg-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                borderRadius: '0 0 16px 16px',
              }}
            >
              <span style={{ fontSize: '11.5px', color: 'var(--db-text-4)', fontStyle: 'italic' }}>
                Mode Pratinjau Read-only
              </span>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {selectedArticle.status === 'Siap publik' ? (
                  <a
                    href={`/kabar/${selectedArticle.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fin-btn"
                    style={{ textDecoration: 'none', background: 'var(--db-forest-mid)', color: '#fff', fontSize: '12px', padding: '6px 14px', border: 'none' }}
                  >
                    🌐 Lihat Artikel di Website Utama →
                  </a>
                ) : (
                  <span style={{ fontSize: '11.5px', color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '4px 10px', borderRadius: '6px' }}>
                    🔒 Artikel Draf/Internal — Tidak tampil di publik
                  </span>
                )}
                <button
                  onClick={() => setSelectedArticle(null)}
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    color: 'var(--db-text-1)',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong> · Kabar Masjid · Read-only
        </div>
        <div className="db-pg-footer-quote">
          "Waktu bagaikan pedang; jika engkau tidak memanfaatkannya, ia akan memotongmu." — Imam Syafi'i
        </div>
      </div>
    </DashboardLayout>
  );
}
