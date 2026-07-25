import Container from '../common/Container.jsx';

export default function FinanceSummary({ isLoading, summary }) {
  const safeStats = [
    { 
      label: 'Periode Peninjauan', 
      value: 'Mei – Juni 2026', 
      helper: 'Tahap rekonsiliasi data kas' 
    },
    { 
      label: 'Status Laporan', 
      value: 'Dalam verifikasi', 
      helper: 'Pemeriksaan buku kas & bank',
      featured: true 
    },
    { 
      label: 'Rekening donasi', 
      value: 'BSI 1500600069', 
      helper: 'Kanal donasi DKM (Bukan buku kas)' 
    },
    { 
      label: 'Program Keumatan', 
      value: 'Aktif Berjalan', 
      helper: summary?.activeCampaign ?? 'Operasional & TPQ' 
    },
  ];

  return (
    <section className="transparency-summary-section" aria-label="Status verifikasi keuangan Mei-Juni 2026">
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9a55a', textTransform: 'uppercase', letterSpacing: '0.14em', border: '1px solid rgba(201, 165, 90, 0.3)', borderRadius: '20px', padding: '6px 16px', background: 'rgba(201, 165, 90, 0.04)', display: 'inline-block' }}>
            Status Laporan Kas · Dalam verifikasi
          </span>
          <p style={{ fontSize: '13px', color: '#6b7f74', marginTop: '10px', marginBottom: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Ringkasan keuangan Mei–Juni 2026 sedang diperiksa bersama Bendahara DKM. Angka akan dipublikasikan setelah sumber laporan resmi ditetapkan.
          </p>
        </div>
        <div className="finance-summary-grid">
          {safeStats.map((stat) => (
            <article
              className={`finance-stat-card ${stat.featured ? 'is-featured' : ''}`}
              key={stat.label}
            >
              <p>{stat.label}</p>
              <strong>{isLoading ? 'Memuat...' : stat.value}</strong>
              <span>{stat.helper}</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
