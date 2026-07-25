import { financePeriods } from '../../data/siteContent.js';
import '../../styles/financeAdmin.css';

export default function FinanceCategoryBreakdown({ selectedPeriod = 'juni2026' }) {
  const activePeriod = financePeriods[selectedPeriod];
  const incomeSources = activePeriod.incomeBreakdown;
  const expenseBreakdown = activePeriod.expenseBreakdown;
  const periodLabel = activePeriod.label;

  return (
    <div className="fin-breakdown-grid">
      {/* Card 1: Donut Chart */}
      <div className="fin-breakdown-wrapper" style={{ marginBottom: 0 }}>
        <div className="fin-breakdown-title">Komposisi Sumber Masuk ({periodLabel})</div>
        <div className="fin-breakdown-subtitle">Breakdown per kategori</div>

        <div className="fin-donut-container">
          <div className="fin-donut" aria-hidden="true"></div>
          <div className="fin-legend-list">
            {incomeSources.map((item, idx) => (
              <div className="fin-legend-item" key={idx}>
                <div className="fin-legend-color" style={{ background: item.color || '#0c2b1d' }}></div>
                <div className="fin-legend-label">{item.label}</div>
                <div className="fin-legend-pct">{item.percent}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Detailed Category Lists */}
      <div className="fin-breakdown-wrapper" style={{ marginBottom: 0 }}>
        <div className="fin-breakdown-title">Rekapitulasi Kategori ({periodLabel})</div>
        <div className="fin-breakdown-subtitle">Rincian nominal kas masuk &amp; keluar</div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0c2b1d', borderBottom: '1px solid #E5E5E5', paddingBottom: '6px', marginBottom: '10px' }}>Sumber Masuk</h4>
          {incomeSources.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: '1px dashed #F0F0F0' }}>
              <span style={{ color: '#3a5244' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: '#0c1810' }}>{item.amount}</span>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9b2113', borderBottom: '1px solid #E5E5E5', paddingBottom: '6px', marginBottom: '10px' }}>Penggunaan Keluar</h4>
          {expenseBreakdown.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: '1px dashed #F0F0F0' }}>
              <span style={{ color: '#3a5244' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: '#0c1810' }}>{item.amount || item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
