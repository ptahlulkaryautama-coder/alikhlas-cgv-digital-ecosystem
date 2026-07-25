import Container from '../common/Container.jsx';

export default function FinanceBreakdown() {
  const steps = [
    {
      step: '01',
      title: 'Pencocokan Buku Kas',
      desc: 'Verifikasi seluruh pencatatan infaq Jumat, donasi khusus, infaq cluster, serta bukti fisik pengeluaran operasional.',
    },
    {
      step: '02',
      title: 'Rekonsiliasi Rekening Bank',
      desc: 'Penyelarasan catatan kas internal dengan mutasi rekening resmi BSI (No. Rek 1500600069) a.n. Masjid Al Ikhlas.',
    },
    {
      step: '03',
      title: 'Penetapan Laporan Resmi',
      desc: 'Penerbitan berita acara penetapan saldo resmi Mei–Juni 2026 yang ditandatangani oleh Bendahara & Ketua DKM.',
    },
  ];

  return (
    <section className="finance-breakdown-section" aria-labelledby="breakdown-title">
      <Container>
        <div style={{ marginBottom: '32px' }}>
          <div className="transparency-hero-label" style={{ color: '#0c2b1d', marginBottom: '8px' }}>
            <span className="fin-line" style={{ background: '#0c2b1d' }}></span> Tahapan Verifikasi
          </div>
          <h2 id="breakdown-title" style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#0c2b1d', margin: '0 0 8px 0' }}>
            Proses Audit & Rekonsiliasi Kas
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7f74', lineHeight: 1.6, maxWidth: '680px' }}>
            Pengurus DKM berkomitmen menyajikan data keuangan yang akurat dan dapat dipertanggungjawabkan. Berikut adalah langkah verifikasi yang sedang berlangsung:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {steps.map((item) => (
            <div
              key={item.step}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(12, 43, 29, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#c9a55a', background: 'rgba(201, 165, 90, 0.1)', padding: '4px 10px', borderRadius: '8px', display: 'inline-block', marginBottom: '12px' }}>
                Langkah {item.step}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0c2b1d', margin: '0 0 8px 0' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#3a5244', margin: 0, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', background: '#F8F9FA', borderRadius: '12px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#3a5244', fontWeight: 500 }}>
            Membutuhkan informasi donasi atau konfirmasi pencatatan kas?
          </span>
          <a
            href="https://wa.me/6281375410997"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '13px', fontWeight: 700, color: '#0c2b1d', textDecoration: 'none', background: '#FFFFFF', border: '1px solid rgba(12, 43, 29, 0.2)', padding: '8px 18px', borderRadius: '8px' }}
          >
            Hubungi Pengurus DKM →
          </a>
        </div>
      </Container>
    </section>
  );
}
