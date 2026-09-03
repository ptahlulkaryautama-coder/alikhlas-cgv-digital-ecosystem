import React, { useState } from 'react';
import Container from '../common/Container.jsx';

export default function PublicCashflowChart() {
  const [scaleMode, setScaleMode] = useState('dual'); // 'dual' (balanced) | 'absolute'
  const [showKasMasjid, setShowKasMasjid] = useState(true);
  const [showJpu, setShowJpu] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Line 1: Kas Operasional Masjid (Per 31 Agustus 2026)
  // Dual axis: 14M -> 24M (y: 230 -> 40)
  // Absolute axis: 0 -> 25M (y: 240 -> 35)
  const rawKasMasjid = [
    { label: '01 Ags (Awal)', date: '01 Ags', fund: 'Kas Masjid', valueNum: 18386130, valueStr: 'Rp 18.386.130', x: 60, yDual: 146.7, yAbs: 89.2 },
    { label: '07 Ags (Infaq Jumat)', date: '07 Ags', fund: 'Kas Masjid', valueNum: 19726130, valueStr: 'Rp 19.726.130', x: 196, yDual: 121.2, yAbs: 78.2 },
    { label: '14 Ags (Infaq Jumat)', date: '14 Ags', fund: 'Kas Masjid', valueNum: 21176130, valueStr: 'Rp 21.176.130', x: 355, yDual: 93.7, yAbs: 66.4 },
    { label: '20 Ags (PLN/Wifi)', date: '20 Ags', fund: 'Kas Masjid', valueNum: 19091667, valueStr: 'Rp 19.091.667', x: 491, yDual: 133.3, yAbs: 83.4 },
    { label: '21 Ags (Infaq Jumat)', date: '21 Ags', fund: 'Kas Masjid', valueNum: 20303667, valueStr: 'Rp 20.303.667', x: 513, yDual: 110.2, yAbs: 73.5 },
    { label: '27 Ags (Kencleng)', date: '27 Ags', fund: 'Kas Masjid', valueNum: 20665667, valueStr: 'Rp 20.665.667', x: 649, yDual: 103.4, yAbs: 70.5 },
    { label: '28 Ags (Infaq Jumat)', date: '28 Ags', fund: 'Kas Masjid', valueNum: 22423667, valueStr: 'Rp 22.423.667', x: 672, yDual: 70.0, yAbs: 56.1 },
    { label: '30 Ags (Kajian/Taklim)', date: '30 Ags', fund: 'Kas Masjid', valueNum: 21723667, valueStr: 'Rp 21.723.667', x: 717, yDual: 83.3, yAbs: 61.9 },
    { label: '31 Ags (Saldo Akhir)', date: '31 Ags', fund: 'Kas Masjid', valueNum: 16313667, valueStr: 'Rp 16.313.667', x: 740, yDual: 186.1, yAbs: 106.2, featured: true },
  ];

  // Line 2: Dana Sosial - Jumat Peduli Umat (JPU)
  // Dual axis: 1M -> 6.5M (y: 230 -> 40)
  // Absolute axis: 0 -> 25M (y: 240 -> 35)
  const rawJpu = [
    { label: '01 Ags (Awal)', date: '01 Ags', fund: 'JPU (Sosial)', valueNum: 1700000, valueStr: 'Rp 1.700.000', x: 60, yDual: 205.8, yAbs: 226.1 },
    { label: '07 Ags (Santunan & Donasi)', date: '07 Ags', fund: 'JPU (Sosial)', valueNum: 1500000, valueStr: 'Rp 1.500.000', x: 196, yDual: 212.7, yAbs: 227.7 },
    { label: '15 Ags (Jumat Berkah)', date: '15 Ags', fund: 'JPU (Sosial)', valueNum: 1850000, valueStr: 'Rp 1.850.000', x: 377, yDual: 200.6, yAbs: 224.8 },
    { label: '20 Ags (Donasi Cluster)', date: '20 Ags', fund: 'JPU (Sosial)', valueNum: 4700000, valueStr: 'Rp 4.700.000', x: 491, yDual: 102.2, yAbs: 201.5 },
    { label: '21 Ags (Jumat Berkah)', date: '21 Ags', fund: 'JPU (Sosial)', valueNum: 4250000, valueStr: 'Rp 4.250.000', x: 513, yDual: 117.7, yAbs: 205.1 },
    { label: '27 Ags (Donasi Warga)', date: '27 Ags', fund: 'JPU (Sosial)', valueNum: 5250000, valueStr: 'Rp 5.250.000', x: 649, yDual: 83.2, yAbs: 196.9 },
    { label: '28 Ags (Santunan & Donasi)', date: '28 Ags', fund: 'JPU (Sosial)', valueNum: 5000000, valueStr: 'Rp 5.000.000', x: 672, yDual: 91.8, yAbs: 199.0 },
    { label: '30 Ags (Santunan)', date: '30 Ags', fund: 'JPU (Sosial)', valueNum: 4700000, valueStr: 'Rp 4.700.000', x: 717, yDual: 102.2, yAbs: 201.5 },
    { label: '31 Ags (Saldo Akhir JPU)', date: '31 Ags', fund: 'JPU (Sosial)', valueNum: 4700000, valueStr: 'Rp 4.700.000', x: 740, yDual: 102.2, yAbs: 201.5, featured: true },
  ];

  const pointsKasMasjid = rawKasMasjid.map(p => ({ ...p, y: scaleMode === 'dual' ? p.yDual : p.yAbs }));
  const pointsJpu = rawJpu.map(p => ({ ...p, y: scaleMode === 'dual' ? p.yDual : p.yAbs }));

  const pathDKas = `M ${pointsKasMasjid[0].x} ${pointsKasMasjid[0].y} ` + pointsKasMasjid.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillDKas = `${pathDKas} L ${pointsKasMasjid[pointsKasMasjid.length - 1].x} 240 L ${pointsKasMasjid[0].x} 240 Z`;

  const pathDJpu = `M ${pointsJpu[0].x} ${pointsJpu[0].y} ` + pointsJpu.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillDJpu = `${pathDJpu} L ${pointsJpu[pointsJpu.length - 1].x} 240 L ${pointsJpu[0].x} 240 Z`;

  const xDateLabels = [
    { label: '01 Ags', x: 60 },
    { label: '07 Ags', x: 196 },
    { label: '14 Ags', x: 355 },
    { label: '21 Ags', x: 513 },
    { label: '28 Ags', x: 672 },
    { label: '31 Ags', x: 740 },
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
                Grafik Saldo Harian: Kas Masjid &amp; JPU (Agustus 2026)
              </h3>
              <p className="public-chart-desc">
                {scaleMode === 'dual'
                  ? 'Mode Skala Ganda (Seimbang): Masing-masing kurva menggunakan skala proporsional sehingga fluktuasi terlihat jelas.'
                  : 'Mode Skala Absolut: Ditampilkan dalam 1 sumbu perbandingan nominal mutlak (Rp 0 – 25 Juta).'}
              </p>
            </div>

            {/* Total Balance Badges */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="public-chart-stat-badge" style={{ borderLeft: '3px solid #c9a55a' }}>
                <span className="badge-kicker">KAS MASJID (31 AGS)</span>
                <strong className="badge-val" style={{ color: '#c9a55a' }}>Rp 16.313.667</strong>
                <span className="badge-growth">Operasional &amp; Bisyaroh</span>
              </div>
              <div className="public-chart-stat-badge" style={{ borderLeft: '3px solid #06b6d4' }}>
                <span className="badge-kicker">DANA JPU (31 AGS)</span>
                <strong className="badge-val" style={{ color: '#38bdf8' }}>Rp 4.700.000</strong>
                <span className="badge-growth">Sosial &amp; Santunan</span>
              </div>
            </div>
          </div>

          {/* Interactive Legend, Filter & Scale Mode Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
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


