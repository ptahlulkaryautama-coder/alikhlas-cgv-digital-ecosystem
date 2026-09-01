const FLOW_STEPS = [
  {
    step: '1',
    title: 'Absensi sesi',
    module: 'Absensi',
    detail: 'Pengampu menyiapkan draft hadir/izin/sakit/alfa memakai kode opaque.',
    output: 'Rekap kehadiran kelas',
    cta: 'Buka Absensi',
  },
  {
    step: '2',
    title: 'Progres belajar',
    module: 'Progres',
    detail: 'Catat capaian Iqra, Al-Qur’an, hafalan, dan tindak lanjut singkat.',
    output: 'Checkpoint belajar',
    cta: 'Buka Progres',
  },
  {
    step: '3',
    title: 'Bahan raport',
    module: 'Raport',
    detail: 'Gabungkan ringkasan absensi dan progres untuk preview raport.',
    output: 'Preview print safe',
    cta: 'Buka Raport',
  },
];

export default function TPQAcademicFlowPreview({ onSelectModule }) {
  return (
    <section className="tpq-academic-flow" aria-label="Alur akademik harian App TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>ALUR AKADEMIK</span>
          <h3>Absensi → Progres → Raport</h3>
          <p>
            Simulasi ini mengikat tiga pekerjaan utama pengampu. Semua masih dummy/opaque,
            belum membaca nama anak atau catatan privat.
          </p>
        </div>
        <strong>Safe chain</strong>
      </div>

      <div className="tpq-academic-flow-grid">
        {FLOW_STEPS.map((item) => (
          <article key={item.title}>
            <span>{item.step}</span>
            <div>
              <small>{item.module}</small>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <em>Output: {item.output}</em>
              <button type="button" onClick={() => onSelectModule(item.module)}>
                {item.cta} →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
