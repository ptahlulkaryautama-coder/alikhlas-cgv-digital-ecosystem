const EVALUATION_ROWS = [
  { label: 'Kehadiran pengampu', value: 'Draft', note: 'Rekap sesi mengajar, bukan presensi publik.' },
  { label: 'Kesiapan kelas', value: 'Draft', note: 'Checklist materi dan adab pengajaran.' },
  { label: 'Catatan kepala TPQ', value: 'Private', note: 'Tidak tampil ke website atau wali santri.' },
];

const RUBRIC_ROWS = [
  { label: 'Adab mengajar', level: 'Rubrik', note: 'Bahasa santun, teladan, dan empati.' },
  { label: 'Konsistensi materi', level: 'Rubrik', note: 'Mengikuti target kelas dan catatan progres.' },
  { label: 'Tindak lanjut', level: 'Rubrik', note: 'Catatan perbaikan internal, bukan publik.' },
];

export default function TPQMentorEvaluationPreview() {
  return (
    <div className="tpq-academic-demo" aria-label="Preview evaluasi pengampu privat">
      <div className="tpq-demo-header">
        <div>
          <span>EVALUASI PENGAMPU</span>
          <h3>Evaluasi Internal Terbatas</h3>
          <p>Preview evaluasi pengampu. Belum membaca identitas personal, absensi riil, atau catatan kepala TPQ.</p>
        </div>
        <strong>Private only</strong>
      </div>

      <div className="tpq-eval-grid">
        {EVALUATION_ROWS.map((row) => (
          <article key={row.label}>
            <small>{row.value}</small>
            <strong>{row.label}</strong>
            <span>{row.note}</span>
          </article>
        ))}
      </div>

      <div className="tpq-vault-warning">
        <strong>Prinsip evaluasi</strong>
        <p>Evaluasi pengampu adalah data internal SDM TPQ. Akses, export, dan retensi harus ditentukan sebelum fitur tulis diaktifkan.</p>
      </div>

      <div className="tpq-evaluation-rubric" aria-label="Preview rubrik evaluasi pengampu tanpa data personal">
        {RUBRIC_ROWS.map((row) => (
          <article key={row.label}>
            <small>{row.level}</small>
            <strong>{row.label}</strong>
            <span>{row.note}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
