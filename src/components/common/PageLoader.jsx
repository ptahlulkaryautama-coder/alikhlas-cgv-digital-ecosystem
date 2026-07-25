export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        backgroundColor: 'var(--color-cream, #fffdf7)',
        color: 'var(--color-forest, #0e3828)',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--color-forest-10, rgba(14, 56, 40, 0.1))',
          borderTopColor: 'var(--color-gold, #c9a55a)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '16px',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.01em' }}>
        Memuat halaman...
      </span>
    </div>
  );
}
