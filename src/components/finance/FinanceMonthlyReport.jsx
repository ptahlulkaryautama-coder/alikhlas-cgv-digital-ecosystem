import { monthlyReports } from '../../data/siteContent.js';
import '../../styles/financeAdmin.css';

function getBadgeClass(status) {
  const s = String(status).toLowerCase();
  if (s.includes('peninjauan') || s.includes('draft')) return 'fin-badge-draft';
  if (s.includes('publik') || s.includes('diterbitkan')) return 'fin-badge-public';
  return 'fin-badge-archive';
}

export default function FinanceMonthlyReport() {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#0c1810' }}>Laporan Bulanan</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7f74' }}>Arsip ringkasan kas per periode (Read-only)</p>
        </div>
      </div>
      
      <div className="fin-reports-grid">
        {monthlyReports.slice(0, 3).map((report, i) => (
          <div key={i} className="fin-report-card">
            <div className="fin-report-month">{report.month}</div>
            <div className="fin-report-desc">{report.title} — {report.summary}</div>
            <span className={`fin-badge ${getBadgeClass(report.status)}`}>{report.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
