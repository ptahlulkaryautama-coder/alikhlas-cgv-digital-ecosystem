/**
 * SettingsAdmin.jsx — Protected Pengaturan & Appearance module page
 *
 * Route: /app/pengaturan (protected by ProtectedRoute)
 *
 * Provides:
 * - Theme palette switcher (Default Emerald, Toska Teal, Midnight Navy, Earth Brown, Professional Slate, Soft Sage)
 * - Typography customization (Font family, Base font size, Line height)
 * - Layout density & corner radius controls
 * - Privacy-safe same-origin integration health status
 * - Persistent configuration in localStorage ('dkm_appear_v1')
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import { getAdminIntegrationHealth, getServerAdminSession } from '../services/adminSession.js';
import FinancePermissionAdminPanel from '../components/settings/FinancePermissionAdminPanel.jsx';
import ContentPermissionAdminPanel from '../components/settings/ContentPermissionAdminPanel.jsx';
import ContentProductionReleasePanel from '../components/settings/ContentProductionReleasePanel.jsx';
import OperationalRoleAdminPanel from '../components/settings/OperationalRoleAdminPanel.jsx';
import IntegrationReadinessPanel from '../components/settings/IntegrationReadinessPanel.jsx';
import ProductionReadinessGate from '../components/settings/ProductionReadinessGate.jsx';
import OperatorWorkflowGuide from '../components/settings/OperatorWorkflowGuide.jsx';
import ProjectCompletionPhasesPanel from '../components/settings/ProjectCompletionPhasesPanel.jsx';
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
  const [integrationHealth, setIntegrationHealth] = useState({ status: 'loading' });

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

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    getServerAdminSession({ signal: controller.signal })
      .then(async (session) => {
        const health = await getAdminIntegrationHealth({ signal: controller.signal });
        if (active) setIntegrationHealth({ status: 'ready', session, ...health });
      })
      .catch((error) => {
        if (active) setIntegrationHealth({
          status: error?.status === 401 ? 'signed-out' : 'error',
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
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

  const integrationLabel = integrationHealth.status === 'loading'
    ? 'Memeriksa sesi server…'
    : integrationHealth.status === 'ready'
      ? integrationHealth.readProxyConfigured
        ? 'Proxy baca dikonfigurasi'
        : 'Proxy baca belum dikonfigurasi'
      : 'Integrasi belum diverifikasi';

  const sessionLabel = integrationHealth.status === 'ready' ? 'Aktif' : 'Belum login server';
  const safeModeLabel = integrationHealth.status === 'ready'
    ? 'Kill-switch aktif saat idle'
    : 'Menunggu sesi server';
  const testEnvironmentLabel = integrationHealth.status === 'ready'
    ? integrationHealth.testSheetProvisioned === true
      ? 'Tersedia untuk uji terbatas'
      : integrationHealth.testSheetProvisioned === false
        ? 'Belum diprovision'
        : 'Tidak digunakan untuk modul Supabase'
    : 'Belum diverifikasi';

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
        <div className="db-pg-header settings-page-header">
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

          <div className="settings-actions">
            <button className="fin-btn" onClick={handleReset}>
              🔄 Reset Default
            </button>
            <button 
              className="fin-btn" 
              onClick={handleSave}
              data-variant="primary"
            >
              💾 Terapkan Pengaturan
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="settings-save-notice" role="status">
            <span>✓</span> Pengaturan tampilan berhasil disimpan dan diterapkan!
          </div>
        )}

        {/* ── Theme Palette Swatches ───────────────────────────────────── */}
        <div className="db-sec-eyebrow">1. Tema Warna Dashboard</div>
        <div className="db-grid-3 settings-theme-grid">
          {Object.entries(THEMES).map(([key, theme]) => {
            const isSelected = settings.theme === key;
            return (
              <div
                key={key}
                onClick={() => setSettings({ ...settings, theme: key })}
                className={`settings-theme-card${isSelected ? ' is-selected' : ''}`}
                style={{ '--settings-theme-card': theme.bgCard, '--settings-theme-accent': theme.forestMid }}
              >
                {isSelected && (
                  <span className="settings-theme-active">
                    Aktif
                  </span>
                )}
                <div className="settings-theme-name">
                  {theme.name}
                </div>
                <div className="settings-swatch-row">
                  <div className="settings-swatch" style={{ background: theme.forest }} title="Forest Base" />
                  <div className="settings-swatch" style={{ background: theme.forestMid }} title="Forest Mid" />
                  <div className="settings-swatch" style={{ background: theme.gold }} title="Gold Accent" />
                  <div className="settings-swatch is-background" style={{ background: theme.bg }} title="Background" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Typography & Layout Options ───────────────────────────────── */}
        <div className="db-sec-eyebrow">2. Tipografi &amp; Kepadatan Layout</div>
        <div className="db-card settings-form-card">
          <div className="settings-form-grid settings-form-grid-2">
            <div className="settings-field">
              <label className="settings-label">
                Font Body (Teks Umum)
              </label>
              <select
                value={settings.fontBody}
                onChange={(e) => setSettings({ ...settings, fontBody: e.target.value })}
                className="settings-select"
              >
                <option value="'DM Sans', 'Inter', system-ui, sans-serif">DM Sans (Default Modern)</option>
                <option value="'Inter', system-ui, sans-serif">Inter (Bersih &amp; Geometris)</option>
                <option value="system-ui, -apple-system, BlinkMacSystemFont, sans-serif">System UI Standard</option>
              </select>
            </div>

            <div className="settings-field">
              <label className="settings-label">
                Font Heading (Judul Halaman &amp; Angka)
              </label>
              <select
                value={settings.fontHeading}
                onChange={(e) => setSettings({ ...settings, fontHeading: e.target.value })}
                className="settings-select"
              >
                <option value="'DM Serif Display', Georgia, serif">DM Serif Display (Klasik &amp; Elegan)</option>
                <option value="Georgia, serif">Georgia Editorial</option>
                <option value="'DM Sans', sans-serif">DM Sans Bold (Seragam dengan Body)</option>
              </select>
            </div>
          </div>

          <div className="settings-form-grid settings-form-grid-3">
            <div className="settings-field">
              <label className="settings-label">
                Ukuran Teks Utama
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                className="settings-select"
              >
                <option value="13px">Kecil (13px)</option>
                <option value="14px">Sedang (14px - Default)</option>
                <option value="15px">Besar (15px)</option>
              </select>
            </div>

            <div className="settings-field">
              <label className="settings-label">
                Kelengkungan Sudut (Radius)
              </label>
              <select
                value={settings.radius}
                onChange={(e) => setSettings({ ...settings, radius: e.target.value })}
                className="settings-select"
              >
                <option value="sharp">Tajam (4px - Corporate)</option>
                <option value="normal">Standar (10px - Presisi)</option>
                <option value="round">Membulat (16px - Soft)</option>
              </select>
            </div>

            <div className="settings-field">
              <label className="settings-label">
                Lebar Sidebar Navigasi
              </label>
              <select
                value={settings.sidebarWidth}
                onChange={(e) => setSettings({ ...settings, sidebarWidth: e.target.value })}
                className="settings-select"
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
        <div className="db-card settings-system-card">
          <div className="settings-info-list">
            <div className="settings-info-row">
              <span className="settings-info-label">Prototype navigation gate</span>
              <span className="settings-info-value">Terpisah dari autentikasi server</span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Server session</span>
              <span className="fin-pill">{sessionLabel}</span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Role</span>
              <span className="settings-info-value">{integrationHealth.role ?? '—'}</span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Status Integrasi Data</span>
              <span className="fin-pill">{integrationLabel}</span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Mode aman penulisan</span>
              <span className="settings-info-value is-warning">{safeModeLabel}</span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Lingkungan uji lama</span>
              <span className="settings-info-value">
                {testEnvironmentLabel}
              </span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Mode Lingkungan</span>
              <span className="settings-info-value">
                {integrationHealth.environment ?? 'local'}
              </span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Peta integrasi</span>
              <span className="settings-info-value">Gunakan panel di bawah untuk status Web · Dashboard · TPQ</span>
            </div>

            <div className="settings-info-row">
              <span className="settings-info-label">Gate production</span>
              <span className="settings-info-value">Validasi otomatis sebelum rilis publik</span>
            </div>

            <div className="settings-info-row is-last">
              <span className="settings-info-label">Versi Sistem Dashboard</span>
              <span className="settings-info-value">v2.5.0 (Supabase Integration Control)</span>
            </div>
          </div>
        </div>

        <IntegrationReadinessPanel />
        <ProductionReadinessGate />
        <OperatorWorkflowGuide />
        <ProjectCompletionPhasesPanel />
        <OperationalRoleAdminPanel />
        <FinancePermissionAdminPanel />
        <ContentPermissionAdminPanel />
        <ContentProductionReleasePanel />

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
