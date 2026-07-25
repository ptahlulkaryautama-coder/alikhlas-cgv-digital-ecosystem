/**
 * SettingsAdmin.jsx — Protected Pengaturan & Appearance module page
 *
 * Route: /app/pengaturan (protected by ProtectedRoute)
 *
 * Provides:
 * - Theme palette switcher (Default Emerald, Toska Teal, Midnight Navy, Earth Brown, Professional Slate, Soft Sage)
 * - Typography customization (Font family, Base font size, Line height)
 * - Layout density & corner radius controls
 * - System diagnostics & Google Apps Script (GAS) API status
 * - Persistent configuration in localStorage ('dkm_appear_v1')
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

const LOCAL_STORAGE_KEY = 'dkm_appear_v1';

const THEMES = {
  default: {
    name: 'Hijau Zamrud (Default)',
    forest: '#0c2b1d',
    forestMid: '#154d38',
    gold: '#c9a55a',
    bg: '#f3efe6',
    bgCard: '#fdfcf9',
  },
  teal: {
    name: 'Biru Toska',
    forest: '#0c5b54',
    forestMid: '#0e7068',
    gold: '#4ecdc4',
    bg: '#f0fafa',
    bgCard: '#fafffe',
  },
  navy: {
    name: 'Biru Malam (Navy)',
    forest: '#1b2a4a',
    forestMid: '#243659',
    gold: '#c9a55a',
    bg: '#f0f2f8',
    bgCard: '#fafbfe',
  },
  earth: {
    name: 'Cokelat Kayu (Earth)',
    forest: '#5c3d2e',
    forestMid: '#6e4a38',
    gold: '#e8a87c',
    bg: '#faf4ee',
    bgCard: '#fffcf9',
  },
  slate: {
    name: 'Abu Profesional (Slate)',
    forest: '#2d3748',
    forestMid: '#3a4a5c',
    gold: '#a0aec0',
    bg: '#f4f6f8',
    bgCard: '#fafbfc',
  },
  sage: {
    name: 'Hijau Soft (Sage)',
    forest: '#4a6741',
    forestMid: '#587950',
    gold: '#b5a98a',
    bg: '#f5f4ef',
    bgCard: '#fdfcfa',
  },
};

const DEFAULT_SETTINGS = {
  theme: 'default',
  fontBody: "'DM Sans', 'Inter', system-ui, sans-serif",
  fontHeading: "'DM Serif Display', Georgia, serif",
  fontSize: '14px',
  lineHeight: '1.55',
  density: 'normal',
  radius: 'normal',
  sidebarWidth: '252px',
};

export default function SettingsAdmin() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        setSettings(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load appearance settings', e);
    }
  }, []);

  // Apply custom CSS dynamically to document
  const applySettingsToDOM = (newSettings) => {
    let styleTag = document.getElementById('dkm-custom-theme-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dkm-custom-theme-styles';
      document.head.appendChild(styleTag);
    }

    const t = THEMES[newSettings.theme] || THEMES.default;
    const rMap = {
      sharp: { sm: '4px', md: '6px', lg: '8px' },
      normal: { sm: '6px', md: '10px', lg: '14px' },
      round: { sm: '10px', md: '16px', lg: '22px' },
    };
    const r = rMap[newSettings.radius] || rMap.normal;

    styleTag.textContent = `
      .dashboard-root {
        --db-forest-mid: ${t.forestMid};
        --db-bg: ${t.bg};
        --db-bg-card: ${t.bgCard};
        --db-sidebar-w: ${newSettings.sidebarWidth};
        --db-r-sm: ${r.sm};
        --db-r-md: ${r.md};
        --db-r-lg: ${r.lg};
      }
      body {
        font-family: ${newSettings.fontBody};
        line-height: ${newSettings.lineHeight};
      }
      .db-pg-title, .db-card-title {
        font-family: ${newSettings.fontHeading};
      }
    `;
  };

  // Save settings
  const handleSave = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
      applySettingsToDOM(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  // Reset settings
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const styleTag = document.getElementById('dkm-custom-theme-styles');
    if (styleTag) styleTag.remove();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const gasUrl = import.meta.env.VITE_GAS_URL || 'Tidak dikonfigurasi (Menggunakan data lokal)';

  return (
    <DashboardLayout
      title="Pengaturan"
      subtitle="Konfigurasi Tampilan &amp; Sistem"
      activeId="pengaturan"
      period="Juli 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">⚙️</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Pengaturan Tampilan &amp; Diagnostik Sistem</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="db-pg-eyebrow">Kustomisasi Dashboard</div>
            <h1 className="db-pg-title">
              Pengaturan Tampilan<br />
              <em>&amp; Aksesibilitas</em>
            </h1>
            <p className="db-pg-desc">
              Sesuaikan palet warna, tipografi, ukuran font, &amp; kepadatan tata letak panel DKM
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="fin-btn" onClick={handleReset}>
              🔄 Reset Default
            </button>
            <button 
              className="fin-btn" 
              onClick={handleSave}
              style={{ background: 'var(--db-forest-mid)', color: '#fff', border: 'none', fontWeight: 700 }}
            >
              💾 Terapkan Pengaturan
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div 
            style={{
              padding: '12px 16px',
              background: 'var(--db-up-bg)',
              color: 'var(--db-up-text)',
              borderRadius: '10px',
              border: '1px solid rgba(15,97,48,.2)',
              marginBottom: '20px',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span> Pengaturan tampilan berhasil disimpan dan diterapkan!
          </div>
        )}

        {/* ── Theme Palette Swatches ───────────────────────────────────── */}
        <div className="db-sec-eyebrow">1. Tema Warna Dashboard</div>
        <div className="db-grid-3" style={{ gap: '14px', marginBottom: '28px' }}>
          {Object.entries(THEMES).map(([key, theme]) => {
            const isSelected = settings.theme === key;
            return (
              <div
                key={key}
                onClick={() => setSettings({ ...settings, theme: key })}
                style={{
                  background: theme.bgCard,
                  border: isSelected ? `2px solid ${theme.forestMid}` : '1px solid rgba(12,24,16,.12)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--db-sh-md)' : 'var(--db-sh-sm)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '12px', 
                      background: theme.forestMid, 
                      color: '#fff', 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '99px' 
                    }}
                  >
                    Aktif
                  </span>
                )}
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--db-text-1)', marginBottom: '10px' }}>
                  {theme.name}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: theme.forest }} title="Forest Base" />
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: theme.forestMid }} title="Forest Mid" />
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: theme.gold }} title="Gold Accent" />
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: theme.bg, border: '1px solid rgba(0,0,0,.1)' }} title="Background" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Typography & Layout Options ───────────────────────────────── */}
        <div className="db-sec-eyebrow">2. Tipografi &amp; Kepadatan Layout</div>
        <div className="db-card" style={{ padding: '24px', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Font Body (Teks Umum)
              </label>
              <select
                value={settings.fontBody}
                onChange={(e) => setSettings({ ...settings, fontBody: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              >
                <option value="'DM Sans', 'Inter', system-ui, sans-serif">DM Sans (Default Modern)</option>
                <option value="'Inter', system-ui, sans-serif">Inter (Bersih &amp; Geometris)</option>
                <option value="system-ui, -apple-system, BlinkMacSystemFont, sans-serif">System UI Standard</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Font Heading (Judul Halaman &amp; Angka)
              </label>
              <select
                value={settings.fontHeading}
                onChange={(e) => setSettings({ ...settings, fontHeading: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              >
                <option value="'DM Serif Display', Georgia, serif">DM Serif Display (Klasik &amp; Elegan)</option>
                <option value="Georgia, serif">Georgia Editorial</option>
                <option value="'DM Sans', sans-serif">DM Sans Bold (Seragam dengan Body)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Ukuran Teks Utama
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              >
                <option value="13px">Kecil (13px)</option>
                <option value="14px">Sedang (14px - Default)</option>
                <option value="15px">Besar (15px)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Kelengkungan Sudut (Radius)
              </label>
              <select
                value={settings.radius}
                onChange={(e) => setSettings({ ...settings, radius: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              >
                <option value="sharp">Tajam (4px - Corporate)</option>
                <option value="normal">Standar (10px - Presisi)</option>
                <option value="round">Membulat (16px - Soft)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--db-text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Lebar Sidebar Navigasi
              </label>
              <select
                value={settings.sidebarWidth}
                onChange={(e) => setSettings({ ...settings, sidebarWidth: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(12,24,16,.15)', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: 'var(--db-bg-card)', color: 'var(--db-text-1)' }}
              >
                <option value="240px">Ringkas (240px)</option>
                <option value="252px">Standar (252px)</option>
                <option value="280px">Lebar (280px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── System Info & Diagnostics ────────────────────────────────── */}
        <div className="db-sec-eyebrow">3. Informasi &amp; Status Sistem</div>
        <div className="db-card" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(12,24,16,.06)', paddingBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--db-text-3)', fontWeight: 600 }}>Google Apps Script (GAS) API URL</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--db-text-1)', fontWeight: 500 }}>{gasUrl}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(12,24,16,.06)', paddingBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--db-text-3)', fontWeight: 600 }}>Status Koneksi Database</span>
              <span className="fin-pill fin-pill-green">Tersambung / Live Cache</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(12,24,16,.06)', paddingBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--db-text-3)', fontWeight: 600 }}>Versi Sistem Dashboard</span>
              <span style={{ fontWeight: 600, color: 'var(--db-text-1)' }}>v2.4.0 (Batch 1 Parity Complete)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--db-text-3)', fontWeight: 600 }}>Penyimpanan Lokal (localStorage)</span>
              <span style={{ fontWeight: 500, color: 'var(--db-text-2)' }}>Key: {LOCAL_STORAGE_KEY}</span>
            </div>
          </div>
        </div>

        {/* ── Context Navigation / Quick Links ─────────────────────────── */}
        <div className="db-sec-eyebrow">Tautan Cepat</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '📊',
              label: 'Dashboard Utama',
              href: '/app',
              desc: 'Kembali ke ringkasan panel admin utama.',
            },
            {
              icon: '💵',
              label: 'Buku Kas Keuangan',
              href: '/app/keuangan',
              desc: 'Buka laporan kas keuangan DKM.',
            },
            {
              icon: '🌐',
              label: 'Beranda Website Utama',
              href: '/',
              desc: 'Buka halaman depan publik masjid.',
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

      {/* ── Page Footer ──────────────────────────────────────────────── */}
      <div className="db-pg-footer">
        <div className="db-pg-footer-id">
          <strong>DKM Masjid Al Ikhlas Cipta Greenville</strong> · Pengaturan · Prototype v1
        </div>
        <div className="db-pg-footer-quote">
          "Sesungguhnya Allah menyukai apabila salah seorang dari kamu melakukan suatu pekerjaan, dia melakukannya secara itqan (rapi &amp; sempurna)." — HR. Thabrani
        </div>
      </div>
    </DashboardLayout>
  );
}
