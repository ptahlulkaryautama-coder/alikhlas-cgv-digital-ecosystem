/**
 * Sidebar.jsx — DKM Dashboard sidebar navigation
 *
 * Fixed left sidebar with:
 * - Mosque brand + DKM badge
 * - Section-grouped nav items with routing
 *   Active now: overview (/app), keuangan (/app/keuangan)
 *   Placeholder: program, agenda, tpq, donasi
 * - User area with logout button
 *
 * Logout uses the existing auth.js logout() helper from Phase 2.
 */

import { useNavigate } from 'react-router-dom';
import logoUrl from '../../assets/official-logo.png';
import { logout } from '../../services/auth.js';

// Modules that have been fully implemented and should be navigable
const ACTIVE_MODULES = new Set(['overview', 'keuangan', 'program', 'agenda', 'donasi']);

const NAV_GROUPS = [
  {
    label: 'Utama',
    items: [
      {
        id: 'overview',
        label: 'Dashboard',
        route: '/app',
        icon: (
          <svg className="db-sb-ico" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".7" />
            <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".5" />
            <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" />
            <rect x="9" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".3" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Pengelolaan',
    items: [
      {
        id: 'keuangan',
        label: 'Keuangan',
        route: '/app/keuangan',
        icon: (
          <svg className="db-sb-ico" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 4V3M11 4V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'program',
        label: 'Program & Kegiatan',
        route: '/app/program',
        icon: (
          <svg className="db-sb-ico" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.5 3V2M10.5 3V2M2 6.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: 'agenda',
        label: 'Agenda & Kalender',
        route: '/app/agenda',
        icon: (
          <svg className="db-sb-ico" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.5 3V2M10.5 3V2M2 6.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="5.5" cy="9.3" r="1" fill="currentColor" />
            <circle cx="8" cy="9.3" r="1" fill="currentColor" />
            <circle cx="10.5" cy="9.3" r="1" fill="currentColor" />
          </svg>
        ),
      },
      {
        id: 'tpq',
        label: 'TPQ & Pendidikan',
        pill: 'Belum aktif',
        icon: (
          <svg className="db-sb-ico" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L1.5 5v4.5C1.5 12.5 4.5 14.5 8 15.5c3.5-1 6.5-3 6.5-6V5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        id: 'donasi',
        label: 'Donasi & Infaq',
        route: '/app/donasi',
        icon: (
          <svg className="db-sb-ico" viewBox="0 0 16 16" fill="none">
            <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM8 4.5V6M7 5.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M3 11.5c1.2.9 2.9 1.5 5 1.5s3.8-.6 5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ activeId = 'overview', isMobileOpen, onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function handleNavClick(item) {
    if (!ACTIVE_MODULES.has(item.id)) return;
    if (onClose) onClose();
    if (item.route) navigate(item.route);
  }

  return (
    <aside className={`db-sidebar${isMobileOpen ? ' is-open' : ''}`} aria-label="Navigasi Dashboard DKM">
      {/* Brand */}
      <div className="db-sb-brand">
        <div className="db-sb-logo">
          <img src={logoUrl} alt="Logo Masjid Al Ikhlas" />
        </div>
        <div>
          <div className="db-sb-brand-name">Al Ikhlas CGV</div>
          <div className="db-sb-brand-url">Dashboard Internal</div>
        </div>
        <div className="db-sb-brand-badge" aria-label="Prototype">DKM</div>
      </div>

      {/* Nav groups */}
      <nav className="db-sb-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="db-sb-group-label">{group.label}</div>
            {group.items.map((item) => {
              const isActive = ACTIVE_MODULES.has(item.id);
              return (
                <button
                  key={item.id}
                  className={`db-sb-item${item.id === activeId ? ' active' : ''}`}
                  onClick={() => handleNavClick(item)}
                  aria-current={item.id === activeId ? 'page' : undefined}
                  disabled={!isActive}
                  title={!isActive ? 'Modul ini akan tersedia di fase berikutnya' : undefined}
                >
                  {item.icon}
                  {item.label}
                  {item.pill && <span className="db-sb-pill">{item.pill}</span>}
                </button>
              );
            })}
            <div className="db-sb-divider" />
          </div>
        ))}
      </nav>

      {/* User / logout */}
      <div className="db-sb-footer">
        <div className="db-sb-user">
          <div className="db-sb-avatar" aria-hidden="true">DK</div>
          <div>
            <div className="db-sb-user-name">Admin DKM</div>
            <div className="db-sb-user-role">Prototype Session</div>
          </div>
        </div>

        <button
          className="db-logout-btn"
          onClick={handleLogout}
          type="button"
          aria-label="Keluar dari sesi admin"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M5 11H2.5A1.5 1.5 0 011 9.5v-6A1.5 1.5 0 012.5 2H5M8.5 9.5L12 6.5 8.5 3.5M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
