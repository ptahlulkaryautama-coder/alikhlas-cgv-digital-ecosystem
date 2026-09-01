# Kontrak Input Keuangan Manual

Status: fondasi dan alur test-only terverifikasi; single-account operation aktif untuk mempercepat input sosial/internal; belum diotorisasi untuk produksi.

## Tujuan

Input manual melengkapi import Excel untuk transaksi satuan DKM dan TPQ. Keduanya harus berakhir pada read model dan grafik yang sama; tidak boleh ada buku kas paralel.

## Workflow

`Draft -> Dalam peninjauan -> Disetujui -> Dipublikasikan`

- Berdasarkan keputusan operasional, pembuat boleh melanjutkan approval/publish sendiri jika memiliki permission yang sesuai. Audit, versioning, dan kill switch tetap wajib.
- Draft dapat diedit atau diarsipkan, tetapi tidak dihapus permanen.
- Setelah disetujui, koreksi menggunakan reversal sesuai `FINANCE_CORRECTION_CONTRACT.md`; transaksi asli tidak diedit.
- Publikasi tetap merupakan langkah terpisah dari approval.

## Data wajib

- scope: `dkm` atau `tpq`
- periode dan tanggal transaksi
- arah: pemasukan atau pengeluaran
- kategori dan subkategori dari katalog Supabase
- dana/tujuan
- uraian publik yang tidak memuat data pribadi
- nominal positif
- metode pembayaran opsional
- referensi eksternal opsional dan unik
- kode santri hanya bila kategori TPQ memang mewajibkan, memakai kode opaque
- alasan/catatan internal opsional
- idempotency key, version, pembuat, reviewer, dan timestamp server

## Gate implementasi

1. Kill switch terpisah `finance_manual_test_mode_enabled` dan `finance_manual_writes_enabled`, default `false`.
2. Tabel draft manual private dengan RLS dan tanpa INSERT/UPDATE/DELETE browser.
3. Semua mutation melalui satu RPC atomik yang melakukan permission, state transition, optimistic version, rate limit, validasi katalog, dan audit.
4. Approval tidak langsung mengubah grafik; hanya publish yang memproyeksikan transaksi ke ledger/read model.
5. Publish wajib menemukan satu batch periode yang sah atau membuat batch manual terkontrol dengan opening/closing balance yang dapat direkonsiliasi.
6. DKM dan TPQ memakai izin scope yang berbeda.
7. Test data tidak pernah masuk proyeksi produksi/publik.

## Hasil verifikasi test-only — 4 Agustus 2026

- Dua akun berbeda berhasil menjalankan pemisahan tugas: pembuat, pemeriksa, dan keputusan tercatat pada workflow.
- Transaksi manual TPQ uji senilai Rp25.000 berhasil melalui `Draft -> Dalam peninjauan -> Disetujui -> Dipublikasikan`.
- Publikasi membuat tepat satu proyeksi ledger; jumlah transaksi periode uji berubah dari 3 menjadi 4.
- Satu read model memperbarui kas masuk uji dari Rp350.000 menjadi Rp375.000 dan saldo akhir uji dari Rp1.275.000 menjadi Rp1.300.000.
- Notifikasi keberhasilan tampil pada transaksi terkait dan snapshot keuangan diperbarui otomatis tanpa memuat ulang halaman secara manual.
- Gangguan awal `digest(text, unknown)` diperbaiki dengan resolusi `pgcrypto` melalui schema `extensions` pada migration `202608040012_fix_manual_finance_digest_path.sql`.
- Stepper operator ditambahkan di dashboard: isi transaksi, simpan draft, validasi, publikasikan ke ledger.
- Seluruh angka di atas adalah **data uji**, bukan angka keuangan produksi dan bukan persetujuan Bendahara.

Setelah bukti penutupan dicatat, kedua kill switch wajib dikembalikan ke `false`. Aktivasi produksi tetap memerlukan rekonsiliasi sumber Bendahara, latihan restore, dan persetujuan formal.
