import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { ROUTE_PERMISSIONS } from '../src/services/accessPolicy.js';

test('TPQ pengampu app has a protected internal route and sidebar entry', async () => {
  const [app, sidebar] = await Promise.all([
    readFile('src/App.jsx', 'utf8'),
    readFile('src/components/dashboard/Sidebar.jsx', 'utf8'),
  ]);
  assert.equal(ROUTE_PERMISSIONS['/app/tpq/pengampu'], 'tpq:read');
  assert.equal(ROUTE_PERMISSIONS['/app/tpq/app'], 'tpq:read');
  assert.match(app, /TPQPengampu/);
  assert.match(app, /path="\/app\/tpq\/pengampu"/);
  assert.match(app, /path="\/app\/tpq\/app"/);
  assert.match(app, /<TPQPengampu standalone \/>/);
  assert.match(sidebar, /App Pengampu/);
  assert.match(sidebar, /\/app\/tpq\/pengampu/);
  assert.match(sidebar, /db-sb-item-featured/);
  assert.match(sidebar, /db-sb-icon-wrap/);
});

test('TPQ pengampu placeholder is mobile-first and does not access private records yet', async () => {
  const page = await readFile('src/pages/TPQPengampu.jsx', 'utf8');
  assert.match(page, /Workspace ringan untuk tugas harian pengampu/);
  assert.match(page, /tpq-pengampu-page/);
  assert.match(page, /standalone = false/);
  assert.match(page, /tpq-standalone-app-shell/);
  assert.match(page, /tpq-standalone-actions/);
  assert.match(page, /STANDALONE_BOTTOM_NAV/);
  assert.match(page, /tpq-standalone-bottom-nav/);
  assert.match(page, /Navigasi bawah App Pengampu TPQ/);
  assert.match(page, /to="\/app\/tpq"/);
  assert.match(page, /to="\/app"/);
  assert.match(page, /TPQ Al Mardhotillah/);
  assert.match(page, /mobile-first/);
  assert.match(page, /belum membaca atau menulis data privat anak/i);
  assert.match(page, /SHELL OPERASIONAL/);
  assert.match(page, /STATUS_CHIPS/);
  assert.match(page, /QUICK_START/);
  assert.match(page, /Private vault/);
  assert.match(page, /Terkunci/);
  assert.match(page, /Website publik/);
  assert.match(page, /Tidak menerima data privat/);
  assert.match(page, /Mulai cepat/);
  for (const bottomNavItem of ['Home', 'Absen', 'Progres', 'Raport', 'Kas']) {
    assert.match(page, new RegExp(bottomNavItem));
  }
  assert.match(page, /ROADMAP EKSEKUSI/);
  assert.match(page, /TPQRaportPrintPreview/);
  assert.match(page, /TPQAttendanceQuickDraft/);
  assert.match(page, /TPQProgressQuickDraft/);
  assert.match(page, /TPQClassAssignmentPreview/);
  assert.match(page, /TPQMentorWorkspacePreview/);
  assert.match(page, /TPQFinanceMiniSnapshot/);
  assert.match(page, /TPQAgendaMiniPreview/);
  assert.match(page, /TPQPengampuHomeOverview/);
  assert.match(page, /TPQModuleActionMap/);
  assert.match(page, /TPQModulePilotChecklist/);
  assert.match(page, /TPQReportsMiniPreview/);
  assert.match(page, /TPQSettingsMiniPreview/);
  assert.match(page, /TPQStudentVaultPreview/);
  assert.match(page, /TPQMentorEvaluationPreview/);
  for (const module of ['Beranda', 'Santri', 'Progres', 'Raport', 'Absensi', 'Kelas', 'Pengampu', 'Evaluasi Pengampu', 'Kas TPQ', 'Agenda', 'Laporan', 'Setting']) {
    assert.match(page, new RegExp(module));
  }
  assert.doesNotMatch(page, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(/i);
});

test('TPQ module action map gives safe per-module next actions without private access', async () => {
  const [page, source, css] = await Promise.all([
    readFile('src/pages/TPQPengampu.jsx', 'utf8'),
    readFile('src/components/tpq/TPQModuleActionMap.jsx', 'utf8'),
    readFile('src/styles/tpqPortal.css', 'utf8'),
  ]);
  assert.match(page, /TPQModuleActionMap moduleTitle=\{selected\.title\} onSelectModule=\{setSelectedTitle\}/);
  assert.match(source, /ACTION_MAP/);
  assert.match(source, /Peta aksi aman modul/);
  assert.match(source, /Bisa dicoba sekarang/);
  assert.match(source, /Masih terkunci/);
  assert.match(source, /Modul terkait/);
  assert.match(source, /Santri/);
  assert.match(source, /Absensi/);
  assert.match(source, /Progres/);
  assert.match(source, /Raport/);
  assert.match(source, /Kas TPQ/);
  assert.match(source, /Laporan/);
  assert.match(source, /Setting/);
  assert.match(source, /Nama lengkap anak/);
  assert.match(source, /pembayaran anak/i);
  assert.match(source, /onSelectModule\(target\)/);
  assert.match(css, /tpq-module-action-map/);
  assert.match(css, /tpq-module-action-grid/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem/i);
});

test('TPQ module pilot checklist explains safe readiness per module without private access', async () => {
  const source = await readFile('src/components/tpq/TPQModulePilotChecklist.jsx', 'utf8');
  assert.match(source, /Kesiapan pilot modul/);
  assert.match(source, /MODUL READINESS/);
  assert.match(source, /Kesiapan pilot:/);
  assert.match(source, /UI shell/);
  assert.match(source, /Data dummy/);
  assert.match(source, /Private vault/);
  assert.match(source, /Write RPC/);
  assert.match(source, /Beranda/);
  assert.match(source, /Kas TPQ/);
  assert.match(source, /Agenda/);
  assert.match(source, /Tidak menampilkan pembayaran individu/);
  assert.match(source, /Tidak menampilkan daftar peserta/);
  assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem/i);
});

test('TPQ module pilot checklist has responsive styling', async () => {
  const css = await readFile('src/styles/tpqPortal.css', 'utf8');
  assert.match(css, /tpq-module-pilot-checklist/);
  assert.match(css, /tpq-module-pilot-grid/);
  assert.match(css, /article\.ready/);
  assert.match(css, /article\.pending/);
  assert.match(css, /article\.locked/);
});

test('TPQ pengampu spec preserves privacy and scopes future work', async () => {
  const spec = await readFile('docs/TPQ_PENGAMPU_APP_SPEC.md', 'utf8');
  assert.match(spec, /Mobile-first/);
  assert.match(spec, /Satu layar = satu tugas/);
  assert.match(spec, /Raport/);
  assert.match(spec, /Kas TPQ/);
  assert.match(spec, /print raport/i);
  assert.match(spec, /Semua mutasi lewat RPC Supabase/);
  assert.match(spec, /Stand-alone app direction/);
  assert.match(spec, /\/app\/tpq\/app/);
  assert.match(spec, /Tetap memakai Supabase Auth, role, permission, RLS, RPC, dan audit trail yang sama/);
  assert.match(spec, /Apakah semua pengampu melihat semua kelas, atau hanya kelas yang diampu/);
  assert.doesNotMatch(spec, /langsung tampil di website publik/i);
});

test('TPQ raport print preview uses dummy opaque data only', async () => {
  const [preview, readiness, css] = await Promise.all([
    readFile('src/components/tpq/TPQRaportPrintPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQRaportPrintReadinessChecklist.jsx', 'utf8'),
    readFile('src/styles/tpqPortal.css', 'utf8'),
  ]);
  assert.match(preview, /Preview cetak raport TPQ dengan data dummy/);
  assert.match(preview, /Input → Preview → Print/);
  assert.match(preview, /Pilih kelas dan periode/);
  assert.match(preview, /Cetak \/ simpan PDF/);
  assert.match(preview, /TPQ-STUDENT-001/);
  assert.match(preview, /belum memakai data anak asli/i);
  assert.match(preview, /tidak boleh masuk website publik atau localStorage/i);
  assert.match(preview, /PRINT SAFE/);
  assert.match(preview, /TPQRaportPrintReadinessChecklist/);
  assert.match(readiness, /PRINT READINESS/);
  assert.match(readiness, /Checklist sebelum raport asli dicetak/);
  assert.match(readiness, /Audit print/);
  assert.match(readiness, /tidak punya link publik/);
  assert.match(css, /tpq-raport-readiness/);
  assert.match(css, /tpq-raport-readiness-grid/);
  for (const source of [preview, readiness]) {
    assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|window\.print|localStorage\.setItem/i);
  }
});

test('TPQ attendance and progress demos use opaque dummy records only', async () => {
  const [attendance, progress] = await Promise.all([
    readFile('src/components/tpq/TPQAttendanceQuickDraft.jsx', 'utf8'),
    readFile('src/components/tpq/TPQProgressQuickDraft.jsx', 'utf8'),
  ]);
  for (const source of [attendance, progress]) {
    assert.match(source, /TPQ-STUDENT-00/);
    assert.match(source, /dummy|Simulasi|Draft safe/i);
    assert.match(source, /private vault aktif/);
    assert.match(source, /disabled/);
    assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem/i);
  }
  assert.match(attendance, /ABSENSI CEPAT/);
  assert.match(attendance, /MOCK INPUT/);
  assert.match(attendance, /Catatan sopan dan singkat/);
  assert.match(progress, /PROGRES BELAJAR/);
  assert.match(progress, /Catatan progres aman/);
  assert.match(progress, /Nama santri dan catatan sensitif belum dibuka/);
});

test('TPQ class and mentor previews contain no private identity data or mutations', async () => {
  const [classes, mentors, evaluation] = await Promise.all([
    readFile('src/components/tpq/TPQClassAssignmentPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQMentorWorkspacePreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQMentorEvaluationPreview.jsx', 'utf8'),
  ]);
  assert.match(classes, /KELAS & JADWAL/);
  assert.match(classes, /Pemetaan Kelompok Belajar/);
  assert.match(classes, /Preview jadwal mingguan kelas TPQ/);
  assert.match(mentors, /Peran Operasional TPQ/);
  assert.match(mentors, /Belum menampilkan identitas personal pengampu/);
  assert.match(mentors, /Preview coverage pengampu tanpa identitas personal/);
  assert.match(evaluation, /Preview rubrik evaluasi pengampu tanpa data personal/);
  assert.match(evaluation, /Adab mengajar/);
  for (const source of [classes, mentors, evaluation]) {
    assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(/i);
    assert.doesNotMatch(source, /nama wali|nomor wali|alamat|payment|pembayaran|Ustadz [A-Z]|Ustadzah [A-Z]/i);
  }
});

test('TPQ student vault and mentor evaluation previews remain private-safe', async () => {
  const [student, evaluation] = await Promise.all([
    readFile('src/components/tpq/TPQStudentVaultPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQMentorEvaluationPreview.jsx', 'utf8'),
  ]);
  assert.match(student, /Preview direktori santri privat tanpa data anak/);
  assert.match(student, /belum membaca nama anak, wali, alamat, absensi, nilai, atau pembayaran/i);
  assert.match(evaluation, /Preview evaluasi pengampu privat/);
  assert.match(evaluation, /Belum membaca identitas personal/);
  for (const source of [student, evaluation]) {
    assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem/i);
  }
});

test('TPQ finance mini snapshot is read-only and uses the canonical finance read model', async () => {
  const source = await readFile('src/components/tpq/TPQFinanceMiniSnapshot.jsx', 'utf8');
  assert.match(source, /useSupabaseFinanceReadModel\('tpq'\)/);
  assert.match(source, /Snapshot read-only Kas TPQ/);
  assert.match(source, /Tidak memuat nama santri atau detail pembayaran privat/);
  assert.doesNotMatch(source, /insert\(|update\(|delete\(|command_finance|finance_manual_command|finance_import_commit/i);
});

test('TPQ agenda mini preview reads only public-safe agenda data', async () => {
  const source = await readFile('src/components/tpq/TPQAgendaMiniPreview.jsx', 'utf8');
  assert.match(source, /useAgendaData\(\{ scope: 'public' \}\)/);
  assert.match(source, /Preview read-only Agenda TPQ/);
  assert.match(source, /Data peserta dan catatan internal tidak ditampilkan/);
  assert.doesNotMatch(source, /command_content_agenda|AgendaEditor|insert\(|update\(|delete\(/i);
});

test('TPQ pengampu home overview is a safe navigation shell only', async () => {
  const [source, mobileFrame, checklist, academicFlow, handoff, readiness, journey] = await Promise.all([
    readFile('src/components/tpq/TPQPengampuHomeOverview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQMobileAppFramePreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQOperatorChecklistPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQAcademicFlowPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQDailySessionHandoffPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQPilotReadinessPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQRoleJourneyPreview.jsx', 'utf8'),
  ]);
  assert.match(source, /Beranda aman App Pengampu TPQ/);
  assert.match(source, /Shortcut ini hanya memindahkan tampilan modul/);
  assert.match(source, /TPQMobileAppFramePreview/);
  assert.match(source, /TPQOperatorChecklistPreview/);
  assert.match(source, /TPQAcademicFlowPreview/);
  assert.match(source, /TPQStudentSessionPipeline/);
  assert.match(source, /TPQClassMentorEvaluationBridge/);
  assert.match(source, /TPQDailySessionHandoffPreview/);
  assert.match(source, /TPQPilotReadinessPreview/);
  assert.match(source, /TPQRoleJourneyPreview/);
  assert.match(source, /onSelectModule/);
  assert.match(mobileFrame, /Preview stand-alone App Pengampu TPQ/);
  assert.match(mobileFrame, /Supabase Auth\/RLS\/RPC/);
  assert.match(mobileFrame, /Tanpa membuka data privat anak/);
  assert.match(checklist, /Checklist operator App Pengampu TPQ/);
  assert.match(checklist, /Urutan Kerja Pengampu/);
  assert.match(checklist, /Belum menyimpan data anak sampai private vault aktif/);
  assert.match(checklist, /onSelectModule\('Raport'\)/);
  assert.match(academicFlow, /Alur akademik harian App TPQ/);
  assert.match(academicFlow, /Absensi → Progres → Raport/);
  assert.match(academicFlow, /dummy\/opaque/);
  assert.match(academicFlow, /Buka Absensi/);
  assert.match(academicFlow, /Buka Progres/);
  assert.match(academicFlow, /Buka Raport/);
  assert.match(handoff, /Preview handoff sesi harian TPQ/);
  assert.match(handoff, /SESSION HANDOFF/);
  assert.match(handoff, /Ringkasan setelah kelas/);
  assert.match(handoff, /Review Absensi/);
  assert.match(handoff, /Review Progres/);
  assert.match(handoff, /Siapkan Raport/);
  assert.match(readiness, /Preview kesiapan pilot App TPQ/);
  assert.match(readiness, /Tidak menjalankan SQL/);
  assert.match(readiness, /TPQ-STUDENT-001/);
  assert.match(readiness, /Policy data anak → migration private vault/);
  assert.match(journey, /Preview alur kerja per role App TPQ/);
  assert.match(journey, /Pengampu/);
  assert.match(journey, /Kepala TPQ/);
  assert.match(journey, /Bendahara TPQ/);
  assert.match(journey, /Admin DKM/);
  assert.match(journey, /Tidak mengubah permission/);
  assert.match(journey, /firstModule/);
  assert.match(journey, /Mulai alur/);
  assert.match(journey, /onSelectModule\(item\.firstModule\)/);
  assert.match(source, /TPQRoleJourneyPreview onSelectModule=\{onSelectModule\}/);
  for (const checked of [source, mobileFrame, checklist, academicFlow, handoff, readiness, journey]) {
    assert.doesNotMatch(checked, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|serviceWorker|localStorage\.setItem/i);
  }
});

test('TPQ class mentor evaluation bridge connects SDM workflow without identities', async () => {
  const [source, css] = await Promise.all([
    readFile('src/components/tpq/TPQClassMentorEvaluationBridge.jsx', 'utf8'),
    readFile('src/styles/tpqPortal.css', 'utf8'),
  ]);
  assert.match(source, /CLASS TO MENTOR BRIDGE/);
  assert.match(source, /Kelas → Pengampu → Evaluasi/);
  assert.match(source, /Pengampu A\/B\/C/);
  assert.match(source, /tanpa membuka identitas personal/);
  assert.match(source, /Belum ada nama pengampu asli/);
  assert.match(source, /onSelectModule\(step\.module\)/);
  assert.match(css, /tpq-class-mentor-bridge/);
  assert.match(css, /tpq-class-mentor-bridge-grid/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem|window\.print/i);
});

test('TPQ student session pipeline connects attendance progress and raport with opaque data only', async () => {
  const [source, css] = await Promise.all([
    readFile('src/components/tpq/TPQStudentSessionPipeline.jsx', 'utf8'),
    readFile('src/styles/tpqPortal.css', 'utf8'),
  ]);
  assert.match(source, /SESSION PIPELINE/);
  assert.match(source, /Satu alur santri tanpa identitas pribadi/);
  assert.match(source, /TPQ-STUDENT-001/);
  assert.match(source, /Absensi/);
  assert.match(source, /Progres/);
  assert.match(source, /Raport/);
  assert.match(source, /kode opaque/);
  assert.match(source, /Belum ada nama santri, wali, alamat, nilai asli, atau catatan sensitif/);
  assert.match(source, /onSelectModule\(item\.step\)/);
  assert.match(css, /tpq-student-pipeline/);
  assert.match(css, /tpq-student-pipeline-grid/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(source, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem|window\.print/i);
});

test('TPQ reports mini preview is read-only and export locked', async () => {
  const [source, manifest, assembly, css] = await Promise.all([
    readFile('src/components/tpq/TPQReportsMiniPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQReportExportManifestPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQReportAssemblyPreview.jsx', 'utf8'),
    readFile('src/styles/tpqPortal.css', 'utf8'),
  ]);
  assert.match(source, /Preview laporan TPQ tanpa data privat/);
  assert.match(source, /Export belum aktif sampai role dan privacy policy disetujui/);
  assert.match(source, /Laporan publik hanya boleh agregat/);
  assert.match(source, /TPQReportAssemblyPreview/);
  assert.match(source, /TPQReportExportManifestPreview/);
  assert.match(manifest, /Preview manifest export laporan TPQ/);
  assert.match(manifest, /Semua export produksi harus punya tujuan, format, dan batas data/);
  assert.match(manifest, /Raport Santri/);
  assert.match(manifest, /bukan publik/);
  assert.match(assembly, /REPORT ASSEMBLY/);
  assert.match(assembly, /Absensi \+ Progres \+ Raport \+ Kas \+ Agenda/);
  assert.match(assembly, /Belum export, belum print produksi/);
  assert.match(assembly, /tanpa file PDF\/CSV, tanpa nama anak/);
  assert.match(css, /tpq-report-assembly/);
  assert.match(css, /tpq-report-assembly-flow/);
  for (const checked of [source, manifest, assembly]) {
    assert.doesNotMatch(checked, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem|window\.print/i);
  }
});

test('TPQ settings mini preview documents stand-alone readiness without writes', async () => {
  const [source, roleAccess, backup, runbook, policyGate, readiness, fieldMatrix, journey] = await Promise.all([
    readFile('src/components/tpq/TPQSettingsMiniPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQRoleAccessPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQBackupReadinessPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQBackupRestoreRunbookPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQPolicyGatePreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQPilotReadinessPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQPrivateFieldMatrixPreview.jsx', 'utf8'),
    readFile('src/components/tpq/TPQRoleJourneyPreview.jsx', 'utf8'),
  ]);
  assert.match(source, /Preview setting TPQ stand-alone/);
  assert.match(source, /Belum menyimpan perubahan/);
  assert.match(source, /Login, role, RLS, RPC, dan audit tetap dari Supabase yang sama/);
  assert.match(source, /Data privat anak tidak boleh masuk localStorage atau website publik/);
  assert.match(source, /TPQRoleAccessPreview/);
  assert.match(source, /TPQBackupReadinessPreview/);
  assert.match(source, /TPQPolicyGatePreview/);
  assert.match(source, /TPQPilotReadinessPreview/);
  assert.match(source, /TPQPrivateFieldMatrixPreview/);
  assert.match(source, /TPQRoleJourneyPreview/);
  assert.match(roleAccess, /Preview matriks role App Pengampu TPQ/);
  assert.match(roleAccess, /Kepala TPQ/);
  assert.match(roleAccess, /Bendahara TPQ/);
  assert.match(roleAccess, /Belum mengubah role\/permission Supabase/);
  assert.match(backup, /Preview kesiapan backup App TPQ/);
  assert.match(backup, /Backup untuk data privat TPQ belum aktif/);
  assert.match(backup, /Restore rehearsal/);
  assert.match(backup, /TPQBackupRestoreRunbookPreview/);
  assert.match(runbook, /RESTORE REHEARSAL/);
  assert.match(runbook, /checksum/);
  assert.match(runbook, /tidak pernah menimpa produksi/);
  assert.match(runbook, /Audit wajib/);
  assert.match(runbook, /Tidak ada data anak ke website publik atau localStorage/);
  assert.match(policyGate, /Preview policy gate TPQ Private Vault/);
  assert.match(policyGate, /Checklist ini belum menjalankan SQL/);
  assert.match(policyGate, /docs\/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST\.md/);
  assert.match(readiness, /Print & Export/);
  assert.match(readiness, /Terkunci/);
  assert.match(fieldMatrix, /Preview matriks field TPQ Private Vault/);
  assert.match(fieldMatrix, /Daftar ini hanya bahan keputusan/);
  assert.match(fieldMatrix, /Kode opaque santri/);
  assert.match(fieldMatrix, /Jangan dibuka di pilot awal/);
  assert.match(journey, /ROLE JOURNEY/);
  for (const checked of [source, roleAccess, backup, runbook, policyGate, readiness, fieldMatrix, journey]) {
    assert.doesNotMatch(checked, /tpq_private_records|command_tpq_private_record|from\(|insert\(|update\(|delete\(|getSupabaseBrowserClient|localStorage\.setItem/i);
  }
});

test('TPQ legacy full app audit maps HTML modules to safe Supabase phases', async () => {
  const audit = await readFile('docs/TPQ_LEGACY_FULL_APP_FEATURE_AUDIT.md', 'utf8');
  assert.match(audit, /localStorage/);
  assert.match(audit, /Beranda/);
  assert.match(audit, /Evaluasi Pengampu/);
  assert.match(audit, /Print\/cetak raport/);
  assert.match(audit, /TPQ Private Vault/);
  assert.match(audit, /Jangan memakai localStorage sebagai database privat/);
});

test('TPQ standalone progress handoff documents current safe boundary', async () => {
  const progress = await readFile('docs/TPQ_STANDALONE_APP_PROGRESS.md', 'utf8');
  assert.match(progress, /\/app\/tpq\/pengampu/);
  assert.match(progress, /\/app\/tpq\/app/);
  assert.match(progress, /206\/206 passed/);
  assert.match(progress, /Student Session Pipeline/);
  assert.match(progress, /Class Mentor Evaluation Bridge/);
  assert.match(progress, /Tidak ada data nama anak, wali, alamat/);
  assert.match(progress, /Role & akses/);
  assert.match(progress, /Operator checklist/);
  assert.match(progress, /Weekly class board/);
  assert.match(progress, /Export manifest/);
  assert.match(progress, /Backup readiness/);
  assert.match(progress, /Policy Gate/);
  assert.match(progress, /Pilot Readiness/);
  assert.match(progress, /Role Journey Preview/);
  assert.match(progress, /Private Field Matrix Preview/);
  assert.match(progress, /TPQ_PRIVATE_VAULT_DECISION_CHECKLIST/);
  assert.match(progress, /TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE/);
  assert.match(progress, /TPQ_STANDALONE_PILOT_EVIDENCE/);
  assert.match(progress, /TPQ Private Vault Pilot/);
  assert.match(progress, /hanya setelah DKM\/TPQ menyetujui policy data anak/);
});

test('project activity log records TPQ safe-shell activity and pending manual decisions', async () => {
  const log = await readFile('docs/PROJECT_ACTIVITY_LOG.md', 'utf8');
  assert.match(log, /Activity Log/);
  assert.match(log, /App TPQ stand-alone safe shell/);
  assert.match(log, /TPQRoleJourneyPreview/);
  assert.match(log, /TPQPrivateFieldMatrixPreview/);
  assert.match(log, /206\/206 passed/);
  assert.match(log, /student session pipeline TPQ/i);
  assert.match(log, /PROJECT_COMPLETION_PHASES\.md/);
  assert.match(log, /Private TPQ SQL\s*\|\s*Belum dijalankan/);
  assert.match(log, /Data anak asli\s*\|\s*Belum dibuka\/dimasukkan/);
  assert.match(log, /Apakah pengampu melihat semua kelas atau hanya kelas yang diampu/);
  assert.match(log, /Tidak push\/deploy production tanpa approval eksplisit/);
});

test('project completion phases define the remaining path without broadening safety scope', async () => {
  const phases = await readFile('docs/PROJECT_COMPLETION_PHASES.md', 'utf8');
  assert.match(phases, /6 phase utama/);
  assert.match(phases, /Phase 1[\s\S]*Stabilkan fondasi integrasi/);
  assert.match(phases, /Phase 2[\s\S]*Operator polish dashboard/);
  assert.match(phases, /Phase 3[\s\S]*Rilis konten asli pertama/);
  assert.match(phases, /Phase 4[\s\S]*Finance production readiness/);
  assert.match(phases, /Phase 5[\s\S]*TPQ private data & App Pengampu/);
  assert.match(phases, /Phase 6[\s\S]*Production hardening & deploy/);
  assert.match(phases, /\/app\/tpq\/app/);
  assert.match(phases, /private vault SQL sudah disiapkan, tetapi belum dijalankan/i);
  assert.match(phases, /Tidak menjalankan private TPQ SQL tanpa approval policy data anak/);
  assert.match(phases, /Tidak push\/deploy production tanpa persetujuan eksplisit/);
});

test('TPQ standalone pilot runbook allows safe dry-run without private data or SQL', async () => {
  const runbook = await readFile('docs/TPQ_STANDALONE_PILOT_RUNBOOK.md', 'utf8');
  assert.match(runbook, /tanpa memasukkan data privat anak/);
  assert.match(runbook, /\/app\/tpq\/pengampu/);
  assert.match(runbook, /\/app\/tpq\/app/);
  assert.match(runbook, /TPQ-STUDENT-001/);
  assert.match(runbook, /Tidak boleh/);
  assert.match(runbook, /Private Vault SQL belum dijalankan kecuali DKM\/TPQ sudah menyetujui checklist/);
  assert.match(runbook, /tidak ada data privat muncul di public website/);
  assert.match(runbook, /202608120027_tpq_private_vault_foundation\.sql/);
});

test('TPQ private vault decision checklist is non-technical and blocks SQL until policy approval', async () => {
  const checklist = await readFile('docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md', 'utf8');
  assert.match(checklist, /sebelum data santri, wali, absensi, progres, raport, dan evaluasi pengampu boleh masuk Supabase/i);
  assert.match(checklist, /Data anak tidak tampil di website publik/);
  assert.match(checklist, /Pengampu hanya melihat kelas yang diampu/);
  assert.match(checklist, /Print harus tercatat di audit/);
  assert.match(checklist, /SQL TPQ Private Vault boleh dijalankan jika/);
  assert.match(checklist, /Trial hanya memakai data dummy\/opaque dulu/);
  assert.match(checklist, /202608120027_tpq_private_vault_foundation\.sql/);
});

test('TPQ standalone pilot evidence pack records routes, safe modules, and blocked actions', async () => {
  const evidence = await readFile('docs/TPQ_STANDALONE_PILOT_EVIDENCE.md', 'utf8');
  assert.match(evidence, /App Pengampu TPQ sudah layak untuk pilot UI aman dengan data dummy\/opaque/);
  assert.match(evidence, /\/app\/tpq\/pengampu/);
  assert.match(evidence, /\/app\/tpq\/app/);
  assert.match(evidence, /tpq:read/);
  assert.match(evidence, /TPQPilotReadinessPreview\.jsx/);
  assert.match(evidence, /TPQRoleJourneyPreview\.jsx/);
  assert.match(evidence, /TPQStudentSessionPipeline\.jsx/);
  assert.match(evidence, /TPQClassMentorEvaluationBridge\.jsx/);
  assert.match(evidence, /TPQ_STANDALONE_PILOT_RUNBOOK\.md/);
  assert.match(evidence, /TPQ_PRIVATE_VAULT_DECISION_CHECKLIST\.md/);
  assert.match(evidence, /TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE\.md/);
  assert.match(evidence, /206\/206 passed/);
  assert.match(evidence, /tidak ada nama santri asli/i);
  assert.match(evidence, /Jangan lakukan hal berikut sebelum policy data anak disetujui/);
  assert.match(evidence, /menjalankan TPQ Private Vault SQL di Supabase/);
  assert.match(evidence, /Exit gate menuju Private Vault Pilot/);
});

test('TPQ private field matrix template defines minimum pilot fields and delayed sensitive fields', async () => {
  const template = await readFile('docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md', 'utf8');
  assert.match(template, /Jangan isi data anak asli di dokumen ini/);
  assert.match(template, /Kode opaque santri/);
  assert.match(template, /Nama panggilan/);
  assert.match(template, /Nama lengkap/);
  assert.match(template, /Nomor WhatsApp/);
  assert.match(template, /Checkpoint Iqra\/Al-Qur’an/);
  assert.match(template, /Print\/PDF raport/);
  assert.match(template, /Pembayaran individu/);
  assert.match(template, /tanpa data wali/);
  assert.match(template, /SQL TPQ Private Vault boleh dijalankan jika/);
});
