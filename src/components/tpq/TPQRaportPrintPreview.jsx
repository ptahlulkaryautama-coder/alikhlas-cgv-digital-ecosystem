import { useState } from 'react';
import TPQRaportPrintReadinessChecklist from './TPQRaportPrintReadinessChecklist.jsx';
import useTpqIntegration from '../../hooks/useTpqIntegration.js';

const STUDENT_REPORTS = {
  'TPQ-STUDENT-001': {
    code: 'TPQ-STUDENT-001',
    kelas: 'Iqra 3–4',
    period: 'Semester Ganjil',
    rows: [
      { label: 'Iqra / Al-Qur’an', value: 'Juz Amma — latihan murajaah', tone: 'green' },
      { label: 'Hafalan', value: 'Surat pendek pilihan (Al-Alaq)', tone: 'gold' },
      { label: 'Adab & Kehadiran', value: 'Stabil — perlu penguatan rutinitas', tone: 'blue' },
    ],
  },
  'TPQ-STUDENT-002': {
    code: 'TPQ-STUDENT-002',
    kelas: 'Iqra 5–6',
    period: 'Semester Ganjil',
    rows: [
      { label: 'Iqra / Al-Qur’an', value: 'Al-Qur’an Juz 1 — lancar', tone: 'green' },
      { label: 'Hafalan', value: 'Surat An-Naba & An-Naziat', tone: 'gold' },
      { label: 'Adab & Kehadiran', value: 'Sangat baik — rajin mengaji', tone: 'blue' },
    ],
  },
  'TPQ-STUDENT-003': {
    code: 'TPQ-STUDENT-003',
    kelas: 'Al-Qur’an Lanjutan',
    period: 'Semester Ganjil',
    rows: [
      { label: 'Iqra / Al-Qur’an', value: 'Tajwid & Ghoib Juz 30', tone: 'green' },
      { label: 'Hafalan', value: 'Hafalan Juz 30 Mutqin', tone: 'gold' },
      { label: 'Adab & Kehadiran', value: 'Aktif & teliti', tone: 'blue' },
    ],
  },
};

const PRINT_STEPS = [
  'Pilih kelas dan periode',
  'Review nilai & catatan',
  'Preview wali santri',
  'Cetak / simpan PDF',
];

export default function TPQRaportPrintPreview() {
  const { saveRaport, isSaving, capabilities } = useTpqIntegration();
  const [selectedStudentCode, setSelectedStudentCode] = useState('TPQ-STUDENT-001');
  const [printNotice, setPrintNotice] = useState(null);
  const report = STUDENT_REPORTS[selectedStudentCode] ?? STUDENT_REPORTS['TPQ-STUDENT-001'];

  async function handleSimulatePrint() {
    if (capabilities?.writes_enabled) {
      await saveRaport({ student_code: selectedStudentCode, report });
      setPrintNotice(`🖨️ Document Raport TPQ [${selectedStudentCode} - ${report.kelas}] Disimpan ke Vault & Siap Cetak/PDF!`);
    } else {
      setPrintNotice(`🖨️ Document Raport TPQ [${selectedStudentCode} - ${report.kelas}] Siap Dicetak / Disimpan PDF (Simulasi Safe-Shell)!`);
    }
    setTimeout(() => setPrintNotice(null), 4500);
  }

  return (
    <div className="tpq-report-workspace" aria-label="Preview cetak raport TPQ dengan data dummy">
      <section className="tpq-report-toolbar" aria-label="Alur cetak raport aman">
        <div>
          <span>RAPORT WORKFLOW</span>
          <h3>Input → Preview → Print</h3>
          <p>Flow ini masih simulasi aman. Data anak asli baru boleh dibuka setelah private vault dan policy disetujui.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedStudentCode}
            onChange={(e) => setSelectedStudentCode(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(12,24,16,.2)',
              fontSize: '12px',
              fontWeight: 600,
              background: '#fff',
              cursor: 'pointer',
            }}
            aria-label="Pilih kode santri simulasi"
          >
            <option value="TPQ-STUDENT-001">TPQ-STUDENT-001</option>
            <option value="TPQ-STUDENT-002">TPQ-STUDENT-002</option>
            <option value="TPQ-STUDENT-003">TPQ-STUDENT-003</option>
          </select>
          <button
            className="tpq-report-print-btn"
            type="button"
            onClick={handleSimulatePrint}
            aria-label="Tombol simulasi cetak raport"
          >
            Print preview
          </button>
        </div>
      </section>

      {printNotice && (
        <div style={{
          background: 'linear-gradient(135deg, #08291c, #17573a)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(8,41,28,0.25)',
        }}>
          {printNotice}
        </div>
      )}

      <div className="tpq-report-stepper" aria-label="Tahapan print raport">
        {PRINT_STEPS.map((step, index) => (
          <div className="tpq-report-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <div className="tpq-report-preview">
        <div className="tpq-report-sheet">
          <div className="tpq-report-header">
            <div>
              <span>TPQ AL MARDHOTILLAH</span>
              <h3>Preview Raport Semester</h3>
              <p>Data dummy/opaque untuk desain print — belum memakai data anak asli.</p>
            </div>
            <strong>PRINT SAFE</strong>
          </div>

          <div className="tpq-report-identity">
            <div>
              <small>Kode Santri</small>
              <strong>{report.code}</strong>
            </div>
            <div>
              <small>Kelas</small>
              <strong>{report.kelas}</strong>
            </div>
            <div>
              <small>Periode</small>
              <strong>{report.period}</strong>
            </div>
          </div>

          <div className="tpq-report-table">
            {report.rows.map((row) => (
              <div className="tpq-report-row" key={row.label}>
                <span className={`tpq-report-dot ${row.tone}`} aria-hidden="true" />
                <div>
                  <small>{row.label}</small>
                  <strong>{row.value}</strong>
                </div>
              </div>
            ))}
          </div>

          <blockquote>
            Catatan pengampu akan dirender di sini setelah field, role, dan aturan privasi disetujui.
          </blockquote>
        </div>
      </div>

      <div className="tpq-report-safety-note">
        <strong>Kenapa belum bisa cetak data asli?</strong>
        <p>
          Raport memuat data anak. Jadi versi produksi nanti harus membaca dari private vault,
          mencatat audit akses, dan tidak boleh masuk website publik atau localStorage.
        </p>
      </div>

      <TPQRaportPrintReadinessChecklist />
    </div>
  );
}

