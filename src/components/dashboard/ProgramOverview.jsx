/**
 * ProgramOverview.jsx — Dashboard program listing card
 *
 * Props:
 *   programs  {object[]}  — normalized dashboard program items
 *   source    {string}    — 'api' | 'fallback'
 *   isLoading {boolean}
 *
 * Shows live program data from 01_Program_Kajian when available,
 * falls back to mock data with a "Menampilkan data sementara" label.
 * No private fields (jemaah, kitab, audio) are displayed.
 */

function SkeletonRow() {
  return (
    <div className="db-prog-item" aria-hidden="true">
      <div
        style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'rgba(12,24,16,.07)',
          animation: 'dbSkeletonPulse 1.4s ease-in-out infinite',
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 12, width: '65%', borderRadius: 4, background: 'rgba(12,24,16,.07)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 10, width: '45%', borderRadius: 4, background: 'rgba(12,24,16,.05)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export default function ProgramOverview({ programs = [], source = 'fallback', isLoading = false }) {
  return (
    <div className="db-card">
      <div className="db-cp">
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Program Berjalan</div>
            <div className="db-card-sub">
              {isLoading
                ? 'Memuat data program…'
                : `${programs.length} kajian aktif · Sheet 01_Program_Kajian`}
            </div>
          </div>
          {/* Source indicator */}
          {!isLoading && source === 'fallback' ? (
            <span
              className="db-chip o"
              style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', whiteSpace: 'nowrap' }}
              title="Menampilkan data sementara — API belum terhubung"
            >
              ⚠ Sementara
            </span>
          ) : !isLoading ? (
            <span
              className="db-chip g"
              style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', whiteSpace: 'nowrap' }}
              title="Data langsung dari Google Sheets"
            >
              ✓ Live
            </span>
          ) : null}
        </div>

        {/* Fallback notice */}
        {!isLoading && source === 'fallback' && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--db-warn-text)',
              background: 'var(--db-warn-bg)',
              borderRadius: '6px',
              padding: '4px 9px',
              marginBottom: '10px',
            }}
            role="status"
          >
            Menampilkan data sementara
          </div>
        )}

        <div className="db-prog-list" role="list" aria-label="Daftar program aktif">
          {isLoading
            ? [1, 2, 3].map((k) => <SkeletonRow key={k} />)
            : programs.map((prog) => (
                <div key={prog.id} className="db-prog-item" role="listitem">
                  <div
                    className="db-prog-ico"
                    style={{ background: prog.bgColor }}
                    aria-hidden="true"
                  >
                    {prog.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="db-prog-name">{prog.nama}</div>
                    <div className="db-prog-meta">
                      {prog.hari} · {prog.waktu}
                    </div>
                  </div>
                  <span className={`db-pl-badge db-${prog.pilarColor}`}>
                    {prog.pilar}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
