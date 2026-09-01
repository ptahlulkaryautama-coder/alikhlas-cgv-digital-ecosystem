import { useState } from 'react';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function ContactSection({ isHomepage = false }) {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    keperluan: 'Informasi kegiatan dan jadwal kajian',
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

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Masjid+Al+Ikhlas+Cipta+Greenville+Batam";

  return (
    <section id="kontak" className="contact-section" aria-labelledby="contact-title">
      <Container className="contact-grid">
        <div className="section-kicker-block">
          <p className="label">Lokasi dan Kontak</p>
          <h2 id="contact-title" className="section-title">Alamat Masjid &amp; Kontak Pengurus</h2>
          <p className="section-copy">
            Masjid Al Ikhlas berada di perumahan Cipta Greenville, Tembesi, Batam. Pengurus DKM senantiasa terbuka melayani jamaah untuk informasi kegiatan, TPQ, agenda masjid, maupun penggunaan fasilitas.
          </p>

          <div className="location-card" style={{ marginTop: '24px', padding: '24px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-warm)' }}>Masjid Al Ikhlas CGV</strong>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              Perumahan Cipta Greenville, Blok Townhouse<br />
              Kelurahan Tembesi, Kecamatan Sagulung, Batam, Kepulauan Riau
            </p>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', background: 'rgba(201, 165, 90, 0.15)', color: 'var(--color-gold)', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>
                Salat 5 Waktu
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(201, 165, 90, 0.15)', color: 'var(--color-gold)', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>
                Pengajian Rutin
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(201, 165, 90, 0.15)', color: 'var(--color-gold)', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>
                TPQ Al Ikhlas
              </span>
            </div>

            <Button href={googleMapsUrl} variant="gold" target="_blank" rel="noopener noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '6px' }}>
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              Buka Peta Google Maps
            </Button>
          </div>

          <a
            className="social-link"
            href="https://www.youtube.com/@masjidalikhlascgv"
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.75)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Kanal YouTube Official Masjid Al Ikhlas →
          </a>
        </div>

        <form className="contact-form" aria-label="Form kontak WhatsApp pengurus" onSubmit={handleSubmit}>
          <div className="form-header-info">
            <h3>Kirim Pesan ke Pengurus</h3>
            <p className="form-helper-note">
              Pesan akan disiapkan dan diteruskan langsung melalui WhatsApp pengurus DKM.
            </p>
          </div>
          {submitted && (
            <div style={{ padding: '12px 16px', background: 'rgba(201, 165, 90, 0.15)', border: '1px solid rgba(201, 165, 90, 0.4)', borderRadius: '8px', color: '#0c2b1d', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 600 }}>
              ✓ Pesan disiapkan dan diteruskan melalui WhatsApp DKM.
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
            No. WhatsApp
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
              <option value="Informasi kegiatan dan jadwal kajian">Jadwal kajian &amp; kegiatan</option>
              <option value="Kegiatan TPQ dan pendidikan anak">Kegiatan TPQ &amp; pendidikan</option>
              <option value="Agenda masjid dan khidmat">Agenda &amp; kegiatan jamaah</option>
              <option value="Penggunaan fasilitas masjid">Penggunaan fasilitas masjid</option>
              <option value="Informasi donasi dan infaq">Informasi donasi &amp; infaq</option>
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
              placeholder="Tuliskan pesan atau pertanyaan Anda..."
              required
            />
          </label>
          <button type="submit" className="contact-form-submit">
            Kirim via WhatsApp
          </button>
        </form>
      </Container>
    </section>
  );
}

