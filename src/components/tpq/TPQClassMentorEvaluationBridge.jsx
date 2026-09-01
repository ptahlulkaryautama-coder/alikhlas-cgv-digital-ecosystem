const BRIDGE_STEPS = [
  {
    title: 'Kelas',
    module: 'Kelas',
    status: 'Jadwal aman',
    detail: 'Kelompok belajar, hari, dan ruang memakai label generik.',
  },
  {
    title: 'Pengampu',
    module: 'Pengampu',
    status: 'Coverage draft',
    detail: 'Pengampu A/B/C dipakai untuk uji cakupan tanpa identitas staf.',
  },
  {
    title: 'Evaluasi',
    module: 'Evaluasi Pengampu',
    status: 'Private only',
    detail: 'Rubrik internal tetap terkunci sampai policy SDM TPQ disetujui.',
  },
];

export default function TPQClassMentorEvaluationBridge({ onSelectModule }) {
  return (
    <section className="tpq-class-mentor-bridge" aria-label="Bridge kelas pengampu evaluasi TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>CLASS TO MENTOR BRIDGE</span>
          <h3>Kelas → Pengampu → Evaluasi</h3>
          <p>
            Peta operasional ini memastikan jadwal kelas, coverage pengampu, dan evaluasi internal
            saling nyambung tanpa membuka identitas personal.
          </p>
        </div>
        <strong>Dummy safe</strong>
      </div>

      <div className="tpq-class-mentor-bridge-grid">
        {BRIDGE_STEPS.map((step, index) => (
          <article key={step.title}>
            <span className="tpq-class-mentor-bridge-index">{index + 1}</span>
            <small>{step.status}</small>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
            <button type="button" onClick={() => onSelectModule(step.module)}>
              Buka {step.module} →
            </button>
          </article>
        ))}
      </div>

      <div className="tpq-class-mentor-bridge-safe">
        <strong>Batas aman pilot</strong>
        <p>
          Belum ada nama pengampu asli, jadwal personal, catatan evaluasi riil, atau export SDM.
          Data produksi nanti wajib lewat private vault, role scope, audit, dan retensi.
        </p>
      </div>
    </section>
  );
}
