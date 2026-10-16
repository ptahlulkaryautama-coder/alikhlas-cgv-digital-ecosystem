import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoUrl from '../../assets/official-logo.png';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';
import LiveKajianBanner from './LiveKajianBanner.jsx';
import '../../styles/liveKajian.css';

const defaultNavItems = [
  { label: 'Beranda', href: '/', icon: '🏠', desc: 'Halaman Utama Portal' },
  { label: 'Program', href: '/program', icon: '🕌', desc: 'Kajian & Kegiatan Umat' },
  { label: 'Agenda', href: '/agenda', icon: '📅', desc: 'Jadwal Acara & Sholat' },
  { label: 'TPQ', href: '/tpq', icon: '📖', desc: "Pendidikan Al-Qur'an Santri" },
  { label: 'Kabar', href: '/kabar', icon: '📰', desc: 'Warta & Pengumuman DKM' },
  { label: 'Transparansi', href: '/transparansi', icon: '📊', desc: 'Laporan Kas Terbuka & JPU' },
  { label: 'Donasi', href: '/donasi', icon: '💛', desc: 'Infaq Digital & QRIS' },
  { label: 'Kontak', href: '/kontak', icon: '📞', desc: 'Alamat & Hubungi DKM' },
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

  // Desktop navigation excludes Home (logo already points to /)
  const desktopNavItems = navItems.filter((item) => item.href !== '/');

  return (
    <>
      <LiveKajianBanner />
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
            {desktopNavItems.map((item) => {
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="mobile-brand-logo">
                <img src={logoUrl} alt="Logo resmi Masjid Al Ikhlas" />
              </span>
              <div>
                <strong>Masjid Al Ikhlas CGV</strong>
                <small>Cipta Greenville · Batam</small>
              </div>
            </div>
            <button
              type="button"
              className="mobile-menu-close-btn focus-ring"
              onClick={closeMenu}
              aria-label="Tutup menu navigasi"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="mobile-menu-section-label">
            <span>Jelajah Topik &amp; Layanan</span>
          </div>

          <nav className="mobile-menu-links" aria-label="Navigasi mobile">
            {navItems.map((item) => {
              const isActive = item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);

              if (item.href.startsWith('http')) {
                return (
                  <a key={item.href} href={item.href} className={`mobile-nav-card ${isActive ? 'is-active' : ''}`} onClick={closeMenu}>
                    <span className="mobile-nav-card-icon" aria-hidden="true">{item.icon || '📌'}</span>
                    <div className="mobile-nav-card-content">
                      <div className="mobile-nav-card-title">{item.label}</div>
                      {item.desc && <div className="mobile-nav-card-desc">{item.desc}</div>}
                    </div>
                  </a>
                );
              }
              return (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={`mobile-nav-card ${isActive ? 'is-active' : ''}`} 
                  aria-current={isActive ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  <span className="mobile-nav-card-icon" aria-hidden="true">{item.icon || '📌'}</span>
                  <div className="mobile-nav-card-content">
                    <div className="mobile-nav-card-title">
                      <span>{item.label}</span>
                      {isActive && <span className="mobile-nav-card-badge">Aktif</span>}
                    </div>
                    {item.desc && <div className="mobile-nav-card-desc">{item.desc}</div>}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mobile-menu-footer-actions">
            <a 
              href="https://wa.me/6281375410997?text=Assalamu'alaikum%20DKM%20Masjid%20Al%20Ikhlas%20CGV" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-menu-wa-btn"
              onClick={closeMenu}
            >
              <span>💬</span> Hubungi Pengurus via WhatsApp
            </a>
            <Button href={ctaHref} variant="gold" className="mobile-menu-cta" onClick={closeMenu}>
              💛 Dukung Masjid &amp; Infaq
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
