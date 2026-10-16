import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileBottomNav() {
  const location = useLocation();
  const { pathname } = location;

  // Do not show inside admin console or login view
  if (pathname.startsWith('/app') || pathname === '/login') {
    return null;
  }

  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      to: '/',
      isActive: pathname === '/',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'program',
      label: pathname.startsWith('/agenda') ? 'Agenda' : 'Program',
      to: pathname.startsWith('/agenda') ? '/agenda' : '/program',
      isActive: pathname === '/program' || pathname.startsWith('/agenda'),
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 'transparansi',
      label: 'Transparansi',
      to: '/transparansi',
      isActive: pathname.startsWith('/transparansi'),
      icon: (
        <svg viewBox="0 0 24 24">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: 'tpq',
      label: 'TPQ',
      to: '/tpq',
      isActive: pathname.startsWith('/tpq'),
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'donasi',
      label: 'Donasi',
      to: '/donasi',
      isActive: pathname.startsWith('/donasi'),
      isSpecial: true,
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  const handleTabClick = (isActive) => {
    if (isActive) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi Bawah Mobile">
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.to}
            className={`mobile-nav-tab ${tab.isActive ? 'is-active' : ''} ${tab.isSpecial ? 'mobile-nav-tab-special' : ''}`}
            aria-current={tab.isActive ? 'page' : undefined}
            onClick={() => handleTabClick(tab.isActive)}
          >
            <span className="mobile-nav-tab-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="mobile-nav-tab-label">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
