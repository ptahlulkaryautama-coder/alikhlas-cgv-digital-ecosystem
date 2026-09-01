import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import ReportSummary from '../components/reports/ReportSummary.jsx';
import ReportArchiveTable from '../components/reports/ReportArchiveTable.jsx';
import '../styles/dashboard.css';
import '../styles/financeAdmin.css';

// Status badge helper
function getStatusBadge(status) {
  switch (status) {
    case 'Dalam verifikasi':
      return <span className="fin-pill fin-pill-gold">Dalam verifikasi</span>;
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
      title: 'Laporan Kas Agustus 2026 (1–15 Ags)',
      category: 'Keuangan Bulanan',
      status: 'Siap publik',
      period: 'Agustus 2026',
      visibility: 'Publik',
      desc: 'Buku kas periode 1–15 Agustus 2026 telah diverifikasi & disahkan oleh Ketua DKM, Sekretaris, dan Bendahara Masjid Al Ikhlas CGV.',
    },
    {
      title: 'Laporan Kas Mei 2026',
      category: 'Keuangan Bulanan',
      status: 'Arsip internal',
      period: 'Mei 2026',
      visibility: 'Pengurus',
      desc: 'Rekapitulasi kas masuk, kas keluar, dan saldo akhir periode Mei 2026 dari arsip DKM.',
    },
    {
      title: 'Laporan Kas Juni 2026',
      category: 'Keuangan Bulanan',
      status: 'Arsip internal',
      period: 'Juni 2026',
      visibility: 'Pengurus',
      desc: 'Pencatatan buku kas berjalan bulan Juni 2026 dari arsip DKM.',
    },
    {
      title: 'Laporan LPJ Kegiatan Ramadhan 1447 H',
      category: 'Kegiatan DKM',
      status: 'Arsip internal',
      period: 'April 2026',
      visibility: 'Pengurus',
      desc: 'Laporan pertanggungjawaban kegiatan kajian ramadhan, sedekah jumat berkah, dan bantuan dana sosial santri.',
    },
  ];

  return (
    <DashboardLayout
      title="Laporan &amp; Arsip"
      subtitle="Arsip &amp; Laporan Transparansi"
      activeId="laporan"
      period="Agustus 2026"
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
        <div className="db-pg-header db-pg-header-actions">
          <div>
            <div className="db-pg-eyebrow">DOKUMEN RESMI DKM</div>
            <h1 className="db-pg-title">
              Arsip &amp; Laporan<br />
              <em>Transparansi Publik</em>
            </h1>
            <p className="db-pg-desc">Dokumentasi akuntabilitas kepengurusan DKM periode Juni 2026</p>
          </div>
          
          {/* Disabled Action Buttons */}
          <div className="db-action-cluster">
            <button className="fin-btn" disabled>
              📥 Upload Laporan <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled>
              📄 Export PDF <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
            <button className="fin-btn" disabled>
              ➕ Tambah Arsip <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--db-warn-text)', background: 'var(--db-warn-bg)', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>belum aktif</span>
            </button>
          </div>
        </div>

        {/* ── Public Link & Read-Only Notice ───────────────────────────── */}
        <div 
          className="db-card db-notice-card"
        >
          <div className="db-notice-content">
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <div className="db-notice-copy">
              Laporan keuangan Mei &amp; Juni 2026 berstatus <strong>Dalam verifikasi</strong>. Halaman transparansi publik menampilkan pemberitahuan verifikasi resmi.
            </div>
          </div>
          <a 
            href="/transparansi" 
            className="db-chip o db-notice-link"
          >
            Lihat Halaman Transparansi Publik →
          </a>
        </div>

        {/* ── KPI Summary Counts ───────────────────────────────────────── */}
        <ReportSummary />

        {/* ── Report Cards Section ────────────────────────────────────── */}
        <div className="db-sec-eyebrow db-section-gap-md">Ringkasan Dokumen Laporan DKM</div>
        <div className="db-grid-2 db-section-bottom">
          {CARDS.map((card) => (
            <div className="db-card db-report-card" key={card.title}>
              <div className="db-cp">
                <div className="db-card-head db-report-card-head">
                  <div>
                    <div className="db-report-meta">
                      <span className="db-report-category">
                        {card.category}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--db-text-4)' }}>· {card.period}</span>
                    </div>
                    <div className="db-card-title db-report-title">{card.title}</div>
                  </div>
                  {getStatusBadge(card.status)}
                </div>
                <p className="db-report-desc">
                  {card.desc}
                </p>
              </div>
              
              <div className="db-report-footer">
                <span className="db-report-access">
                  Hak Akses: {card.visibility}
                </span>
                {card.status === 'Siap publik' ? (
                  <a
                    href="/transparansi"
                    className="fin-btn fin-btn-primary db-report-action"
                  >
                    🌐 Buka di Transparansi
                  </a>
                ) : (
                  <button 
                    className="fin-btn db-report-action"
                    disabled
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
        <div className="db-sec-eyebrow db-section-gap-lg">Tautan Cepat</div>
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
