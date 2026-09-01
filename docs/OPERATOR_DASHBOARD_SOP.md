# SOP Operator Dashboard Al Ikhlas CGV

Tanggal: 21 Agustus 2026  
Status: draft operasional internal

Dokumen ini dibuat untuk pengurus non-teknis. Ikuti langkah di bawah sesuai menu yang dipakai.

## Prinsip umum

1. Draft tidak langsung tampil di website.
2. Data uji tidak tampil di website publik.
3. Tombol rilis/publish hanya muncul untuk akun yang punya otoritas.
4. Jika tombol tidak aktif, biasanya mode aman/kill-switch sedang terkunci atau akun belum diberi role.
5. Jangan hapus permanen data penting. Sistem memakai archive/suspend agar jejak audit tetap ada.
6. Data santri, wali, presensi, nilai, raport, dan pembayaran individu tidak boleh tampil di website publik.

## Kabar Masjid / Artikel

Tujuan: membuat artikel/warta yang bisa tampil di website publik.

Langkah:

1. Buka `Kabar Masjid`.
2. Klik `Tulis artikel baru`.
3. Isi judul, slug URL, ringkasan, isi artikel, kategori, tag, penulis, dan foto bila ada.
4. Klik `Simpan Draft`.
5. Review tampilan artikel dari tombol kelola/review.
6. Klik `Publikasikan` atau `Siap publik` sesuai status yang tersedia.
7. Buka `Pengaturan` → `Pusat Rilis Website`.
8. Klik `Rilis ke website`.
9. Cek halaman website publik.

Catatan:

- Foto yang di-upload saat trial tersimpan private dulu.
- Saat rilis production, sistem menyalin foto ke penyimpanan publik.
- Artikel dengan akses `Pengurus` tidak tampil sebagai artikel publik.

## Program & Kegiatan

Tujuan: mengelola program/kajian yang tampil di dashboard dan website.

Langkah:

1. Buka `Program & Kegiatan`.
2. Klik `Tambah Program`.
3. Isi nama program, kategori, pilar, jadwal, lokasi, dan deskripsi.
4. Simpan draft.
5. Review tampilan.
6. Klik `Publikasikan` atau `Siap publik`.
7. Buka `Pengaturan` → `Pusat Rilis Website`.
8. Klik `Rilis ke website`.
9. Cek section Program di website publik.

Catatan:

- Gunakan archive untuk program uji yang tidak dipakai.
- Jangan memasukkan data pribadi jamaah atau daftar hadir ke konten publik.

## Agenda & Kalender

Tujuan: membuat agenda masjid yang tampil di kalender dan website.

Langkah:

1. Buka `Agenda & Kalender`.
2. Klik `Tambah Agenda`.
3. Isi judul, kategori, tanggal, jam, lokasi, dan deskripsi.
4. Simpan draft.
5. Review kalender.
6. Klik `Publikasikan`.
7. Bila perlu tampil di website production, buka `Pengaturan` → `Pusat Rilis Website`.
8. Klik `Rilis ke website`.

Catatan:

- Agenda uji tetap tidak tampil di website production.
- Gunakan kategori konsisten agar kalender mudah dibaca.

## Keuangan DKM / TPQ - Import Excel

Tujuan: memasukkan banyak transaksi dari file Excel.

Langkah:

1. Buka menu `Keuangan` untuk DKM atau `TPQ & Pendidikan` untuk TPQ.
2. Pilih periode bulan.
3. Isi saldo awal dan saldo akhir pembanding.
4. Upload file Excel `.xlsx`.
5. Periksa preview:
   - total baris,
   - valid/bermasalah,
   - kas masuk,
   - kas keluar,
   - saldo akhir hitung,
   - selisih.
6. Jika selisih bukan Rp 0, jangan lanjut. Perbaiki data atau saldo.
7. Jika valid, klik `Konfirmasi import`.
8. Klik `Publikasikan ke ledger` sesuai workflow.
9. Cek snapshot keuangan dan riwayat batch.

Catatan:

- Jika file DKM diupload ke TPQ atau sebaliknya, sistem akan memberi peringatan kategori.
- Jangan ubah angka finance tanpa sumber Bendahara yang jelas.

## Keuangan DKM / TPQ - Input Manual

Tujuan: memasukkan transaksi satuan.

Langkah:

1. Buka form `Catat Keuangan Manual`.
2. Pilih scope DKM atau TPQ.
3. Isi tanggal, arah transaksi, kategori, subkategori, dana/tujuan, uraian publik, nominal, dan metode pembayaran bila ada.
4. Untuk kategori TPQ yang terkait santri, isi kode santri opaque, bukan nama anak.
5. Simpan draft.
6. Review transaksi.
7. Publikasikan ke ledger.
8. Cek snapshot saldo.

Catatan:

- Data yang sudah masuk ledger tidak dihapus langsung.
- Jika keliru setelah masuk ledger, gunakan panel `Koreksi Ledger`.

## Keuangan DKM / TPQ - Koreksi Ledger

Tujuan: memperbaiki transaksi yang sudah terlanjur dipublikasikan ke ledger tanpa menghapus jejak lama.

Langkah:

1. Buka menu `Keuangan` untuk DKM atau `TPQ & Pendidikan` untuk TPQ.
2. Cari panel `Koreksi Ledger`.
3. Pilih transaksi sumber yang akan dikoreksi.
4. Isi alasan koreksi dengan jelas.
5. Bila transaksi perlu diganti, centang opsi transaksi pengganti dan isi data pengganti.
6. Simpan draft koreksi.
7. Klik `Publikasikan reversal` jika data sudah benar.
8. Cek snapshot saldo dan riwayat batch.

Catatan:

- Koreksi membuat transaksi pembalik/reversal, bukan mengedit atau menghapus transaksi lama.
- Untuk TPQ, kode santri tetap harus opaque. Jangan masukkan nama anak/wali.
- Jika tombol terkunci, berarti migration/flag koreksi belum aktif atau akun belum punya akses finance.

## Pengaturan Role dan Akses

Tujuan: mengatur siapa bisa membuka menu dan tombol tertentu.

Langkah:

1. Buka `Pengaturan`.
2. Di `Jabatan & Akses Dashboard`, centang role sesuai tugas:
   - Ketua DKM,
   - Sekretaris,
   - Bendahara,
   - Media & Humas,
   - Kepala TPQ,
   - Pengampu TPQ,
   - Viewer.
3. Di panel otorisasi, beri akses khusus bila perlu:
   - approval/publikasi keuangan,
   - akses editorial Kabar Masjid,
   - rilis website.
4. Jangan beri akses lebih luas dari kebutuhan tugas.

Catatan:

- `Hapus akses akun` berarti suspend, bukan delete permanen.
- Akun yang dipulihkan tidak otomatis mendapat role lama. Pilih role lagi setelah restore.
- Akun Super Admin dilindungi.

## TPQ Private Data Vault

Status: fondasi teknis disiapkan, tetapi belum aktif untuk input operator.

Gunakan bagian ini sebagai pengingat kebijakan:

1. Jangan input data anak/wali ke field umum, artikel, agenda, program, atau uraian publik finance.
2. Data individual TPQ baru boleh masuk setelah DKM/Kepala TPQ menyetujui daftar field, consent, retention, dan metode sealing/encryption.
3. Website publik hanya boleh menampilkan jadwal, agenda, fokus belajar, dan ringkasan aman.
4. Jika nanti fitur privat dibuka, gunakan kode opaque untuk referensi anak, bukan nama lengkap di laporan publik.

## Peta Integrasi dan Gate Production

Gunakan panel ini sebelum rilis resmi.

Yang perlu dilihat:

1. `Peta Integrasi`: cek modul mana yang siap jalan, masih uji, atau terkunci aman.
2. `Gate Production`: cek apakah mode trial sudah tertutup dan daftar rilis bersih.
3. `Pusat Rilis Website`: cek konten yang masih menunggu rilis/arsip.

Jika Gate Production belum siap:

1. Tutup kill-switch trial yang masih aktif.
2. Arsipkan konten uji yang tidak dipakai.
3. Pastikan minimal ada konten production yang terbaca.
4. Refresh status.

## Setelah selesai trial

Checklist:

1. Matikan semua feature flag test/write yang tidak sedang dipakai.
2. Pastikan tidak ada trial content menggantung di Pusat Rilis.
3. Pastikan website publik tidak menampilkan konten uji.
4. Jalankan backup/restore rehearsal sebelum produksi.
5. Minta approval DKM sebelum deploy production.
