import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoUrl from '../../assets/official-logo.png';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';
import LiveKajianBanner from './LiveKajianBanner.jsx';

const defaultNavItems = [
  { label: 'Live', href: '/live' },
  { label: 'Program', href: '/program' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Kabar', href: '/kabar' },
  { label: 'Transparansi', href: '/transparansi' },
  { label: 'Donasi', href: '/donasi' },
  { label: 'Kontak', href: '/kontak' },
];

export default function Header({ navItems = defaultNavItems, ctaHref = '/donasi' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <Container as="nav" size="xl" className="site-nav" aria-label="Navigasi utama">
          <Link className="site-brand focus-ring" to="/" aria-label="Masjid Al Ikhlas Beranda">
            <span className="site-brand-logo">
              <img src={logoUrl} alt="Logo resmi Masjid Al Ikhlas" />
            </span>
            <span className="site-brand-text">
              <strong>Masjid Al Ikhlas</strong>
              <small>Cipta Greenville Batam</small>
            </span>
          </Link>

          <div className="site-nav-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              if (item.href.startsWith('http')) {
                return (
                  <a key={item.href} href={item.href} className={isActive ? 'active' : ''}>
                    {item.label}
                  </a>
                );
              }
              return (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={isActive ? 'active' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Button href={ctaHref} variant="gold" className="site-nav-cta">
            Dukung Masjid
          </Button>

          <button
            className="menu-toggle focus-ring"
            type="button"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        </Container>

        <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} id="mobile-menu" aria-hidden={!isOpen}>
          <div className="mobile-menu-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="mobile-brand-logo">
                <img src={logoUrl} alt="Logo resmi Masjid Al Ikhlas" />
              </span>
              <div>
                <strong>Masjid Al Ikhlas</strong>
                <small>Cipta Greenville Batam</small>
              </div>
            </div>
            <button
              type="button"
              className="mobile-menu-close-btn focus-ring"
              onClick={closeMenu}
              aria-label="Tutup menu navigasi"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu-links" aria-label="Navigasi mobile">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              if (item.href.startsWith('http')) {
                return (
                  <a key={item.href} href={item.href} className={isActive ? 'active' : ''} onClick={closeMenu}>
                    {item.label}
                  </a>
                );
              }
              return (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={isActive ? 'active' : ''} 
                  aria-current={isActive ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button href={ctaHref} variant="gold" className="mobile-menu-cta" onClick={closeMenu}>
            Dukung Masjid
          </Button>
        </div>
      </header>

      {/* Conditional Live Announcement Banner directly below header */}
      <LiveKajianBanner />
    </>
  );
}
