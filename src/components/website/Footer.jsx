import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container className="footer-grid">
        <div>
          <span className="footer-arabic">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</span>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <strong>Masjid Al Ikhlas CGV</strong>
          </Link>
          <p>
            Rumah ibadah, tempat pengajian, kegiatan belajar TPQ, dan pelayanan sosial 
            bagi warga Perumahan Cipta Greenville, Tembesi, Batam.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Navigasi</strong>
            <Link to="/program">Program Kajian</Link>
            <Link to="/agenda">Agenda Event</Link>
            <Link to="/kabar">Kabar Masjid</Link>
            <Link to="/transparansi">Transparansi</Link>
            <Link to="/donasi">Donasi</Link>
            <Link to="/kontak">Kontak</Link>
          </div>
          <div>
            <strong>Program Utama</strong>
            <Link to="/program">Kajian Kitab</Link>
            <Link to="/program">Bahasa Arab</Link>
            <Link to="/program">Tafsir Quran</Link>
            <Link to="/program">Tahsin Al-Qur'an</Link>
          </div>
          <div>
            <strong>Infaq dan Donasi</strong>
            <Link to="/donasi">Transfer Bank BSI</Link>
            <Link to="/donasi">QRIS Donasi</Link>
            <Link to="/transparansi">Laporan Bulanan</Link>
          </div>
          <div>
            <strong>Kontak dan Lokasi</strong>
            <a href="https://wa.me/6281375410997" target="_blank" rel="noopener noreferrer">WhatsApp Pengurus</a>
            <a href="https://maps.google.com/?q=Cipta%20Greenville%20Tembesi%20Batam" target="_blank" rel="noopener noreferrer">Buka Lokasi</a>
            <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.45)', marginTop: '12px', fontSize: '11px', lineHeight: 1.4 }}>
              Perumahan Cipta Greenville, Blok Townhouse, Tembesi, Batam, Kepri.
            </span>
          </div>

        </div>
      </Container>
      <Container className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <span>
          © {new Date().getFullYear()} DKM Masjid Al Ikhlas Cipta Greenville Batam.
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>
          BSI: 1500600069 · a.n Masjid Al Ikhlas CGV
        </span>
      </Container>
    </footer>
  );
}
