const READINESS_ITEMS = [
  {
    label: 'Field raport',
    status: 'Menunggu approval',
    detail: 'Nilai, catatan, dan predikat harus disepakati sebelum data asli dibuka.',
  },
  {
    label: 'Akses pengampu',
    status: 'Scoped',
    detail: 'Pengampu hanya boleh melihat raport kelas/santri yang diotorisasi.',
  },
  {
    label: 'Audit print',
    status: 'Wajib',
    detail: 'Setiap preview, print, atau export PDF produksi harus tercatat.',
  },
  {
    label: 'Output wali',
    status: 'Private',
    detail: 'Raport tidak punya link publik dan tidak masuk website utama.',
  },
];

export default function TPQRaportPrintReadinessChecklist() {
  return (
    <section className="tpq-raport-readiness" aria-label="Checklist kesiapan print raport privat">
      <div>
        <span>PRINT READINESS</span>
        <h4>Checklist sebelum raport asli dicetak</h4>
        <p>
          Panel ini masih simulasi. Tujuannya memastikan print raport nanti tetap private, terotorisasi,
          dan punya jejak audit.
        </p>
      </div>

      <div className="tpq-raport-readiness-grid">
        {READINESS_ITEMS.map((item) => (
          <article key={item.label}>
            <small>{item.status}</small>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
