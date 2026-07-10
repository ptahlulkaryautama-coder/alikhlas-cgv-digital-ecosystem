import { useState } from 'react';
import logoUrl from '../../assets/official-logo.png';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const defaultNavItems = [
  { label: 'Program', href: '#program' },
  { label: 'Transparansi', href: '#transparansi' },
  { label: 'Donasi', href: '#donasi' },
  { label: 'Kontak', href: '#kontak' },
];

export default function Header({ navItems = defaultNavItems, ctaHref = '#donasi' }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <Container as="nav" size="xl" className="site-nav" aria-label="Navigasi utama">
        <a className="site-brand focus-ring" href="/" aria-label="Masjid Al Ikhlas Beranda">
          <span className="site-brand-logo">
            <img src={logoUrl} alt="Logo resmi Masjid Al Ikhlas" />
          </span>
          <span className="site-brand-text">
            <strong>Masjid Al Ikhlas</strong>
            <small>Cipta Greenville Batam</small>
          </span>
        </a>

        <div className="site-nav-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
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

      <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} id="mobile-menu">
        <div className="mobile-menu-card">
          <span className="mobile-brand-logo">
            <img src={logoUrl} alt="Logo resmi Masjid Al Ikhlas" />
          </span>
          <div>
            <strong>Masjid Al Ikhlas</strong>
            <small>Cipta Greenville Batam</small>
          </div>
        </div>

        <nav className="mobile-menu-links" aria-label="Navigasi mobile">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>

        <Button href={ctaHref} variant="gold" className="mobile-menu-cta" onClick={closeMenu}>
          Dukung Masjid
        </Button>
      </div>
    </header>
  );
}
