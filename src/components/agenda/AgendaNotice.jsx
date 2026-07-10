/**
 * AgendaNotice.jsx — Status notice for the Agenda & Kalender read-only module
 *
 * Shows:
 *  1. Data source indicator (API live vs. fallback)
 *  2. Disabled "Tambah Agenda" placeholder button
 *  3. Sheet reference
 */

export default function AgendaNotice({ source = 'fallback', isLoading = false, total = 0 }) {
  const isFallback = source !== 'api';

  return (
    <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

        {/* Left: status + context */}
        <div style={{ flex: 1, minWidth: 240 }}>
          {!isLoading && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '99px',
                marginBottom: '10px',
                ...(isFallback
                  ? { background: 'var(--db-warn-bg)', color: 'var(--db-warn-text)', border: '1px solid rgba(122,75,10,.12)' }
                  : { background: 'var(--db-up-bg)',   color: 'var(--db-up-text)',   border: '1px solid rgba(15,97,48,.12)' }),
              }}
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">{isFallback ? '⚠' : '✓'}</span>
              {isFallback
                ? 'Data sementara — agenda belum tersambung penuh.'
                : `Data live · ${total} agenda dari Sheet 09_Agenda_Kalender`}
            </div>
          )}

          <p style={{ fontSize: '12.5px', color: 'var(--db-text-3)', lineHeight: 1.6, margin: 0, maxWidth: '560px' }}>
            Halaman ini menampilkan daftar agenda dari{' '}
            <code style={{ background: 'var(--db-bg-inset)', padding: '1px 6px', borderRadius: '5px', fontSize: '11px' }}>
              09_Agenda_Kalender
            </code>
            {' '}secara read-only. Catatan internal panitia dan data peserta tidak ditampilkan.
          </p>
        </div>

        {/* Right: disabled action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <button
            disabled
            type="button"
            aria-disabled="true"
            title="Tambah agenda belum aktif di fase ini"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(12,24,16,.10)',
              background: 'var(--db-bg-inset)',
              color: 'var(--db-text-4)',
              fontFamily: 'inherit',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'not-allowed',
              opacity: 0.65,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Tambah Agenda
          </button>
          <span style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Belum aktif — fase berikutnya</span>
        </div>
      </div>
    </div>
  );
}
