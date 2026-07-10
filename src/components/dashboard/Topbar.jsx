/**
 * Topbar.jsx — Dashboard sticky top navigation bar
 */

export default function Topbar({ title = 'Dashboard', subtitle, onMenuToggle }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-breadcrumb">
        {/* Mobile hamburger */}
        <button
          className="db-tb-btn"
          style={{ display: 'none', padding: '6px 8px' }}
          onClick={onMenuToggle}
          aria-label="Buka menu navigasi"
          id="db-hamburger"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <span className="db-tb-page">{title}</span>
        <span className="db-tb-sep">/</span>
        <span className="db-tb-sub">{subtitle}</span>
      </div>

      <div className="db-topbar-actions">
        {/* Period badge */}
        <button className="db-tb-btn" disabled style={{ cursor: 'default' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1" y="2.5" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 2.5V1.5M8.5 2.5V1.5M1 5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          Jun 2026
        </button>
      </div>
    </header>
  );
}
