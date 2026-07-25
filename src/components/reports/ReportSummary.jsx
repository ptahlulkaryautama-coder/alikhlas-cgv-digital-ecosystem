import React from 'react';

export default function ReportSummary() {
  const kpis = [
    { label: 'TOTAL DOKUMEN', value: '12', hint: 'Arsip terdaftar', icon: '📁' },
    { label: 'LAPORAN KEUANGAN', value: '5', hint: 'Rekapitulasi kas', icon: '💰' },
    { label: 'SK & SURAT KEPUTUSAN', value: '4', hint: 'Dokumen legalitas', icon: '📋' },
    { label: 'NOTULEN RAPAT', value: '3', hint: 'Musyawarah DKM', icon: '📝' },
  ];

  return (
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
  );
}
