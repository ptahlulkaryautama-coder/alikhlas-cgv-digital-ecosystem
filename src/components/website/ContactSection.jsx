import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function ContactSection() {
  return (
    <section id="kontak" className="contact-section" aria-labelledby="contact-title">
      <Container className="contact-grid">
        <div className="section-kicker-block">
          <p className="label">Lokasi & Kontak</p>
          <h2 id="contact-title" className="section-title">Datang, bertanya, atau ikut menghidupkan.</h2>
          <p className="section-copy">
            Masjid Al Ikhlas berada di Cipta Greenville, Tembesi, Batam. Hubungi DKM untuk
            jadwal, kegiatan, donasi, pendidikan, atau kerja sama.
          </p>
          <div className="contact-actions">
            <Button href="https://maps.google.com/?q=Cipta%20Greenville%20Tembesi%20Batam" variant="gold">
              Buka Google Maps
            </Button>
            <Button href="https://wa.me/6281375410997" variant="glass">
              WhatsApp DKM
            </Button>
          </div>
          <a
            className="social-link"
            href="https://www.facebook.com/masjidalikhlasCGV"
            target="_blank"
            rel="noreferrer"
          >
            Ikuti kajian live & dokumentasi di Facebook
          </a>
          <div className="map-frame">
            <iframe
              src="https://www.google.com/maps?q=Cipta%20Greenville%20Tembesi%20Batam&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta lokasi Masjid Al Ikhlas Cipta Greenville Batam"
            />
          </div>
        </div>
        <form className="contact-form" aria-label="Form kontak">
          <label>Nama<input placeholder="Nama lengkap" /></label>
          <label>WhatsApp<input placeholder="08xxxx" /></label>
          <label>
            Keperluan
            <select defaultValue="Informasi kegiatan">
              <option>Informasi kegiatan</option>
              <option>Donasi</option>
              <option>Pendidikan</option>
              <option>Relawan</option>
            </select>
          </label>
          <label>Pesan<textarea rows="4" placeholder="Tulis pesan Anda" /></label>
          <button type="button">Kirim Pesan</button>
        </form>
      </Container>
    </section>
  );
}
