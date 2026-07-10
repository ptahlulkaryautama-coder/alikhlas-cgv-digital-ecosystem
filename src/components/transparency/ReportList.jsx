import Container from '../common/Container.jsx';

export default function ReportList({ reports }) {
  return (
    <section className="report-list-section" aria-labelledby="reports-title">
      <Container>
        <div className="report-list-head">
          <div className="section-kicker-block">
            <p className="label">Laporan Bulanan</p>
            <h2 id="reports-title" className="section-title">
              Catatan publik yang ringkas.
            </h2>
          </div>
          <p>
            Laporan lengkap tetap divalidasi oleh pengurus. Versi publik menampilkan ringkasan
            amanah tanpa nama donatur atau informasi pribadi.
          </p>
        </div>
        <div className="report-list-grid">
          {reports.map((report) => (
            <article className="report-card" key={report.month}>
              <span>{report.month}</span>
              <h3>{report.title}</h3>
              <p>{report.summary}</p>
              <strong>{report.status}</strong>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
