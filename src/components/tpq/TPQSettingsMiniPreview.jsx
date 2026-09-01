import TPQBackupReadinessPreview from './TPQBackupReadinessPreview.jsx';
import TPQPrivateFieldMatrixPreview from './TPQPrivateFieldMatrixPreview.jsx';
import TPQPolicyGatePreview from './TPQPolicyGatePreview.jsx';
import TPQPilotReadinessPreview from './TPQPilotReadinessPreview.jsx';
import TPQRoleAccessPreview from './TPQRoleAccessPreview.jsx';
import TPQRoleJourneyPreview from './TPQRoleJourneyPreview.jsx';

const SETTINGS_ROWS = [
  { label: 'Nama app', value: 'TPQ Al Mardhotillah', note: 'Identitas tampilan stand-alone' },
  { label: 'Tahun ajaran', value: '2026 / 2027', note: 'Dummy, belum menjadi sumber data' },
  { label: 'Mode data', value: 'Safe shell', note: 'Belum membaca private vault' },
  { label: 'Export', value: 'Terkunci', note: 'Menunggu policy dan role export' },
];

const STANDALONE_CHECKS = [
  'Navigasi TPQ dapat dipisah dari dashboard DKM.',
  'Login, role, RLS, RPC, dan audit tetap dari Supabase yang sama.',
  'Data privat anak tidak boleh masuk localStorage atau website publik.',
];

export default function TPQSettingsMiniPreview() {
  return (
    <div className="tpq-academic-demo" aria-label="Preview setting TPQ stand-alone">
      <div className="tpq-demo-header">
        <div>
          <span>SETTING TPQ</span>
          <h3>Konfigurasi App TPQ</h3>
          <p>Preview pengaturan identitas, tahun ajaran, dan arah stand-alone. Belum menyimpan perubahan.</p>
        </div>
        <strong>Read-only</strong>
      </div>

      <div className="tpq-settings-grid">
        {SETTINGS_ROWS.map((row) => (
          <article key={row.label}>
            <small>{row.label}</small>
            <strong>{row.value}</strong>
            <span>{row.note}</span>
          </article>
        ))}
      </div>

      <div className="tpq-standalone-checks">
        <strong>Kesiapan stand-alone nanti</strong>
        <ul>
          {STANDALONE_CHECKS.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <TPQBackupReadinessPreview />

      <TPQPilotReadinessPreview />

      <TPQRoleJourneyPreview />

      <TPQPolicyGatePreview />

      <TPQPrivateFieldMatrixPreview />

      <TPQRoleAccessPreview />
    </div>
  );
}
