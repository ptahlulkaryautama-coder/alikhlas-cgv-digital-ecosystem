/**
 * NotFound.jsx — 404 catch-all page
 *
 * Displayed when the React Router cannot match any registered route.
 * Matches the forest/gold/cream visual identity used across the site.
 */

import { useEffect } from 'react';
import logoUrl from '../assets/official-logo.png';
import '../styles/notfound.css';

export default function NotFound() {
  // Set document title for this error page
  useEffect(() => {
    const prev = document.title;
    document.title = 'Halaman Tidak Ditemukan — Masjid Al Ikhlas CGV';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="notfound-page" role="main">
      <div className="notfound-card">
        {/* Brand logo */}
        <img
          src={logoUrl}
          alt="Logo Masjid Al Ikhlas"
          className="notfound-logo"
          width="56"
          height="56"
        />

        {/* Arabic / decorative label */}
        <p className="notfound-arabic" lang="ar" aria-hidden="true">
          ٤٠٤
        </p>

        <h1 className="notfound-heading">Halaman Tidak Ditemukan</h1>

        <p className="notfound-body">
          Halaman yang Anda cari tidak tersedia atau alamatnya telah berubah.
        </p>

        <div className="notfound-actions">
          <a href="/" className="button button-gold notfound-btn-home">
            Kembali ke Beranda
          </a>
          <a href="/transparansi" className="button button-outline notfound-btn-alt">
            Lihat Transparansi
          </a>
        </div>
      </div>
    </div>
  );
}
