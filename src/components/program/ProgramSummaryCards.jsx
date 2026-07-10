/**
 * ProgramSummaryCards.jsx — KPI row for Program & Kegiatan module
 *
 * Shows: Total Program · Aktif/Publik · per-Pilar breakdown
 *
 * Props:
 *   programs  {object[]} — normalized program list from usePrograms
 *   isLoading {boolean}
 */

// Derive pilar counts from the program list
function getPilarCounts(programs) {
  const counts = { ilmu: 0, ibadah: 0, keluarga: 0, amanah: 0, lain: 0 };
  programs.forEach((p) => {
    const key = (p.pilar ?? '').toLowerCase();
    if (key in counts) counts[key]++;
    else counts.lain++;
  });
  return counts;
}

function Skeleton({ w = '60%', h = '26px' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: h, width: w, borderRadius: '6px',
        background: 'rgba(12,24,16,.07)',
        animation: 'dbSkeletonPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

const PILAR_DOT_COLORS = {
  ilmu:     '#1A7A50',
  ibadah:   '#2B6CB0',
  keluarga: '#C9A55A',
  amanah:   '#6B46C1',
  lain:     '#9CA3AF',
};

const PILAR_LABELS = {
  ilmu: 'Ilmu', ibadah: 'Ibadah', keluarga: 'Keluarga', amanah: 'Amanah', lain: 'Lainnya',
};

export default function ProgramSummaryCards({ programs = [], isLoading = false }) {
  const total  = programs.length;
  const pilar  = getPilarCounts(programs);
  const maxCount = Math.max(1, ...Object.values(pilar));

  const cards = [
    {
      variant: 'v-blue',
      watermark: '◼',
      tag: 'Total Program',
      suffix: 'program',
      value: String(total),
      hint: 'Seluruh entri di sheet',
    },
    {
      variant: 'v-green',
      watermark: '✓',
      tag: 'Kajian Rutin',
      suffix: 'kajian',
      value: String(programs.filter((p) => ['kajian kitab', "tafsir al-qur'an", 'kajian keluarga'].some((k) => (p.kategori ?? '').toLowerCase().includes(k))).length),
      hint: 'Kitab · Tafsir · Keluarga',
    },
    {
      variant: 'v-teal',
      watermark: '🔤',
      tag: 'Kelas Bahasa & Tahsin',
      suffix: 'kelas',
      value: String(programs.filter((p) => ['bahasa arab', 'tahsin'].some((k) => (p.kategori ?? '').toLowerCase().includes(k))).length),
      hint: 'Bahasa Arab & Tahsin',
    },
    {
      variant: 'v-featured',
      watermark: '✦',
      tag: 'Pilar Ilmu',
      suffix: 'program',
      value: String(pilar.ilmu),
      hint: `Ibadah ${pilar.ibadah} · Keluarga ${pilar.keluarga}`,
    },
  ];

  return (
    <>
      {/* KPI row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}
        role="list"
        aria-label="Ringkasan program"
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
            <div className="db-kpi-hint">{isLoading ? 'Memuat…' : card.hint}</div>
          </div>
        ))}
      </div>

      {/* Pilar breakdown bar */}
      {!isLoading && total > 0 && (
        <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
          <div className="db-card-head">
            <div>
              <div className="db-card-title">Distribusi Pilar</div>
              <div className="db-card-sub">Proporsi program per pilar dakwah</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(pilar).filter(([, v]) => v > 0).map(([key, count]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12.5px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--db-text-1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: PILAR_DOT_COLORS[key], display: 'inline-block' }} aria-hidden="true" />
                    {PILAR_LABELS[key]}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--db-text-2)' }}>{count} program</span>
                </div>
                <div className="db-pb-wrap">
                  <div
                    className="db-pb g"
                    style={{ width: `${Math.round((count / maxCount) * 100)}%`, background: PILAR_DOT_COLORS[key] }}
                    role="progressbar"
                    aria-valuenow={count}
                    aria-valuemax={maxCount}
                    aria-label={`${PILAR_LABELS[key]}: ${count} program`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
