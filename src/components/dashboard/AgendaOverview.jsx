/**
 * AgendaOverview.jsx — Upcoming agenda card
 *
 * Props:
 *   agenda    {object[]}  — normalized dashboard agenda items
 *   source    {string}    — 'api' | 'fallback'
 *   isLoading {boolean}
 *
 * Shows live agenda from 09_Agenda_Kalender when available,
 * falls back to mock data with "Menampilkan data sementara" label.
 * No private event details are exposed.
 */

function SkeletonAgendaRow() {
  return (
    <div className="db-agenda-item" aria-hidden="true">
      <div style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, background: 'rgba(12,24,16,.07)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 12, width: '60%', borderRadius: 4, background: 'rgba(12,24,16,.07)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 10, width: '40%', borderRadius: 4, background: 'rgba(12,24,16,.05)', animation: 'dbSkeletonPulse 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export default function AgendaOverview({ agenda = [], source = 'fallback', isLoading = false }) {
  return (
    <div className="db-card">
      <div className="db-cp">
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Agenda Mendatang</div>
            <div className="db-card-sub">
              {isLoading
                ? 'Memuat agenda…'
                : `Sheet 09_Agenda_Kalender · ${agenda.length} kegiatan`}
            </div>
          </div>
          {/* Source indicator */}
          {!isLoading && source === 'fallback' ? (
            <span
              className="db-chip o"
              style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', whiteSpace: 'nowrap' }}
              title="Menampilkan data sementara"
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

        <div className="db-agenda-list" role="list" aria-label="Agenda mendatang">
          {isLoading
            ? [1, 2, 3].map((k) => <SkeletonAgendaRow key={k} />)
            : agenda.map((item) => (
                <div key={item.id} className="db-agenda-item" role="listitem">
                  {/* Date box */}
                  <div
                    className="db-date-box"
                    aria-label={`${item.displayDay} ${item.displayMonth}`}
                  >
                    <div className="db-date-d">{item.displayDay}</div>
                    <div className="db-date-m">{item.displayMonth}</div>
                  </div>

                  {/* Body */}
                  <div className="db-agenda-body">
                    <div className="db-agenda-title">{item.nama}</div>
                    <div className="db-agenda-meta">
                      {[item.waktu, item.lokasi].filter(Boolean).join(' · ')}
                    </div>
                  </div>

                  {/* Category badge */}
                  <span className={`db-ag-badge db-${item.badgeClass}`}>
                    {item.kategori}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
