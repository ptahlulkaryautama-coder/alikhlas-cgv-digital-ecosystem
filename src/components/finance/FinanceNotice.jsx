/**
 * FinanceNotice.jsx — Informational notice for the Keuangan read-only module
 *
 * Shows:
 *  1. Fallback/live data status indicator
 *  2. Disabled "Input Transaksi" button placeholder (no POST, Phase 5)
 *  3. Public-safe explanation of what data is shown
 */

export default function FinanceNotice({ source = 'fallback', isLoading = false }) {
  const isFallback = source !== 'api';

  return (
    <div className="db-card db-cp" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

        {/* Left: status + explanation */}
        <div style={{ flex: 1, minWidth: 240 }}>
          {/* Data source badge */}
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
                  : { background: 'var(--db-up-bg)', color: 'var(--db-up-text)', border: '1px solid rgba(15,97,48,.12)' }),
              }}
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">{isFallback ? '⚠' : '✓'}</span>
              {isFallback
                ? 'Data sementara — belum seluruh transaksi tersambung.'
                : 'Data live dari Google Sheets 02_Keuangan'}
            </div>
          )}

          {/* Explanation */}
          <p style={{ fontSize: '12.5px', color: 'var(--db-text-3)', lineHeight: 1.6, margin: 0, maxWidth: '540px' }}>
            Halaman ini menampilkan <strong>ringkasan kas</strong> dan <strong>rekapitulasi kategori</strong> dari buku kas masjid.
            Data diambil dari spreadsheet bendahara secara read-only.
            Nama donatur dan catatan internal tidak ditampilkan di sini.
          </p>
        </div>

        {/* Right: disabled action button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <button
            disabled
            type="button"
            aria-disabled="true"
            title="Input transaksi belum aktif di fase ini"
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
            Input Transaksi
          </button>
          <span style={{ fontSize: '10.5px', color: 'var(--db-text-4)' }}>Belum aktif — fase berikutnya</span>
        </div>
      </div>
    </div>
  );
}
