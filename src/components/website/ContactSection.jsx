import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function ContactSection({ hideCta }) {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    keperluan: 'Informasi kegiatan',
    pesan: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.pesan.trim()) {
      alert('Mohon isi Nama dan Pesan Anda.');
      return;
    }

    const text = `Assalamu'alaikum Pengurus DKM Masjid Al Ikhlas,\n\nSaya ingin menyampaikan pesan/pertanyaan:\n• Nama: ${formData.nama}\n• No. WA: ${formData.whatsapp || '-'}\n• Keperluan: ${formData.keperluan}\n\nPesan:\n${formData.pesan}`;
    const waUrl = `https://wa.me/6281375410997?text=${encodeURIComponent(text)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <section id="kontak" className="contact-section" aria-labelledby="contact-title">
      <Container className="contact-grid">
        <div className="section-kicker-block">
          <p className="label">Lokasi &amp; Kontak</p>
          <h2 id="contact-title" className="section-title">Alamat Masjid dan Kontak Pengurus</h2>
          <p className="section-copy">
            Masjid Al Ikhlas berada di perumahan Cipta Greenville, Tembesi, Batam. Warga bisa menghubungi pengurus DKM untuk jadwal kajian, kegiatan TPQ, agenda masjid, penggunaan fasilitas, atau informasi donasi.
          </p>

          <div className="contact-actions">
            <Button href="https://maps.google.com/?q=Cipta%20Greenville%20Tembesi%20Batam" variant="gold">
              Buka Lokasi
            </Button>
            <Button href="https://wa.me/6281375410997" variant="outline-light">
              Hubungi Pengurus
            </Button>
          </div>


          <a
            className="social-link"
            href="https://www.facebook.com/masjidalikhlasCGV"
            target="_blank"
            rel="noreferrer"
          >
            Ikuti kajian live &amp; dokumentasi di Facebook
          </a>
          {hideCta && (
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps?q=Cipta%20Greenville%20Tembesi%20Batam&amp;output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta lokasi Masjid Al Ikhlas Cipta Greenville Batam"
              />
            </div>
          )}
        </div>
        {hideCta ? (
          <form className="contact-form" aria-label="Form kontak WhatsApp pengurus" onSubmit={handleSubmit}>
            <div className="form-header-info">
              <h3>Kirim Pesan ke Pengurus</h3>
              <p className="form-helper-note">
                Pesan Anda disiapkan dan diteruskan melalui WhatsApp pengurus DKM.
              </p>
            </div>
            {submitted && (
              <div style={{ padding: '12px 16px', background: 'rgba(201, 165, 90, 0.15)', border: '1px solid rgba(201, 165, 90, 0.4)', borderRadius: '8px', color: '#0c2b1d', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 600 }}>
                ✓ Pesan Anda disiapkan &amp; diteruskan melalui WhatsApp DKM.
              </div>
            )}
            <label>
              Nama <span style={{ color: '#e53935' }}>*</span>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama lengkap Anda"
                required
              />
            </label>
            <label>
              WhatsApp
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </label>
            <label>
              Keperluan
              <select name="keperluan" value={formData.keperluan} onChange={handleChange}>
                <option value="Informasi kegiatan &amp; jadwal kajian">Jadwal kajian &amp; kegiatan</option>
                <option value="Kegiatan TPQ &amp; pendidikan anak">Kegiatan TPQ &amp; pendidikan</option>
                <option value="Agenda masjid &amp; khidmat">Agenda masjid</option>
                <option value="Penggunaan fasilitas masjid">Penggunaan fasilitas</option>
                <option value="Informasi donasi &amp; infaq">Informasi donasi &amp; infaq</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </label>
            <label>
              Pesan <span style={{ color: '#e53935' }}>*</span>
              <textarea
                name="pesan"
                rows="4"
                value={formData.pesan}
                onChange={handleChange}
                placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                required
              />
            </label>
            <button type="submit" className="contact-form-submit">Kirim Pesan</button>
          </form>
        ) : (
          <div className="contact-section-footer">
            <Button href="/kontak" variant="gold">
              Formulir Kontak DKM
            </Button>
          </div>
        )}

      </Container>
    </section>
  );
}

