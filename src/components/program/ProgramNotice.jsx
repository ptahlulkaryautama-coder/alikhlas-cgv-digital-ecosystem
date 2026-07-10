/**
 * ProgramNotice.jsx — Status notice for the Program & Kegiatan read-only module
 *
 * Shows:
 *  1. Data source indicator (API live vs. fallback)
 *  2. Disabled "Tambah Program" placeholder button (no write, Phase 6)
 *  3. Sheet source reference
 */

export default function ProgramNotice({ source = 'fallback', isLoading = false, total = 0 }) {
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
                ? 'Data sementara — program belum tersambung penuh.'
                : `Data live · ${total} program dari Sheet 01_Program_Kajian`}
            </div>
          )}

          <p style={{ fontSize: '12.5px', color: 'var(--db-text-3)', lineHeight: 1.6, margin: 0, maxWidth: '560px' }}>
            Halaman ini menampilkan daftar program kajian dari{' '}
            <code style={{ background: 'var(--db-bg-inset)', padding: '1px 6px', borderRadius: '5px', fontSize: '11px' }}>
              01_Program_Kajian
            </code>
            {' '}secara read-only. Data pribadi jemaah, daftar hadir, dan catatan internal tidak ditampilkan.
          </p>
        </div>

        {/* Right: disabled action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <button
            disabled
            type="button"
            aria-disabled="true"
            title="Input program belum aktif di fase ini"
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
            Tambah Program
          </button>
          <span style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Belum aktif — fase berikutnya</span>
        </div>
      </div>
    </div>
  );
}
