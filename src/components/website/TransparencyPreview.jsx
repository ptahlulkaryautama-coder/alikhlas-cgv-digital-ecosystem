import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function TransparencyPreview() {
  return (
    <section id="transparansi" className="transparency-section" aria-labelledby="trust-title">
      <Container className="transparency-grid">
        <div className="section-kicker-block">
          <p className="label">TRANSPARANSI KAS</p>
          <h2 id="trust-title" className="section-title">
            Amanah Yang Dapat Diperiksa
          </h2>
          <p className="section-copy">
            Pengelolaan kas, mutasi perbankan BSI, dan laporan operasional Masjid Al Ikhlas CGV dicatat serta diumumkan secara terbuka untuk menjaga transparansi bagi seluruh warga.
          </p>
          <div style={{ marginTop: '24px' }}>
            <Button href="/transparansi" variant="gold">
              Lihat Status Laporan Keuangan
            </Button>
          </div>
        </div>

        <div className="transparency-card">
          <div className="summary-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#8a6200', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                IKHTISAR KAS RESMI (AGUSTUS 2026)
              </span>
              <p style={{ margin: 0, fontWeight: 800, color: '#0c2b1d', fontSize: '18px' }}>
                Total Likuiditas: Rp 21.013.667
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#5b7365', fontWeight: 600 }}>
                Kas Masjid: <strong>Rp 16.313.667</strong> · Dana JPU: <strong>Rp 4.700.000</strong>
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: 'rgba(15, 97, 48, 0.12)', color: '#0f6130', border: '1px solid rgba(15, 97, 48, 0.35)', whiteSpace: 'nowrap' }}>
              ✓ Terverifikasi DKM
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: '#FAF9F6', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E2' }}>
              <span style={{ fontSize: '10.5px', color: '#6b7f74', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Kas Masuk</span>
              <strong style={{ fontSize: '15px', color: '#0f6130', fontWeight: 800 }}>+Rp 10.782.000</strong>
            </div>
            <div style={{ background: '#FAF9F6', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E2' }}>
              <span style={{ fontSize: '10.5px', color: '#6b7f74', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Kas Keluar</span>
              <strong style={{ fontSize: '15px', color: '#9b2113', fontWeight: 800 }}>-Rp 12.854.463</strong>
            </div>
          </div>

          <p className="summary-note" style={{ fontSize: '13px', color: '#3a5244', lineHeight: 1.6, marginBottom: '16px' }}>
            Buku kas &amp; program Jumat Peduli Umat (JPU) periode Agustus 2026 disahkan resmi oleh Ketua DKM (Karya HP), Sekretaris (Zulhendy M), dan Bendahara (Bambang S).
          </p>

          <div style={{ padding: '12px 14px', background: 'rgba(12, 43, 29, 0.04)', borderRadius: '10px', border: '1px solid rgba(12, 43, 29, 0.08)', fontSize: '12px', color: '#2a4235', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span><strong>💡 Transparansi Terbuka:</strong> 70 mutasi kas &amp; dana JPU tercatat.</span>
            <a href="/transparansi#buku-kas-terbuka" style={{ color: '#0c2b1d', fontWeight: 700, textDecoration: 'underline', fontSize: '12px', whiteSpace: 'nowrap' }}>
              Buka Buku Kas →
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
