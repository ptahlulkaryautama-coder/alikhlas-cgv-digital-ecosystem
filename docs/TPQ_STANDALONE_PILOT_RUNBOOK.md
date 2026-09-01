# TPQ Stand-alone App Pilot Runbook

Last updated: 2026-08-21

## Tujuan

Runbook ini dipakai untuk mencoba App Pengampu TPQ sebagai aplikasi stand-alone tanpa memasukkan data privat anak, wali, pengampu, absensi individu, nilai, raport asli, atau pembayaran individu.

Hasil yang dicari pada tahap ini bukan data produksi, tetapi memastikan alur kerja sudah mudah dipakai:

- pengampu bisa membuka modul harian;
- kepala TPQ bisa memahami alur review;
- bendahara TPQ bisa melihat ringkasan kas TPQ yang sudah aman;
- admin DKM bisa melihat batas akses, policy gate, backup readiness, dan role matrix;
- tidak ada data privat yang tampil di website publik.

## Prasyarat

Sebelum pilot, pastikan:

1. Login dashboard sudah berhasil.
2. Akun uji minimal tersedia untuk role `guru_tpq` dan/atau `kepala_tpq`.
3. Tidak ada real data santri/wali yang diketik ke form dummy.
4. Private Vault SQL belum dijalankan kecuali DKM/TPQ sudah menyetujui checklist keputusan data anak.
5. Trial content switch boleh aktif hanya untuk modul konten publik, bukan data privat anak.

## Data yang boleh dipakai saat pilot

Gunakan contoh aman seperti:

| Jenis data | Boleh | Tidak boleh |
| --- | --- | --- |
| Santri | `TPQ-STUDENT-001`, `Santri A`, `Santri B` | Nama anak asli, NIK, alamat, nama wali |
| Pengampu | `Pengampu A`, `Pengampu B` | Nama lengkap pribadi jika belum disetujui |
| Absensi | jumlah agregat atau status dummy | riwayat hadir anak asli |
| Progres | checkpoint dummy | nilai/kemampuan anak asli |
| Raport | preview dummy | raport asli yang dicetak/dikirim |
| Keuangan TPQ | agregat kas atau data test yang sudah disetujui | tagihan/riwayat bayar per anak |

## Langkah pilot aman

### 1. Buka App TPQ

Masuk ke:

- `/app/tpq/pengampu`
- atau `/app/tpq/app`

Ekspektasi:

- sidebar TPQ muncul;
- role user tampil di kiri bawah;
- modul Beranda terbuka;
- tidak ada nama santri asli.

### 2. Cek Beranda

Di Beranda, periksa:

- checklist operator harian;
- role journey Pengampu, Kepala TPQ, Bendahara TPQ, dan Admin DKM;
- preview mobile stand-alone;
- ringkasan modul yang tersedia.

Ekspektasi:

- tombol shortcut hanya pindah modul;
- tidak ada data tersimpan;
- role journey hanya menjadi panduan, bukan pengubah permission;
- tidak ada prompt untuk input data anak asli.

### 3. Cek modul Akademik

Buka modul:

- Santri;
- Absensi;
- Progres;
- Raport;
- Kelas.

Ekspektasi:

- Santri hanya menampilkan private vault preview;
- Absensi dan Progres memakai kode opaque/dummy;
- Raport hanya preview, belum print produksi;
- Kelas memakai label generik, bukan identitas personal.

### 4. Cek modul SDM TPQ

Buka:

- Pengampu;
- Evaluasi Pengampu.

Ekspektasi:

- coverage memakai `Pengampu A/B/C`;
- evaluasi masih private-only preview;
- tidak ada data personal pengampu asli.

### 5. Cek modul Operasional

Buka:

- Kas TPQ;
- Agenda.

Ekspektasi:

- Kas TPQ hanya membaca ringkasan/ledger yang sudah aman;
- Agenda hanya menampilkan data public-safe;
- tidak ada pembayaran individu santri.

### 6. Cek Laporan dan Setting

Buka:

- Laporan;
- Setting.

Ekspektasi:

- Export manifest tampil tetapi export produksi terkunci;
- Backup readiness tampil sebagai checklist;
- Policy Gate tampil dan mengarahkan ke `TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md`;
- role matrix tampil sebagai preview, belum mengubah Supabase.

## Hal yang harus dicatat saat pilot

Catat temuan dengan format sederhana:

| Area | Temuan | Dampak | Usulan |
| --- | --- | --- | --- |
| Beranda | Contoh: shortcut kurang jelas | Pengampu bingung | Ubah label tombol |
| Absensi | Contoh: butuh pilihan telat | Perlu field tambahan | Tambah status setelah policy |
| Raport | Contoh: format print belum sesuai | Raport belum siap | Sesuaikan template |

## Kriteria pilot lulus

Pilot aman dinyatakan lulus jika:

- semua route App TPQ bisa dibuka oleh akun yang berwenang;
- operator memahami urutan kerja tanpa bantuan developer;
- tidak ada data anak asli yang diperlukan untuk mencoba UI;
- tidak ada tombol yang menulis data privat;
- tidak ada data privat muncul di public website;
- daftar field private vault sudah siap dibahas DKM/TPQ.

## Jika ada masalah

Gunakan eskalasi berikut:

1. Masalah tampilan atau alur UI: catat screenshot dan modulnya.
2. Masalah akses login/role: cek menu Pengaturan dan Supabase Auth.
3. Masalah data privat: hentikan pilot, jangan lanjut input, dan review checklist policy.
4. Masalah data keuangan TPQ: jangan koreksi angka sembarangan; minta approval sumber Bendahara.

## Langkah setelah pilot

Jika pilot UI sudah nyaman, keputusan berikutnya adalah approval policy data anak. Setelah itu baru boleh lanjut ke:

1. migration `supabase/migrations/202608120027_tpq_private_vault_foundation.sql`;
2. verification SQL;
3. trial switch private vault terbatas;
4. input data dummy/opaque;
5. uji role `guru_tpq`, `kepala_tpq`, dan admin;
6. desain print/export raport produksi.
