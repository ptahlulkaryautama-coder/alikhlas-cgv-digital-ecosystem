import TPQAcademicFlowPreview from './TPQAcademicFlowPreview.jsx';
import TPQClassMentorEvaluationBridge from './TPQClassMentorEvaluationBridge.jsx';
import TPQDailySessionHandoffPreview from './TPQDailySessionHandoffPreview.jsx';
import TPQMobileAppFramePreview from './TPQMobileAppFramePreview.jsx';
import TPQOperatorChecklistPreview from './TPQOperatorChecklistPreview.jsx';
import TPQPilotReadinessPreview from './TPQPilotReadinessPreview.jsx';
import TPQRoleJourneyPreview from './TPQRoleJourneyPreview.jsx';
import TPQStudentSessionPipeline from './TPQStudentSessionPipeline.jsx';

const TODAY_TASKS = [
  { label: 'Absensi kelas', target: 'Absensi', hint: 'Siapkan draft kehadiran setelah sesi.' },
  { label: 'Catat progres', target: 'Progres', hint: 'Gunakan catatan singkat dan sopan.' },
  { label: 'Cek agenda', target: 'Agenda', hint: 'Lihat kegiatan terdekat yang sudah public-safe.' },
  { label: 'Pantau kas', target: 'Kas TPQ', hint: 'Ringkasan ledger TPQ read-only.' },
];

const HOME_KPIS = [
  { label: 'Kelas dummy', value: '3', detail: 'Kelompok belajar' },
  { label: 'Alur aktif', value: '5', detail: 'Absensi, progres, raport, kas, agenda' },
  { label: 'Data privat', value: '0', detail: 'Belum dibaca di shell ini' },
];

export default function TPQPengampuHomeOverview({ onSelectModule }) {
  return (
    <div className="tpq-home-overview" aria-label="Beranda aman App Pengampu TPQ">
      <section className="tpq-home-hero">
        <div>
          <span>BERANDA HARIAN</span>
          <h3>Ruang kerja pengampu tanpa membuka data privat</h3>
          <p>
            Mulai dari tugas paling sering: absensi, progres belajar, agenda, dan kas TPQ.
            Semua kartu di fase ini masih demo/read-only sampai private vault disetujui.
          </p>
        </div>
        <strong>Safe shell</strong>
      </section>

      <div className="tpq-home-kpis">
        {HOME_KPIS.map((item) => (
          <article key={item.label}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </article>
        ))}
      </div>

      <section className="tpq-home-tasks">
        <div className="tpq-demo-header compact">
          <div>
            <span>CHECKLIST CEPAT</span>
            <h3>Tugas Pengampu</h3>
            <p>Shortcut ini hanya memindahkan tampilan modul, bukan menyimpan data.</p>
          </div>
        </div>

        <div className="tpq-home-task-grid">
          {TODAY_TASKS.map((task) => (
            <button className="tpq-home-task" key={task.label} type="button" onClick={() => onSelectModule(task.target)}>
              <span>{task.label}</span>
              <small>{task.hint}</small>
              <strong>Buka {task.target} →</strong>
            </button>
          ))}
        </div>
      </section>

      <TPQOperatorChecklistPreview onSelectModule={onSelectModule} />

      <TPQAcademicFlowPreview onSelectModule={onSelectModule} />

      <TPQStudentSessionPipeline onSelectModule={onSelectModule} />

      <TPQClassMentorEvaluationBridge onSelectModule={onSelectModule} />

      <TPQDailySessionHandoffPreview onSelectModule={onSelectModule} />

      <TPQPilotReadinessPreview />

      <TPQRoleJourneyPreview onSelectModule={onSelectModule} />

      <TPQMobileAppFramePreview />
    </div>
  );
}
