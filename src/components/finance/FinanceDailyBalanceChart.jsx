import '../../styles/financeAdmin.css';

export default function FinanceDailyBalanceChart({ selectedPeriod = 'agustus2026', data = null }) {
  const pointsAgustus = [
    { label: '1 Ags (Awal)', x: 50, y: 130, value: 'Rp 18.386.130' },
    { label: '1 Ags', x: 120, y: 145, value: 'Rp 17.976.130' },
    { label: '4 Ags', x: 230, y: 134, value: 'Rp 18.276.130' },
    { label: '7 Ags', x: 370, y: 80, value: 'Rp 19.726.130' },
    { label: '8 Ags', x: 480, y: 77, value: 'Rp 19.823.130' },
    { label: '9 Ags', x: 590, y: 73, value: 'Rp 19.923.130' },
    { label: '15 Ags', x: 750, y: 35, value: 'Rp 21.126.130' }
  ];

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

  const sourceBalances = data?.dailyBalances?.length ? data.dailyBalances : null;
  const maxBalance = sourceBalances ? Math.max(...sourceBalances.map((item) => item.balance), 1) : 1;
  const dataPoints = sourceBalances?.map((item, index) => ({
    label: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(`${item.date}T00:00:00`)),
    x: sourceBalances.length === 1 ? 400 : 50 + (700 * index / (sourceBalances.length - 1)),
    y: 240 - (200 * item.balance / maxBalance),
    value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.balance),
  }));
  const points = dataPoints || (selectedPeriod === 'agustus2026' ? pointsAgustus : selectedPeriod === 'mei2026' ? pointsMei : pointsJuni);

  const pathD = `M ${points[0].x} ${points[0].y} ` + 
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const fillD = `${pathD} L ${points[points.length - 1].x} 240 L ${points[0].x} 240 Z`;

  // Get labels excluding the second point (which is double 1st of the month)
  const xLabels = points.filter((p, i) => i !== 1);

  const periodLabel = data?.period || (selectedPeriod === 'agustus2026' ? 'Agustus 2026 (1–15 Ags)' : selectedPeriod === 'mei2026' ? 'Mei 2026' : 'Juni 2026');

  return (
    <div className="fin-chart-card">
      <div className="fin-chart-title">Saldo Harian ({periodLabel})</div>
      <div className="fin-chart-subtitle">Perkembangan saldo akumulatif</div>
      
      <div className="fin-chart-svg-wrapper">
        <svg viewBox="0 0 800 280" className="fin-chart-svg" width="100%" height="auto" aria-label="Grafik Saldo Harian">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2b1d" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0c2b1d" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[240, 203.3, 166.6, 130, 93.3, 56.6, 20].map((y, idx) => (
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
          {[
            { label: '0', y: 240 },
            { label: '2.0jt', y: 203.3 },
            { label: '4.0jt', y: 166.6 },
            { label: '6.0jt', y: 130 },
            { label: '8.0jt', y: 93.3 },
            { label: '10.0jt', y: 56.6 },
            { label: '12.0jt', y: 20 },
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
          ))}

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
          {xLabels.map((item, idx) => (
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
        </svg>
      </div>
    </div>
  );
}
