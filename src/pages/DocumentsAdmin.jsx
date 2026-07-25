/**
 * DocumentsAdmin.jsx — Protected Dokumen & Arsip Digital module page
 *
 * Route: /app/dokumen (protected by ProtectedRoute)
 *
 * Provides:
 * - Digital document archive index matching legacy DKM Al Ikhlas
 * - Sheet 07_Dokumen_Laporan structure
 * - Filter & Search by category and year
 * - Document cards grid with Google Drive link access
 * - Interactive modal for adding/editing document entries
 */

import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import { mockDocumentsData } from '../data/documentsData.js';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

const CATEGORY_ICONS = {
  'SK & Surat': '📋',
  'Laporan': '📊',
  'Notulen': '📝',
  'Kontrak': '🤝',
  'Keuangan': '💰',
  'Lainnya': '📄',
};

export default function DocumentsAdmin() {
  const [documents, setDocuments] = useState(mockDocumentsData);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    judul: '',
    kategori: 'SK & Surat',
    tanggal: new Date().toISOString().slice(0, 10),
    nomor: '',
    link: '',
    deskripsi: '',
  });

  // Unique years for filter dropdown
  const availableYears = Array.from(
    new Set(documents.map(d => (d.tanggal ? d.tanggal.slice(0, 4) : '')).filter(Boolean))
  ).sort().reverse();

  // KPI Calculations
  const totalDocs = documents.length;
  const skCount = documents.filter(d => d.kategori === 'SK & Surat').length;
  const laporanCount = documents.filter(d => d.kategori === 'Laporan').length;
  const otherCount = totalDocs - skCount - laporanCount;

  // Filtered rows
  const filteredRows = documents.filter(doc => {
    if (categoryFilter && doc.kategori !== categoryFilter) return false;
    if (yearFilter && (!doc.tanggal || !doc.tanggal.startsWith(yearFilter))) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = doc.judul.toLowerCase().includes(q);
      const matchDesc = (doc.deskripsi || '').toLowerCase().includes(q);
      const matchNomor = (doc.nomor || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchNomor) return false;
    }
    return true;
  }).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  // Open modal
  const handleOpenModal = (doc = null) => {
    if (doc) {
      setFormData({
        id: doc.id,
        judul: doc.judul,
        kategori: doc.kategori,
        tanggal: doc.tanggal,
        nomor: doc.nomor || '',
        link: doc.link || '',
        deskripsi: doc.deskripsi || '',
      });
    } else {
      setFormData({
        id: null,
        judul: '',
        kategori: 'SK & Surat',
        tanggal: new Date().toISOString().slice(0, 10),
        nomor: '',
        link: '',
        deskripsi: '',
      });
    }
    setIsModalOpen(true);
  };

  // Save document
  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) return;

    if (formData.id) {
      setDocuments(prev => prev.map(item => item.id === formData.id ? { ...formData } : item));
    } else {
      const newId = documents.length ? Math.max(...documents.map(d => d.id)) + 1 : 1;
      setDocuments(prev => [{ ...formData, id: newId }, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Delete document
  const handleDeleteDocument = (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus arsip dokumen ini?')) return;
    setDocuments(prev => prev.filter(d => d.id !== id));
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Dokumen & Arsip"
      subtitle="Index Berkas &amp; Legalitas DKM"
      activeId="dokumen"
      period="Juli 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">📁</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Pusat Dokumen &amp; Arsip Digital</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="db-pg-eyebrow">Arsip Kepengurusan</div>
            <h1 className="db-pg-title">
              Dokumen &amp;<br />
              <em>Arsip Legalitas</em>
            </h1>
            <p className="db-pg-desc">
              Index dokumen resmi DKM, SK, notulen, akta wakaf, &amp; laporan terhubung ke Google Drive
            </p>
          </div>

          <div>
            <button 
              className="fin-btn" 
              onClick={() => handleOpenModal()}
              style={{ background: 'var(--db-forest-mid)', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              ➕ Tambah Dokumen
            </button>
          </div>
        </div>

        {/* ── KPI Summary ──────────────────────────────────────────────── */}
        <div className="db-kpi-4-grid">
          <div 
            style={{
              background: 'var(--db-bg-card)',
              border: '1px solid rgba(201,165,90,.28)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Dokumen
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-forest-mid)', margin: '6px 0 2px 0' }}>
              {totalDocs} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>berkas</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Seluruh arsip terdaftar</div>
          </div>

          <div 
            style={{
              background: 'var(--db-up-bg)',
              border: '1px solid rgba(15,97,48,.12)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SK &amp; Surat Resmi
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-up-text)', margin: '6px 0 2px 0' }}>
              {skCount} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>berkas</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>SK pengurus &amp; surat keputusan</div>
          </div>

          <div 
            style={{
              background: 'var(--db-teal-bg)',
              border: '1px solid rgba(12,91,84,.12)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Laporan Kegiatan
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-teal-text)', margin: '6px 0 2px 0' }}>
              {laporanCount} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>berkas</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>LPJ &amp; laporan pertanggungjawaban</div>
          </div>

          <div 
            style={{
              background: 'var(--db-info-bg)',
              border: '1px solid rgba(27,58,122,.12)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: 'var(--db-sh-sm)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Notulen &amp; Berkas Lain
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--db-info-text)', margin: '6px 0 2px 0' }}>
              {Math.max(0, otherCount)} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--db-text-3)' }}>berkas</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Notulen rapat &amp; akta legalitas</div>
          </div>
        </div>

        {/* ── Search & Filter ─────────────────────────────────────────── */}
        <div 
          className="db-card"
          style={{ 
            marginTop: '20px', 
            marginBottom: '24px',
            padding: '14px 18px',
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap', 
            alignItems: 'center',
            background: 'var(--db-bg-card)',
            border: '1px solid rgba(12,24,16,.08)',
          }}
        >
          <input 
            type="text" 
            placeholder="Cari judul dokumen, nomor, atau deskripsi..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: '220px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
            }}
          />

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
              fontWeight: 500,
            }}
          >
            <option value="">Semua Kategori</option>
            <option value="SK & Surat">SK &amp; Surat</option>
            <option value="Laporan">Laporan</option>
            <option value="Notulen">Notulen</option>
            <option value="Kontrak">Kontrak</option>
            <option value="Keuangan">Keuangan</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <select 
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.15)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: 'var(--db-bg-card)',
              color: 'var(--db-text-1)',
              fontWeight: 500,
            }}
          >
            <option value="">Semua Tahun</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {(search || categoryFilter || yearFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setYearFilter(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--db-text-3)',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '4px 8px',
              }}
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* ── Document Cards Grid ──────────────────────────────────────── */}
        {filteredRows.length === 0 ? (
          <div className="db-card" style={{ textCenter: 'center', padding: '48px 24px', textAlign: 'center', color: 'var(--db-text-3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>📁</div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Belum ada dokumen ditemukan</div>
            <div style={{ fontSize: '12.5px', color: 'var(--db-text-4)', marginTop: '4px' }}>
              Coba gunakan kata kunci pencarian lain atau klik "+ Tambah Dokumen".
            </div>
          </div>
        ) : (
          <div className="db-grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
            {filteredRows.map((doc) => {
              const icon = CATEGORY_ICONS[doc.kategori] || '📄';
              const dateStr = doc.tanggal 
                ? new Date(doc.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : '–';

              return (
                <div 
                  className="db-card" 
                  key={doc.id}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justify: 'space-between',
                    padding: '20px',
                    borderRadius: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px', background: 'var(--db-bg-inset)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span className="fin-pill" style={{ fontSize: '10px', padding: '1px 8px', background: 'var(--db-bg-inset)' }}>
                            {doc.kategori}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--db-text-4)' }}>{dateStr}</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: 'var(--db-text-1)', lineHeight: 1.4 }}>
                          {doc.judul}
                        </h3>
                        {doc.nomor && (
                          <div style={{ fontSize: '11px', color: 'var(--db-text-3)', fontFamily: 'monospace', marginTop: '3px' }}>
                            No: {doc.nomor}
                          </div>
                        )}
                      </div>
                    </div>

                    {doc.deskripsi && (
                      <p style={{ fontSize: '12.5px', color: 'var(--db-text-3)', lineHeight: 1.55, margin: '0 0 16px 0' }}>
                        {doc.deskripsi}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(12,24,16,.06)', paddingTop: '14px', marginTop: '8px' }}>
                    {doc.link ? (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fin-btn"
                        style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: '12px', background: 'var(--db-forest-mid)', color: '#fff', border: 'none' }}
                      >
                        🔗 Buka Dokumen Drive
                      </a>
                    ) : (
                      <button className="fin-btn" disabled style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed', fontSize: '12px' }}>
                        Tidak ada link
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(doc)}
                      className="fin-btn"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Context Navigation / Quick Links ─────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '32px' }}>Tautan Cepat</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '🌐',
              label: 'Transparansi Publik',
              href: '/transparansi',
              desc: 'Halaman dokumen transparansi yang dapat diakses publik.',
            },
            {
              icon: '📦',
              label: 'Inventaris & Aset',
              href: '/app/inventaris',
              desc: 'Manajemen aset dan inventaris peralatan masjid.',
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

      {/* ── Modal Add / Edit Document ────────────────────────────────── */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
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
          <form
            onSubmit={handleSaveDocument}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fdfcf9',
              borderRadius: '16px',
              border: '1px solid var(--db-gold-border)',
              boxShadow: 'var(--db-sh-lg)',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              padding: '28px',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e5e5', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'DM Serif Display, Georgia, serif', fontSize: '20px', color: 'var(--color-forest)', fontWeight: 'normal' }}>
                {formData.id ? 'Edit Arsip Dokumen' : 'Tambah Dokumen Baru'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--db-text-3)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Judul Dokumen / Berkas</label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: SK Pengurus DKM 2025-2028..." 
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Kategori</label>
                <select 
                  value={formData.kategori} 
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
                >
                  <option value="SK & Surat">SK &amp; Surat</option>
                  <option value="Laporan">Laporan</option>
                  <option value="Notulen">Notulen</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Tanggal Dokumen</label>
                <input 
                  type="date" 
                  required 
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Nomor Dokumen (Opsional)</label>
              <input 
                type="text" 
                placeholder="Contoh: 001/SK-DKM/I/2025" 
                value={formData.nomor}
                onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Tautan Google Drive / PDF (URL)</label>
              <input 
                type="url" 
                placeholder="https://drive.google.com/file/d/..." 
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Deskripsi / Ringkasan Dokumen</label>
              <textarea 
                placeholder="Tulis ringkasan singkat isi berkas..." 
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', minHeight: '80px', outline: 'none', resize: 'vertical', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '12px', borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
              {formData.id ? (
                <button 
                  type="button" 
                  onClick={() => handleDeleteDocument(formData.id)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '12.5px' }}
                >
                  🗑️ Hapus Dokumen
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', background: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '12.5px' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--db-forest-mid)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '12.5px' }}
                >
                  Simpan Dokumen
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Page Footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong> · Dokumen & Arsip · Prototype v1 · Read-only
        </div>
        <div className="db-pg-footer-quote">
          "Peganglah teguh amanah yang diberikan kepadamu." — HR. Ahmad
        </div>
      </div>
    </DashboardLayout>
  );
}
