import Container from '../common/Container.jsx';

const pillars = [
  {
    id: 'ibadah',
    title: 'Salat 5 Waktu & Kajian',
    desc: 'Salat berjamaah tepat waktu, pengajian kitab ba\'da Maghrib & Subuh, serta majelis tadabur keluarga.',
    badge: 'Maghrib & Subuh',
    icon: 'mosque',
    accentColor: '#174c38',
  },
  {
    id: 'tpq',
    title: 'Pendidikan TPQ Santri',
    desc: 'Pembinaan bacaan Al-Qur\'an, tajwid, hafalan surah pendek, serta penanaman adab harian santri.',
    badge: '4 Kelas · Santri CGV',
    icon: 'book',
    accentColor: '#c9a55a',
  },
  {
    id: 'transparansi',
    title: 'Amanah Transparansi Kas',
    desc: 'Pengelolaan dana infaq, sedekah, dan kas operasional masjid dilaporkan terbuka untuk warga.',
    badge: 'Laporan Real-Time',
    icon: 'shield',
    accentColor: '#1a7a50',
  },
  {
    id: 'sosial',
    title: 'Khidmah & Sedekah Berkah',
    desc: 'Program Sedekah Jumat gratis, tanggap sosial perumahan Cipta Greenville, dan khidmah warga.',
    badge: 'Jumat Berkah',
    icon: 'heart',
    accentColor: '#8b5e34',
  },
];

function PillarIcon({ name }) {
  const icons = {
    mosque: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg" aria-hidden="true">
        <path d="M12 2L15 6H9L12 2Z" />
        <path d="M12 6V9" />
        <path d="M4 22V11C4 8.5 7.5 7 12 7C16.5 7 20 8.5 20 11V22" />
        <path d="M9 22V16C9 14.3 10.3 13 12 13C13.7 13 15 14.3 15 16V22" />
        <line x1="2" y1="22" x2="22" y2="22" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <line x1="12" y1="6" x2="16" y2="6" />
        <line x1="12" y1="10" x2="16" y2="10" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function JamaahGateway() {
  return (
    <section className="jamaah-pillars-section" aria-labelledby="jamaah-pillars-title">
      <Container size="xl">
        <div className="pillars-header-block">
          <p className="label">Khidmah &amp; Nilai Utama</p>
          <h2 id="jamaah-pillars-title" className="section-title">
            Pusat Ibadah, Ilmu &amp; Amanah Warga
          </h2>
          <p className="section-copy">
            Masjid Al Ikhlas hadir melayani jamaah perumahan Cipta Greenville melalui empat pilar khidmah utama:
          </p>
        </div>

        <div className="pillars-feature-grid">
          {pillars.map((item) => (
            <div className="pillar-feature-card" key={item.id} style={{ '--accent-color': item.accentColor }}>
              <div className="pillar-feature-top">
                <span className="pillar-feature-icon">
                  <PillarIcon name={item.icon} />
                </span>
                <span className="pillar-feature-badge">{item.badge}</span>
              </div>
              <h3 className="pillar-feature-title">{item.title}</h3>
              <p className="pillar-feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
