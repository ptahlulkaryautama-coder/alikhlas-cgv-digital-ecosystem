import { donationPrograms } from '../../data/siteContent.js';
import Container from '../common/Container.jsx';
import Button from '../common/Button.jsx';

const donationIcons = {
  'Operasional Masjid': (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 22V11a5 5 0 0 1 10 0v11" />
      <path d="M13 22v-7a3 3 0 0 1 6 0v7" />
      <path d="M12 2v4" />
      <path d="M10 4h4" />
    </svg>
  ),
  'Pendidikan Anak': (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  'Fasilitas Jamaah': (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 17h6M12 10v4M10 12h4" />
    </svg>
  ),
  'Sosial Warga': (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

export default function DonationSection({ hideCta }) {
  return (
    <section id="donasi" className="donation-section" aria-labelledby="donation-title">
      <Container>
        <div className="section-kicker-block wide">
          <p className="label">Kanal Donasi dan Infaq</p>
          <h2 id="donation-title" className="section-title">
            Penggunaan Infaq Jamaah
          </h2>
          <p className="section-copy">
            Setiap rupiah digunakan untuk kebutuhan harian masjid: dari operasional shalat, guru TPQ, sampai peralatan dan kebersihan.
          </p>
        </div>
        <div className="donation-grid-compact" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '800px', marginInline: 'auto' }}>
          {donationPrograms.map((item) => (
            <div className="donation-row-compact" key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: 'rgba(12, 43, 29, 0.03)', borderRadius: '12px', border: '1px solid rgba(12, 43, 29, 0.08)' }}>
              <span className="card-icon-mini" aria-hidden="true" style={{ color: '#0c2b1d', flexShrink: 0, marginTop: '2px' }}>
                {donationIcons[item.title] || item.title.slice(0, 1)}
              </span>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#0c2b1d' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#4a5d53', lineHeight: 1.5 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {!hideCta && (
          <div className="donation-section-footer">
            <Button href="/donasi" variant="gold">
              Informasi Donasi
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

