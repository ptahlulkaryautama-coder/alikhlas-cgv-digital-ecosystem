import { financePeriods } from '../../data/siteContent.js';
import '../../styles/financeAdmin.css';

export default function FinanceCategoryBreakdown({ selectedPeriod = 'juni2026', data = null }) {
  const activePeriod = financePeriods[selectedPeriod];
  const format = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  const incomeTotal = data?.totalIncome || 0;
  const incomeSources = data ? data.incomeBreakdown.map((item) => ({ label: item.category, amount: format(item.amount), percent: incomeTotal ? Math.round(item.amount / incomeTotal * 100) : 0 })) : activePeriod.incomeBreakdown;
  const expenseBreakdown = data ? data.expenseBreakdown.map((item) => ({ label: item.category, amount: format(item.amount) })) : activePeriod.expenseBreakdown;
  const periodLabel = data ? data.period : activePeriod.label;
  const maxIncome = Math.max(...incomeSources.map((item) => item.percent || 0), 1);
  const expenseValues = expenseBreakdown.map((item) => Number(String(item.amount || item.val || '').replace(/[^0-9]/g, '')) || 0);
  const maxExpense = Math.max(...expenseValues, 1);

  return (
    <div className="fin-breakdown-stack">
      {/* Card 1: Donut Chart */}
      <section className="fin-breakdown-wrapper" aria-labelledby="income-composition-title">
        <div className="fin-breakdown-title" id="income-composition-title">Komposisi Sumber Masuk ({periodLabel})</div>
        <div className="fin-breakdown-subtitle">Breakdown per kategori</div>

        <div className="fin-donut-container">
          <div className="fin-donut" role="img" aria-label={`Komposisi sumber kas masuk ${periodLabel}`}></div>
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
      </section>

      {/* Card 2: Detailed Category Lists */}
      <section className="fin-breakdown-wrapper" aria-labelledby="category-recap-title">
        <div className="fin-breakdown-title" id="category-recap-title">Rekap per Kategori ({periodLabel})</div>
        <div className="fin-breakdown-subtitle">Breakdown sumber dan penggunaan dana secara lengkap</div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0c2b1d', borderBottom: '1px solid #E5E5E5', paddingBottom: '6px', marginBottom: '10px' }}>Sumber Masuk</h4>
          {incomeSources.map((item, idx) => (
            <div className="fin-category-row" key={idx}>
              <div className="fin-category-meta"><span>{item.label}</span><strong>{item.amount}</strong></div>
              <div className="fin-category-track"><span className="fin-category-fill fin-category-fill-in" style={{ width: `${Math.max(4, ((item.percent || 0) / maxIncome) * 100)}%` }} /></div>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9b2113', borderBottom: '1px solid #E5E5E5', paddingBottom: '6px', marginBottom: '10px' }}>Penggunaan Keluar</h4>
          {expenseBreakdown.map((item, idx) => (
            <div className="fin-category-row" key={idx}>
              <div className="fin-category-meta"><span>{item.label}</span><strong className="fin-category-out">{item.amount || item.val}</strong></div>
              <div className="fin-category-track"><span className="fin-category-fill fin-category-fill-out" style={{ width: `${Math.max(4, (expenseValues[idx] / maxExpense) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
