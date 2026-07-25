import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import DonationKpi from '../components/donation/DonationKpi.jsx';
import qrisUrl from '../assets/qris-alikhlas.png';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

const ACTIVE_CAMPAIGNS = [
  { id: 1, title: 'Operasional & Utilitas Bulanan', target: 20000000, raised: 18000000, status: 'Aktif', desc: 'Pembiayaan tagihan listrik, air, kebersihan, dan operasional masjid harian.' },
  { id: 2, title: 'Beasiswa & Pendidikan Santri TPQ', target: 10000000, raised: 7500000, status: 'Aktif', desc: 'Bantuan biaya SPP, buku Iqra, sarana mengajar, dan insentif pengajar TPQ.' },
  { id: 3, title: 'Sedekah Jumat Berkah Al Ikhlas', target: 5000000, raised: 4200000, status: 'Aktif', desc: 'Penyediaan ratusan paket nasi kotak siap saji pasca shalat Jumat.' },
  { id: 4, title: 'Pemeliharaan AC & Sarpras Masjid', target: 15000000, raised: 12850000, status: 'Aktif', desc: 'Servis rutin berkala AC masjid, sound system, pengecatan dan taman.' }
];

export default function DonationAdmin() {
  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <DashboardLayout
      title="Donasi &amp; Infaq"
      subtitle="Monitoring Saluran Donasi"
      activeId="donasi"
      period="Juni 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="db-banner-content">
            <div className="db-banner-title">Monitoring Saluran &amp; Penggalangan Donasi</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="db-pg-eyebrow">MONITORING INFAQ</div>
            <h1 className="db-pg-title">
              Pengelolaan Donasi<br />
              <em>Amanah &amp; Akuntabel</em>
            </h1>
            <p className="db-pg-desc">Informasi rekapitulasi penggalangan dana dan transparansi masuk bulanan</p>
          </div>
          
          {/* Action buttons (Disabled) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="fin-btn" disabled style={{ cursor: 'not-allowed', color: 'var(--db-text-3)', borderColor: 'rgba(12,24,16,.15)' }}>
              ➕ Tambah Program <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled style={{ cursor: 'not-allowed', color: 'var(--db-text-3)', borderColor: 'rgba(12,24,16,.15)' }}>
              📥 Export Donasi <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled style={{ cursor: 'not-allowed', color: 'var(--db-text-3)', borderColor: 'rgba(12,24,16,.15)' }}>
              🔄 Sinkronisasi <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-up-text)', background: 'var(--db-up-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>read-only</span>
            </button>
          </div>
        </div>

        {/* ── Read-only Notice Card ────────────────────────────────────── */}
        <div 
          className="db-card" 
          style={{ 
            background: 'var(--db-warn-bg)', 
            border: '1px solid rgba(122,75,10,.18)', 
            borderRadius: '12px', 
            padding: '16px 20px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <span style={{ fontSize: '22px' }}>🔒</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--db-warn-text)' }}>
              Privasi &amp; Keamanan Data Jamaah
            </div>
            <div style={{ fontSize: '12px', color: 'var(--db-text-2)', marginTop: '2px', lineHeight: 1.5 }}>
              Nama donatur, nomor telepon, dan catatan pribadi tidak ditampilkan pada modul monitoring publik. Pencatatan rinci transaksi keuangan dikelola oleh Bendahara di buku kas internal (`/app/keuangan`).
            </div>
          </div>
        </div>

        {/* ── Public Donation Page Preview / Link ──────────────────────── */}
        <div 
          className="db-card" 
          style={{ 
            background: 'var(--db-up-bg)', 
            border: '1px solid rgba(15,97,48,.15)', 
            borderRadius: '12px', 
            padding: '16px 20px', 
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🌐</span>
            <div style={{ fontSize: '13px', color: 'var(--db-up-text)', lineHeight: 1.5 }}>
              Halaman publik Donasi &amp; Infaq menyediakan informasi rekening dan QRIS untuk jamaah.
            </div>
          </div>
          <a 
            href="/donasi" 
            className="db-chip g"
            style={{ textDecoration: 'none', fontWeight: 700, padding: '6px 16px', borderRadius: '6px', fontSize: '12px', boxShadow: 'var(--db-sh-sm)' }}
          >
            Pratinjau Halaman Donasi Publik →
          </a>
        </div>

        {/* ── KPI Summary Cards ────────────────────────────────────────── */}
        <DonationKpi />

        {/* ── Account Overview & QRIS / Rekening Display ───────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '24px' }}>Saluran Penerimaan Infaq &amp; Rekening Resmi</div>
        <div className="fin-info-grid" style={{ marginTop: '12px', marginBottom: '28px' }}>
          <div className="fin-info-card">
            <div className="fin-info-label">REKENING BANK DKM AL IKHLAS</div>
            <div className="fin-info-title" style={{ fontSize: '18px', color: '#0c2b1d' }}>BSI · 1500600069</div>
            <div className="fin-info-value" style={{ marginTop: '10px', fontSize: '12.5px', lineHeight: 1.6 }}>
              <strong>a.n. Masjid Al Ikhlas Cipta Green Ville</strong><br />
              Rekening utama penerimaan infaq dan donasi jamaah. Seluruh saldo terhubung ke laporan buku kas bulanan DKM.<br /><br />
              <strong>Kontak Konfirmasi Transfer (WhatsApp):</strong><br />
              <a href="https://wa.me/6281375410997" target="_blank" rel="noopener noreferrer" style={{ color: '#0c2b1d', fontWeight: 600, textDecoration: 'none' }}>
                +62 813-7541-0997
              </a> (Zulhendy Masruddin - Bendahara DKM)
            </div>
          </div>

          <div className="fin-info-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div className="fin-info-label">QRIS STANDAR NASIONAL</div>
              <div className="fin-info-title" style={{ fontSize: '16px', color: '#0c2b1d' }}>MASJID AL IKHLAS CGV</div>
              <div className="fin-info-value" style={{ fontSize: '11.5px', color: '#6b7f74', marginTop: '6px', lineHeight: 1.6 }}>
                NMID: ID1024337942592<br />
                Menerima donasi digital via GoPay, OVO, ShopeePay, Dana, LinkAja, &amp; Mobile Banking.
              </div>
            </div>
            <img 
              src={qrisUrl} 
              alt="QRIS Donasi Masjid" 
              style={{ width: '96px', height: '96px', objectFit: 'contain', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '4px', background: '#fff' }} 
            />
          </div>
        </div>

        {/* ── Active Campaign Cards ───────────────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '24px' }}>Program Penggalangan Infaq Aktif</div>
        <div className="db-grid-2" style={{ marginTop: '12px', marginBottom: '28px' }}>
          {ACTIVE_CAMPAIGNS.map((camp) => {
            const pct = Math.round((camp.raised / camp.target) * 100);
            return (
              <div className="db-card" key={camp.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="db-card-head" style={{ marginBottom: '10px' }}>
                    <div className="db-card-title" style={{ fontSize: '14.5px', fontWeight: 700 }}>{camp.title}</div>
                    <span className="db-chip g" style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {camp.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--db-text-3)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {camp.desc}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: 'var(--db-text-2)', marginBottom: '6px' }}>
                    <span>Progress Penggalangan</span>
                    <span>{formatRupiah(camp.raised)} / {formatRupiah(camp.target)} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#ede9df', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-gold)', borderRadius: 'inherit' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="fin-btn" 
                      disabled 
                      aria-disabled="true" 
                      style={{ flex: 1, fontSize: '11px', padding: '6px 10px', height: 'auto', opacity: 0.6, cursor: 'not-allowed' }}
                    >
                      ✏️ Edit (belum aktif)
                    </button>
                    <button 
                      className="fin-btn" 
                      disabled 
                      aria-disabled="true" 
                      style={{ flex: 1, fontSize: '11px', padding: '6px 10px', height: 'auto', opacity: 0.6, cursor: 'not-allowed' }}
                    >
                      🔒 Privat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Context links / Quick Navigation ─────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '32px' }}>Tautan Cepat</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '🌐',
              label: 'Portal Donasi (Website)',
              href: '/donasi',
              desc: 'Buka halaman Donasi publik untuk warga.',
            },
            {
              icon: '📋',
              label: 'Buku Kas Keuangan',
              href: '/app/keuangan',
              desc: 'Lihat buku kas keuangan internal DKM.',
            },
            {
              icon: '📊',
              label: 'Dashboard Utama',
              href: '/app',
              desc: 'Kembali ke ringkasan panel admin utama.',
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="db-quick-link-card"
            >
              <div className="card-icon-wrapper">
                {link.icon}
              </div>
              <div className="card-title">{link.label}</div>
              <div className="card-desc">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
