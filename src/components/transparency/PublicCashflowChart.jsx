import React from 'react';
import Container from '../common/Container.jsx';

export default function PublicCashflowChart() {
  const points = [
    { label: '01 Ags (Awal)', date: '01 Ags', valueNum: 18386130, valueStr: 'Rp 18.386.130', x: 50, y: 155 },
    { label: '01 Ags (Bisyaroh/Air)', date: '01 Ags', valueNum: 17976130, valueStr: 'Rp 17.976.130', x: 140, y: 180 },
    { label: '04 Ags (Infaq M07)', date: '04 Ags', valueNum: 18276130, valueStr: 'Rp 18.276.130', x: 260, y: 162 },
    { label: '07 Ags (Infaq Jumat)', date: '07 Ags', valueNum: 19726130, valueStr: 'Rp 19.726.130', x: 410, y: 88 },
    { label: '08 Ags (Majelis Taklim)', date: '08 Ags', valueNum: 19823130, valueStr: 'Rp 19.823.130', x: 530, y: 82 },
    { label: '09 Ags (Ummahat)', date: '09 Ags', valueNum: 19923130, valueStr: 'Rp 19.923.130', x: 640, y: 76 },
    { label: '15 Ags (Saldo Akhir)', date: '15 Ags', valueNum: 21126130, valueStr: 'Rp 21.126.130', x: 750, y: 30, featured: true },
  ];

  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillD = `${pathD} L ${points[points.length - 1].x} 230 L ${points[0].x} 230 Z`;

  return (
    <section className="public-chart-section" aria-labelledby="chart-heading">
      <Container>
        <div className="public-chart-container">
          <div className="public-chart-top">
            <div>
              <div className="transparency-hero-label" style={{ color: '#c9a55a', marginBottom: '6px' }}>
                <span className="fin-line" style={{ background: '#c9a55a' }}></span> PERJALANAN ARUS KAS
              </div>
              <h3 id="chart-heading" className="public-chart-title">
                Grafik Saldo Kas Harian (1–15 Agustus 2026)
              </h3>
              <p className="public-chart-desc">
                Pergerakan akumulasi saldo kas masjid dari saldo awal Juli hingga penutupan 15 Agustus 2026.
              </p>
            </div>

            <div className="public-chart-stat-badge">
              <span className="badge-kicker">SALDO AKHIR PER 15 AGS</span>
              <strong className="badge-val">Rp 21.126.130</strong>
              <span className="badge-growth">▲ +Rp 2.740.000 surplus periode</span>
            </div>
          </div>

          <div className="public-svg-chart-wrapper">
            <svg viewBox="0 0 800 260" className="public-svg-chart" width="100%" height="auto" aria-label="Grafik pergerakan saldo kas harian">
              <defs>
                <linearGradient id="publicChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a55a" stopOpacity="0.32" />
                  <stop offset="60%" stopColor="#0c2b1d" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0c2b1d" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              {[230, 180, 130, 80, 30].map((y, idx) => (
                <line
                  key={idx}
                  x1="50"
                  y1={y}
                  x2="750"
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
              ))}

              {/* Y-Axis Value Labels */}
              {[
                { label: 'Rp 17,5 jt', y: 230 },
                { label: 'Rp 18,5 jt', y: 180 },
                { label: 'Rp 19,5 jt', y: 130 },
                { label: 'Rp 20,5 jt', y: 80 },
                { label: 'Rp 21,5 jt', y: 30 },
              ].map((item, idx) => (
                <text
                  key={idx}
                  x="10"
                  y={item.y + 4}
                  fontSize="9.5"
                  fill="rgba(255, 255, 255, 0.45)"
                  fontFamily="sans-serif"
                >
                  {item.label}
                </text>
              ))}

              {/* Shaded area under graph */}
              <path d={fillD} fill="url(#publicChartGradient)" />

              {/* Main Line with Gold Glow */}
              <path
                d={pathD}
                fill="none"
                stroke="#c9a55a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />

              {/* Node points & tooltips */}
              {points.map((p, idx) => (
                <g key={idx} className="chart-node-group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.featured ? "6.5" : "4.5"}
                    fill={p.featured ? "#c9a55a" : "#0c2b1d"}
                    stroke={p.featured ? "#FFFFFF" : "#c9a55a"}
                    strokeWidth="2.5"
                  />
                  {p.featured && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="12"
                      fill="none"
                      stroke="#c9a55a"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}
                  {/* Values label for top node */}
                  <text
                    x={p.featured ? p.x - 45 : p.x}
                    y={p.y - 12}
                    fontSize={p.featured ? "12" : "10"}
                    fontWeight={p.featured ? "800" : "600"}
                    fill={p.featured ? "#F3E3B6" : "rgba(255,255,255,0.8)"}
                    fontFamily="sans-serif"
                    textAnchor={p.featured ? "end" : "middle"}
                  >
                    {p.valueStr}
                  </text>
                </g>
              ))}

              {/* X axis labels */}
              {points.map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y="250"
                  fontSize="10"
                  fill="rgba(255, 255, 255, 0.6)"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight={p.featured ? "700" : "500"}
                >
                  {p.date}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
