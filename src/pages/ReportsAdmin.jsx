import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import ReportSummary from '../components/reports/ReportSummary.jsx';
import ReportArchiveTable from '../components/reports/ReportArchiveTable.jsx';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

// Status badge helper
function getStatusBadge(status) {
  switch (status) {
    case 'Dalam verifikasi':
      return <span className="fin-pill" style={{ background: '#FFF3CD', color: '#856404', border: '1px solid #FFEEBA', fontWeight: 600 }}>Dalam verifikasi</span>;
    case 'Dalam peninjauan':
      return <span className="fin-pill fin-pill-red">Dalam peninjauan</span>;
    case 'Siap publik':
      return <span className="fin-pill fin-pill-green">Siap publik</span>;
    case 'Arsip internal':
      return <span className="fin-pill fin-pill-blue">Arsip internal</span>;
    default:
      return <span className="fin-pill">{status}</span>;
  }
}

export default function ReportsAdmin() {
  const CARDS = [
    {
      title: 'Laporan Kas Mei 2026',
      category: 'Keuangan Bulanan',
      status: 'Dalam verifikasi',
      period: 'Mei 2026',
      visibility: 'Pengurus',
      desc: 'Rekapitulasi kas masuk, kas keluar, dan saldo akhir periode Mei 2026 sedang dalam peninjauan verifikasi Bendahara DKM.',
    },
    {
      title: 'Laporan Kas Juni 2026',
      category: 'Keuangan Bulanan',
      status: 'Dalam verifikasi',
      period: 'Juni 2026',
      visibility: 'Pengurus',
      desc: 'Pencatatan buku kas berjalan bulan Juni 2026 sedang dalam peninjauan verifikasi Bendahara DKM.',
    },
    {
      title: 'Laporan LPJ Kegiatan Ramadhan 1447 H',
      category: 'Kegiatan DKM',
      status: 'Arsip internal',
      period: 'April 2026',
      visibility: 'Pengurus',
      desc: 'Laporan pertanggungjawaban kegiatan kajian ramadhan, sedekah jumat berkah, dan bantuan dana sosial santri.',
    },
    {
      title: 'Dokumen Transparansi Kebijakan DKM',
      category: 'Kebijakan Publik',
      status: 'Dalam verifikasi',
      period: 'Juni 2026',
      visibility: 'Pengurus',
      desc: 'Dokumen panduan transparansi publik mengenai alokasi anggaran operasional dan utilitas sarpras.',
    },
  ];

  return (
    <DashboardLayout
      title="Laporan &amp; Arsip"
      subtitle="Arsip &amp; Laporan Transparansi"
      activeId="laporan"
      period="Juni 2026"
    >
      <div className="db-page-container">
        {/* ── Top Module Banner ────────────────────────────────────────── */}
        <div className="db-top-banner">
          <div className="db-banner-icon">📂</div>
          <div className="db-banner-content">
            <div className="db-banner-title">Pusat Arsip &amp; Laporan Transparansi</div>
            <div className="db-banner-sub">Masjid Al Ikhlas Cipta Greenville · DKM Al Ikhlas CGV</div>
          </div>
        </div>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="db-pg-header" style={{ flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="db-pg-eyebrow">DOKUMEN RESMI DKM</div>
            <h1 className="db-pg-title">
              Arsip &amp; Laporan<br />
              <em>Transparansi Publik</em>
            </h1>
            <p className="db-pg-desc">Dokumentasi akuntabilitas kepengurusan DKM periode Juni 2026</p>
          </div>
          
          {/* Disabled Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="fin-btn" disabled style={{ cursor: 'not-allowed', color: 'var(--db-text-3)', borderColor: 'rgba(12,24,16,.15)' }}>
              📥 Upload Laporan <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled style={{ cursor: 'not-allowed', color: 'var(--db-text-3)', borderColor: 'rgba(12,24,16,.15)' }}>
              📄 Export PDF <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled style={{ cursor: 'not-allowed', color: 'var(--db-text-3)', borderColor: 'rgba(12,24,16,.15)' }}>
              ➕ Tambah Arsip <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
          </div>
        </div>

        {/* ── Public Link & Read-Only Notice ───────────────────────────── */}
        <div 
          className="db-card" 
          style={{ 
            background: 'var(--db-warn-bg)', 
            border: '1px solid rgba(122,75,10,.15)', 
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
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <div style={{ fontSize: '13px', color: 'var(--db-warn-text)', lineHeight: 1.5 }}>
              Laporan keuangan Mei &amp; Juni 2026 berstatus <strong>Dalam verifikasi</strong>. Halaman transparansi publik menampilkan pemberitahuan verifikasi resmi.
            </div>
          </div>
          <a 
            href="/transparansi" 
            className="db-chip o"
            style={{ textDecoration: 'none', fontWeight: 700, padding: '6px 16px', borderRadius: '6px', fontSize: '12px', boxShadow: 'var(--db-sh-sm)' }}
          >
            Lihat Halaman Transparansi Publik →
          </a>
        </div>

        {/* ── KPI Summary Counts ───────────────────────────────────────── */}
        <ReportSummary />

        {/* ── Report Cards Section ────────────────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '24px' }}>Ringkasan Dokumen Laporan DKM</div>
        <div className="db-grid-2" style={{ marginBottom: '28px' }}>
          {CARDS.map((card) => (
            <div className="db-card" key={card.title} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="db-cp">
                <div className="db-card-head" style={{ marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--db-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {card.category}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--db-text-4)' }}>· {card.period}</span>
                    </div>
                    <div className="db-card-title" style={{ fontSize: '15px', fontWeight: 700 }}>{card.title}</div>
                  </div>
                  {getStatusBadge(card.status)}
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--db-text-3)', lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
              
              <div 
                style={{ 
                  background: 'var(--db-bg-hover)', 
                  borderTop: '1px solid rgba(12,24,16,.06)', 
                  padding: '12px 20px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--db-text-4)', fontWeight: 500 }}>
                  Hak Akses: {card.visibility}
                </span>
                {card.status === 'Siap publik' ? (
                  <a
                    href="/transparansi"
                    className="fin-btn"
                    style={{ textDecoration: 'none', fontSize: '11px', padding: '4px 12px', background: 'var(--db-forest-mid)', color: '#fff', border: 'none' }}
                  >
                    🌐 Buka di Transparansi
                  </a>
                ) : (
                  <button 
                    className="fin-btn" 
                    disabled 
                    style={{ padding: '4px 10px', height: 'auto', fontSize: '11px', cursor: 'not-allowed', opacity: 0.6 }}
                  >
                    🔒 Internal DKM
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Report Archive Table ─────────────────────────────────────── */}
        <ReportArchiveTable />

        {/* ── Context links / Quick Navigation ─────────────────────────── */}
        <div className="db-sec-eyebrow" style={{ marginTop: '32px' }}>Tautan Cepat</div>
        <div className="db-quick-link-grid">
          {[
            {
              icon: '🌐',
              label: 'Transparansi Publik (Website)',
              href: '/transparansi',
              desc: 'Buka portal transparansi publik untuk jamaah.',
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
