import React, { useState } from 'react';
import Container from '../common/Container.jsx';

export default function PublicCashflowChart() {
  const [scaleMode, setScaleMode] = useState('dual'); // 'dual' (balanced) | 'absolute'
  const [showKasMasjid, setShowKasMasjid] = useState(true);
  const [showJpu, setShowJpu] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Line 1: Kas Operasional Masjid (Per 30 September 2026)
  // Dual axis: 12M -> 24M (y: 230 -> 40)
  // Absolute axis: 0 -> 25M (y: 240 -> 35)
  const rawKasMasjid = [
    { label: '01 Sep (Awal)', date: '01 Sep', fund: 'Kas Masjid', valueNum: 16313667, valueStr: 'Rp 16.313.667', x: 60, yDual: 161.7, yAbs: 106.2 },
    { label: '04 Sep (Infaq Jumat)', date: '04 Sep', fund: 'Kas Masjid', valueNum: 17887667, valueStr: 'Rp 17.887.667', x: 130, yDual: 136.8, yAbs: 93.3 },
    { label: '07 Sep (Bantuan Bu Rusmah)', date: '07 Sep', fund: 'Kas Masjid', valueNum: 17061167, valueStr: 'Rp 17.061.167', x: 200, yDual: 149.9, yAbs: 100.1 },
    { label: '10 Sep (Infaq Listrik/Air)', date: '10 Sep', fund: 'Kas Masjid', valueNum: 19061167, valueStr: 'Rp 19.061.167', x: 270, yDual: 118.2, yAbs: 83.7 },
    { label: '11 Sep (Infaq Jumat)', date: '11 Sep', fund: 'Kas Masjid', valueNum: 20321208, valueStr: 'Rp 20.321.208', x: 295, yDual: 98.2, yAbs: 73.4 },
    { label: '15 Sep (Kencleng)', date: '15 Sep', fund: 'Kas Masjid', valueNum: 19701208, valueStr: 'Rp 19.701.208', x: 390, yDual: 108.1, yAbs: 78.4 },
    { label: '18 Sep (Infaq Jumat)', date: '18 Sep', fund: 'Kas Masjid', valueNum: 21131208, valueStr: 'Rp 21.131.208', x: 460, yDual: 85.4, yAbs: 66.7 },
    { label: '19 Sep (Renovasi Ruko 4)', date: '19 Sep', fund: 'Kas Masjid', valueNum: 15757208, valueStr: 'Rp 15.757.208', x: 485, yDual: 170.5, yAbs: 110.8 },
    { label: '22 Sep (Donatur Pak Ary)', date: '22 Sep', fund: 'Kas Masjid', valueNum: 17567208, valueStr: 'Rp 17.567.208', x: 555, yDual: 141.9, yAbs: 95.9 },
    { label: '25 Sep (Infaq Jumat)', date: '25 Sep', fund: 'Kas Masjid', valueNum: 18675208, valueStr: 'Rp 18.675.208', x: 625, yDual: 124.3, yAbs: 86.9 },
    { label: '27 Sep (Goro & Infaq)', date: '27 Sep', fund: 'Kas Masjid', valueNum: 18215208, valueStr: 'Rp 18.215.208', x: 670, yDual: 131.6, yAbs: 90.6 },
    { label: '30 Sep (Saldo Akhir)', date: '30 Sep', fund: 'Kas Masjid', valueNum: 14850208, valueStr: 'Rp 14.850.208', x: 740, yDual: 184.9, yAbs: 118.2, featured: true },
  ];

  // Line 2: Dana Sosial - Jumat Peduli Umat (JPU September 2026)
  // Dual axis: 1M -> 7M (y: 230 -> 40)
  // Absolute axis: 0 -> 25M (y: 240 -> 35)
  const rawJpu = [
    { label: '01 Sep (Awal)', date: '01 Sep', fund: 'JPU (Sosial)', valueNum: 4700000, valueStr: 'Rp 4.700.000', x: 60, yDual: 112.8, yAbs: 201.5 },
    { label: '04 Sep (Jumat Berkah)', date: '04 Sep', fund: 'JPU (Sosial)', valueNum: 5700000, valueStr: 'Rp 5.700.000', x: 130, yDual: 81.2, yAbs: 193.3 },
    { label: '07 Sep (Santunan & Bantuan)', date: '07 Sep', fund: 'JPU (Sosial)', valueNum: 3200000, valueStr: 'Rp 3.200.000', x: 200, yDual: 160.3, yAbs: 213.8 },
    { label: '11 Sep (Jumat Berkah & NTT)', date: '11 Sep', fund: 'JPU (Sosial)', valueNum: 3150000, valueStr: 'Rp 3.150.000', x: 295, yDual: 161.9, yAbs: 214.2 },
    { label: '18 Sep (Santunan & Donasi)', date: '18 Sep', fund: 'JPU (Sosial)', valueNum: 3250000, valueStr: 'Rp 3.250.000', x: 460, yDual: 158.8, yAbs: 213.3 },
    { label: '24 Sep (Donasi Warga)', date: '24 Sep', fund: 'JPU (Sosial)', valueNum: 4750000, valueStr: 'Rp 4.750.000', x: 600, yDual: 111.2, yAbs: 201.0 },
    { label: '25 Sep (Jumat Berkah)', date: '25 Sep', fund: 'JPU (Sosial)', valueNum: 4500000, valueStr: 'Rp 4.500.000', x: 625, yDual: 119.2, yAbs: 203.1 },
    { label: '30 Sep (Saldo Akhir JPU)', date: '30 Sep', fund: 'JPU (Sosial)', valueNum: 4500000, valueStr: 'Rp 4.500.000', x: 740, yDual: 119.2, yAbs: 203.1, featured: true },
  ];

  const pointsKasMasjid = rawKasMasjid.map(p => ({ ...p, y: scaleMode === 'dual' ? p.yDual : p.yAbs }));
  const pointsJpu = rawJpu.map(p => ({ ...p, y: scaleMode === 'dual' ? p.yDual : p.yAbs }));

  const pathDKas = `M ${pointsKasMasjid[0].x} ${pointsKasMasjid[0].y} ` + pointsKasMasjid.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillDKas = `${pathDKas} L ${pointsKasMasjid[pointsKasMasjid.length - 1].x} 240 L ${pointsKasMasjid[0].x} 240 Z`;

  const pathDJpu = `M ${pointsJpu[0].x} ${pointsJpu[0].y} ` + pointsJpu.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillDJpu = `${pathDJpu} L ${pointsJpu[pointsJpu.length - 1].x} 240 L ${pointsJpu[0].x} 240 Z`;

  const xDateLabels = [
    { label: '01 Sep', x: 60 },
    { label: '07 Sep', x: 200 },
    { label: '15 Sep', x: 390 },
    { label: '22 Sep', x: 555 },
    { label: '25 Sep', x: 625 },
    { label: '30 Sep', x: 740 },
  ];

  return (
    <section className="public-chart-section" aria-labelledby="chart-heading">
      <Container>
        <div className="public-chart-container">
          <div className="public-chart-top">
            <div>
              <div className="transparency-hero-label" style={{ color: '#c9a55a', marginBottom: '6px' }}>
                <span className="fin-line" style={{ background: '#c9a55a' }}></span> PERJALANAN ARUS KAS &amp; DANA SOSIAL
              </div>
              <h3 id="chart-heading" className="public-chart-title">
                Grafik Saldo Harian: Kas Masjid &amp; JPU (September 2026)
              </h3>
              <p className="public-chart-desc">
                {scaleMode === 'dual'
                  ? 'Mode Skala Ganda (Seimbang): Masing-masing kurva menggunakan skala proporsional sehingga fluktuasi terlihat jelas.'
                  : 'Mode Skala Absolut: Ditampilkan dalam 1 sumbu perbandingan nominal mutlak (Rp 0 – 25 Juta).'}
              </p>
            </div>

            {/* Total Balance Badges */}
            <div className="public-chart-badges-container">
              <div className="public-chart-stat-badge" style={{ borderLeft: '3px solid #c9a55a' }}>
                <span className="badge-kicker">KAS MASJID (30 SEP)</span>
                <strong className="badge-val" style={{ color: '#c9a55a' }}>Rp 14.850.208</strong>
                <span className="badge-growth">Operasional &amp; Renovasi</span>
              </div>
              <div className="public-chart-stat-badge" style={{ borderLeft: '3px solid #06b6d4' }}>
                <span className="badge-kicker">DANA JPU (30 SEP)</span>
                <strong className="badge-val" style={{ color: '#38bdf8' }}>Rp 4.500.000</strong>
                <span className="badge-growth">Sosial &amp; Santunan</span>
              </div>
            </div>
          </div>

          {/* Interactive Legend, Filter & Scale Mode Controls */}
          <div className="public-chart-controls-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Scale mode toggle button */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: '20px', padding: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => setScaleMode('dual')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    background: scaleMode === 'dual' ? 'rgba(201, 165, 90, 0.3)' : 'transparent',
                    color: scaleMode === 'dual' ? '#F3E3B6' : 'rgba(255,255,255,0.5)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Tampilkan kedua grafik secara proporsional dan seimbang"
                >
                  ⚖️ Skala Seimbang (Dual Axis)
                </button>
                <button
                  type="button"
                  onClick={() => setScaleMode('absolute')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    background: scaleMode === 'absolute' ? 'rgba(201, 165, 90, 0.3)' : 'transparent',
                    color: scaleMode === 'absolute' ? '#F3E3B6' : 'rgba(255,255,255,0.5)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Tampilkan perbandingan nominal rupiah langsung (0 - 25 jt)"
                >
                  📊 Skala Absolut (0–25 jt)
                </button>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

              <button
                type="button"
                onClick={() => setShowKasMasjid(!showKasMasjid)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: showKasMasjid ? 'rgba(201, 165, 90, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: showKasMasjid ? '1px solid #c9a55a' : '1px solid rgba(255,255,255,0.15)',
                  color: showKasMasjid ? '#F3E3B6' : 'rgba(255,255,255,0.4)',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c9a55a' }}></span>
                Kas Masjid {showKasMasjid ? '✓' : '—'}
              </button>
              <button
                type="button"
                onClick={() => setShowJpu(!showJpu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: showJpu ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: showJpu ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)',
                  color: showJpu ? '#67e8f9' : 'rgba(255,255,255,0.4)',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span>
                Dana JPU {showJpu ? '✓' : '—'}
              </button>
            </div>

            {hoveredPoint ? (
              <div style={{ fontSize: '12px', color: '#FFFFFF', background: 'rgba(0,0,0,0.45)', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <strong>{hoveredPoint.fund}</strong> ({hoveredPoint.date}): <span style={{ color: hoveredPoint.fund === 'Kas Masjid' ? '#c9a55a' : '#38bdf8', fontWeight: 700 }}>{hoveredPoint.valueStr}</span>
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                {scaleMode === 'dual' ? '💡 Sumbu kiri (Emas): Kas Masjid · Sumbu kanan (Cyan): JPU' : '💡 Sumbu kiri: Skala nominal gabungan 0 - 25 Jt'}
              </div>
            )}
          </div>

          <div className="public-svg-chart-wrapper">
            <svg viewBox="0 0 800 270" className="public-svg-chart" width="100%" height="auto" aria-label="Grafik pergerakan saldo kas harian dan JPU">
              <defs>
                <linearGradient id="kasChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a55a" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#c9a55a" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="jpuChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              {[230, 182.5, 135, 87.5, 40].map((y, idx) => (
                <line
                  key={idx}
                  x1="55"
                  y1={y}
                  x2="745"
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
              ))}

              {/* Y-Axis Value Labels (Left = Kas Masjid in Gold) */}
              {scaleMode === 'dual' ? (
                <>
                  {[
                    { label: 'Rp 14 jt', y: 230 },
                    { label: 'Rp 16,5 jt', y: 182.5 },
                    { label: 'Rp 19 jt', y: 135 },
                    { label: 'Rp 21,5 jt', y: 87.5 },
                    { label: 'Rp 24 jt', y: 40 },
                  ].map((item, idx) => (
                    <text
                      key={`left-${idx}`}
                      x="10"
                      y={item.y + 4}
                      fontSize="9.5"
                      fill="#F3E3B6"
                      fontFamily="sans-serif"
                    >
                      {item.label}
                    </text>
                  ))}

                  {/* Y-Axis Value Labels (Right = JPU in Cyan) */}
                  {[
                    { label: 'Rp 1,0 jt', y: 230 },
                    { label: 'Rp 2,4 jt', y: 182.5 },
                    { label: 'Rp 3,8 jt', y: 135 },
                    { label: 'Rp 5,1 jt', y: 87.5 },
                    { label: 'Rp 6,5 jt', y: 40 },
                  ].map((item, idx) => (
                    <text
                      key={`right-${idx}`}
                      x="795"
                      y={item.y + 4}
                      fontSize="9.5"
                      fill="#67e8f9"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {item.label}
                    </text>
                  ))}
                </>
              ) : (
                [
                  { label: 'Rp 0', y: 240 },
                  { label: 'Rp 5 jt', y: 199 },
                  { label: 'Rp 10 jt', y: 158 },
                  { label: 'Rp 15 jt', y: 117 },
                  { label: 'Rp 20 jt', y: 76 },
                  { label: 'Rp 25 jt', y: 35 },
                ].map((item, idx) => (
                  <text
                    key={`abs-${idx}`}
                    x="10"
                    y={item.y + 4}
                    fontSize="9.5"
                    fill="rgba(255, 255, 255, 0.45)"
                    fontFamily="sans-serif"
                  >
                    {item.label}
                  </text>
                ))
              )}

              {/* ── LINE 1: KAS OPERASIONAL MASJID ── */}
              {showKasMasjid && (
                <>
                  <path d={fillDKas} fill="url(#kasChartGradient)" />
                  <path
                    d={pathDKas}
                    fill="none"
                    stroke="#c9a55a"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glowGold)"
                  />
                  {pointsKasMasjid.map((p, idx) => (
                    <g
                      key={`kas-${idx}`}
                      className="chart-node-group"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={p.featured ? "6" : "4"}
                        fill={p.featured ? "#c9a55a" : "#0c2b1d"}
                        stroke={p.featured ? "#FFFFFF" : "#c9a55a"}
                        strokeWidth="2.2"
                      />
                      {p.featured && (
                        <>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="11"
                            fill="none"
                            stroke="#c9a55a"
                            strokeWidth="1.2"
                            opacity="0.6"
                          />
                          <text
                            x={p.x - 10}
                            y={p.y - 12}
                            fontSize="11.5"
                            fontWeight="800"
                            fill="#F3E3B6"
                            fontFamily="sans-serif"
                            textAnchor="end"
                          >
                            Kas: {p.valueStr}
                          </text>
                        </>
                      )}
                    </g>
                  ))}
                </>
              )}

              {/* ── LINE 2: DANA SOSIAL JPU ── */}
              {showJpu && (
                <>
                  <path d={fillDJpu} fill="url(#jpuChartGradient)" />
                  <path
                    d={pathDJpu}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glowCyan)"
                  />
                  {pointsJpu.map((p, idx) => (
                    <g
                      key={`jpu-${idx}`}
                      className="chart-node-group"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={p.featured ? "5.5" : "3.8"}
                        fill={p.featured ? "#06b6d4" : "#083344"}
                        stroke={p.featured ? "#FFFFFF" : "#38bdf8"}
                        strokeWidth="2"
                      />
                      {p.featured && (
                        <>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="10"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="1.2"
                            opacity="0.6"
                          />
                          <text
                            x={p.x - 10}
                            y={scaleMode === 'dual' ? p.y - 12 : p.y + 18}
                            fontSize="11"
                            fontWeight="800"
                            fill="#67e8f9"
                            fontFamily="sans-serif"
                            textAnchor="end"
                          >
                            JPU: {p.valueStr}
                          </text>
                        </>
                      )}
                    </g>
                  ))}
                </>
              )}

              {/* X axis labels */}
              {xDateLabels.map((item, idx) => (
                <text
                  key={idx}
                  x={item.x}
                  y="260"
                  fontSize="10"
                  fill="rgba(255, 255, 255, 0.6)"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {item.label}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}


