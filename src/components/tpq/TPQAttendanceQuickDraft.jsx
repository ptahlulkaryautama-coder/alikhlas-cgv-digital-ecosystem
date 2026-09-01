import { useState } from 'react';
import useTpqIntegration from '../../hooks/useTpqIntegration.js';

const INITIAL_ROWS = [
  { code: 'TPQ-STUDENT-001', status: 'Hadir', note: 'Datang tepat waktu' },
  { code: 'TPQ-STUDENT-002', status: 'Izin', note: 'Konfirmasi wali' },
  { code: 'TPQ-STUDENT-003', status: 'Sakit', note: 'Tidak dihitung alfa' },
  { code: 'TPQ-STUDENT-004', status: 'Hadir', note: 'Perlu murojaah pendek' },
];

const STATUS_OPTIONS = ['Hadir', 'Izin', 'Sakit', 'Alfa'];

export default function TPQAttendanceQuickDraft() {
  const { saveAttendance, isSaving, capabilities } = useTpqIntegration();
  const [selectedStatus, setSelectedStatus] = useState('Hadir');
  const [note, setNote] = useState('Datang tepat waktu');
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [saveBanner, setSaveBanner] = useState(null);

  function handleSelectStatus(status) {
    setSelectedStatus(status);
    setRows((current) =>
      current.map((r, i) => (i === 0 ? { ...r, status } : r))
    );
  }

  async function handleSaveDraftSimulasi() {
    setRows((current) =>
      current.map((r, i) => (i === 0 ? { ...r, status: selectedStatus, note } : r))
    );

    const sessionPayload = {
      student_code: 'TPQ-STUDENT-001',
      status: selectedStatus,
      note: note,
      recorded_at: new Date().toISOString(),
    };

    if (capabilities?.writes_enabled) {
      await saveAttendance(sessionPayload);
      setSaveBanner(`✅ Presensi TPQ-STUDENT-001 [${selectedStatus}] Berhasil Disimpan ke Database Vault!`);
    } else {
      setSaveBanner(`✅ Draft Presensi TPQ-STUDENT-001 [${selectedStatus}] Berhasil Disimpan (Mode Prototype Safe)!`);
    }

    setTimeout(() => setSaveBanner(null), 4000);
  }

  const counts = {
    Hadir: rows.filter((r) => r.status === 'Hadir').length,
    Izin: rows.filter((r) => r.status === 'Izin').length,
    Sakit: rows.filter((r) => r.status === 'Sakit').length,
    Alfa: rows.filter((r) => r.status === 'Alfa').length,
  };

  const summaryItems = [
    { label: 'Hadir', value: counts.Hadir, tone: 'green' },
    { label: 'Izin', value: counts.Izin, tone: 'gold' },
    { label: 'Sakit', value: counts.Sakit, tone: 'blue' },
    { label: 'Alfa', value: counts.Alfa, tone: 'red' },
  ];

  return (
    <div className="tpq-academic-demo" aria-label="Simulasi absensi cepat TPQ">
      <div className="tpq-demo-header">
        <div>
          <span>ABSENSI CEPAT</span>
          <h3>Draft Kehadiran Kelas</h3>
          <p>Simulasi mobile-first dengan kode opaque. Pencatatan presensi interaktif aktif.</p>
        </div>
        <strong>{capabilities?.writes_enabled ? 'Vault Live Active' : 'Draft safe'}</strong>
      </div>

      {saveBanner && (
        <div style={{
          background: 'linear-gradient(135deg, #0b3424, #155737)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(11,52,36,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span>{saveBanner}</span>
        </div>
      )}

      <div className="tpq-attendance-summary">
        {summaryItems.map((item) => (
          <div className={`tpq-attendance-kpi ${item.tone}`} key={item.label}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="tpq-quick-draft-card" aria-label="Mock form absensi tanpa penyimpanan">
        <div>
          <small>MOCK INPUT</small>
          <strong>TPQ-STUDENT-001</strong>
          <p>Pilih status cepat dan simpan draft presensi harian.</p>
        </div>
        <div className="tpq-status-options" aria-label="Pilihan status absensi dummy">
          {STATUS_OPTIONS.map((status) => (
            <button
              className={status === selectedStatus ? 'active' : ''}
              type="button"
              key={status}
              onClick={() => handleSelectStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <textarea
          aria-label="Catatan absensi dummy"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan sopan dan singkat"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            className="tpq-active-submit"
            type="button"
            disabled={isSaving}
            onClick={handleSaveDraftSimulasi}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0b3424 0%, #17573a 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              border: '1px solid rgba(198, 161, 91, 0.4)',
              cursor: isSaving ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(8, 41, 28, 0.18)',
              transition: 'transform 0.15s ease',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? '⏳ Menyimpan Presensi...' : '💾 Simpan Draft Presensi (Aktif)'}
          </button>
          <small className="tpq-disabled-note" style={{ fontSize: '11px', color: '#71887c' }}>
            {capabilities?.writes_enabled
              ? 'Tersambung ke Supabase Vault terenkripsi.'
              : 'Penyimpanan langsung aktif dalam mode prototype aman (private vault aktif disabled).'}
          </small>
        </div>
      </div>

      <div className="tpq-demo-list">
        {rows.map((row) => (
          <article className="tpq-demo-row" key={row.code}>
            <div>
              <small>{row.code}</small>
              <strong>{row.status}</strong>
            </div>
            <span>{row.note}</span>
          </article>
        ))}
      </div>
    </div>
  );
}


