/**
 * DashboardLayout.jsx — Shell layout wrapper for the DKM dashboard
 *
 * Composes:
 *   - Prototype banner (always visible)
 *   - Fixed sidebar (Sidebar.jsx)
 *   - Main area: bismillah strip + sticky topbar + page content slot
 *
 * Handles mobile sidebar toggle state.
 */

import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import '../../styles/dashboardPremium.css';

export default function DashboardLayout({ children, title, subtitle, activeId, period }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <a className="db-skip-link" href="#dashboard-main-content">Lewati ke konten utama</a>
      {/* ── Prototype warning banner ─────────────────────────────────── */}
      <div className="db-proto-banner" role="alert" aria-live="polite">
        <span className="db-proto-dot" aria-hidden="true" />
        Prototype Internal — belum untuk produksi
        <span className="db-proto-dot" aria-hidden="true" />
      </div>

      {/* ── Dashboard root ────────────────────────────────────────────── */}
      <div className="dashboard-root has-proto-banner">
        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            type="button"
            className="db-mobile-scrim"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu navigasi"
          />
        )}

        <Sidebar
          activeId={activeId}
          isMobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="db-main" id="dashboard-main-content" tabIndex="-1">
          {/* Bismillah strip */}
          <div className="db-bismillah" aria-hidden="true">
            <span className="db-bismillah-ornament" />
            <span lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="db-bismillah-ornament r" />
          </div>

          <Topbar
            title={title}
            subtitle={subtitle}
            period={period}
            onMenuToggle={() => setMobileOpen((v) => !v)}
          />

          <div className="db-page">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
