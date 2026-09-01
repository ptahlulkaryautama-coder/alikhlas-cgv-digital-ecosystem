const EXPORT_MANIFEST = [
  { report: 'Rekap Absensi', audience: 'Internal TPQ', format: 'PDF/CSV terkunci', data: 'Agregat + private vault nanti' },
  { report: 'Rekap Progres', audience: 'Kepala TPQ', format: 'PDF terkunci', data: 'Catatan terotorisasi' },
  { report: 'Raport Santri', audience: 'Wali santri', format: 'Print/PDF privat', data: 'Per santri, bukan publik' },
  { report: 'Kas TPQ', audience: 'DKM/Bendahara', format: 'CSV agregat', data: 'Finance ledger TPQ' },
];

export default function TPQReportExportManifestPreview() {
  return (
    <section className="tpq-export-manifest" aria-label="Preview manifest export laporan TPQ">
      <div className="tpq-demo-header compact">
        <div>
          <span>EXPORT MANIFEST</span>
          <h3>Peta Laporan & Tujuan</h3>
          <p>Semua export produksi harus punya tujuan, format, dan batas data sebelum tombol diaktifkan.</p>
        </div>
      </div>

      <div className="tpq-export-table" role="table" aria-label="Manifest export TPQ tanpa data privat">
        <div className="tpq-export-row is-head" role="row">
          <span role="columnheader">Laporan</span>
          <span role="columnheader">Tujuan</span>
          <span role="columnheader">Format</span>
          <span role="columnheader">Data</span>
        </div>
        {EXPORT_MANIFEST.map((row) => (
          <div className="tpq-export-row" role="row" key={row.report}>
            <strong role="cell">{row.report}</strong>
            <span role="cell">{row.audience}</span>
            <span role="cell">{row.format}</span>
            <span role="cell">{row.data}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
