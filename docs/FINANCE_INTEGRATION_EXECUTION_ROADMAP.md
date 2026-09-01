# Roadmap Eksekusi Integrasi Keuangan DKM dan TPQ

Status dokumen: **Aktif - rencana kerja internal**  
Tanggal penyusunan: 2 Agustus 2026  
Ruang lingkup: Web publik, Dashboard DKM, Dashboard TPQ, dan Supabase  
Status penulisan production: **NONAKTIF** (`finance_import_writes_enabled = false`)

## 1. Tujuan

Membangun pengelolaan keuangan DKM dan TPQ yang:

- mudah digunakan oleh operator yang tidak memahami coding;
- mempunyai satu sumber data yang konsisten di Supabase;
- mendukung input manual dan impor Excel;
- mempunyai pemeriksaan dan persetujuan Bendahara;
- menghasilkan KPI, grafik, rekap kategori, dan tabel dari transaksi yang sama;
- menjaga data internal dan data pribadi TPQ agar tidak tampil di website publik;
- mempunyai audit trail, backup, rekonsiliasi, dan prosedur pemulihan.

## 2. Kondisi Saat Ini

Sudah tersedia:

- autentikasi Supabase dan pembagian permission dasar;
- fondasi tabel dan RPC impor keuangan;
- Row Level Security untuk data keuangan;
- menu preview impor Excel pada Dashboard DKM dan TPQ;
- validasi dasar file Excel;
- tampilan laporan DKM berupa KPI, grafik saldo, komposisi pemasukan, rekap kategori, dan tabel transaksi;
- kill-switch penulisan yang masih nonaktif;
- test keamanan dan kontrak repository.

Belum siap production karena:

- angka keuangan lama masih harus direkonsiliasi dan disetujui Bendahara;
- beberapa bagian grafik masih menggunakan data repository/mock;
- halaman Keuangan belum sepenuhnya menggunakan Supabase sebagai sumber data;
- format impor belum mempunyai kolom `Subkategori` dan `Dana/Tujuan`;
- alur pemeriksaan, persetujuan, penolakan, dan publikasi belum diimplementasikan;
- backup/restore dan pilot pengguna belum dilaksanakan.

## 3. Prinsip Keselamatan

1. Jangan mengubah angka lama tanpa sumber Bendahara yang terverifikasi.
2. Jangan mengaktifkan penulisan production sebelum Phase 3 dinyatakan lulus.
3. Jangan menguji impor menggunakan data atau tabel production.
4. Jangan menampilkan nama santri, wali, nomor telepon, pembayaran individu, atau catatan internal TPQ di website publik.
5. Setiap hasil ringkasan harus dapat ditelusuri ke transaksi sumber.
6. Setiap impor harus bersifat atomik: seluruh transaksi berhasil atau seluruhnya dibatalkan.
7. Transaksi yang sudah disetujui tidak boleh diubah diam-diam.
8. Zakat, wakaf, fidyah, infaq terikat, dan dana operasional harus dapat dipisahkan.

## 4. Rumus Rekonsiliasi Utama

```text
Saldo akhir = Saldo awal + Total pemasukan - Total pengeluaran
```

Ketentuan:

- saldo awal bukan pemasukan bulan berjalan;
- total pemasukan dihitung dari transaksi berjenis `Pemasukan`;
- total pengeluaran dihitung dari transaksi berjenis `Pengeluaran`;
- saldo berjalan dihitung berdasarkan tanggal dan urutan transaksi;
- jumlah transaksi dihitung dari baris transaksi yang sah;
- jika ringkasan tidak cocok, periode diberi status `Perlu Verifikasi Bendahara`;
- sistem tidak boleh memperbaiki selisih secara otomatis.

---

## Phase 0 - Standardisasi dan Rekonsiliasi

Prioritas: **CRITICAL**  
Estimasi: **2-3 hari kerja**  
Status: **Berjalan - fondasi teknis diterapkan, verifikasi Bendahara tertunda**

### Tujuan

Menetapkan definisi angka dan struktur kategori sebelum transaksi boleh disimpan.

### Implementasi

- [ ] Tetapkan definisi saldo awal, pemasukan, pengeluaran, dan saldo akhir.
- [ ] Audit angka Mei, Juni, dan contoh laporan DKM.
- [ ] Audit contoh laporan TPQ Juli.
- [ ] Buat pemeriksaan otomatis antara ringkasan dan transaksi.
- [ ] Buat daftar selisih tanpa mengubah data sumber.
- [x] Implementasikan draft kamus kategori dan subkategori DKM.
- [x] Implementasikan draft kamus kategori dan subkategori TPQ.
- [x] Implementasikan klasifikasi `Dana/Tujuan` pada importer dan schema.
- [ ] Catat keputusan dan persetujuan Bendahara.

### Deliverable

- aturan perhitungan keuangan;
- kamus kategori DKM dan TPQ;
- laporan rekonsiliasi per periode;
- daftar selisih yang memerlukan keputusan Bendahara.

### Gate Phase 0

Phase 0 selesai hanya jika:

- rumus dan definisi angka disetujui;
- saldo awal masing-masing periode teridentifikasi;
- selisih telah dijelaskan atau ditandai resmi untuk koreksi;
- Bendahara menyetujui kamus kategori.

---

## Phase 1 - Format Excel Standar dan Preview Aman

Prioritas: **CRITICAL**  
Estimasi: **3-4 hari kerja**  
Status: **Berjalan - schema Supabase, rekonsiliasi, dan template resmi tersedia**

### Struktur kolom target

1. `Tanggal`
2. `Jenis`
3. `Kategori`
4. `Subkategori`
5. `Dana/Tujuan`
6. `Kode Santri`
7. `Keterangan Publik`
8. `Metode`
9. `Nominal (Rp)`
10. `Referensi Eksternal`
11. `Status`
12. `Catatan Internal`

### Implementasi

- [x] Tambahkan `Subkategori` ke parser, database, preview, dan RPC.
- [x] Tambahkan `Dana/Tujuan` ke parser, database, preview, dan RPC.
- [x] Buat template Excel DKM dengan dropdown kategori.
- [x] Buat template Excel TPQ dengan dropdown kategori.
- [ ] Tambahkan validasi kombinasi kategori dan jenis transaksi.
- [ ] Wajibkan kode santri untuk SPP, pendaftaran, buku prestasi, dan seragam.
- [ ] Larang data pribadi santri dan wali pada kolom publik.
- [ ] Buat konverter file format lama.
- [x] Tampilkan total pemasukan, pengeluaran, dan perkiraan saldo akhir pada preview.
- [x] Tampilkan selisih rekonsiliasi sebelum tombol konfirmasi aktif.
- [ ] Tambahkan unduh laporan kesalahan impor.

### Deliverable

- template Excel DKM;
- template Excel TPQ;
- konverter laporan lama;
- preview impor dengan validasi baris dan rekonsiliasi.

### Gate Phase 1

- satu file DKM lolos preview tanpa kesalahan;
- satu file TPQ lolos preview tanpa kesalahan;
- total file cocok 100% dengan sumber Bendahara;
- tidak ada data pribadi TPQ pada output publik.

### Catatan penerapan

- 2 Agustus 2026: migration `202608020003_finance_classification_reconciliation.sql` dilaporkan berhasil dijalankan pada project Supabase `ialwxioqkylyacpvtxwz`.
- Migration menambah katalog kategori, `Subkategori`, dan `Dana/Tujuan` serta memperbarui RPC impor.
- Migration tidak mengaktifkan `finance_import_writes_enabled`; penyimpanan transaksi tetap nonaktif.
- 2 Agustus 2026: template resmi DKM dan TPQ dibuat dengan sheet petunjuk, area impor kosong, contoh terpisah, referensi kategori, dan dropdown validasi sampai 500 transaksi.

---

## Phase 2 - Keamanan dan Alur Persetujuan

Prioritas: **HIGH**  
Estimasi: **3-5 hari kerja**  
Status: **Lulus teknis - migration dan uji approval multi-user berhasil**

### Peran

| Peran | Kewenangan |
|---|---|
| Operator | Membuat draft, mengunggah file, memperbaiki kesalahan |
| Bendahara | Memeriksa, menyetujui, atau menolak |
| Ketua DKM | Melihat laporan dan menyetujui publikasi |
| Super Admin | Mengelola pengguna, role, dan konfigurasi |
| Viewer | Melihat data sesuai scope tanpa mengubahnya |

### Alur status

```text
Draft -> Diperiksa -> Disetujui -> Dipublikasikan
             |             |
             +-> Ditolak <-+
```

### Implementasi

- [x] Tambahkan status batch dan riwayat perubahan status.
- [x] Pisahkan permission DKM dan TPQ-finance.
- [x] Terapkan pemisahan pembuat dan penyetuju.
- [x] Wajibkan alasan penolakan.
- [x] Catat aktor, waktu, tindakan, dan perubahan pada audit trail.
- [x] Cegah perubahan langsung pada batch melalui browser; perubahan status hanya melalui RPC.
- [ ] Tambahkan mekanisme koreksi melalui reversal/versi baru.
- [ ] Tambahkan rate limit untuk impor dan persetujuan.
- [x] Tambahkan test kontrak role, self-approval, audit, dan akses RPC.
- [x] Tambahkan otoritas approval DKM/TPQ per pengguna yang hanya dapat dikelola Super Admin.
- [x] Gabungkan permission per-user ke permission efektif saat login.

### Otoritas approval per-user

- Super Admin dapat memberi atau mencabut `finance:approve` dan `tpq_finance:approve` kepada setiap pengguna aktif.
- Grant tidak mengubah role utama pengguna.
- Grant approval tidak memberikan hak publikasi.
- Seluruh pemberian dan pencabutan dilakukan melalui RPC dan dicatat pada audit trail.
- Browser tidak mempunyai akses langsung untuk menambah, mengubah, atau menghapus tabel grant.

### Catatan penerapan Phase 2

- 2 Agustus 2026: migration `202608020004_finance_approval_workflow.sql` dilaporkan berhasil dijalankan pada Supabase.
- 2 Agustus 2026: migration `202608020005_user_finance_approval_grants.sql` dilaporkan berhasil dijalankan pada Supabase.
- RPC commit impor tetap dicabut untuk role browser sampai diganti dan diuji pada Phase 3.
- 3 Agustus 2026: batch uji TPQ dibuat dan diajukan oleh akun Super Admin, kemudian disetujui oleh akun berbeda (`guru_tpq`) yang menerima grant `tpq_finance:approve`.
- Separation of duties terbukti pada simulasi manual: tombol approval tidak tersedia bagi pembuat batch dan tersedia bagi reviewer berbeda.

### Gate Phase 2

- seluruh pengujian authorization lulus;
- operator tidak dapat menyetujui batch sendiri;
- pengguna TPQ tidak dapat menulis data DKM dan sebaliknya;
- audit trail tidak dapat diubah melalui browser.

---

## Phase 3 - Uji Impor Supabase

Prioritas: **HIGH**  
Estimasi: **2-3 hari kerja**  
Status: **Berjalan - import, pengajuan, dan approval akun kedua berhasil; audit serta restore tertunda**

### Implementasi

- [x] Siapkan kontrak data dan akun uji terpisah.
- [ ] Ambil backup sebelum pengujian.
- [x] Tambahkan kill-switch kedua khusus mode uji dengan default nonaktif.
- [x] Tambahkan test kontrak batch valid dan permission test-only.
- [x] Uji otomatis format salah dan kolom hilang.
- [x] Uji otomatis nominal nol/negatif.
- [x] Tambahkan perlindungan referensi duplikat dalam file dan database.
- [x] Tambahkan idempotency hash untuk menolak file yang sama.
- [x] Tambahkan test pengguna tanpa permission dan pemisahan TPQ-finance.
- [x] Pastikan RPC bersifat atomik dan menangani unique violation tanpa partial import.
- [ ] Uji pembatalan dan pemulihan.
- [x] Tambahkan rekonsiliasi ulang di server terhadap saldo akhir Excel.
- [ ] Lakukan latihan restore backup.

### Gate Phase 3

- semua skenario uji lulus;
- tidak ada partial import;
- rekonsiliasi cocok 100%;
- backup berhasil dipulihkan;
- ada persetujuan Bendahara dan reviewer keamanan.

---

## Phase 4 - Dashboard Membaca Supabase

Prioritas: **HIGH**  
Estimasi: **3-5 hari kerja**  
Status: **Berjalan - read-model tunggal dan privacy projection diterapkan; query Supabase/UI tertunda**

### Implementasi

- [ ] Hubungkan KPI ke query Supabase.
- [ ] Hitung grafik saldo harian dari transaksi Supabase.
- [ ] Hitung donut komposisi dari transaksi Supabase.
- [ ] Hitung rekap kategori dari transaksi Supabase.
- [ ] Tampilkan tabel transaksi dengan pagination.
- [x] Tambahkan read-model tunggal agar KPI, saldo harian, kategori, dan tabel berasal dari dataset yang sama.
- [x] Hilangkan kode santri dan catatan internal dari projection read-model dashboard.
- [x] Tambahkan hook query Supabase dengan loading, empty, error, fallback, dan retry state.
- [x] Tampilkan snapshot batch TPQ terbaru yang disetujui dengan label eksplisit `Data uji`.
- [x] Tampilkan KPI, rekap kategori, saldo berjalan, dan tabel transaksi TPQ dari read-model yang sama.
- [x] Hubungkan pemilih periode DKM ke Supabase dengan fallback repository yang tetap terlihat jelas.
- [x] Adaptasikan KPI, grafik saldo harian, rekap kategori, dan tabel DKM agar menerima read-model yang sama.
- [ ] Tambahkan loading, empty, error, dan retry state.
- [ ] Tampilkan status `Draft`, `Terverifikasi`, atau `Dipublikasikan`.
- [ ] Pertahankan fallback repository selama masa transisi.
- [ ] Tambahkan pengujian rekonsiliasi UI terhadap query database.
- [ ] Uji tampilan desktop dan mobile.

### Gate Phase 4

- KPI, grafik, rekap, dan tabel memberikan hasil identik;
- tidak ada angka hardcoded pada mode Supabase;
- kegagalan jaringan tidak menampilkan data sebagai data resmi;
- tampilan mobile dapat digunakan tanpa horizontal overflow pada bagian utama.

---

## Phase 5 - Pilot Terbatas

Prioritas: **MEDIUM**  
Estimasi: **1 minggu**  
Status: **Alur teknis test-only TPQ terverifikasi 4 Agustus 2026; pilot operasional dan approval Bendahara belum selesai**

### Lingkup pilot

- satu periode keuangan DKM;
- satu periode keuangan TPQ;
- maksimal dua operator;
- satu Bendahara/reviewer;
- belum dipublikasikan ke website umum.

### Implementasi

- [ ] Berikan panduan singkat kepada operator.
- [x] Jalankan input manual dan impor Excel pada lingkungan test TPQ.
- [ ] Rekonsiliasi harian dengan buku kas/Excel asli.
- [ ] Catat kategori yang membingungkan.
- [ ] Catat kesalahan penggunaan dan hambatan antarmuka.
- [ ] Perbaiki temuan critical dan high.
- [ ] Minta persetujuan hasil pilot dari Bendahara.

### Fondasi teknis pilot

- [x] Riwayat batch hanya-baca untuk DKM dan TPQ.
- [x] Panduan operator pilot ditampilkan langsung pada dashboard DKM dan TPQ.
- [x] Riwayat batch dapat diekspor sebagai bukti pilot CSV yang privacy-safe dan tahan formula injection.
- [x] Dashboard kesiapan pilot merangkum rekonsiliasi, status review, publikasi, dan kelengkapan audit.
- [x] Detail sumber file, status workflow, saldo, dan selisih rekonsiliasi.
- [x] Jejak keputusan ditampilkan hanya kepada pengguna dengan `audit:read`.
- [x] Tidak menampilkan kode santri, catatan internal, atau snapshot audit mentah.
- [x] Paket manifest backup dan restore gate yang hanya-baca tersedia.
- [x] Runbook latihan restore dan kontrak koreksi tanpa hard delete tersedia.
- [x] Input manual TPQ, approval akun kedua, publikasi ledger, dan refresh read model terverifikasi end-to-end.
- [x] Proyeksi manual dan impor Excel tergabung pada satu ringkasan, kategori, saldo berjalan, dan tabel transaksi.
- [x] Perbaikan schema path `pgcrypto` diterapkan tanpa mutasi data dan publikasi ulang berhasil tanpa duplikasi.
- [ ] Latihan restore nyata pada target Supabase terisolasi dan persetujuan Bendahara.

### Gate Phase 5

- tidak ada selisih yang tidak dapat dijelaskan;
- alur dapat dijalankan operator tanpa bantuan developer;
- Bendahara menyetujui hasil pilot;
- tidak ada temuan keamanan critical/high yang terbuka.

---

## Phase 6 - Produksi dan Publikasi

Prioritas: **MEDIUM setelah seluruh gate lulus**  
Estimasi: **3-5 hari kerja**  
Status: **Belum dimulai**

### Implementasi

- [ ] Ambil backup production.
- [ ] Dokumentasikan prosedur rollback.
- [ ] Aktifkan penulisan secara terkontrol.
- [ ] Batasi publikasi pada data agregat yang disetujui.
- [ ] Pastikan referensi eksternal dan catatan internal tidak tampil publik.
- [ ] Pastikan kode santri dan data pembayaran individu tidak tampil publik.
- [ ] Aktifkan monitoring login, impor, approval, dan rekonsiliasi.
- [ ] Siapkan notifikasi kegagalan kritis.
- [ ] Sediakan panduan operator dan Bendahara.
- [ ] Lakukan review setelah minggu pertama production.

### Gate Phase 6

- backup dan rollback teruji;
- seluruh approval tersedia;
- monitoring aktif;
- DKM/security menyetujui go-live;
- tidak ada deploy atau push ke `main` tanpa otorisasi eksplisit.

## 5. Timeline Eksekusi

| Minggu | Fokus |
|---|---|
| Minggu 1 | Phase 0 dan awal Phase 1 |
| Minggu 2 | Penyelesaian Phase 1 dan Phase 2 |
| Minggu 3 | Phase 3 dan awal Phase 4 |
| Minggu 4 | Penyelesaian Phase 4 |
| Minggu 5 | Pilot Phase 5 |
| Minggu 6 | Perbaikan pilot dan persiapan Phase 6 |

Estimasi total: **4-6 minggu**, tergantung kecepatan verifikasi data dan persetujuan Bendahara/DKM.

## 6. Urutan Eksekusi Langsung

Urutan kerja teknis berikutnya:

1. Membuat kamus kategori DKM dan TPQ dalam kode/migration.
2. Menambahkan `Subkategori` dan `Dana/Tujuan` ke schema dan importer.
3. Membuat template Excel DKM dan TPQ.
4. Membuat fungsi rekonsiliasi saldo.
5. Menghasilkan laporan selisih untuk data contoh.
6. Menambahkan test untuk kategori, privacy, dan rekonsiliasi.
7. Meminta keputusan Bendahara hanya pada angka/selisih yang tidak dapat ditentukan dari sumber.

## 7. Definisi Selesai

Integrasi keuangan dinyatakan siap production hanya jika:

- seluruh phase gate lulus;
- angka telah disetujui Bendahara;
- tidak ada data pribadi TPQ pada output publik;
- seluruh write mempunyai authorization dan audit trail;
- backup/restore berhasil diuji;
- KPI, grafik, rekap, dan tabel berasal dari transaksi yang sama;
- test otomatis, build, dan uji pengguna lulus;
- DKM dan reviewer keamanan memberikan persetujuan go-live.
