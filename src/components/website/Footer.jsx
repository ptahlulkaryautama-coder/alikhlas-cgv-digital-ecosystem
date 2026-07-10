import Container from '../common/Container.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container className="footer-grid">
        <div>
          <span className="footer-arabic">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</span>
          <strong>Masjid Al Ikhlas</strong>
          <p>
            Rumah ibadah, ilmu, keluarga, pelayanan sosial, dan amanah warga Cipta Greenville
            Batam.
          </p>
        </div>
        <div className="footer-links">
          <div><strong>Ibadah</strong><a href="#">Jadwal Salat</a><a href="#">Jumat</a></div>
          <div><strong>Program</strong><a href="#program">TPA</a><a href="#program">Kajian</a></div>
          <div><strong>Amanah</strong><a href="#donasi">Donasi</a><a href="#transparansi">Transparansi</a></div>
          <div><strong>Kontak</strong><a href="https://wa.me/6281375410997">WhatsApp</a><a href="https://maps.google.com/?q=Cipta%20Greenville%20Tembesi%20Batam">Lokasi</a></div>
        </div>
      </Container>
      <Container className="footer-bottom">
        © 2026 Masjid Al Ikhlas Cipta Greenville Batam. Dibangun untuk ibadah, ilmu, keluarga,
        dan amanah.
      </Container>
    </footer>
  );
}
