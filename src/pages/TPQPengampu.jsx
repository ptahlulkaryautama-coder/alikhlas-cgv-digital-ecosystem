import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import TPQAgendaMiniPreview from '../components/tpq/TPQAgendaMiniPreview.jsx';
import TPQAttendanceQuickDraft from '../components/tpq/TPQAttendanceQuickDraft.jsx';
import TPQClassAssignmentPreview from '../components/tpq/TPQClassAssignmentPreview.jsx';
import TPQFinanceMiniSnapshot from '../components/tpq/TPQFinanceMiniSnapshot.jsx';
import TPQMentorWorkspacePreview from '../components/tpq/TPQMentorWorkspacePreview.jsx';
import TPQModuleActionMap from '../components/tpq/TPQModuleActionMap.jsx';
import TPQMentorEvaluationPreview from '../components/tpq/TPQMentorEvaluationPreview.jsx';
import TPQModulePilotChecklist from '../components/tpq/TPQModulePilotChecklist.jsx';
import TPQPengampuHomeOverview from '../components/tpq/TPQPengampuHomeOverview.jsx';
import TPQProgressQuickDraft from '../components/tpq/TPQProgressQuickDraft.jsx';
import TPQRaportPrintPreview from '../components/tpq/TPQRaportPrintPreview.jsx';
import TPQReportsMiniPreview from '../components/tpq/TPQReportsMiniPreview.jsx';
import TPQSettingsMiniPreview from '../components/tpq/TPQSettingsMiniPreview.jsx';
import TPQStudentVaultPreview from '../components/tpq/TPQStudentVaultPreview.jsx';
import '../styles/tpq.css';
import '../styles/tpqPortal.css';

const MODULE_GROUPS = [
  {
    group: 'Utama',
    modules: [
      { title: 'Beranda', status: 'Shell', desc: 'Ringkasan jadwal, aktivitas, progres, dan kas TPQ untuk Kepala TPQ/pengampu.' },
    ],
  },
  {
    group: 'Akademik',
    modules: [
      { title: 'Santri', status: 'Private vault', desc: 'Direktori privat santri, kelas, status, dan kurikulum. Belum aktif sampai policy data anak disetujui.' },
      { title: 'Progres', status: 'Dirancang', desc: 'Catatan Iqra, Al-Qur’an, hafalan, dan murojaah dengan audit.' },
      { title: 'Raport', status: 'Print target', desc: 'Input nilai, preview raport, dan cetak raport dari data privat berotorisasi.' },
      { title: 'Absensi', status: 'Dirancang', desc: 'Absensi santri per kelas/periode: hadir, izin, sakit, alfa.' },
      { title: 'Kelas', status: 'Dirancang', desc: 'Kelompok belajar, jadwal, ruang, dan pengampu kelas.' },
    ],
  },
  {
    group: 'SDM TPQ',
    modules: [
      { title: 'Pengampu', status: 'Dirancang', desc: 'Data pengampu, jadwal mengajar, dan peran internal.' },
      { title: 'Evaluasi Pengampu', status: 'Private only', desc: 'Absensi pengampu dan evaluasi internal. Tidak tampil publik.' },
    ],
  },
  {
    group: 'Operasional',
    modules: [
      { title: 'Kas TPQ', status: 'Ledger ready', desc: 'Menggunakan finance ledger TPQ: import, manual entry, koreksi, dan batch history.' },
      { title: 'Agenda', status: 'Workflow ready', desc: 'Agenda TPQ internal/public-safe lewat workflow Agenda.' },
    ],
  },
  {
    group: 'Lainnya',
    modules: [
      { title: 'Laporan', status: 'Dirancang', desc: 'Rekap kelas, absensi, progres, kas, dan raport.' },
      { title: 'Setting', status: 'Dirancang', desc: 'Identitas TPQ, tahun ajaran, preferensi tampilan, dan backup manifest.' },
    ],
  },
];

const PRIVACY_RULES = [
  'Belum ada input nama anak/wali pada fase placeholder ini.',
  'Data presensi, progres, dan catatan individu tidak boleh tampil di website publik.',
  'Fitur tulis privat menunggu approval field list, consent, retention, dan sealing/encryption.',
  'Pengampu bekerja di app ringan; rilis publik tetap lewat workflow DKM.',
];

const PHASES = [
  { label: 'Shell', detail: 'Navigasi modul lengkap dan batas privasi.' },
  { label: 'Private Vault', detail: 'Schema/RPC privat setelah policy disetujui.' },
  { label: 'Dummy Trial', detail: 'Absensi, progres, dan print raport memakai data contoh.' },
  { label: 'Pilot TPQ', detail: 'Uji akun guru_tpq dan kepala_tpq dengan audit.' },
];

const STATUS_CHIPS = [
  { label: 'Safe shell', value: 'Aktif' },
  { label: 'Stand-alone', value: 'Siap dipisah' },
  { label: 'Private vault', value: 'Terkunci' },
  { label: 'Website publik', value: 'Tidak menerima data privat' },
];

const QUICK_START = ['Beranda', 'Absensi', 'Progres', 'Raport', 'Kas TPQ'];

const STANDALONE_BOTTOM_NAV = [
  { title: 'Beranda', label: 'Home' },
  { title: 'Absensi', label: 'Absen' },
  { title: 'Progres', label: 'Progres' },
  { title: 'Raport', label: 'Raport' },
  { title: 'Kas TPQ', label: 'Kas' },
];

const allModules = MODULE_GROUPS.flatMap((group) => group.modules.map((module) => ({ ...module, group: group.group })));

export default function TPQPengampu({ standalone = false }) {
  const [selectedTitle, setSelectedTitle] = useState('Beranda');
  const selected = useMemo(
    () => allModules.find((module) => module.title === selectedTitle) ?? allModules[0],
    [selectedTitle],
  );

  const content = (
    <div className="tpq-page tpq-pengampu-page">
      <section className="tpq-hero-card">
        <div>
          <div className="db-pg-eyebrow">PENGAMPU TPQ</div>
          <h1>App Pengampu TPQ</h1>
          <p>
            Ruang kerja mobile-first untuk sistem TPQ lengkap: santri, progres, raport, absensi,
            kelas, pengampu, evaluasi pengampu, kas TPQ, agenda, laporan, dan setting.
            Saat ini masih placeholder aman; belum membaca atau menulis data privat anak.
          </p>
        </div>
        <span className="tpq-pill">Belum aktif penuh</span>
      </section>

      <section className="tpq-app-command" aria-label="Status dan shortcut App Pengampu TPQ">
        <div className="tpq-app-command__status">
          {STATUS_CHIPS.map((chip) => (
            <span key={chip.label}>
              <small>{chip.label}</small>
              <strong>{chip.value}</strong>
            </span>
          ))}
        </div>
        <div className="tpq-app-command__quick">
          <small>Mulai cepat</small>
          <div>
            {QUICK_START.map((title) => (
              <button
                className={title === selected.title ? 'active' : ''}
                key={title}
                type="button"
                onClick={() => setSelectedTitle(title)}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="tpq-sec-wrapper">
        <div className="db-sec-eyebrow">SHELL OPERASIONAL</div>
        <div className="tpq-ops-shell">
          <aside className="tpq-ops-nav" aria-label="Navigasi modul App Pengampu TPQ">
            {MODULE_GROUPS.map((group) => (
              <div className="tpq-ops-nav-group" key={group.group}>
                <div className="tpq-ops-nav-label">{group.group}</div>
                {group.modules.map((module) => (
                  <button
                    className={`tpq-ops-nav-btn${module.title === selected.title ? ' active' : ''}`}
                    key={module.title}
                    type="button"
                    onClick={() => setSelectedTitle(module.title)}
                    aria-current={module.title === selected.title ? 'true' : undefined}
                  >
                    <span>{module.title}</span>
                    <small>{module.status}</small>
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <article className="tpq-ops-panel">
            <div className="tpq-ops-panel-top">
              <div>
                <div className="db-sec-eyebrow">{selected.group}</div>
                <h2>{selected.title}</h2>
                <p>{selected.desc}</p>
              </div>
              <span className="tpq-roadmap-badge">{selected.status}</span>
            </div>

            <div className="tpq-ops-preview">
              <div>
                <strong>Mode aman</strong>
                <span>Belum membaca data privat.</span>
              </div>
              <div>
                <strong>Mutasi</strong>
                <span>Belum ada form tulis sampai RPC privat aktif.</span>
              </div>
              <div>
                <strong>Public website</strong>
                <span>Tidak menerima data dari modul ini.</span>
              </div>
            </div>

            <div className="tpq-ops-next">
              <strong>Langkah implementasi berikutnya</strong>
              <ol>
                <li>Finalkan field dan aturan akses modul {selected.title}.</li>
                <li>Buat data dummy/test tanpa identitas anak riil.</li>
                <li>Pasang RPC privat setelah migration dan verification disetujui.</li>
              </ol>
            </div>

            {selected.title === 'Raport' ? <TPQRaportPrintPreview /> : null}
            {selected.title === 'Beranda' ? <TPQPengampuHomeOverview onSelectModule={setSelectedTitle} /> : null}
            {selected.title === 'Santri' ? <TPQStudentVaultPreview /> : null}
            {selected.title === 'Absensi' ? <TPQAttendanceQuickDraft /> : null}
            {selected.title === 'Progres' ? <TPQProgressQuickDraft /> : null}
            {selected.title === 'Kelas' ? <TPQClassAssignmentPreview /> : null}
            {selected.title === 'Pengampu' ? <TPQMentorWorkspacePreview /> : null}
            {selected.title === 'Evaluasi Pengampu' ? <TPQMentorEvaluationPreview /> : null}
            {selected.title === 'Kas TPQ' ? <TPQFinanceMiniSnapshot /> : null}
            {selected.title === 'Agenda' ? <TPQAgendaMiniPreview /> : null}
            {selected.title === 'Laporan' ? <TPQReportsMiniPreview /> : null}
            {selected.title === 'Setting' ? <TPQSettingsMiniPreview /> : null}
            <TPQModuleActionMap moduleTitle={selected.title} onSelectModule={setSelectedTitle} />
            <TPQModulePilotChecklist moduleTitle={selected.title} />
          </article>
        </div>
      </section>

      <section className="tpq-sec-wrapper">
        <div className="db-sec-eyebrow">ROADMAP EKSEKUSI</div>
        <div className="tpq-phase-grid">
          {PHASES.map((phase, index) => (
            <article className="tpq-phase-card" key={phase.label}>
              <span>{index + 1}</span>
              <strong>{phase.label}</strong>
              <p>{phase.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tpq-sec-wrapper">
        <div className="db-sec-eyebrow">BATAS PRIVASI</div>
        <h2 className="tpq-section-title">Aturan sebelum fitur privat dibuka</h2>
        <div className="tpq-info-grid">
          {PRIVACY_RULES.map((rule, index) => (
            <div className="tpq-info-card" key={rule}>
              <strong>{index + 1}</strong>
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </section>

      {standalone ? (
        <nav className="tpq-standalone-bottom-nav" aria-label="Navigasi bawah App Pengampu TPQ">
          {STANDALONE_BOTTOM_NAV.map((item) => (
            <button
              className={item.title === selected.title ? 'active' : ''}
              key={item.title}
              type="button"
              onClick={() => setSelectedTitle(item.title)}
              aria-current={item.title === selected.title ? 'page' : undefined}
            >
              <span aria-hidden="true">{item.label.charAt(0)}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );

  if (standalone) {
    return (
      <main className="tpq-standalone-app-shell">
        <div className="tpq-standalone-topbar">
          <div>
            <small>TPQ Al Mardhotillah</small>
            <strong>App Pengampu TPQ</strong>
          </div>
          <nav className="tpq-standalone-actions" aria-label="Navigasi cepat App TPQ">
            <Link to="/app/tpq">Portal TPQ</Link>
            <Link to="/app">Dashboard DKM</Link>
            <span>Safe shell</span>
          </nav>
        </div>
        <div className="tpq-standalone-bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        {content}
      </main>
    );
  }

  return (
    <DashboardLayout
      title="App Pengampu TPQ"
      subtitle="Workspace ringan untuk tugas harian pengampu"
      activeId="tpqPengampu"
    >
      {content}
    </DashboardLayout>
  );
}
