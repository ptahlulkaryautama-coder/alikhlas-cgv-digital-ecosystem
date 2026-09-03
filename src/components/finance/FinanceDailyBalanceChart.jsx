import React, { useState } from 'react';
import '../../styles/financeAdmin.css';

export default function FinanceDailyBalanceChart({ selectedPeriod = 'agustus2026', data = null }) {
  const [scaleMode, setScaleMode] = useState('dual'); // 'dual' | 'absolute'
  const [showKasMasjid, setShowKasMasjid] = useState(true);
  const [showJpu, setShowJpu] = useState(true);

  // Line 1: Kas Operasional Masjid (Agustus 2026 - 1 Bulan Penuh)
  // Dual axis: 14M -> 24M (y: 230 -> 40)
  // Absolute axis: 0 -> 25M (y: 240 -> 35)
  const rawKasAgustus = [
    { label: '01 Ags', x: 60, yDual: 146.7, yAbs: 89.2, value: 'Rp 18.386.130' },
    { label: '07 Ags', x: 196, yDual: 121.2, yAbs: 78.2, value: 'Rp 19.726.130' },
    { label: '14 Ags', x: 355, yDual: 93.7, yAbs: 66.4, value: 'Rp 21.176.130' },
    { label: '20 Ags', x: 491, yDual: 133.3, yAbs: 83.4, value: 'Rp 19.091.667' },
    { label: '21 Ags', x: 513, yDual: 110.2, yAbs: 73.5, value: 'Rp 20.303.667' },
    { label: '27 Ags', x: 649, yDual: 103.4, yAbs: 70.5, value: 'Rp 20.665.667' },
    { label: '28 Ags', x: 672, yDual: 70.0, yAbs: 56.1, value: 'Rp 22.423.667' },
    { label: '30 Ags', x: 717, yDual: 83.3, yAbs: 61.9, value: 'Rp 21.723.667' },
    { label: '31 Ags', x: 740, yDual: 186.1, yAbs: 106.2, value: 'Rp 16.313.667' }
  ];

  // Line 2: Dana Sosial - Jumat Peduli Umat (JPU)
  // Dual axis: 1M -> 6.5M (y: 230 -> 40)
  // Absolute axis: 0 -> 25M (y: 240 -> 35)
  const rawJpuAgustus = [
    { label: '01 Ags', x: 60, yDual: 205.8, yAbs: 226.1, value: 'Rp 1.700.000' },
    { label: '07 Ags', x: 196, yDual: 212.7, yAbs: 227.7, value: 'Rp 1.500.000' },
    { label: '15 Ags', x: 377, yDual: 200.6, yAbs: 224.8, value: 'Rp 1.850.000' },
    { label: '20 Ags', x: 491, yDual: 102.2, yAbs: 201.5, value: 'Rp 4.700.000' },
    { label: '21 Ags', x: 513, yDual: 117.7, yAbs: 205.1, value: 'Rp 4.250.000' },
    { label: '27 Ags', x: 649, yDual: 83.2, yAbs: 196.9, value: 'Rp 5.250.000' },
    { label: '28 Ags', x: 672, yDual: 91.8, yAbs: 199.0, value: 'Rp 5.000.000' },
    { label: '30 Ags', x: 717, yDual: 102.2, yAbs: 201.5, value: 'Rp 4.700.000' },
    { label: '31 Ags', x: 740, yDual: 102.2, yAbs: 201.5, value: 'Rp 4.700.000' }
  ];

  const pointsKasAgustus = rawKasAgustus.map(p => ({ ...p, y: scaleMode === 'dual' ? p.yDual : p.yAbs }));
  const pointsJpuAgustus = rawJpuAgustus.map(p => ({ ...p, y: scaleMode === 'dual' ? p.yDual : p.yAbs }));

  const pointsMei = [
    { label: '1 Mei', x: 50, y: 150.5, value: 'Rp 4.882.104' },
    { label: '1 Mei', x: 90, y: 240, value: 'Rp 0' },
    { label: '5 Mei', x: 170, y: 220, value: 'Rp 1.094.708' },
    { label: '10 Mei', x: 290, y: 201.7, value: 'Rp 2.095.708' },
    { label: '15 Mei', x: 410, y: 172.2, value: 'Rp 3.700.708' },
    { label: '21 Mei', x: 530, y: 164.1, value: 'Rp 4.150.708' },
    { label: '26 Mei', x: 650, y: 124.7, value: 'Rp 6.288.708' },
    { label: '27 Mei', x: 750, y: 35.4, value: 'Rp 11.162.708' }
  ];

  const pointsJuni = [
    { label: '1 Jun', x: 50, y: 150.5, value: 'Rp 4.882.104' },
    { label: '1 Jun', x: 90, y: 240, value: 'Rp 0' },
    { label: '5 Jun', x: 170, y: 220, value: 'Rp 1.094.708' },
    { label: '10 Jun', x: 290, y: 201.7, value: 'Rp 2.095.708' },
    { label: '15 Jun', x: 410, y: 172.2, value: 'Rp 3.700.708' },
    { label: '21 Jun', x: 530, y: 164.1, value: 'Rp 4.150.708' },
    { label: '26 Jun', x: 650, y: 124.7, value: 'Rp 6.288.708' },
    { label: '27 Jun', x: 750, y: 140.4, value: 'Rp 5.200.000' }
  ];

  const isAgustus = selectedPeriod === 'agustus2026' && !data;
  const sourceBalances = data?.dailyBalances?.length ? data.dailyBalances : null;
  const maxBalance = sourceBalances ? Math.max(...sourceBalances.map((item) => item.balance), 1) : 1;
  const dataPoints = sourceBalances?.map((item, index) => ({
    label: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(`${item.date}T00:00:00`)),
    x: sourceBalances.length === 1 ? 400 : 50 + (700 * index / (sourceBalances.length - 1)),
    y: 240 - (200 * item.balance / maxBalance),
    value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.balance),
  }));

  const points = dataPoints || (selectedPeriod === 'agustus2026' ? pointsKasAgustus : selectedPeriod === 'mei2026' ? pointsMei : pointsJuni);

  const pathDKas = `M ${pointsKasAgustus[0].x} ${pointsKasAgustus[0].y} ` + 
    pointsKasAgustus.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillDKas = `${pathDKas} L ${pointsKasAgustus[pointsKasAgustus.length - 1].x} 240 L ${pointsKasAgustus[0].x} 240 Z`;

  const pathDJpu = `M ${pointsJpuAgustus[0].x} ${pointsJpuAgustus[0].y} ` + 
    pointsJpuAgustus.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillDJpu = `${pathDJpu} L ${pointsJpuAgustus[pointsJpuAgustus.length - 1].x} 240 L ${pointsJpuAgustus[0].x} 240 Z`;

  // Fallback single line path
  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillD = `${pathD} L ${points[points.length - 1].x} 240 L ${points[0].x} 240 Z`;

  const periodLabel = data?.period || (selectedPeriod === 'agustus2026' ? 'Agustus 2026 (1 Bulan Penuh)' : selectedPeriod === 'mei2026' ? 'Mei 2026' : 'Juni 2026');

  return (
    <div className="fin-chart-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="fin-chart-title">Saldo Harian ({periodLabel})</div>
          <div className="fin-chart-subtitle">
            {isAgustus ? (scaleMode === 'dual' ? 'Skala Ganda (Seimbang): Kiri Kas Masjid, Kanan Dana JPU' : 'Skala Absolut (0 – 25 Juta)') : 'Perkembangan saldo akumulatif'}
          </div>
        </div>

        {isAgustus && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '14px', padding: '2px', border: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setScaleMode('dual')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '12px',
                  border: 'none',
                  background: scaleMode === 'dual' ? '#0c2b1d' : 'transparent',
                  color: scaleMode === 'dual' ? '#fff' : '#64748B',
                  cursor: 'pointer',
                }}
              >
                ⚖️ Seimbang
              </button>
              <button
                type="button"
                onClick={() => setScaleMode('absolute')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '12px',
                  border: 'none',
                  background: scaleMode === 'absolute' ? '#0c2b1d' : 'transparent',
                  color: scaleMode === 'absolute' ? '#fff' : '#64748B',
                  cursor: 'pointer',
                }}
              >
                📊 Absolut
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowKasMasjid(!showKasMasjid)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '16px',
                border: showKasMasjid ? '1px solid #0c2b1d' : '1px solid #ddd',
                background: showKasMasjid ? '#E8F5EE' : '#fff',
                color: showKasMasjid ? '#0c2b1d' : '#888',
                cursor: 'pointer',
              }}
            >
              ● Kas Masjid (Rp 16,31 jt) {showKasMasjid ? '✓' : ''}
            </button>
            <button
              type="button"
              onClick={() => setShowJpu(!showJpu)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '16px',
                border: showJpu ? '1px solid #0284c7' : '1px solid #ddd',
                background: showJpu ? '#E0F2FE' : '#fff',
                color: showJpu ? '#0369a1' : '#888',
                cursor: 'pointer',
              }}
            >
              ● JPU (Rp 4,70 jt) {showJpu ? '✓' : ''}
            </button>
          </div>
        )}
      </div>
      
      <div className="fin-chart-svg-wrapper">
        <svg viewBox="0 0 800 280" className="fin-chart-svg" width="100%" height="auto" aria-label="Grafik Saldo Harian">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2b1d" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0c2b1d" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="jpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[230, 182.5, 135, 87.5, 40].map((y, idx) => (
            <line
              key={idx}
              x1="50"
              y1={y}
              x2="750"
              y2={y}
              stroke="#E5E5E5"
              strokeDasharray="4,4"
              strokeWidth="0.8"
            />
          ))}

          {/* Grid labels (left Y-axis) */}
          {isAgustus && scaleMode === 'dual' ? (
            <>
              {[
                { label: '14jt', y: 230 },
                { label: '16.5jt', y: 182.5 },
                { label: '19jt', y: 135 },
                { label: '21.5jt', y: 87.5 },
                { label: '24jt', y: 40 },
              ].map((item, idx) => (
                <text
                  key={`left-${idx}`}
                  x="15"
                  y={item.y + 4}
                  fontSize="10"
                  fill="#0c2b1d"
                  fontWeight="600"
                  textAnchor="start"
                  fontFamily="sans-serif"
                >
                  {item.label}
                </text>
              ))}

              {/* Right Y-axis for JPU */}
              {[
                { label: '1.0jt', y: 230 },
                { label: '2.4jt', y: 182.5 },
                { label: '3.8jt', y: 135 },
                { label: '5.1jt', y: 87.5 },
                { label: '6.5jt', y: 40 },
              ].map((item, idx) => (
                <text
                  key={`right-${idx}`}
                  x="785"
                  y={item.y + 4}
                  fontSize="10"
                  fill="#0284c7"
                  fontWeight="600"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {item.label}
                </text>
              ))}
            </>
          ) : (
            [
              { label: '0', y: 240 },
              { label: '5.0jt', y: 199 },
              { label: '10.0jt', y: 158 },
              { label: '15.0jt', y: 117 },
              { label: '20.0jt', y: 76 },
              { label: '25.0jt', y: 35 },
            ].map((item, idx) => (
              <text
                key={idx}
                x="15"
                y={item.y + 4}
                fontSize="10"
                fill="#9aada4"
                textAnchor="start"
                fontFamily="sans-serif"
              >
                {item.label}
              </text>
            ))
          )}

          {isAgustus ? (
            <>
              {/* Line 1: Kas Masjid */}
              {showKasMasjid && (
                <>
                  <path d={fillDKas} fill="url(#chartGradient)" />
                  <path
                    d={pathDKas}
                    fill="none"
                    stroke="#0c2b1d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pointsKasAgustus.map((p, idx) => (
                    <g key={`kas-${idx}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="#c9a55a"
                        stroke="#0c2b1d"
                        strokeWidth="2"
                      />
                      {idx === pointsKasAgustus.length - 1 && (
                        <text
                          x={p.x - 20}
                          y={p.y - 12}
                          fontSize="11"
                          fontWeight="bold"
                          fill="#0c2b1d"
                          fontFamily="sans-serif"
                        >
                          Kas: {p.value}
                        </text>
                      )}
                    </g>
                  ))}
                </>
              )}

              {/* Line 2: JPU */}
              {showJpu && (
                <>
                  <path d={fillDJpu} fill="url(#jpuGradient)" />
                  <path
                    d={pathDJpu}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pointsJpuAgustus.map((p, idx) => (
                    <g key={`jpu-${idx}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#38bdf8"
                        stroke="#0284c7"
                        strokeWidth="2"
                      />
                      {idx === pointsJpuAgustus.length - 1 && (
                        <text
                          x={p.x - 20}
                          y={p.y + 16}
                          fontSize="11"
                          fontWeight="bold"
                          fill="#0284c7"
                          fontFamily="sans-serif"
                        >
                          JPU: {p.value}
                        </text>
                      )}
                    </g>
                  ))}
                </>
              )}

              {/* X Axis labels */}
              {[
                { label: '01 Ags', x: 60 },
                { label: '07 Ags', x: 196 },
                { label: '14 Ags', x: 355 },
                { label: '21 Ags', x: 513 },
                { label: '28 Ags', x: 672 },
                { label: '31 Ags', x: 740 },
              ].map((item, idx) => (
                <text
                  key={idx}
                  x={item.x}
                  y="265"
                  fontSize="11"
                  fill="#9aada4"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {item.label}
                </text>
              ))}
            </>
          ) : (
            <>
              {/* Gradient area under line */}
              <path d={fillD} fill="url(#chartGradient)" />

              {/* Main line */}
              <path
                d={pathD}
                fill="none"
                stroke="#0c2b1d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots and tooltips */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#c9a55a"
                    stroke="#0c2b1d"
                    strokeWidth="2.5"
                  />
                  {idx === points.length - 1 && (
                    <text
                      x={p.x - 20}
                      y={p.y - 12}
                      fontSize="11"
                      fontWeight="bold"
                      fill="#0c2b1d"
                      fontFamily="sans-serif"
                    >
                      {p.value}
                    </text>
                  )}
                </g>
              ))}

              {/* X axis labels (bottom) */}
              {points.map((item, idx) => (
                <text
                  key={idx}
                  x={item.x}
                  y="265"
                  fontSize="11"
                  fill="#9aada4"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {item.label}
                </text>
              ))}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

