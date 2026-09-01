const PIPELINE_STEPS = [
  {
    step: 'Absensi',
    status: 'Hadir',
    detail: 'TPQ-STUDENT-001 tercatat hadir di sesi dummy.',
    next: 'Catat progres',
  },
  {
    step: 'Progres',
    status: 'Iqra 3 · Hal. 18',
    detail: 'Checkpoint belajar disiapkan sebagai catatan aman.',
    next: 'Review raport',
  },
  {
    step: 'Raport',
    status: 'Preview semester',
    detail: 'Bahan raport hanya memakai kode opaque dan narasi generik.',
    next: 'Terkunci',
  },
];

const HANDOFF_NOTES = [
  'Satu kode opaque dipakai konsisten lintas modul.',
  'Belum ada nama santri, wali, alamat, nilai asli, atau catatan sensitif.',
  'Produksi nanti wajib membaca dari private vault dan mencatat audit akses.',
];

export default function TPQStudentSessionPipeline({ onSelectModule }) {
  return (
    <section className="tpq-student-pipeline" aria-label="Pipeline sesi santri dummy App TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>SESSION PIPELINE</span>
          <h3>Satu alur santri tanpa identitas pribadi</h3>
          <p>
            Preview ini memperlihatkan bagaimana absensi, progres, dan raport nanti saling
            tersambung memakai kode opaque, bukan nama anak.
          </p>
        </div>
        <strong>Opaque only</strong>
      </div>

      <div className="tpq-student-pipeline-grid">
        {PIPELINE_STEPS.map((item, index) => (
          <article key={item.step}>
            <div className="tpq-student-pipeline-index">{index + 1}</div>
            <small>{item.step}</small>
            <strong>{item.status}</strong>
            <p>{item.detail}</p>
            <button type="button" onClick={() => onSelectModule(item.step)}>
              Buka {item.step} →
            </button>
          </article>
        ))}
      </div>

      <div className="tpq-student-pipeline-notes">
        <strong>Catatan integrasi</strong>
        <ul>
          {HANDOFF_NOTES.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </div>
    </section>
  );
}
