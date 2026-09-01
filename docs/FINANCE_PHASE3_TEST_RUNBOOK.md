# Panduan Uji Phase 3 - Impor Keuangan Test-Only

Status awal yang wajib: kedua flag **false** dan tidak ada data production yang digunakan.

## 1. Jalankan migration

Jalankan `202608020006_finance_test_import_rpc.sql` di Supabase SQL Editor.

Migration ini:

- menghapus RPC commit lama;
- memasang RPC `commit_finance_test_import`;
- membuat flag `finance_import_test_mode_enabled` dengan nilai `false`;
- menandai seluruh batch baru sebagai `test`;
- tidak mengaktifkan penyimpanan.

## 2. Siapkan dua akun berbeda

- Akun A: operator/pembuat batch.
- Akun B: pemeriksa/approver.

Super Admin memberi approval kepada Akun B melalui Pengaturan. Akun A dan Akun B tidak boleh akun yang sama.

## 3. Siapkan file uji

Gunakan template resmi. Isi 2-5 transaksi fiktif dan jangan memakai:

- data kas production;
- nama santri atau wali;
- nomor telepon;
- referensi rekening nyata;
- bukti transaksi nyata.

Gunakan referensi dengan awalan `TEST-`, misalnya `TEST-DKM-202608-0001`.

## 4. Aktifkan mode uji sementara

Jalankan hanya ketika operator sudah siap melakukan simulasi:

```sql
update public.integration_feature_flags
set enabled = true, updated_at = now(), updated_by = auth.uid()
where key in ('finance_import_writes_enabled', 'finance_import_test_mode_enabled');
```

Periksa hasil:

```sql
select key, enabled
from public.integration_feature_flags
where key in ('finance_import_writes_enabled', 'finance_import_test_mode_enabled')
order by key;
```

Kedua baris harus bernilai `true` hanya selama uji berlangsung.

## 5. Skenario wajib

1. File valid dan saldo cocok.
2. File yang sama diimpor dua kali - harus ditolak.
3. Saldo akhir pembanding salah - harus ditolak.
4. Transaksi di luar periode - harus ditolak.
5. Kategori tidak standar - harus ditolak.
6. Akun tanpa permission - harus ditolak.
7. Akun pembuat mencoba approval sendiri - harus ditolak.
8. Akun approver berbeda menyetujui - harus berhasil.

## 6. Matikan mode uji segera

Setelah simulasi, jalankan:

```sql
update public.integration_feature_flags
set enabled = false, updated_at = now(), updated_by = auth.uid()
where key in ('finance_import_writes_enabled', 'finance_import_test_mode_enabled');
```

Verifikasi kedua flag kembali `false`.

## 7. Bukti kelulusan

Catat:

- ID batch uji;
- nama akun operator dan approver;
- total pemasukan/pengeluaran fiktif;
- saldo awal, saldo akhir hitung, dan selisih;
- hasil setiap skenario;
- waktu flag diaktifkan dan dimatikan;
- bukti audit event.

Phase 3 belum lulus sebelum kedua flag kembali `false` dan seluruh skenario wajib tercatat.
