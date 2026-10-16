import React, { useState } from 'react';
import { financePeriods } from '../../data/siteContent.js';
import DonutChart from '../common/DonutChart.jsx';
import '../../styles/financeAdmin.css';

export default function FinanceCategoryBreakdown({ selectedPeriod = 'september2026', data = null }) {
  const [activeTab, setActiveTab] = useState('both'); // 'income' | 'expense' | 'both'
  const activePeriod = financePeriods[selectedPeriod] || financePeriods.september2026;
  const format = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  const incomeTotal = data?.totalIncome || (activePeriod?.kasMasukRaw ?? 22046541);
  const incomeSources = data
    ? data.incomeBreakdown.map((item) => ({
        label: item.category,
        amount: format(item.amount),
        percent: incomeTotal ? Math.round((item.amount / incomeTotal) * 100) : 0,
        color: item.color,
      }))
    : activePeriod.incomeBreakdown;

  const expenseBreakdown = data
    ? data.expenseBreakdown.map((item) => ({
        label: item.category,
        amount: format(item.amount),
        color: item.color,
      }))
    : activePeriod.expenseBreakdown;

  const periodLabel = data ? data.period : activePeriod.label;
  const maxIncome = Math.max(...incomeSources.map((item) => item.percent || 0), 1);
  
  const expenseValues = expenseBreakdown.map((item) => Number(String(item.amount || item.val || '').replace(/[^0-9]/g, '')) || 0);
  const totalExpenseVal = expenseValues.reduce((a, b) => a + b, 0) || (activePeriod?.kasKeluarRaw ?? 23710000);
  const maxExpense = Math.max(...expenseValues, 1);

  const expenseItemsWithPct = expenseBreakdown.map((item, idx) => {
    const val = expenseValues[idx] || 0;
    const pct = item.percent || (totalExpenseVal ? Math.round((val / totalExpenseVal) * 100) : 0);
    const color = item.color || ['#9b2113', '#dc2626', '#b45309', '#d97706', '#7c2d12'][idx % 5];
    return {
      ...item,
      percent: pct,
      color,
    };
  });

  return (
    <div className="fin-breakdown-stack">
      {/* Dual Donut Charts Section */}
      <section className="fin-breakdown-wrapper" aria-labelledby="composition-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div className="fin-breakdown-title" id="composition-title">Komposisi Pemasukan &amp; Pengeluaran</div>
            <div className="fin-breakdown-subtitle" style={{ marginBottom: 0 }}>Diagram proporsi sumber kas dan realisasi pengeluaran ({periodLabel})</div>
          </div>
          <div style={{ display: 'flex', gap: '6px', background: '#F4F3EE', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('both')}
              style={{
                border: 'none',
                background: activeTab === 'both' ? '#0c2b1d' : 'transparent',
                color: activeTab === 'both' ? '#FAF6F0' : '#4a5568',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('income')}
              style={{
                border: 'none',
                background: activeTab === 'income' ? '#0f6130' : 'transparent',
                color: activeTab === 'income' ? '#ffffff' : '#4a5568',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Kas Masuk
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expense')}
              style={{
                border: 'none',
                background: activeTab === 'expense' ? '#9b2113' : 'transparent',
                color: activeTab === 'expense' ? '#ffffff' : '#4a5568',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Kas Keluar
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'both' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr', gap: '24px', marginTop: '16px' }}>
          {/* Donut 1: Kas Masuk */}
          {(activeTab === 'both' || activeTab === 'income') && (
            <div style={{ background: '#FAF9F6', padding: '20px', borderRadius: '12px', border: '1px solid #EAE8E2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <strong style={{ fontSize: '14px', color: '#0f6130' }}>🟢 Sumber Kas Masuk</strong>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0c2b1d' }}>{activePeriod?.kasMasuk || format(incomeTotal)}</span>
              </div>
              <DonutChart
                items={incomeSources}
                centerLabel="Total Masuk"
                centerValue={activePeriod?.kasMasuk || format(incomeTotal)}
                size={160}
                strokeWidth={20}
                ariaLabel={`Donut Sumber Masuk ${periodLabel}`}
              />
              <div className="fin-legend-list" style={{ marginTop: '16px' }}>
                {incomeSources.map((item, idx) => (
                  <div className="fin-legend-item" key={idx}>
                    <div className="fin-legend-color" style={{ background: item.color || '#0c2b1d' }}></div>
                    <div className="fin-legend-label">{item.label}</div>
                    <div className="fin-legend-pct">{item.percent}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donut 2: Realisasi Kas Keluar */}
          {(activeTab === 'both' || activeTab === 'expense') && (
            <div style={{ background: '#FAF9F6', padding: '20px', borderRadius: '12px', border: '1px solid #EAE8E2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <strong style={{ fontSize: '14px', color: '#9b2113' }}>🔴 Realisasi Pengeluaran</strong>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0c2b1d' }}>{activePeriod?.kasKeluar || format(totalExpenseVal)}</span>
              </div>
              <DonutChart
                items={expenseItemsWithPct}
                centerLabel="Total Keluar"
                centerValue={activePeriod?.kasKeluar || format(totalExpenseVal)}
                size={160}
                strokeWidth={20}
                ariaLabel={`Donut Pengeluaran ${periodLabel}`}
              />
              <div className="fin-legend-list" style={{ marginTop: '16px' }}>
                {expenseItemsWithPct.map((item, idx) => (
                  <div className="fin-legend-item" key={idx}>
                    <div className="fin-legend-color" style={{ background: item.color || '#9b2113' }}></div>
                    <div className="fin-legend-label">{item.label}</div>
                    <div className="fin-legend-pct">{item.percent}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          {expenseItemsWithPct.map((item, idx) => (
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
