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

export default function DashboardLayout({ children, title, subtitle, activeId }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
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
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8,25,18,.45)',
              zIndex: 99,
            }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <Sidebar
          activeId={activeId}
          isMobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="db-main">
          {/* Bismillah strip */}
          <div className="db-bismillah" aria-hidden="true">
            <span className="db-bismillah-ornament" />
            <span lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="db-bismillah-ornament r" />
          </div>

          <Topbar
            title={title}
            subtitle={subtitle}
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
