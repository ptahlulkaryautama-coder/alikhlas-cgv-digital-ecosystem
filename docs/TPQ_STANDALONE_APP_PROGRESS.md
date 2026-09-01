# TPQ Stand-alone App Progress

Last updated: 2026-08-21

## Status singkat

App Pengampu TPQ sudah disiapkan sebagai shell stand-alone internal di dashboard:

- Route utama: `/app/tpq/pengampu`
- Route alias arah stand-alone: `/app/tpq/app`
- Akses dilindungi oleh permission `tpq:read`
- Semua modul saat ini aman untuk tahap desain/integrasi karena belum membaca atau menulis data privat anak/pengampu.
- Mode stand-alone sudah punya topbar ringan dan bottom navigation untuk alur mobile: Home, Absen, Progres, Raport, dan Kas.

## Modul shell yang sudah ada

| Area | Modul | Status |
| --- | --- | --- |
| Utama | Beranda | Shortcut tugas harian + operator checklist + preview mobile stand-alone |
| Akademik | Santri | Preview private vault tanpa data anak |
| Akademik | Absensi | Draft dummy/opaque + mock input disabled |
| Akademik | Progres | Draft dummy/opaque + mock input disabled |
| Akademik | Raport | Workflow preview `Input → Preview → Print` dengan data dummy + checklist print readiness |
| Akademik | Kelas | Preview kelompok/jadwal + Weekly class board tanpa identitas privat |
| SDM TPQ | Pengampu | Preview peran operasional + coverage tanpa identitas personal |
| SDM TPQ | Evaluasi Pengampu | Preview private-only + rubrik evaluasi |
| Operasional | Kas TPQ | Read-only dari finance read model TPQ |
| Operasional | Agenda | Read-only dari public-safe agenda |
| Lainnya | Laporan | Preview read-only, Report Assembly, export terkunci + Export manifest |
| Lainnya | Setting | Preview arah stand-alone, Backup readiness, Policy Gate, role & akses, tanpa write/localStorage |

Beranda juga memuat `Academic Flow Preview`, yaitu alur dummy/opaque yang mengikat pekerjaan utama pengampu: `Absensi → Progres → Raport`.
Beranda juga memuat `Student Session Pipeline`, yaitu simulasi satu kode santri opaque yang bergerak dari absensi, progres, sampai raport tanpa membuka identitas anak.
Beranda juga memuat `Class Mentor Evaluation Bridge`, yaitu penghubung dummy antara `Kelas → Pengampu → Evaluasi` agar coverage SDM TPQ jelas tanpa identitas personal.
Beranda juga memuat `Daily Session Handoff Preview`, yaitu ringkasan akhir sesi dummy yang memperlihatkan bagaimana absensi dan progres nanti menjadi bahan review raport.
Beranda dan Setting juga memuat `Pilot Readiness`, yaitu panel lampu lalu lintas yang menandai: shell App TPQ siap, data privat anak terkunci, private vault menunggu approval, pilot dummy/opaque aman diuji, dan print/export produksi masih terkunci.
Beranda dan Setting memuat `Role Journey Preview`, yaitu peta kerja ringkas untuk Pengampu, Kepala TPQ, Bendahara TPQ, dan Admin DKM. Di Beranda, role journey juga punya shortcut aman untuk mulai dari modul pertama tiap role.
Setting juga memuat `Private Field Matrix Preview`, yaitu template keputusan field santri/wali/akademik/operasional sebelum private vault boleh dipakai.
Setiap modul kini memuat `Module Readiness`, yaitu checklist ringkas: UI shell, data dummy, private vault, dan write RPC. Untuk modul yang sudah punya integrasi aman seperti Kas TPQ dan Agenda, panel ini menjelaskan bahwa mutasi tetap lewat workflow finance/agenda yang sudah dijaga.
Setiap modul kini juga memuat `Module Action Map`, yaitu panduan praktis untuk operator: apa yang boleh dicoba sekarang, apa yang masih terkunci, dan modul terkait yang bisa dibuka berikutnya. Ini membantu pilot terasa seperti aplikasi sungguhan tanpa membuka data privat.

Mode stand-alone `/app/tpq/app` sekarang lebih dekat ke pola aplikasi HP: tidak membawa sidebar DKM, memiliki topbar ringkas untuk kembali ke Portal TPQ/Dashboard DKM, dan bottom navigation tetap untuk 5 tugas utama pengampu. Bottom navigation ini hanya mengganti modul preview; belum menulis data dan belum membuka private vault.

## Role & akses yang sudah dipetakan di UI

| Role | Arah akses |
| --- | --- |
| Kepala TPQ | Koordinasi akademik, review kelas, raport, progres, dan evaluasi pengampu |
| Pengampu | Tugas kelas yang diampu: absensi, progres, catatan kelas, dan draft raport |
| Bendahara TPQ | Kas TPQ lewat finance ledger, tanpa membuka nilai/raport/catatan anak |
| Admin DKM | Pengaturan, audit, backup, dan rilis konten public-safe |

## Operator checklist

Beranda App TPQ sudah memuat checklist urutan kerja pengampu:

1. Sebelum kelas: cek agenda dan kelompok belajar.
2. Saat kelas: siapkan absensi dan catatan progres.
3. Setelah kelas: review catatan dan tindak lanjut.
4. Akhir periode: preview raport dan laporan.

Checklist ini belum menyimpan data. Shortcut hanya memindahkan tampilan modul.

## Akademik & SDM preview

- Kelas sudah punya Weekly class board berbasis label generik.
- Pengampu sudah punya coverage preview dengan `Pengampu A/B/C`, bukan nama orang.
- Evaluasi Pengampu sudah punya rubrik internal tanpa data personal.

## Laporan, export, dan backup

- Laporan sudah punya Export manifest untuk memetakan jenis laporan, tujuan, format, dan batas data.
- Laporan sudah punya Report Assembly untuk menyatukan Absensi, Progres, Raport, Kas TPQ, dan Agenda sebagai blueprint laporan bulanan/semester tanpa export aktif.
- Setting sudah punya Backup readiness dan Restore Rehearsal Runbook untuk menandai scope backup, checksum, audit export, restore di test environment, serta larangan menimpa produksi.
- Setting sudah punya Policy Gate untuk menampilkan keputusan yang wajib disetujui sebelum TPQ Private Vault dibuka.
- Beranda dan Setting sudah punya Pilot Readiness untuk membantu operator memahami status aman sebelum pilot.
- Beranda dan Setting sudah punya Role Journey Preview untuk membedakan alur Pengampu, Kepala TPQ, Bendahara TPQ, dan Admin DKM; Beranda memakai shortcut role yang hanya memindahkan modul.
- Setting sudah punya Private Field Matrix Preview untuk membantu DKM/TPQ memilih field minimum yang boleh dibuka.
- Beranda sudah punya Daily Session Handoff untuk mensimulasikan ringkasan akhir kelas tanpa menyimpan data privat.
- Beranda sudah punya Student Session Pipeline untuk menguji integrasi Absensi → Progres → Raport memakai kode opaque.
- Beranda sudah punya Class Mentor Evaluation Bridge untuk menguji integrasi Kelas → Pengampu → Evaluasi Pengampu tanpa data personal.
- Raport sudah punya Print Readiness Checklist untuk memagari field, akses, audit print, dan output wali sebelum data asli dicetak.
- Export/backup produksi masih terkunci sampai private vault, role export, dan policy data anak disetujui.

## Batas aman saat ini

- Tidak ada data nama anak, wali, alamat, absensi individu, nilai, catatan perilaku, pembayaran individu, atau identitas personal pengampu.
- Tidak ada direct browser mutation ke tabel Supabase.
- Tidak ada `localStorage.setItem` untuk data privat.
- Tidak ada `window.print` aktif untuk raport asli.
- Tidak ada public website projection dari modul privat TPQ.

## Yang sudah tervalidasi

Per 2026-08-21:

- `npm run build` sukses.
- `npm test` sukses: 206/206 passed.
- Runbook pilot aman sudah disiapkan di `docs/TPQ_STANDALONE_PILOT_RUNBOOK.md`.
- Evidence pack pilot aman sudah disiapkan di `docs/TPQ_STANDALONE_PILOT_EVIDENCE.md`.
- Template field private vault sudah disiapkan di `docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md`.

## Belum boleh dikerjakan tanpa keputusan DKM/TPQ

1. Mengaktifkan TPQ private vault SQL di Supabase.
2. Menentukan field data santri/wali/pengampu yang boleh disimpan.
3. Menentukan siapa yang boleh melihat semua kelas vs hanya kelas yang diampu.
4. Menentukan retensi data absensi, progres, raport, dan evaluasi pengampu.
5. Menentukan format export/print raport produksi.
6. Menentukan apakah wali santri akan punya portal sendiri.

Checklist keputusan non-teknis sudah disiapkan di `docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md`.
Runbook uji tanpa data privat disiapkan di `docs/TPQ_STANDALONE_PILOT_RUNBOOK.md`.
Evidence pack uji aman disiapkan di `docs/TPQ_STANDALONE_PILOT_EVIDENCE.md`.
Template field private vault disiapkan di `docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md`.

## Next recommended phase

Phase berikutnya adalah `TPQ Private Vault Pilot`, tetapi hanya setelah DKM/TPQ menyetujui policy data anak dan field list. Setelah itu urutan aman:

1. Jalankan migration private vault.
2. Jalankan verification SQL.
3. Aktifkan trial switch terbatas.
4. Input data dummy/opaque dulu.
5. Uji akun `guru_tpq` dan `kepala_tpq`.
6. Baru desain import/cetak/export produksi.
