const ASSEMBLY_STEPS = [
  {
    source: 'Absensi',
    output: 'Rekap kehadiran',
    boundary: 'Agregat kelas dulu',
  },
  {
    source: 'Progres',
    output: 'Ringkasan capaian',
    boundary: 'Catatan individu terkunci',
  },
  {
    source: 'Raport',
    output: 'Draft wali santri',
    boundary: 'Print privat + audit',
  },
  {
    source: 'Kas TPQ',
    output: 'Lampiran keuangan',
    boundary: 'Ledger TPQ read-only',
  },
  {
    source: 'Agenda',
    output: 'Kegiatan periode',
    boundary: 'Public-safe only',
  },
];

export default function TPQReportAssemblyPreview() {
  return (
    <section className="tpq-report-assembly" aria-label="Preview assembly laporan TPQ aman">
      <div className="tpq-demo-header compact">
        <div>
          <span>REPORT ASSEMBLY</span>
          <h3>Absensi + Progres + Raport + Kas + Agenda</h3>
          <p>
            Blueprint laporan bulanan/semester. Belum export, belum print produksi, dan belum membaca
            data privat anak.
          </p>
        </div>
        <strong>Locked export</strong>
      </div>

      <div className="tpq-report-assembly-flow">
        {ASSEMBLY_STEPS.map((step) => (
          <article key={step.source}>
            <small>{step.source}</small>
            <strong>{step.output}</strong>
            <span>{step.boundary}</span>
          </article>
        ))}
      </div>

      <div className="tpq-report-assembly-footer">
        <strong>Output pilot:</strong>
        <span>preview layar saja, tanpa file PDF/CSV, tanpa nama anak, dan tanpa penyimpanan lokal.</span>
      </div>
    </section>
  );
}
