import Container from '../common/Container.jsx';

function getBadgeStyle(status) {
  const s = String(status).toLowerCase();
  if (s.includes('verifikasi') || s.includes('peninjauan')) {
    return { background: '#FFF3CD', color: '#856404', border: '1px solid #FFEEBA', fontWeight: 600 };
  }
  return { background: '#E2E8F0', color: '#475569', border: '1px solid #CBD5E1', fontWeight: 600 };
}

export default function ReportList({ reports }) {
  const safeReports = reports.map((rep) => {
    if (rep.month.includes('Mei') || rep.month.includes('Juni') || rep.month.includes('Jun')) {
      return {
        ...rep,
        status: 'Dalam verifikasi',
        summary: 'Ringkasan kas bulanan sedang diperiksa bersama Bendahara DKM. Laporan resmi akan diterbitkan setelah verifikasi selesai.',
      };
    }
    return rep;
  });

  return (
    <section className="report-list-section" aria-labelledby="reports-title">
      <Container>
        <div className="report-list-head">
          <div>
            <div className="transparency-hero-label" style={{ color: '#0c2b1d', marginBottom: '8px' }}>
              <span className="fin-line" style={{ background: '#0c2b1d' }}></span> Laporan Bulanan
            </div>
            <h2 id="reports-title" style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#0c2b1d', margin: 0 }}>
              Arsip Laporan Kas Bulanan
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7f74', lineHeight: 1.6 }}>
            Ringkasan penerimaan dan pengeluaran kas per bulan tanpa mencantumkan data pribadi donatur.
          </p>
        </div>
        <div className="report-list-grid">
          {safeReports.map((report) => (
            <article className="report-card" key={report.month}>
              <span>{report.month}</span>
              <h3>{report.title}</h3>
              <p>{report.summary}</p>
              <span className="report-badge" style={getBadgeStyle(report.status)}>
                {report.status}
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
