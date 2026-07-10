/**
 * AgendaSummaryCards.jsx — KPI row for the Agenda & Kalender module
 *
 * Derives all counts live from the enriched agenda array:
 *   Total Agenda · Bulan Ini · Pekan Ini · Terdekat
 *
 * Props:
 *   agenda    {object[]} — enriched agenda from useAgendaData
 *   isLoading {boolean}
 */

function Skeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: '26px', width: '60%', borderRadius: '6px',
        background: 'rgba(12,24,16,.07)',
        animation: 'dbSkeletonPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

// Badge colours per category
const BADGE_COLORS = {
  'ag-hbi':   { bg: '#FEF3E2', text: '#8A6200' },
  'ag-goro':  { bg: '#E8F5EE', text: '#1A7A50' },
  'ag-rapat': { bg: '#E0EEFF', text: '#2B6CB0' },
  'ag-sosial':{ bg: '#FDF4E3', text: '#8A6200' },
  'ag-lain':  { bg: '#F3F4F6', text: '#6B7280' },
};

function CategoryDot({ badgeClass }) {
  const clr = BADGE_COLORS[badgeClass] ?? BADGE_COLORS['ag-lain'];
  return (
    <span
      style={{ width: 9, height: 9, borderRadius: '50%', background: clr.text, display: 'inline-block', flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}

export default function AgendaSummaryCards({ agenda = [], isLoading = false }) {
  const now = new Date();
  const curYear  = now.getFullYear();
  const curMonth = now.getMonth() + 1;

  // Week boundaries (Mon–Sun)
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek + 1); weekStart.setHours(0,0,0,0);
  const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6); weekEnd.setHours(23,59,59,999);

  function parseSortKey(sk) {
    if (!sk || sk.startsWith('9999')) return null;
    const [y, m, d] = sk.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  const thisMonth = agenda.filter((a) => a.monthNum === curMonth && Number(a.year) === curYear);
  const thisWeek  = agenda.filter((a) => {
    const d = parseSortKey(a._sortKey);
    return d && d >= weekStart && d <= weekEnd;
  });
  const upcoming  = agenda.filter((a) => {
    const d = parseSortKey(a._sortKey);
    return d && d >= now;
  });
  const nearest   = upcoming[0] ?? null;

  // Category distribution
  const catCount = {};
  agenda.forEach((a) => {
    const k = a.badgeClass ?? 'ag-lain';
    catCount[k] = (catCount[k] ?? 0) + 1;
  });
  const catMax = Math.max(1, ...Object.values(catCount));

  const CAT_LABELS = {
    'ag-hbi': 'Hari Besar Islam',
    'ag-goro': 'Kerja Bakti',
    'ag-rapat': 'Rapat/Koordinasi',
    'ag-sosial': 'Sosial',
    'ag-lain': 'Lainnya',
  };

  const cards = [
    { variant: 'v-blue',     watermark: '◼', tag: 'Total Agenda',       value: String(agenda.length),    suffix: 'entri',  hint: 'Seluruh agenda di sheet' },
    { variant: 'v-teal',     watermark: '📅', tag: 'Bulan Ini',          value: String(thisMonth.length), suffix: 'agenda', hint: `${MONTH_ID[curMonth - 1]} ${curYear}` },
    { variant: 'v-green',    watermark: '📆', tag: 'Pekan Ini',          value: String(thisWeek.length),  suffix: 'agenda', hint: 'Senin – Minggu ini' },
    { variant: 'v-featured', watermark: '⏩', tag: 'Agenda Terdekat',    value: nearest ? nearest.displayDay : '—', suffix: nearest ? nearest.displayMonth : '', hint: nearest ? nearest.nama : 'Belum ada agenda mendatang' },
  ];

  return (
    <>
      {/* KPI cards */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}
        role="list"
        aria-label="Ringkasan agenda"
      >
        {cards.map((card) => (
          <div
            key={card.tag}
            className={`db-kpi ${card.variant}`}
            style={{ padding: '16px 18px' }}
            role="listitem"
          >
            <div className="db-kpi-wm" aria-hidden="true">{card.watermark}</div>
            <div className="db-kpi-tag">{card.tag}</div>
            <div className="db-kpi-num">
              {isLoading
                ? <Skeleton />
                : (<>{card.value}<span className="db-suffix"> {card.suffix}</span></>)}
            </div>
            <div className="db-kpi-hint" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isLoading ? 'Memuat…' : card.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Category distribution */}
      {!isLoading && agenda.length > 0 && (
        <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
          <div className="db-card-head">
            <div>
              <div className="db-card-title">Distribusi Kategori</div>
              <div className="db-card-sub">Proporsi agenda per jenis kegiatan</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(catCount).map(([key, count]) => {
              const clr = BADGE_COLORS[key] ?? BADGE_COLORS['ag-lain'];
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--db-text-1)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <CategoryDot badgeClass={key} />
                      {CAT_LABELS[key] ?? key}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--db-text-2)' }}>{count} agenda</span>
                  </div>
                  <div className="db-pb-wrap">
                    <div
                      className="db-pb g"
                      style={{ width: `${Math.round((count / catMax) * 100)}%`, background: clr.text }}
                      role="progressbar"
                      aria-valuenow={count}
                      aria-valuemax={catMax}
                      aria-label={`${CAT_LABELS[key] ?? key}: ${count} agenda`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// Month labels for hint
const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
