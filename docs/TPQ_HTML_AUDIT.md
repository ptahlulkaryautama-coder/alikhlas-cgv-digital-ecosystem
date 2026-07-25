# Audit Teknis & Privacy Legacy TPQ HTML (`TPQ_v8.html`)

Dokumen ini menyajikan hasil audit komprehensif terhadap berkas **`Legacy/tpq-html/TPQ_v8.html`** (407 KB, 4.762 baris) sebagai referensi pra-migrasi dengan penekanan utama pada **perlindungan data pribadi (PII)** dan keamanan sistem.

---

## 🛑 STRICT PRIVACY DIRECTIVE

> [!CAUTION]
> **DILARANG MEMIGRASIKAN DATA PRIBADI ATAU MENAMPILKAN INDIVIDU TANPA OTENTIKASI & DATABASE TERENKRIPSI AMAN (SECURE DATABASE).**
>
> Aturan Privasi Ketat (Privacy Rules):
> 1. ❌ **Tidak ada nama santri** (*No student names*).
> 2. ❌ **Tidak ada kontak orang tua / wali** (*No parent contacts*).
> 3. ❌ **Tidak ada nilai / raport individu** (*No grades*).
> 4. ❌ **Tidak ada identitas presensi / absensi individu** (*No attendance identities*).
> 5. ❌ **Tidak ada data pembayaran / SPP per anak** (*No payment data*).
> 6. ❌ **Tidak ada foto pribadi anak** (*No personal photos unless explicitly approved*).
> 7. ❌ **Tidak ada nama pengajar / PII staf dorman** (*No personal staff names in source data/comments without explicit approval*).
>
> Seluruh fitur yang membutuhkan data di atas **TIDAK DIMIGRASI (DO NOT MIGRATE)** sampai database backend produksi yang aman dan terenkripsi tersedia.

---

## 📂 1. Source Files Reviewed (Berkas Sumber yang Ditinjau)

1. **`Legacy/tpq-html/TPQ_v8.html`** (407.139 bytes, 4.762 baris) — Berkas utama aplikasi HTML/CSS/JS monolitik TPQ Al Mardhotillah.
2. **`src/pages/TPQ.jsx`** — Halaman wrapper admin terproteksi saat ini (menggunakan `DashboardLayout.jsx` dengan data agregat anonim pada `/app/tpq`).
3. **`src/utils/tpqDateUtils.js`** — Utility klasifikasi tanggal lokal runtime-safe.
4. **`src/components/tpq/*` & `src/styles/tpqPortal.css`** — Komponen React modular dan styling terisolasi.

---

## 📑 2. HTML Sections Found (Seksi & Struktur HTML Ditemukan)

Berkas legacy terbagi menjadi **13 seksi halaman HTML**:

1. **`#sidebar`**: Bilah navigasi samping dengan logo TPQ Al Mardhotillah, kelompok navigasi, dan pemilih tahun ajaran.
2. **`#topbar`**: Bilah header atas dengan breadcrumb, tombol aksi cepat, dan strip Bismillah.
3. **`#page-beranda`**: Dashboard utama berisi 4 kartu KPI, grafik presensi, dan grafik keuangan.
4. **`#page-santri`**: Tabel direktori santri dengan pencarian teks, filter kelas, dan filter gender.
5. **`#page-progres`**: Roadmap pencapaian kurikulum Iqra 1–6 dan Juz 30.
6. **`#page-raport`**: Form penginputan nilai semester (Tajwid, Fasohah, Kelancaran, Hafalan, Adab).
7. **`#page-raport-view`**: Tampilan pratinjau lembar cetak raport A4 dengan blok tanda tangan Kepala TPQ.
8. **`#page-absensi`**: Jurnal presensi harian santri per kelompok belajar.
9. **`#page-kas`**: Buku kas keuangan TPQ (SPP, Donasi, Operasional, Insentif Pengajar).
10. **`#page-agenda`**: Kalender kegiatan & jadwal hari besar.
11. **`#page-kelas`**: Manajemen kelompok belajar, ruang kelas, dan pembagian wali kelas.
12. **`#page-pengampu`**: Direktori ustadz/ustadzah dan jadwal piket mengajar.
13. **`#page-eval-pengampu`**: Penilaian kinerja pengajar dan kalkulator honorarium.
14. **`#page-laporan`**: Ringkasan LPJ pertanggungjawaban tahunan.
15. **`#page-setting`**: Pengaturan tahun ajaran, backup/restore JSON, dan reset database (`tpq5_zero`).

---

## ⚙️ 3. Functionality Found (Fungsi & Fitur Ditemukan)

- **Fungsi State LocalStorage**: Pembacaan dan penulisan data mentah ke `localStorage` (`tpq5_kelas`, `tpq5_santri`, `tpq5_eval`, `tpq5_kas`, dll).
- **Fungsi Filter & Search**: Pencarian nama santri dan filter per kelas secara real-time via string matching JS.
- **Fungsi Kalkulasi Raport**: Penghitungan otomatis rerata nilai dan penentuan predikat (A, B, C, D).
- **Fungsi Honorarium Pengajar**: Penghitungan akumulasi insentif mengajar berdasarkan jumlah kehadiran dan sesi.
- **Fungsi Visualisasi Chart.js**: Rendering grafik batang presensi dan doughnut chart alokasi kas pada elemen canvas.
- **Fungsi Backup/Restore**: Ekspor database ke berkas JSON dan impor ulang via FileReader API.

---

## ⚠️ 4. Privacy Risks (Risiko Privasi & Keamanan Data)

1. **Keterpaparan Data Anak (Child PII Exposure)**:
   - Nama lengkap anak, jenis kelamin, dan foto pribadi tersimpan polos tanpa enkripsi.
   - Catatan evaluasi pribadi (misal: "kurang lancar", "sering alfa", "kurang serius", "turun level") berpotensi mencoreng privasi santri jika terakses pihak luar.
2. **Keterpaparan Kontak Wali Santri**:
   - Nomor telepon seluler dan alamat rumah wali santri.
3. **Risiko Data Keuangan Perorangan**:
   - Data historis pembayaran SPP dan tunggakan per anak dapat memicu stigma sosial.
4. **Risiko Kerentanan LocalStorage**:
   - Data `localStorage` dapat dibaca oleh script atau ekstensi peramban apa pun di domain yang sama.
5. **Kurangnya Otentikasi Tingkat Baris (Row-Level Security)**:
   - Berkas HTML legacy tidak memiliki pembatasan hak akses berbasis peran (Wali Santri vs Pengurus vs Publik).

---

## 🗺️ 5. Implemented React Component Architecture (Arsitektur Komponen React Terimplementasi)

Berdasarkan aturan privasi ketat dan verifikasi rilis, komponen React terbagi menjadi **Komponen Aman Terimplementasi** dan **Komponen Terlarang (Requires Secure Database)**:

### 🟢 A. Komponen Aman Terimplementasi (`src/components/tpq/`)
- **`TPQHeaderBanner.jsx`**: Banner pengenalan TPQ Al Mardhotillah, SK DKM, & strip Bismillah.
- **`TPQPrivacyNoticeCard.jsx`**: Pemberitahuan privasi data santri & informasi status fitur.
- **`TPQOverviewKPI.jsx`**: Kartu statistik agregat anonim (Kelompok Belajar, Jam Operasional, Fokus Pembelajaran, Agenda Terakhir) dengan label status klaim jujur (`Informasi Umum` / `Selesai`).
- **`TPQKelasSection.jsx`**: Informasi kelompok belajar, jadwal mengajar, dan ruang kelas tanpa nama individu pengajar, dilengkapi filter hari & catatan sumber jadwal.
- **`TPQKurikulumSection.jsx`**: Peta jalan akademik (Iqra 1–6 & Juz 30) dengan batas guard array & field kosong.
- **`TPQTeachersSection.jsx`**: Ringkasan tim pengajar agregat per kapasitas peran (`TPQ_TEACHING_TEAM`), bebas dari PII nama staf individual.
- **`TPQAgendaSection.jsx`**: Klasifikasi agenda masa depan vs masa lalu runtime-safe via `src/utils/tpqDateUtils.js` (dengan status `Selesai`).
- **`TPQNewsSection.jsx`**: Artikel Kabar TPQ yang siap publik (dengan empty state jika tidak ada artikel).
- **`TPQDocumentsSection.jsx`**: Panel dokumen & raport dalam status terkunci (`Belum Aktif`).
- **`TPQFutureModulesSection.jsx`**: Rencana modul terproteksi mendatang.

### 🔴 B. Komponen Terlarang (Requires Secure Database — DO NOT MIGRATE NOW)
- `TPQSantriDirectory` — **DO NOT MIGRATE** (Membutuhkan database terenkripsi & otentikasi).
- `TPQStudentEvaluator` — **DO NOT MIGRATE** (Mengandung nilai & catatan individu santri).
- `TPQRaportGenerator` — **DO NOT MIGRATE** (Mengandung lembar nilai & predikat anak).
- `TPQAttendanceTracker` — **DO NOT MIGRATE** (Mengandung identitas presensi harian per santri).
- `TPQPaymentLedger` — **DO NOT MIGRATE** (Mengandung rincian SPP per individu).
- `TPQTeacherHonorarium` — **DO NOT MIGRATE** (Mengandung gaji/insentif ustadz).
- `TPQDatabaseReset` — **DO NOT MIGRATE** (Aksi destruktif tanpa otentikasi backend).
