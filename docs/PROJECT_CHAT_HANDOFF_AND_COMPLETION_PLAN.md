# Al Ikhlas CGV Digital Ecosystem - Chat Handoff and Completion Plan

Tanggal ringkasan: 21 Agustus 2026

Thumbnail project: `src/assets/alikhlas-digital-ecosystem-thumbnail.png`

SOP operator: `docs/OPERATOR_DASHBOARD_SOP.md`

Completion phases dan development phase ecosystem: `docs/PROJECT_COMPLETION_PHASES.md`

## Tujuan project

Membangun ekosistem digital Masjid Al Ikhlas CGV yang menghubungkan:

- Website publik jamaah.
- Dashboard internal DKM.
- Portal TPQ dan pendidikan.
- Supabase PostgreSQL sebagai database integrasi.
- Workflow konten, agenda, program, dan keuangan yang aman, bisa diaudit, dan mudah dipakai operator non-teknis.

## Keputusan penting dari chat

1. Integrasi Web - Dashboard - TPQ menggunakan Supabase, mengikuti pendekatan yang sudah pernah dipakai di project Portalwargacgv.id.
2. Dashboard tetap memakai Supabase Auth, role, permission, RLS, audit, dan kill switch.
3. Untuk konten sosial masjid, approval akun kedua tidak diwajibkan. Satu akun yang punya otoritas cukup untuk input, preview, edit, dan publish.
4. Untuk keuangan dan data TPQ, operator boleh input dan koreksi bila keliru. Data tetap dilindungi oleh audit, RLS, dan mekanisme koreksi.
5. Data santri/anak/wali/presensi/nilai/pembayaran individual tidak boleh tampil di website publik.
6. Trial/test data tidak langsung menjadi produksi. Release Center menyalin konten yang sudah siap ke environment production.
7. Tidak ada hard delete untuk data penting. Penghapusan trial adalah archive/hide, dan penghapusan akun adalah suspend/revoke access.

## Status yang sudah selesai

Ringkasan cepat 21 Agustus 2026:

- Core ecosystem Web-Dashboard-TPQ sudah punya fondasi Supabase, auth, role, RLS, audit, kill switch, dan workflow utama.
- Dashboard DKM sudah bisa dipakai untuk trial konten, program, agenda, finance, role, release center, dan status readiness.
- App TPQ sudah masuk safe-shell stand-alone dengan modul lengkap, tetapi belum membuka data privat anak.
- Validasi terakhir: `npm test` berhasil `206/206 passed` dan build production lokal berhasil.
- Belum ada push/deploy production dari sesi ini.

### 1. Fondasi keamanan dan auth

- Supabase Auth sudah terhubung ke dashboard.
- Role, permission, RLS, audit log, dan user profile sudah dibuat.
- Akun Super Admin dan akun kedua sudah dipakai untuk trial.
- Pengaturan role operasional sudah tersedia untuk Super Admin.
- Role operasional mencakup Super Admin, Ketua DKM, Sekretaris, Bendahara, Media/Humas, Kepala TPQ, Guru TPQ, dan Viewer.
- Super Admin bisa memberi akses publikasi, keuangan, editorial, dan role operasional sesuai kebutuhan.

### 2. Keuangan DKM dan TPQ

- Import Excel keuangan sudah bisa preview, validasi, rekonsiliasi saldo, dan publish ke ledger.
- Template Excel dan klasifikasi kategori sudah dibuat.
- Manual entry keuangan sudah bisa dibuat, dipublikasi, dan masuk ledger.
- Koreksi/reversal ledger sudah disiapkan di kode untuk DKM dan TPQ: pilih transaksi sumber, simpan draft koreksi, lalu publish reversal dan transaksi pengganti tanpa menghapus transaksi lama.
- Mode single-account sudah diterapkan untuk workflow keuangan.
- Audit event, idempotency, versioning, dan kill switch sudah tersedia.
- Saldo TPQ sudah terbukti berubah setelah manual entry berhasil dipublikasikan ke ledger.

### 3. Artikel/Kabar Masjid

- Artikel bisa dibuat, diedit, preview, upload foto private, ajukan siap publik, dan disetujui.
- Private media storage sudah dibatasi MIME type dan ukuran file.
- Slug URL sudah diperbaiki agar tanda sambung bisa dipakai.
- Preview artikel dengan foto sudah berjalan.
- Public projection hanya menampilkan artikel production yang memang siap publik.
- Artikel test dengan private media sudah punya jalur public media promotion melalui migration `202608120023_content_article_public_media_release.sql`, dan policy flag storage sudah diperbaiki melalui `202608120024_fix_article_storage_flag_predicates.sql`.
- Storage policy upload/edit artikel sudah diperbaiki agar tidak membaca `integration_feature_flags` langsung dari browser role.

### 4. Program dan kegiatan

- Workflow Program sudah tersedia: tambah, edit, preview, publish/siap publik, archive.
- Data Program masuk Supabase PostgreSQL.
- Public projection production-only sudah diterapkan.
- Layout Program sudah diperhalus dengan alur operator ringkas: tambah/edit, preview, siap publik, lalu rilis dari Pengaturan.

### 5. Agenda dan kalender

- Workflow Agenda sudah tersedia: tambah, edit, preview kalender, siap publik, archive.
- Single-account publishing sudah diterapkan.
- Agenda tampil di kalender dashboard dan preview website.
- Public projection production-only sudah diterapkan.

### 6. Release Center

- Pusat Rilis Website di Settings sudah dibuat.
- Artikel, Program, dan Agenda yang siap publik bisa dirilis dari test ke production.
- Release tetap memakai permission, kill switch, audit, dan verifikasi.
- Akses rilis tidak lagi hanya terikat Super Admin; role Ketua DKM, Sekretaris, dan Media/Humas dapat diberi otoritas rilis.

### 7. Account dan trial management

- Fitur hapus akun dibuat sebagai suspend akses, bukan delete permanen.
- Suspend akun mencabut role dan permission tanpa menghapus auth user.
- Super Admin dan akun sendiri dilindungi dari suspend tidak sengaja.
- Trial content bisa di-edit ulang atau dihapus dari daftar rilis melalui archive.
- Semua aksi trial management diaudit.
- Restore akun suspended sudah disiapkan lewat migration `202608120025_restore_suspended_account.sql`. Restore tidak mengembalikan role lama otomatis; Super Admin harus memilih role lagi.

### 8. Readiness dan panduan operator

- Panel Peta Integrasi sudah merangkum status Web, Dashboard, Finance, Release, dan TPQ.
- Gate Production sudah mengecek mode trial, release switch, candidate uji, dan konten production secara read-only.
- Panduan Operator sudah ditambahkan di Settings agar alur konten, finance, akses pengguna, dan TPQ mudah dipahami pengurus non-teknis.
- SOP operator non-teknis sudah tersedia di `docs/OPERATOR_DASHBOARD_SOP.md`.
- Panel diagnostik lama sudah dirapikan agar tidak lagi menampilkan status hardcoded yang membingungkan.
- Panel Finance, Program, dan Agenda sudah diberi stepper operator serta empty state yang menjelaskan langkah berikutnya.

### 9. TPQ private data foundation

- Fondasi brankas data privat TPQ sudah disiapkan di kode melalui `202608120027_tpq_private_vault_foundation.sql`.
- Default tetap terkunci: `tpq_private_read_enabled=false` dan `tpq_private_writes_enabled=false`.
- Tabel privat memakai opaque code dan sealed payload; tidak ada raw schema untuk identitas anak/wali di public projection.
- Browser tidak mendapat insert/update/delete langsung; perubahan wajib lewat RPC terproteksi dan audit.
- Fitur ini belum dipasang ke UI operator dan belum boleh diisi sebelum field list, consent, retention, dan encryption/sealing disetujui.

### 10. App Pengampu TPQ

- Product spec sudah dibuat di `docs/TPQ_PENGAMPU_APP_SPEC.md`.
- Audit fitur HTML legacy lengkap sudah dibuat di `docs/TPQ_LEGACY_FULL_APP_FEATURE_AUDIT.md`.
- Route internal sudah dibuat di `/app/tpq/pengampu` dan alias stand-alone `/app/tpq/app`.
- Sidebar menampilkan `App Pengampu` untuk akun dengan akses TPQ.
- Shell App TPQ belum membaca/menulis data privat; sekarang menampilkan peta modul lengkap seperti referensi HTML.
- Arah desain: mobile-first, satu tugas per layar, tetapi cakupan lengkap meliputi Beranda, Santri, Progres, Raport/Print, Absensi, Kelas, Pengampu, Evaluasi Pengampu, Kas TPQ, Agenda, Laporan, dan Setting.
- Komponen safe-shell sudah tersedia: operator checklist, mobile stand-alone preview, Pilot Readiness, Role Journey Preview, Private Field Matrix Preview, Backup Readiness, Policy Gate, Role Access, Export Manifest, dan preview dummy akademik.
- Beranda App TPQ sudah menghubungkan alur harian dummy: Absensi, Progres, Raport, Kelas, Pengampu, Evaluasi, Kas TPQ, Agenda, Laporan, dan Setting.
- Laporan TPQ sudah punya assembly preview yang menggabungkan Absensi, Progres, Raport, Kas TPQ, dan Agenda tanpa membuka data privat.
- Setting TPQ sudah punya Restore Rehearsal Runbook untuk backup, checksum, restore di test environment, audit, dan larangan menimpa produksi.
- Dokumentasi pendukung sudah tersedia: `docs/TPQ_STANDALONE_APP_PROGRESS.md`, `docs/TPQ_STANDALONE_PILOT_RUNBOOK.md`, `docs/TPQ_STANDALONE_PILOT_EVIDENCE.md`, `docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md`, dan `docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md`.
- Catatan aktivitas utama sekarang dicatat di `docs/PROJECT_ACTIVITY_LOG.md`.

## Development phase ecosystem

Detail fase resmi ada di `docs/PROJECT_COMPLETION_PHASES.md`. Status ringkasnya:

| Lini ecosystem | Status |
| --- | --- |
| Website publik | Siap membaca production projection setelah konten asli dirilis |
| Dashboard DKM | Fondasi operasional aktif dan terus dipoles |
| Kabar/Artikel | Workflow create/edit/preview/media/release berjalan |
| Program & Agenda | Workflow create/edit/preview/archive/release berjalan |
| Keuangan | Import, manual entry, read model, batch history, dan correction foundation tersedia |
| App TPQ | Safe shell lengkap, belum membuka private vault |
| Production governance | Release center, readiness gate, backup/restore runbook, dan activity log tersedia |

Estimasi progress kasar:

- Core ecosystem: 65-70%.
- Dashboard DKM dan konten: 75-80%.
- Finance: 65-70%, menunggu data/kategori Bendahara final.
- App TPQ stand-alone: 25-30%, karena data privat dan print/report asli harus dibuka sangat hati-hati.

## Migration dan SQL utama yang sudah dibuat

- `202608010001_auth_permissions_audit_foundation.sql`
- `202608020001_shared_content_read_foundation.sql`
- `202608020002_finance_import_foundation.sql`
- `202608020003_finance_classification_reconciliation.sql`
- `202608020004_finance_approval_workflow.sql`
- `202608020005_user_finance_approval_grants.sql`
- `202608020006_finance_test_import_rpc.sql`
- `202608030007_content_articles_workflow.sql`
- `202608030008_content_article_test_isolation.sql`
- `202608030009_user_content_permission_grants.sql`
- `202608030010_lock_content_permission_rpc.sql`
- `202608030011_finance_manual_entry_foundation.sql`
- `202608040012_fix_manual_finance_digest_path.sql`
- `202608040013_content_article_private_test_media.sql`
- `202608050014_fix_content_media_storage_policy.sql`
- `202608050015_content_program_workflow.sql`
- `202608050016_content_agenda_workflow.sql`
- `202608100017_single_account_workflows.sql`
- `202608100018_fix_single_account_manual_finance.sql`
- `202608100019_content_production_release_center.sql`
- `202608100020_release_center_explicit_public_consent.sql`
- `202608110021_operational_role_management.sql`
- `202608110022_safe_account_and_trial_management.sql`
- `202608120023_content_article_public_media_release.sql`
- `202608120024_fix_article_storage_flag_predicates.sql`
- `202608120025_restore_suspended_account.sql`
- `202608120026_finance_correction_reversal_foundation.sql` — siap di kode, perlu dijalankan sebelum trial koreksi ledger.
- `202608120027_tpq_private_vault_foundation.sql` — siap di kode, perlu persetujuan kebijakan data anak sebelum trial.

## Outstanding actions

Catatan aktivitas terbaru: `docs/PROJECT_ACTIVITY_LOG.md`.

### Tanpa Supabase SQL

1. Verifikasi visual Settings: Peta Integrasi, Gate Production, Panduan Operator, Pusat Rilis Website, dan Jabatan & Akses Dashboard.
2. Rapikan layout yang masih terlalu besar/kosong pada layar kecil, terutama tabel panjang dan modal form.
3. Terjemahkan error teknis Supabase yang tersisa menjadi pesan operator yang lebih ramah. Batch utama sudah memakai formatter operator-friendly.
4. Audit local build agar tidak ada backend URL, secret, atau data TPQ privat di bundle frontend.
5. Jalankan build/test lokal setiap batch perubahan.
6. Lanjutkan polish App TPQ safe-shell: empty states, microcopy operator, dan mobile spacing tanpa membuka private vault.
7. Lanjutkan simulasi App TPQ dummy untuk absensi, progres, raport, kelas, pengampu, evaluasi, laporan, dan backup/restore.

### Butuh Supabase SQL atau verifikasi manual

1. Jalankan migration/verification yang belum dipakai saat fiturnya masuk trial berikutnya. Jangan menjalankan private TPQ SQL sebelum policy data anak disetujui.
2. Bersihkan semua trial content yang tidak akan dipakai dengan fitur archive/hapus trial.
3. Jalankan satu rilis production pertama dengan konten asli, bukan trial.
4. Matikan kill switch test/write setelah sesi trial selesai.
5. Rapikan role dan permission final untuk Ketua DKM, Bendahara, Media/Humas, Sekretaris, Kepala TPQ, Guru TPQ, dan Viewer.
6. Jalankan migration `202608120026_finance_correction_reversal_foundation.sql`, verification `finance_correction_foundation_verification.sql`, lalu trial panel `Koreksi Ledger`.
7. Jalankan migration TPQ private vault hanya setelah DKM/Kepala TPQ menyetujui field list, consent, retention, dan sealing/encryption payload.
8. Buat backup/restore rehearsal final sebelum production rollout.
9. Selesaikan containment Legacy GAS lama bila masih ada deployment generic `doPost` yang unauthenticated.
10. Siapkan monitoring error, rate limit durable, dan runbook incident sebelum deploy production.
11. Untuk App Pengampu TPQ, putuskan apakah pengampu melihat semua kelas atau hanya kelas yang diampu.

## Step by step further action sampai complete

### Phase 1 - Stabilkan fitur yang baru dibuat

Target: semua fitur test yang sudah dibuat bisa dipakai operator tanpa bantuan developer.

Langkah:

1. Refresh dashboard lokal.
2. Coba Edit pada satu trial artikel, satu program, dan satu agenda.
3. Coba Hapus trial pada satu data test yang tidak perlu.
4. Coba suspend akun test yang bukan Super Admin, lalu pastikan akun itu tidak bisa akses dashboard.
5. Setelah migration restore dijalankan, coba pulihkan akun test dan pilih role ulang secara sadar.
6. Pastikan Super Admin dan akun sendiri tidak bisa terhapus tidak sengaja.
7. Jalankan test lokal:

```bash
npm test
npm run build
```

Output yang diharapkan:

- Build sukses.
- Test sukses.
- Tidak ada secret/backend URL bocor di bundle.

### Phase 2 - Operator polish tanpa SQL

Target: dashboard bisa dipakai pengurus non-teknis tanpa arahan developer tiap langkah.

Langkah:

1. Pastikan setiap modul punya instruksi singkat: isi data, preview, publish, release atau ledger.
2. Pastikan tombol utama hanya satu per state.
3. Pastikan empty state menjelaskan langkah berikutnya.
4. Pastikan error teknis Supabase diterjemahkan menjadi recovery copy yang jelas.
5. Pastikan tampilan mobile tidak horizontal-scroll.

Output yang diharapkan:

- Operator tahu harus klik apa berikutnya.
- Dashboard terasa lebih rapi dan premium.
- Status aman/terkunci tidak terlihat seperti aplikasi rusak.

### Phase 3 - Rilis konten asli pertama

Target: website publik mulai mengambil konten production dari Supabase.

Langkah:

1. Buat satu artikel asli.
2. Buat satu program asli.
3. Buat satu agenda asli.
4. Preview di dashboard.
5. Publish ke status siap publik.
6. Release dari Pusat Rilis Website.
7. Buka website publik: Kabar, Program, dan Agenda.
8. Pastikan trial content tidak muncul.

Output yang diharapkan:

- Konten asli muncul di website publik.
- Trial content tetap tersembunyi.
- Audit release tercatat.

### Phase 4 - Finance readiness

Target: keuangan siap dipakai Bendahara dan TPQ tanpa mengubah angka sembarangan.

Langkah:

1. Kunci format Excel final untuk DKM dan TPQ.
2. Tentukan daftar kategori resmi Bendahara.
3. Jalankan import satu bulan riil sebagai test.
4. Cocokkan saldo awal, masuk, keluar, saldo akhir.
5. Jalankan migration koreksi/reversal ledger.
6. Trial koreksi satu transaksi test: pastikan reversal dan pengganti masuk ledger tanpa menghapus transaksi sumber.
7. Buat backup manifest sebelum finance production.
8. Matikan test flags setelah selesai trial.

Output yang diharapkan:

- Ledger konsisten.
- Koreksi tidak menghapus jejak lama.
- Bendahara bisa pakai tanpa developer.

### Phase 5 - TPQ private data architecture

Target: data TPQ individual bisa masuk sistem tanpa bocor ke publik.

Langkah:

1. Definisikan data santri yang boleh disimpan.
2. Pisahkan public projection dan private tables.
3. Buat role untuk Kepala TPQ dan Guru TPQ.
4. Terapkan RLS per scope TPQ.
5. Jangan tampilkan data anak, wali, pembayaran, presensi, dan nilai di website publik.
6. Buat audit untuk update data sensitif.
7. Jalankan `202608120027_tpq_private_vault_foundation.sql` setelah kebijakan field/consent/retention disetujui.
8. Jalankan `tpq_private_vault_foundation_verification.sql` dan pastikan semua `pass=true`.
9. Aktifkan trial hanya untuk payload dummy tersegel, bukan data anak riil.

### Phase 5B - App Pengampu TPQ

Target: pengampu dan Kepala TPQ punya workspace lengkap untuk akademik, operasional, kas, laporan, dan print raport.

Langkah:

1. Finalkan keputusan akses: semua kelas atau hanya kelas yang diampu.
2. Finalkan field absensi dan progres belajar.
3. Finalkan field raport, predikat, dan layout print.
4. Finalkan model pengampu dan evaluasi pengampu.
5. Buat model sesi/kelas privat atau sealed payload sesuai kebijakan.
6. Implementasikan shell modul lengkap dengan data dummy/test.
7. Implementasikan absensi cepat dengan data dummy/test.
8. Implementasikan progres belajar dengan pilihan template catatan sopan.
9. Implementasikan preview dan print raport dari data dummy/test.
10. Hubungkan Kas TPQ ke finance ledger yang sudah ada.
11. Uji dengan akun `guru_tpq` dan `kepala_tpq`.
12. Pastikan public website dan public bundle tetap tidak membawa data anak.

Output yang diharapkan:

- Pengampu bisa bekerja dari HP tanpa membuka dashboard DKM penuh.
- Kepala TPQ punya rekap privat.
- Website publik tetap hanya menampilkan agregat aman.

Output yang diharapkan:

- Website hanya menampilkan agregat aman.
- Dashboard internal bisa mengelola data sesuai role.
- Tidak ada PII anak di bundle frontend publik.

### Phase 6 - Production deployment

Target: project siap dipakai bukan hanya di localhost.

Langkah:

1. Review semua env var production.
2. Pastikan Supabase anon key saja yang ada di frontend.
3. Pastikan service role key tidak pernah masuk `src/`.
4. Jalankan full test dan build.
5. Deploy ke Netlify setelah approval.
6. Smoke test login, dashboard, website publik, release center, finance, artikel, program, agenda, dan TPQ.
7. Matikan semua test/write flags yang tidak diperlukan.

Output yang diharapkan:

- Production online.
- Website publik membaca data production.
- Dashboard aman dan bisa dipakai pengurus.

## Flags yang perlu diperhatikan

Saat trial, flags bisa `true`:

- `content_article_test_mode_enabled`
- `content_article_writes_enabled`
- `content_article_media_test_enabled`
- `content_program_test_mode_enabled`
- `content_program_writes_enabled`
- `content_agenda_test_mode_enabled`
- `content_agenda_writes_enabled`
- `finance_import_test_mode_enabled`
- `finance_import_writes_enabled`
- `finance_manual_test_mode_enabled`
- `finance_manual_writes_enabled`
- `finance_correction_test_mode_enabled`
- `finance_correction_writes_enabled`
- `tpq_private_read_enabled`
- `tpq_private_writes_enabled`
- `content_production_release_enabled`

Saat tidak trial, flags write/test sebaiknya dimatikan.

## Catatan risiko

- Jangan rilis trial content ke production.
- Jangan delete data penting secara permanen.
- Jangan expose service role key, backend URL, atau Google Apps Script URL di browser.
- Jangan tampilkan data individu TPQ ke publik.
- Jangan ubah angka finance tanpa sumber Bendahara yang jelas.
- Jangan deploy production sebelum backup, smoke test, dan approval DKM.

## Rekomendasi kerja berikutnya

Urutan paling efisien:

1. Jalankan migration restore akun bila ingin tombol pulihkan aktif.
2. Bersihkan trial content.
3. Jalankan satu rilis production dengan konten asli.
4. Finalkan role pengurus.
5. Jalankan dan uji finance correction workflow.
6. Mulai desain private TPQ tables.
7. Baru masuk deploy production.

Detail phase lengkap ada di `docs/PROJECT_COMPLETION_PHASES.md`.
