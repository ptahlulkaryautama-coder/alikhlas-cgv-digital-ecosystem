import { useState } from 'react';

const INITIAL_PROGRESS_ROWS = [
  { code: 'TPQ-STUDENT-001', track: 'Iqra 3', checkpoint: 'Hal. 18', next: 'Latihan panjang pendek' },
  { code: 'TPQ-STUDENT-002', track: 'Iqra 4', checkpoint: 'Hal. 7', next: 'Penguatan mad thabi’i' },
  { code: 'TPQ-STUDENT-003', track: 'Hafalan', checkpoint: 'Al-Falaq', next: 'Murajaah An-Naas' },
];

const PROGRESS_STEPS = ['Pilih kelas', 'Catat capaian', 'Simpan draft', 'Rekap kepala TPQ'];
const TRACK_OPTIONS = ['Iqra', 'Al-Qur’an', 'Hafalan', 'Adab'];

export default function TPQProgressQuickDraft() {
  const [selectedTrack, setSelectedTrack] = useState('Iqra');
  const [checkpointText, setCheckpointText] = useState('Hal. 19 — Latihan Mad Thabi’i');
  const [rows, setRows] = useState(INITIAL_PROGRESS_ROWS);
  const [saveBanner, setSaveBanner] = useState(null);

  function handleSaveProgressDraft() {
    setRows((current) =>
      current.map((r, i) =>
        i === 0 ? { ...r, track: selectedTrack, checkpoint: checkpointText } : r
      )
    );
    setSaveBanner(`✅ Catatan Capaian Progres TPQ-STUDENT-001 [${selectedTrack}] Berhasil Disimpan!`);
    setTimeout(() => setSaveBanner(null), 4000);
  }

  return (
    <div className="tpq-academic-demo" aria-label="Simulasi progres belajar TPQ">
      <div className="tpq-demo-header">
        <div>
          <span>PROGRES BELAJAR</span>
          <h3>Catatan Capaian Harian</h3>
          <p>Contoh alur input Iqra, Al-Qur’an, hafalan, dan catatan sopan untuk pengampu.</p>
        </div>
        <strong>Draft safe</strong>
      </div>

      {saveBanner && (
        <div style={{
          background: 'linear-gradient(135deg, #0b3424, #17573a)',
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

      <div className="tpq-progress-steps">
        {PROGRESS_STEPS.map((step, index) => (
          <div className="tpq-progress-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <div className="tpq-quick-draft-card" aria-label="Mock form progres belajar tanpa penyimpanan">
        <div>
          <small>MOCK INPUT</small>
          <strong>Catatan progres aman</strong>
          <p>Gunakan kode opaque. Nama santri dan catatan sensitif belum dibuka.</p>
        </div>
        <div className="tpq-status-options" aria-label="Pilihan jalur progres dummy">
          {TRACK_OPTIONS.map((track) => (
            <button
              className={track === selectedTrack ? 'active' : ''}
              type="button"
              key={track}
              onClick={() => setSelectedTrack(track)}
            >
              {track}
            </button>
          ))}
        </div>
        <div className="tpq-progress-mock-fields" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-text-2)' }}>
            Checkpoint: {selectedTrack} — Halaman / surat / materi:
          </label>
          <input
            type="text"
            value={checkpointText}
            onChange={(e) => setCheckpointText(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(12,24,16,.2)',
              fontSize: '13px',
              background: '#fff',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <button
            className="tpq-active-submit"
            type="button"
            onClick={handleSaveProgressDraft}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0b3424 0%, #17573a 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              border: '1px solid rgba(198, 161, 91, 0.4)',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(8, 41, 28, 0.18)',
              transition: 'transform 0.15s ease',
            }}
          >
            📖 Simpan Capaian Progres Simulasi (Aktif)
          </button>
          <small className="tpq-disabled-note" style={{ fontSize: '11px', color: '#71887c' }}>
            Simpan draft permanen ke Supabase membutuhkan private vault aktif (disabled).
          </small>
        </div>
      </div>

      <div className="tpq-demo-list">
        {rows.map((row) => (
          <article className="tpq-demo-row" key={row.code}>
            <div>
              <small>{row.code}</small>
              <strong>{row.track} · {row.checkpoint}</strong>
            </div>
            <span>{row.next}</span>
          </article>
        ))}
      </div>
    </div>
  );
}


