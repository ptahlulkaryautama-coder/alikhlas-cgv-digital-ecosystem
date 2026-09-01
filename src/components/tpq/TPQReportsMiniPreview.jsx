import { useState } from 'react';
import TPQReportExportManifestPreview from './TPQReportExportManifestPreview.jsx';
import TPQReportAssemblyPreview from './TPQReportAssemblyPreview.jsx';

const REPORT_CARDS = [
  { label: 'Absensi', value: '4 baris', detail: 'Dummy kehadiran per sesi' },
  { label: 'Progres', value: '3 catatan', detail: 'Iqra, hafalan, dan tindak lanjut' },
  { label: 'Raport', value: '1 preview', detail: 'Renderer cetak dummy siap' },
  { label: 'Kas TPQ', value: 'Read-only', detail: 'Mengikuti ledger finance TPQ' },
];

const EXPORT_RULES = [
  'Export belum aktif sampai role dan privacy policy disetujui.',
  'Laporan publik hanya boleh agregat, tanpa nama santri/wali.',
  'Print raport hanya dari private vault berotorisasi.',
];

export default function TPQReportsMiniPreview() {
  const [activeReportType, setActiveReportType] = useState('Absensi');
  const [reportNotice, setReportNotice] = useState(null);

  function handleGenerateReport(type) {
    setActiveReportType(type);
    setReportNotice(`📊 Rekap Laporan [${type}] Berhasil Di-generate untuk Pratinjau (Safe-Shell)!`);
    setTimeout(() => setReportNotice(null), 4000);
  }

  return (
    <div className="tpq-academic-demo" aria-label="Preview laporan TPQ tanpa data privat">
      <div className="tpq-demo-header">
        <div>
          <span>LAPORAN TPQ</span>
          <h3>Rekap Operasional Aman</h3>
          <p>Preview laporan semester dan operasional. Pilih modul rekap di bawah untuk menguji penjelajahan laporan.</p>
        </div>
        <strong>Read-only</strong>
      </div>

      {reportNotice && (
        <div style={{
          background: 'linear-gradient(135deg, #0b3424, #17573a)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(11,52,36,0.25)',
        }}>
          {reportNotice}
        </div>
      )}

      <div className="tpq-report-mini-grid">
        {REPORT_CARDS.map((card) => {
          const isSelected = activeReportType === card.label;
          return (
            <article
              key={card.label}
              onClick={() => handleGenerateReport(card.label)}
              style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid #0c2b1d' : undefined,
                background: isSelected ? 'rgba(12,43,29,0.06)' : undefined,
              }}
            >
              <small>{card.label}</small>
              <strong>{card.value}</strong>
              <span>{card.detail}</span>
              <button
                type="button"
                style={{
                  marginTop: '8px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(12,24,16,0.2)',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: isSelected ? '#0c2b1d' : '#fff',
                  color: isSelected ? '#fff' : '#0c2b1d',
                  cursor: 'pointer',
                }}
              >
                {isSelected ? '✓ Rekap Aktif' : 'Generate Rekap'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="tpq-report-rules">
        <strong>Aturan export nanti</strong>
        <ul>
          {EXPORT_RULES.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </div>

      <TPQReportAssemblyPreview />

      <TPQReportExportManifestPreview />
    </div>
  );
}

