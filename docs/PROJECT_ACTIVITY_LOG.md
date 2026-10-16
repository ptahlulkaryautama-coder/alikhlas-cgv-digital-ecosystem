# Al Ikhlas CGV Digital Ecosystem — Activity Log

Last updated: 2026-10-16 16:50 WIB (Ekosistem Digital Al Ikhlas CGV v2)

Dokumen ini adalah catatan aktivitas kerja project agar keputusan, perubahan, dan hasil validasi tidak hilang di chat.

## Cara membaca

- `Aksi`: apa yang dilakukan.
- `Area`: modul terdampak.
- `Output`: file/fitur yang berubah.
- `Validasi`: build/test/manual check yang sudah dilakukan.
- `Butuh user`: apakah perlu aksi manual dari pemilik project.

## 2026-08-21 — App TPQ stand-alone safe shell

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Menyiapkan route App Pengampu TPQ | TPQ | `/app/tpq/pengampu` dan `/app/tpq/app` | Protected route test | Tidak |
| Membuat shell modul lengkap | TPQ | Beranda, Santri, Progres, Raport, Absensi, Kelas, Pengampu, Evaluasi Pengampu, Kas TPQ, Agenda, Laporan, Setting | `tpq-pengampu-app.test.mjs` | Tidak |
| Menjaga privacy boundary | TPQ | Semua preview memakai dummy/opaque dan tidak membaca private vault | Test melarang direct mutation/private record/localStorage | Tidak |
| Menambahkan Beranda Pengampu | TPQ | Shortcut tugas harian, operator checklist, mobile stand-alone preview | Build/test lokal | Tidak |
| Menambahkan Absensi/Progres dummy | TPQ | Draft dummy disabled sampai private vault aktif | Build/test lokal | Tidak |
| Menambahkan preview Raport | TPQ | Workflow `Input → Preview → Print` dengan data dummy, tanpa `window.print` aktif | Build/test lokal | Tidak |
| Menambahkan preview Kelas/Pengampu/Evaluasi | TPQ | Weekly board, coverage generik, rubrik evaluasi private-only | Build/test lokal | Tidak |
| Menghubungkan Kas TPQ read-only | TPQ/Finance | Snapshot Kas TPQ memakai canonical finance read model | Build/test lokal | Tidak |
| Menghubungkan Agenda TPQ read-only | TPQ/Agenda | Agenda memakai public-safe agenda data | Build/test lokal | Tidak |
| Menambahkan laporan/export manifest | TPQ | Laporan read-only dan export terkunci | Build/test lokal | Tidak |
| Menambahkan Setting readiness | TPQ | Backup readiness, policy gate, role access matrix | Build/test lokal | Tidak |
| Menambahkan Restore Rehearsal Runbook | TPQ | SOP preview backup/restore dengan checksum, audit, dan larangan overwrite produksi | Build/test lokal | Tidak |
| Menambahkan Pilot Readiness | TPQ | Panel status shell siap/private data locked/SQL pending/export locked | Build/test lokal | Tidak |
| Menambahkan Field Matrix Preview | TPQ | `TPQPrivateFieldMatrixPreview.jsx` untuk preview keputusan field santri, wali, akademik, operasional | Build/test lokal | Tidak |
| Menambahkan Role Journey Preview | TPQ | `TPQRoleJourneyPreview.jsx` untuk alur Pengampu, Kepala TPQ, Bendahara TPQ, Admin DKM | Build/test lokal | Tidak |

## 2026-08-21 — Dokumen TPQ

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Membuat spec App Pengampu TPQ | Docs/TPQ | `docs/TPQ_PENGAMPU_APP_SPEC.md` | Test dokumen | Tidak |
| Membuat audit fitur HTML legacy TPQ | Docs/TPQ | `docs/TPQ_LEGACY_FULL_APP_FEATURE_AUDIT.md` | Test dokumen | Tidak |
| Membuat progress handoff TPQ | Docs/TPQ | `docs/TPQ_STANDALONE_APP_PROGRESS.md` | Test dokumen | Tidak |
| Membuat runbook pilot aman | Docs/TPQ | `docs/TPQ_STANDALONE_PILOT_RUNBOOK.md` | Test dokumen | Tidak |
| Membuat evidence pack pilot | Docs/TPQ | `docs/TPQ_STANDALONE_PILOT_EVIDENCE.md` | Test dokumen | Tidak |
| Membuat checklist keputusan private vault | Docs/TPQ | `docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md` | Test dokumen | Perlu approval DKM/TPQ sebelum SQL |
| Membuat template field matrix | Docs/TPQ | `docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md` | Test dokumen | Perlu approval DKM/TPQ sebelum SQL |

## 2026-08-21 — Completion planning

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Membuat phase map sampai project complete | Project management | `docs/PROJECT_COMPLETION_PHASES.md` berisi 6 phase, status, dan aksi berikutnya | Dokumen lokal | Tidak |
| Menampilkan phase map di Settings | Dashboard/Settings | `ProjectCompletionPhasesPanel.jsx` menampilkan 6 phase di dashboard | Build/test lokal | Tidak |
| Memperbesar icon App Pengampu secara aman | Dashboard/Sidebar | `db-sb-item-featured` dan `db-sb-icon-wrap` menjaga ukuran SVG sidebar proporsional | Build/test lokal | Tidak |
| Menambahkan command bar App TPQ | TPQ/App Pengampu | Status safe shell, stand-alone readiness, private vault locked, dan shortcut modul harian | Build/test lokal | Tidak |
| Mengunci containment sidebar | Dashboard/App TPQ | Sidebar tetap vertikal, logo/icon proporsional, dan label App Pengampu tidak menempel dengan badge Baru walau halaman memakai stylesheet TPQ | Build/test lokal | Tidak |
| Memperbaiki overlap App Pengampu | Dashboard/App TPQ | Inner `<main>` diganti wrapper aman, konten App TPQ diberi containment, dan icon App Pengampu dibuat solid agar tidak tampak blank | Build/test lokal | Tidak |
| Menyiapkan route stand-alone App TPQ | TPQ/App Pengampu | `/app/tpq/app` memakai shell ringan tanpa sidebar dashboard, tetap melalui ProtectedRoute dan permission `tpq:read` | Build/test lokal | Tidak |
| Menambahkan navigasi stand-alone App TPQ | TPQ/App Pengampu | Topbar App TPQ punya tautan kembali ke Portal TPQ dan Dashboard DKM tanpa membuka data privat | Build/test lokal | Tidak |
| Menambahkan bottom navigation App TPQ | TPQ/App Pengampu | Route stand-alone `/app/tpq/app` punya navigasi bawah Home, Absen, Progres, Raport, dan Kas agar lebih terasa seperti app HP | Build/test lokal | Tidak |
| Mengikat workflow akademik App TPQ | TPQ/App Pengampu | Beranda menampilkan alur dummy/opaque `Absensi → Progres → Raport` supaya proses harian pengampu lebih jelas sebelum private vault dibuka | Build/test lokal | Tidak |
| Menambahkan readiness per modul TPQ | TPQ/App Pengampu | Setiap modul menampilkan status UI shell, data dummy, private vault, dan write RPC agar operator paham mana yang siap diuji dan mana yang masih terkunci | Build/test lokal | Tidak |
| Menambahkan handoff sesi harian TPQ | TPQ/App Pengampu | Beranda punya ringkasan akhir sesi dummy untuk review absensi, progres, dan bahan raport tanpa menyimpan data privat | Build/test lokal | Tidak |
| Menambahkan shortcut role journey TPQ | TPQ/App Pengampu | Role Pengampu, Kepala TPQ, Bendahara TPQ, dan Admin DKM punya tombol mulai alur yang hanya memindahkan modul awal masing-masing | Build/test lokal | Tidak |
| Menambahkan action map per modul TPQ | TPQ/App Pengampu | Setiap modul punya panduan aksi yang boleh dicoba, bagian terkunci, dan tautan modul terkait tanpa membuka data privat | Build/test lokal | Tidak |
| Menambahkan student session pipeline TPQ | TPQ/App Pengampu | Beranda menghubungkan Absensi, Progres, dan Raport memakai kode opaque `TPQ-STUDENT-001` tanpa data anak asli | Build/test lokal | Tidak |
| Menambahkan bridge kelas-pengampu-evaluasi TPQ | TPQ/App Pengampu | Beranda menghubungkan Kelas, Pengampu, dan Evaluasi Pengampu memakai label dummy tanpa identitas staf | Build/test lokal | Tidak |
| Menambahkan checklist print readiness raport | TPQ/App Pengampu | Raport punya pagar field, akses, audit print, dan output wali sebelum data asli dicetak | Build/test lokal | Tidak |
| Menambahkan report assembly TPQ | TPQ/App Pengampu | Laporan menyatukan Absensi, Progres, Raport, Kas TPQ, dan Agenda sebagai blueprint read-only tanpa export aktif | Build/test lokal | Tidak |
| Update development phase ecosystem | Project management | `PROJECT_COMPLETION_PHASES.md` dan handoff project diperbarui dengan status Web, Dashboard, Kabar, Program, Agenda, Finance, TPQ, dan Production Governance | Build/test lokal | Tidak |

## 2026-08-22 — Phase 2 Operator Polish & Phase 3 Audit Rilis Production

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Memoles empty state instruktif pada Kabar Masjid | NewsAdmin | `NewsTable.jsx` memberikan petunjuk aksi pembuat draf warta saat daftar kosong | Build/test lokal | Tidak |
| Memoles empty state instruktif pada Program Kegiatan | ProgramAdmin | `ProgramTable.jsx` memberikan panduan penambahan program kajian baru saat daftar kosong | Build/test lokal | Tidak |
| Memoles empty state instruktif pada Agenda | AgendaAdmin | `AgendaList.jsx` memberikan petunjuk penambahan kegiatan saat daftar agenda kosong | Build/test lokal | Tidak |
| Audit translator Supabase error | Dashboard/Security | `formatSupabaseError` di `supabaseClient.js` terbukti menerjemahkan error DB menjadi pesan ramah operator | `supabase-operator-error-copy.test.mjs` (passed) | Tidak |
| Audit Pusat Rilis Website (Release Center) | Settings/Release | `ContentProductionReleasePanel.jsx` & `ProjectReleaseGate.jsx` menyalin candidate uji ke production projection secara terisolasi | Build/test lokal | Tidak |
| Audit isolasi data publik (Public Projection) | Website Publik | `usePrograms.js` & `useAgendaData.js` terbukti membaca hanya data terbit produksi (`is_published=true`, `is_archived=false`) | Build/test lokal | Tidak |

## 2026-08-22 — Phase 4 Finance Readiness & Phase 5 App TPQ Standalone Mobile Polish

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Audit katalog kategori keuangan | Keuangan | `financeCategoryCatalog.js` mencakup kategori Pemasukan & Pengeluaran DKM dan TPQ secara lengkap | Build/test lokal | Tidak |
| Audit simulasi Jurnal Koreksi Ledger | Keuangan | `FinanceCorrectionPanel.jsx` menyediakan alur reversal + replacement tanpa menghapus data transaksi lama | Build/test lokal | Tidak |
| Poles antarmuka mobile App TPQ | TPQ | `tpqPortal.css` menangani layout responsive & touch target pada layar seluler | Build/test lokal | Tidak |
| Memoles wizard absensi & progres harian TPQ | TPQ | `TPQAttendanceQuickDraft.jsx` & `TPQProgressQuickDraft.jsx` menyediakan tombol cepat & instruksi draf aman | Build/test lokal | Tidak |
| Memoles pratinjau cetak raport santri | TPQ | `TPQRaportPrintPreview.jsx` menampilkan lembar raport cetak dengan data dummy/opaque | Build/test lokal | Tidak |

## 2026-08-22 — UI/UX Luxury Redesign & Media Aspect Ratio Preservation

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Redesain UI/UX Luxury Portal Media Kajian | Website Publik | `PublicLive.jsx` & `liveKajian.css` mengusung *Modern Islamic Luxury Aesthetics* (Deep Emerald Velvet, Metallic Gold, Glassmorphism) | Build/test lokal | Tidak |
| Penerapan Aturan Presisi Aspect Ratio 16:9 | Website Publik | Aturan `aspect-ratio: 16 / 9` & `object-fit: cover` diterapkan pada kontainer video & thumbnail untuk mencegah CLS | Build/test lokal | Tidak |
| Penonaktifan sementara siaran langsung aktif | Website Publik | Status `isLiveNow` diset `false` untuk sementara waktu hingga jadwal siaran aktif disetujui DKM | Build/test lokal | Tidak |

## 2026-08-22 — Status validasi (206/206 passed)

| Check | Status |
| --- | --- |
| `npm run build` | Sukses |
| `npm test` | 206/206 passed |

## 2026-09-02 — Super Admin Direct User Account Creation Feature

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Pembuatan RPC `admin_create_user_account` | Auth / Database | `202609020029_admin_create_user_account.sql` mengizinkan Super Admin membuat akun dengan hash bcrypt & audit log | `admin-create-user.test.mjs` (passed) | Tidak |
| Penambahan UI Pendaftaran Pengurus Langsung | Pengaturan / Settings | `OperationalRoleAdminPanel.jsx` menyediakan tombol `+ Tambah Akun Pengurus`, generator password acak, toggle lihat password & checklist role awal | Build/test lokal (210/210 passed) | Tidak |
| Penambahan terjemahan error pendaftaran akun | Services | `supabaseClient.js` menerjemahkan error `invalid_email_format`, `password_too_short`, `email_already_exists` | `supabase-operator-error-copy.test.mjs` (passed) | Tidak |

## 2026-10-16 15:30 WIB — Penyelarasan Keuangan Live Web & Portal Admin (September 2026)

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Penyelarasan sisa kas & mutasi September 2026 | Keuangan / Transparansi | Live Web (`/transparansi`) & Portal Admin (`/app/keuangan`, `/app/laporan`) selaras 100%: Kas Masjid Rp 14.850.208 (46 mutasi), JPU Rp 4.500.000 (34 mutasi), Total Likuiditas Rp 19.350.208 (80 mutasi) | Audit data silang | Tidak |
| Koreksi fallback label & hero stat dari Agustus ke September | Website & Admin | `TransparencyHero.jsx`, `ReportsAdmin.jsx`, `LatestReportSnapshot.jsx`, `FinanceOverview.jsx` | Build & unit test | Tidak |
| Penerbitan dokumen resmi arsip DKM | Dokumen / Laporan | `ReportArchiveTable.jsx` menerbitkan dokumen `DKM-2026-007` (Laporan Keuangan September 2026) | UI verified | Tidak |
| Penataan mock aktivitas terkini | Mock / Activity | `dashboardMockData.js` menyematkan aktivitas September 2026 di urutan paling atas | UI verified | Tidak |

## 2026-10-16 16:00 WIB — Buku Panduan Pengguna (User Guide Ekosistem Digital)

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Pembuatan buku panduan pengguna komprehensif | Dokumentasi | `docs/PANDUAN_PENGGUNA_ALIKHLAS_CGV.md` siap dibagikan ke DKM, TPQ, Warga, dan Wali Santri | Markdown preview | Siap dishare |
| Panduan instalasi PWA | Mobile / PWA | Prosedur pasang aplikasi instan Android (Chrome APK/PWA) & iOS iPhone (Add to Home Screen) | Panduan teruji | Tidak |
| Panduan operasional 4 pilar pengguna | Tata Kelola | Alur layanan Warga, Portal Santri/Wali, Portal Pengampu (vault privasi RLS), & DKM | Sesuai SOP DKM | Tidak |

## 2026-10-16 16:30 WIB — Mobile UI/UX Overhaul & Proportion Fix (Pola HijrahApp)

| Aksi | Area | Output | Validasi | Butuh user |
| --- | --- | --- | --- | --- |
| Redesain Navigasi Bawah Floating Island Dock | Navigasi Mobile | `MobileBottomNav.jsx` & `mobileApp.css`: Kapsul mengambang 14px dari bawah, radius 999px, frosted glass blur 28px, active pill expansion toska/emas, dynamic route label (`Agenda` / `Program`) | Browser audit (390x844) | Tidak |
| Pembuatan Hero Mobile All-in-One HijrahApp | Home Mobile | `Hero.jsx` & `Home.jsx`: Location chip Sagulung Batam, Jam Digital real-time (`HH:mm:ss`), Tanggal Masehi, Badge Emas Hijriah (`6 Jumadilawal 1448 H`), Countdown sholat berikutnya, Grid pintasan 4-kolom, Jadwal sholat harian teks Arab & active glow hijau | Browser audit (390x844) | Tidak |
| Penguncian tampilan Desktop Luxury | Web Desktop | Pemisahan CSS `@media (min-width: 769px)` menjaga hero sinematik desktop tetap 100% utuh | Desktop check | Tidak |
| Pemadatan 4 Pilar Khidmah | Home Mobile | `mobileApp.css`: Grid 2x2 rapi (~220px) menggantikan kartu vertikal 800px | Browser audit | Tidak |
| Pemadatan Kartu Program & Agenda | Program / Agenda | `mobileApp.css`: Judul sans-serif modern 15px, baris meta horizontal pill chip, deskripsi 2-baris terkunci, tinggi kartu turun dari ~380px ke ~160px | Browser audit | Tidak |
| Perbaikan Header Scroll Peek-Through | Header Mobile | `mobileApp.css`: Frosted dark backdrop (`.site-header.scrolled`) saat scroll mencegah teks halaman menerobos celah navigasi | Browser audit | Tidak |
| Pembersihan Halaman Transparansi Mobile | Transparansi Mobile | Menghilangkan tombol ganda redundan di mobile, menata kartu likuiditas ringkas di fold pertama, merapikan tabel transaksi mutasi | Browser audit | Tidak |
| Penataan Halaman TPQ Mobile | TPQ Mobile | `tpqPublic.css` / `mobileApp.css`: Padding hero dipangkas dari 120px ke 76px, judul proporsional, kartu info operasional grid 2-kolom ringkas | Browser audit | Tidak |
| Penataan Media Hub & Footer Mobile | Media / Footer | Single column video card 16:9, tab touch-scrollable, footer compact | Browser audit | Tidak |

## 2026-10-16 16:50 WIB — Status Validasi Terkini (210/210 passed)

| Check | Status | Keterangan |
| --- | --- | --- |
| `npm run build` | Sukses | Bundle terisolasi aman tanpa secret / URL luar |
| `npm test` | **210/210 passed** | 100% lolos (0 fail, 0 skipped) |
| Mobile Viewport Audit | Lulus | Diuji pada resolusi 390×844px (Chrome & iOS Safari) |
| Dev Server | Aktif | Berjalan di port 5173 |
| Keuangan September 2026 | 100% Aligned | Kas Rp 14.850.208, JPU Rp 4.500.000, Total Rp 19.350.208 |
| Privacy Guard TPQ | Terkunci Aman | Private vault tetap aman, tidak ada data pribadi anak di frontend |

## 2026-09-02 — Status validasi terakhir

| Check | Status |
| --- | --- |
| `npm run build` | Sukses |
| `npm test` | 210/210 passed |
| Private TPQ SQL | Belum dijalankan |
| Data anak asli | Belum dibuka/dimasukkan |
| Public website projection TPQ private | Tidak ada |
| Direct browser mutation private TPQ | Tidak ada |
| Legacy folder | Tidak dimodifikasi |

## Keputusan yang masih menunggu user/DKM/TPQ

1. Apakah pengampu melihat semua kelas atau hanya kelas yang diampu.
2. Apakah pilot awal memakai kode opaque saja atau nama panggilan juga.
3. Apakah data wali ditunda dulu.
4. Field absensi/progres/raport mana yang disetujui.
5. Siapa yang boleh print/export raport.
6. Berapa lama data absensi/progres/raport/evaluasi disimpan.
7. Kapan `202608120027_tpq_private_vault_foundation.sql` boleh dijalankan.

## Prinsip yang tetap berlaku

- Tidak ada data santri/wali/pengampu personal masuk website publik.
- Tidak ada data privat anak masuk `localStorage`.
- Semua mutasi sensitif wajib lewat RPC, RLS, permission, idempotency, dan audit.
- Data keuangan tidak diubah tanpa sumber Bendahara.
- Tidak ada hard delete untuk data penting.
- Tidak push/deploy production tanpa approval eksplisit.
