const PHASES = [
  {
    number: '01',
    title: 'Fondasi integrasi',
    status: 'Fondasi selesai',
    note: 'Auth, RLS, audit, kill switch, workflow utama, dan handoff sudah hijau.',
    state: 'ready',
  },
  {
    number: '02',
    title: 'Polish operator',
    status: 'Berjalan',
    note: 'Rapikan layout, empty state, copy tombol, dan mobile spacing.',
    state: 'active',
  },
  {
    number: '03',
    title: 'Rilis konten asli',
    status: 'Menunggu konten',
    note: 'Artikel, Program, dan Agenda asli dirilis lewat Pusat Rilis Website.',
    state: 'pending',
  },
  {
    number: '04',
    title: 'Finance production',
    status: 'Perlu data final',
    note: 'Kategori Bendahara, backup, koreksi ledger, dan import bulan riil.',
    state: 'pending',
  },
  {
    number: '05',
    title: 'App TPQ private',
    status: 'Policy gate',
    note: 'Safe shell luas siap; data anak baru dibuka setelah keputusan DKM/TPQ.',
    state: 'locked',
  },
  {
    number: '06',
    title: 'Deploy production',
    status: 'Belum deploy',
    note: 'Backup, smoke test, flags aman, dan approval DKM sebelum online.',
    state: 'locked',
  },
];

export default function ProjectCompletionPhasesPanel() {
  return (
    <section className="db-card project-phases" aria-labelledby="project-phases-title">
      <div className="project-phases__head">
        <div>
          <div className="db-sec-eyebrow">Roadmap Penyelesaian</div>
          <h2 id="project-phases-title">6 phase sampai ecosystem complete</h2>
          <p>
            Ringkasan ini mengikuti dokumen <code>PROJECT_COMPLETION_PHASES.md</code>.
            Fokus sekarang: polish operator dan App TPQ stand-alone tanpa membuka private vault.
          </p>
        </div>
        <span className="fin-pill">206/206 test</span>
      </div>

      <div className="project-phases__rail" aria-label="Status enam phase project">
        {PHASES.map((phase) => (
          <article className={`project-phases__item is-${phase.state}`} key={phase.number}>
            <div className="project-phases__number">{phase.number}</div>
            <div>
              <span>{phase.status}</span>
              <h3>{phase.title}</h3>
              <p>{phase.note}</p>
            </div>
          </article>
        ))}
      </div>

      <footer className="project-phases__foot">
        <strong>Aksi aman berikutnya:</strong>
        <span>lanjut simulasi App TPQ dummy, polish UI/UX, dan update docs tanpa membuka data privat.</span>
      </footer>
    </section>
  );
}
