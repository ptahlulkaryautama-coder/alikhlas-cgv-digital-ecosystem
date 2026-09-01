const MENTOR_ROWS = [
  { role: 'Kepala TPQ', scope: 'Monitoring kelas, laporan, dan validasi rekap.' },
  { role: 'Pengampu Kelas', scope: 'Absensi, progres harian, dan catatan raport.' },
  { role: 'Admin TPQ', scope: 'Agenda, dokumen, dan bantuan operasional.' },
];

const COVERAGE_ROWS = [
  { label: 'Pengampu A', value: '2 sesi', detail: 'Iqra awal' },
  { label: 'Pengampu B', value: '2 sesi', detail: 'Iqra lanjut' },
  { label: 'Pengampu C', value: '1 sesi', detail: 'Tahfiz' },
];

export default function TPQMentorWorkspacePreview() {
  return (
    <div className="tpq-academic-demo" aria-label="Preview peran pengampu TPQ">
      <div className="tpq-demo-header">
        <div>
          <span>PENGAMPU</span>
          <h3>Peran Operasional TPQ</h3>
          <p>Draft pembagian akses. Belum menampilkan identitas personal pengampu.</p>
        </div>
        <strong>Role draft</strong>
      </div>

      <div className="tpq-mentor-list">
        {MENTOR_ROWS.map((row) => (
          <article className="tpq-mentor-card" key={row.role}>
            <strong>{row.role}</strong>
            <p>{row.scope}</p>
          </article>
        ))}
      </div>

      <div className="tpq-coverage-strip" aria-label="Preview coverage pengampu tanpa identitas personal">
        {COVERAGE_ROWS.map((row) => (
          <article key={row.label}>
            <small>{row.label}</small>
            <strong>{row.value}</strong>
            <span>{row.detail}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
