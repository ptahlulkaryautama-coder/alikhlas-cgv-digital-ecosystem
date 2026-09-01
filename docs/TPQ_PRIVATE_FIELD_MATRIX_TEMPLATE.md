# TPQ Private Field Matrix Template

Last updated: 2026-08-21

## Tujuan

Dokumen ini adalah template keputusan field sebelum TPQ Private Vault dipakai untuk data asli.

Gunakan dokumen ini untuk rapat DKM/Kepala TPQ/pengampu. Jangan isi data anak asli di dokumen ini. Yang diputuskan hanya jenis field, siapa yang boleh akses, dan kapan field boleh aktif.

## Prinsip awal

1. Mulai dari data paling minimum.
2. Gunakan kode opaque untuk pilot, misalnya `TPQ-STUDENT-001`.
3. Nama lengkap, kontak wali, alamat, catatan sensitif, dan pembayaran individu tidak dibuka di pilot awal.
4. Pengampu hanya melihat kelas yang diampu, kecuali DKM/TPQ memutuskan lain.
5. Print/export harus punya alasan dan audit.
6. Website publik tidak boleh membaca data individual.

## Matrix field yang disarankan

| Area | Field | Status awal | Akses awal | Catatan keputusan |
| --- | --- | --- | --- | --- |
| Santri | Kode opaque santri | Wajib | Pengampu kelas, Kepala TPQ | Dipakai untuk pilot tanpa nama asli. |
| Santri | Nama panggilan | Disarankan | Pengampu kelas, Kepala TPQ | Lebih mudah dipakai operator, tetap lebih ringan dari nama lengkap. |
| Santri | Nama lengkap | Perlu approval | Kepala TPQ/Admin terbatas | Jangan dibuka ke semua pengampu sebelum ada keputusan. |
| Santri | Status aktif/nonaktif | Wajib | Pengampu kelas, Kepala TPQ | Tidak sensitif bila tidak digabung dengan identitas lengkap. |
| Santri | Alamat | Ditunda | Kepala TPQ/Admin terbatas | Jangan masuk pilot awal. |
| Wali | Nama wali | Ditunda | Kepala TPQ/Admin terbatas | Tidak perlu untuk absensi/progres harian awal. |
| Wali | Nomor WhatsApp | Ditunda | Kepala TPQ/Admin terbatas | Butuh consent dan aturan pemakaian. |
| Wali | Kontak darurat | Perlu approval | Kepala TPQ/Admin terbatas | Hanya bila benar-benar dibutuhkan operasional. |
| Akademik | Kelas/kelompok | Wajib | Pengampu kelas, Kepala TPQ | Dipakai untuk filter akses. |
| Akademik | Status absensi | Wajib | Pengampu kelas, Kepala TPQ | Hadir, izin, sakit, alfa. |
| Akademik | Catatan absensi | Opsional terbatas | Pengampu kelas, Kepala TPQ | Harus pendek dan sopan. |
| Akademik | Checkpoint Iqra/Al-Qur’an | Wajib | Pengampu kelas, Kepala TPQ | Hindari label yang merendahkan anak. |
| Akademik | Hafalan/murojaah | Opsional | Pengampu kelas, Kepala TPQ | Bisa aktif setelah struktur progres jelas. |
| Akademik | Catatan progres | Perlu template | Pengampu kelas, Kepala TPQ | Gunakan pilihan/template agar bahasa terjaga. |
| Raport | Nilai raport | Perlu approval | Pengampu terkait, Kepala TPQ | Aktif setelah template raport disetujui. |
| Raport | Catatan raport | Perlu template | Pengampu terkait, Kepala TPQ | Harus sopan dan konstruktif. |
| Raport | Print/PDF raport | Audit wajib | Kepala TPQ + pengampu terkait | Tidak ada link publik. |
| Keuangan | Pembayaran individu | Ditunda | Bendahara TPQ/Admin terbatas | Jangan campur dengan public finance projection. |
| SDM TPQ | Evaluasi pengampu | Private only | Kepala TPQ/Admin terbatas | Tidak tampil ke pengampu lain atau website publik. |
| Laporan | Export agregat | Boleh setelah approval | Kepala TPQ/Admin | Tanpa nama anak. |
| Laporan | Export individu | Terkunci | Kepala TPQ/Admin terbatas | Harus ada alasan, audit, dan batas waktu. |

## Pertanyaan keputusan

Sebelum migration private vault dijalankan, jawab ini:

1. Apakah pilot memakai kode opaque saja, atau nama panggilan juga?
2. Apakah pengampu hanya melihat kelas yang diampu?
3. Siapa yang boleh melihat nama lengkap?
4. Apakah data wali ditunda dulu?
5. Catatan progres memakai teks bebas atau template pilihan?
6. Siapa yang boleh mencetak raport?
7. Apakah export individu dilarang di fase awal?
8. Berapa lama absensi/progres/raport disimpan?
9. Siapa yang bertanggung jawab atas backup/restore data privat?
10. Kapan data trial boleh diganti data asli terbatas?

## Rekomendasi pilot pertama

Untuk pilot awal, gunakan paket minimum:

- kode opaque santri;
- nama panggilan bila disetujui;
- kelas/kelompok;
- status absensi;
- checkpoint progres;
- catatan progres berbasis template;
- raport preview dummy;
- tanpa data wali;
- tanpa alamat;
- tanpa pembayaran individu;
- tanpa export individu.

## Exit gate

SQL TPQ Private Vault boleh dijalankan jika:

- matrix field ini sudah disetujui;
- checklist `docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md` sudah disetujui;
- runbook `docs/TPQ_STANDALONE_PILOT_RUNBOOK.md` sudah dipahami operator;
- evidence pack `docs/TPQ_STANDALONE_PILOT_EVIDENCE.md` tetap hijau;
- DKM/Kepala TPQ menyetujui pilot dengan data dummy/opaque dulu.
