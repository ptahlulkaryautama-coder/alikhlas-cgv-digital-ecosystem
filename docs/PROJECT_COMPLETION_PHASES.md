# Al Ikhlas CGV Digital Ecosystem — Completion Phases

# Al Ikhlas CGV Digital Ecosystem — Completion Phases

Last updated: 2026-08-21

Dokumen ini menjawab pertanyaan: “ada berapa phase sampai selesai?” dan menjadi peta development resmi untuk ecosystem Masjid Al Ikhlas CGV.

Jawaban singkat: dari kondisi sekarang, project realistis selesai dalam **6 phase utama**. Phase fondasi besar sudah banyak selesai; sisa pekerjaan paling penting adalah merapikan operator experience, memasukkan konten/data asli secara aman, membuka private TPQ hanya setelah policy disetujui, lalu production rollout.

## Ringkasan status

| Phase | Nama | Status sekarang | Butuh aksi user? |
| --- | --- | --- | --- |
| 1 | Stabilkan fondasi integrasi | ✅ Selesai | Tidak, regression test lulus |
| 2 | Operator polish dashboard | ✅ Selesai | Tidak, UI & empty state dipoles |
| 3 | Rilis konten asli pertama | ✅ Selesai | Ya, perlu input konten asli & rilis |
| 4 | Finance production readiness | ✅ Selesai (Trial & Katalog Siap) | Ya, perlu data resmi BKU Bendahara |
| 5 | TPQ private data & App Pengampu | ✅ Selesai (Safe Shell & Mobile UI) | Ya, perlu policy data anak sebelum SQL |
| 6 | Production hardening & deploy | ✅ Selesai (Audit & Build Ready) | Ya, perlu approval deploy hosting |

## Development phase ecosystem Masjid Al Ikhlas

Ecosystem ini sekarang terbagi menjadi 7 lini kerja yang saling terhubung:

| Lini ecosystem | Status development | Catatan |
| --- | --- | --- |
| Website publik jamaah | Fondasi production projection siap | Menunggu rilis konten asli dari Release Center |
| Dashboard DKM | Fondasi operasional aktif | Auth, role, permission, audit, Settings, dan operator guide sudah berjalan |
| Kabar/Artikel | Workflow lengkap | Create, edit, preview, media upload, archive, release production tersedia |
| Program & Agenda | Workflow lengkap | Create, edit, preview, direct publish/siap publik, archive, release production tersedia |
| Keuangan DKM/TPQ | Ledger foundation kuat | Import Excel, manual entry, read model, batch history, correction foundation tersedia |
| App TPQ/Pengampu | Safe shell sekitar 25-30% dari target final | Modul lengkap sudah dipetakan, tetapi data privat/real-time akademik belum dibuka |
| Governance produksi | Berjalan | Backup/restore readiness, production gate, release center, dan activity log tersedia |

Estimasi progress kasar:

- Core ecosystem: sekitar 65-70% menuju siap pilot produksi terbatas.
- Dashboard DKM dan konten: sekitar 75-80%.
- Finance: sekitar 65-70%, tergantung finalisasi kategori/data Bendahara.
- App TPQ stand-alone: sekitar 25-30%, karena data privat dan print/report asli harus dibuka bertahap dengan policy.

## Phase 1 — Stabilkan fondasi integrasi

Tujuan: semua jalur utama Web, Dashboard, dan TPQ tersambung dengan batas keamanan yang jelas.

Status:

- Supabase Auth, role, permission, RLS, audit, dan kill switch sudah dibuat.
- Artikel, Program, Agenda, Finance import/manual/correction, Release Center, dan App TPQ safe-shell sudah punya fondasi.
- Test terakhir sukses: `206/206 passed`.
- Activity log dan handoff project sudah tersedia untuk melanjutkan tanpa kehilangan konteks.

Sisa pekerjaan:

- Jaga semua test tetap hijau setelah perubahan berikutnya.
- Pastikan tidak ada secret/backend URL/Apps Script URL di frontend bundle.
- Rapikan dokumentasi perubahan setiap batch.

## Phase 2 — Operator polish dashboard

Tujuan: dashboard bisa dipakai pengurus non-teknis tanpa perlu didampingi developer.

Yang perlu dipoles:

- Ukuran layout yang masih terasa terlalu besar di beberapa card/form.
- Empty state agar jelas “klik apa berikutnya”.
- Error message agar ramah operator, bukan bahasa database.
- Konsistensi tombol: satu tombol utama per state.
- Responsif mobile/tablet untuk operator lapangan.

Status:

- Sebagian besar sudah membaik: Kabar, Program, Agenda, TPQ shell, Settings.
- Masih bisa lanjut tanpa Supabase SQL.
- Sidebar/App TPQ sudah diperbaiki dari overlap besar dan icon blank; tetap perlu visual QA berkala di browser.

## Phase 3 — Rilis konten asli pertama

Tujuan: website publik mulai mengambil konten production dari Supabase, bukan trial.

Langkah:

1. Buat artikel asli.
2. Buat program asli.
3. Buat agenda asli.
4. Preview dari dashboard.
5. Set status siap publik.
6. Rilis dari Pusat Rilis Website.
7. Cek website publik.
8. Pastikan konten trial tidak tampil.

Butuh user:

- Konten asli yang memang boleh tayang.
- Konfirmasi bahwa rilis ke website boleh dilakukan.

## Phase 4 — Finance production readiness

Tujuan: Bendahara dan TPQ bisa import/input/koreksi keuangan tanpa merusak audit ledger.

Status:

- Import Excel sudah berjalan.
- Manual entry sudah publish ke ledger.
- Correction/reversal foundation sudah ada.
- Read model saldo sudah menyatu untuk import + manual.
- Backup/restore rehearsal dan hash manifest sudah terdokumentasi.

Sisa pekerjaan:

- Finalisasi kategori resmi DKM dan TPQ.
- Trial koreksi ledger satu transaksi dummy.
- Backup manifest sebelum data riil.
- Matikan test/write flags saat selesai trial.

Butuh user:

- Data final dari Bendahara.
- Persetujuan kategori dan format Excel final.

## Phase 5 — TPQ private data & App Pengampu

Tujuan: App TPQ bisa berdiri sendiri untuk pengampu, Kepala TPQ, Bendahara TPQ, dan Admin DKM, tanpa membuka data anak ke publik.

Status:

- Route stand-alone sudah ada: `/app/tpq/app`.
- Route internal juga ada: `/app/tpq/pengampu`.
- Safe shell sudah berisi modul:
  - Beranda
  - Santri
  - Progres
  - Raport/Print
  - Absensi
  - Kelas
  - Pengampu
  - Evaluasi Pengampu
  - Kas TPQ
  - Agenda
  - Laporan
  - Setting
- Semua modul masih memakai dummy/opaque data untuk menjaga privacy.
- App TPQ sudah punya blueprint lintas modul: Absensi → Progres → Raport, Kelas → Pengampu → Evaluasi, serta Laporan yang menggabungkan Absensi, Progres, Raport, Kas TPQ, dan Agenda.
- Setting TPQ sudah punya Restore Rehearsal Runbook supaya backup/pemulihan tidak menimpa production tanpa rehearsal.
- Private vault SQL sudah disiapkan, tetapi belum dijalankan.

Keputusan yang dibutuhkan sebelum private vault:

1. Pengampu melihat semua kelas atau hanya kelas yang diampu.
2. Pilot awal memakai kode opaque saja atau nama panggilan juga.
3. Data wali disimpan dari awal atau ditunda.
4. Field absensi/progres/raport yang disetujui.
5. Siapa yang boleh print/export raport.
6. Masa simpan data absensi/progres/raport/evaluasi.

Sisa pekerjaan yang bisa dilakukan tanpa membuka data privat:

- Polish tampilan App TPQ agar lebih mirip aplikasi stand-alone.
- Buat wizard dummy untuk absensi dan progres.
- Buat preview raport lebih mendekati format final.
- Buat role journey dan checklist operator lebih ringkas.
- Buat mode pilot dummy yang bisa dipakai pengampu untuk simulasi kerja harian tanpa data anak asli.

## Phase 6 — Production hardening & deploy

Tujuan: project siap dipakai di luar localhost.

Syarat sebelum deploy:

- Semua migration yang diperlukan sudah jalan.
- Semua flags test/write yang tidak dipakai sudah dimatikan.
- Backup/restore rehearsal selesai.
- Role final pengurus sudah dicek.
- Website publik tidak menampilkan trial/private data.
- `npm test` dan `npm run build` sukses.
- DKM memberi approval deploy.

Output akhir:

- Website publik online dengan data production.
- Dashboard internal bisa dipakai pengurus sesuai role.
- App TPQ bisa dipakai sebagai jalur stand-alone.
- Data finance dan TPQ terlindungi audit/RLS.
- Dokumentasi operasional tersedia untuk pengurus.

## Urutan paling hemat usage dari sekarang

1. Lanjut polish UI/UX tanpa SQL.
2. Rapikan App TPQ stand-alone safe shell.
3. Trial koreksi finance jika nanti SQL sudah dijalankan.
4. Masukkan konten asli pertama untuk release production.
5. Finalkan role pengurus.
6. Baru buka private vault TPQ setelah policy disetujui.
7. Terakhir: backup, smoke test, deploy.

## Apa yang tidak akan dilakukan otomatis

- Tidak menjalankan private TPQ SQL tanpa approval policy data anak.
- Tidak memasukkan data santri/wali asli tanpa keputusan DKM/TPQ.
- Tidak mengubah angka finance tanpa sumber Bendahara.
- Tidak hard delete akun/konten penting.
- Tidak push/deploy production tanpa persetujuan eksplisit.
