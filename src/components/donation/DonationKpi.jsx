import React from 'react';

export default function DonationKpi() {
  const kpis = [
    { label: 'TOTAL DANA MASUK', value: 'Rp 12.850.000', hint: 'Kas Masuk Juni 2026', icon: '📈' },
    { label: 'TRANSAKSI DONASI', value: '24', hint: 'Transaksi terverifikasi', icon: '💳' },
    { label: 'TARGET BULANAN', value: 'Rp 15.000.000', hint: 'Kebutuhan operasional', icon: '🎯' },
    { label: 'PENCAPAIAN', value: '85.6%', hint: 'Tingkat ketercukupan', icon: '🌟' },
  ];

  return (
    <div>
      <div className="fin-kpi-grid" style={{ marginBottom: '24px' }}>
        {kpis.map((kpi) => (
          <div className="fin-kpi-card" key={kpi.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="fin-kpi-label">{kpi.label}</div>
                <div className="fin-kpi-value" style={{ margin: '8px 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: '#0c2b1d' }}>{kpi.value}</div>
                <div className="fin-kpi-hint">{kpi.hint}</div>
              </div>
              <span style={{ fontSize: '24px', opacity: 0.8 }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Target Progress Bar */}
      <div className="db-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: '#3a5244', marginBottom: '8px' }}>
          <span>Realisasi Target Operasional &amp; Sosial Bulan Juni 2026 (Proyeksi)</span>
          <span style={{ color: '#c9a55a' }}>Rp 12.850.000 / Rp 15.000.000 (85.6%)</span>
        </div>
        <div style={{ height: '12px', background: '#ede9df', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '85.6%', background: 'linear-gradient(90deg, #0c2b1d, #c9a55a)', borderRadius: 'inherit' }} />
        </div>
      </div>
    </div>
  );
}
