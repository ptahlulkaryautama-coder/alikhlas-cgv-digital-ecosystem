import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import '../styles/dashboard.css';

export default function DonationAdmin() {
  return (
    <DashboardLayout
      title="Donasi & Infaq"
      subtitle="Manajemen Kampanye Donasi"
      activeId="donasi"
    >
      <div className="db-pg-header">
        <div>
          <div className="db-pg-eyebrow">Modul Donasi</div>
          <h1 className="db-pg-title">Pengelolaan Donasi</h1>
          <p className="db-pg-desc">Modul ini akan tersedia secara penuh pada fase berikutnya.</p>
        </div>
      </div>

      <div className="db-card" style={{ textAlign: 'center', padding: '60px 20px', marginTop: '20px' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.8 }}>💰</span>
        <h2 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--db-text-1)' }}>Fitur Segera Hadir</h2>
        <p style={{ color: 'var(--db-text-3)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
          Modul pengelolaan kampanye donasi, persetujuan transfer, dan manajemen kas masuk
          sedang dalam tahap pengembangan untuk pembaruan selanjutnya.
        </p>
      </div>
    </DashboardLayout>
  );
}
