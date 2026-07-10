/**
 * ProgramSchedulePreview.jsx — Two-section preview panel
 *
 * Section A: Weekly schedule grid (Sun–Sat) showing which programs run on which days
 * Section B: Website card preview + link to homepage #program section
 *
 * Props:
 *   programs  {object[]} — normalized programs from usePrograms
 *   isLoading {boolean}
 */

const DAYS = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const PILAR_COLORS = {
  ilmu:     { bg: '#E8F5EE', text: '#1A7A50', dot: '#1A7A50' },
  ibadah:   { bg: '#E0EEFF', text: '#2B6CB0', dot: '#2B6CB0' },
  keluarga: { bg: '#FDF4E3', text: '#8A6200', dot: '#C9A55A' },
  amanah:   { bg: '#F0EAF8', text: '#6B46C1', dot: '#6B46C1' },
};

const PILAR_EMOJI = {
  ilmu: '📖', ibadah: '🕌', keluarga: '👨‍👩‍👧', amanah: '📿',
};

function programColor(prog) {
  return PILAR_COLORS[(prog.pilar ?? '').toLowerCase()] ?? { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' };
}

/**
 * Maps each DAYS entry to programs that mention it.
 */
function buildDayMap(programs) {
  const map = {};
  DAYS.forEach((d) => (map[d] = []));

  programs.forEach((prog) => {
    const hari = prog.hari ?? '';
    DAYS.forEach((day) => {
      if (hari.toLowerCase().includes(day.toLowerCase())) {
        map[day].push(prog);
      }
    });
  });
  return map;
}

export default function ProgramSchedulePreview({ programs = [], isLoading = false }) {
  const dayMap = buildDayMap(programs);

  return (
    <>
      {/* ── Weekly schedule grid ── */}
      <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Jadwal Mingguan</div>
            <div className="db-card-sub">Pemetaan program kajian per hari dalam sepekan</div>
          </div>
          <span className="db-chip b" style={{ fontSize: '10px', padding: '2px 8px' }}>
            Read-only
          </span>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {DAYS.map((d) => (
              <div key={d} style={{ background: 'rgba(12,24,16,.05)', borderRadius: 10, padding: '10px 8px', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite', minHeight: 60 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {DAYS.map((day) => {
              const dayProgs = dayMap[day];
              const isEmpty = dayProgs.length === 0;
              return (
                <div
                  key={day}
                  style={{
                    background: isEmpty ? 'var(--db-bg-inset)' : 'var(--db-bg-card)',
                    borderRadius: '10px',
                    border: `1px solid ${isEmpty ? 'rgba(12,24,16,.06)' : 'rgba(12,24,16,.09)'}`,
                    padding: '10px 8px',
                    minHeight: '60px',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: isEmpty ? 'var(--db-text-4)' : 'var(--db-forest)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '6px' }}>
                    {day.slice(0, 3)}
                  </div>
                  {isEmpty ? (
                    <div style={{ fontSize: '10px', color: 'var(--db-text-4)', fontStyle: 'italic' }}>—</div>
                  ) : (
                    dayProgs.map((p) => {
                      const clr = programColor(p);
                      return (
                        <div
                          key={p.id}
                          title={`${p.nama} · ${p.waktu}`}
                          style={{
                            background: clr.bg,
                            color: clr.text,
                            fontSize: '9.5px',
                            fontWeight: 600,
                            padding: '3px 5px',
                            borderRadius: '5px',
                            marginBottom: '3px',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {PILAR_EMOJI[(p.pilar ?? '').toLowerCase()] ?? '📋'} {p.nama.split(' ').slice(0, 3).join(' ')}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(12,24,16,.06)' }}>
          {Object.entries(PILAR_COLORS).map(([key, clr]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--db-text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: clr.dot, display: 'inline-block' }} aria-hidden="true" />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* ── Website preview cards ── */}
      <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Preview — Section "Program & Kegiatan" (Website)</div>
            <div className="db-card-sub">Tampilan 6 program pertama di halaman publik</div>
          </div>
          <a
            href="/#program"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--db-emerald)',
              textDecoration: 'none',
              padding: '5px 10px',
              border: '1px solid rgba(12,24,16,.09)',
              borderRadius: '8px',
              background: 'var(--db-bg-card)',
              flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lihat di Website
          </a>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[1, 2, 3].map((k) => (
              <div key={k} style={{ background: 'rgba(12,24,16,.04)', borderRadius: 12, height: 90, animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--db-text-4)', fontSize: '13px' }}>
            Belum ada program untuk ditampilkan.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {programs.slice(0, 6).map((prog) => {
              const clr = programColor(prog);
              return (
                <div
                  key={prog.id}
                  style={{
                    background: clr.bg,
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: `1px solid rgba(12,24,16,.06)`,
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>
                    {PILAR_EMOJI[(prog.pilar ?? '').toLowerCase()] ?? '📋'}
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: clr.text, marginBottom: '3px', lineHeight: 1.3 }}>
                    {prog.nama}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--db-text-3)' }}>
                    {prog.hari} · {prog.waktu}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
