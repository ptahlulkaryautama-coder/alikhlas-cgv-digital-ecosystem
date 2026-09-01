# TPQ Private Data Vault Contract

Status: foundation siap di kode; belum dijalankan di Supabase dan belum dipasang ke UI operator.

## Tujuan

Menyiapkan boundary database untuk data individual TPQ yang sensitif, tanpa mencampurnya dengan website publik atau projection TPQ agregat.

Fondasi ini dibuat sebagai brankas privat:

- default terkunci melalui feature flag;
- RLS aktif;
- tidak ada insert/update/delete langsung dari browser;
- semua perubahan wajib lewat RPC terproteksi;
- semua aksi diaudit;
- public website tidak membaca tabel ini.

## Prinsip privasi

1. Website publik tetap hanya membaca projection aman/agregat.
2. Data individual tidak boleh masuk bundle frontend publik.
3. Tabel privat memakai `opaque_code`, bukan identitas yang mudah ditebak.
4. Payload sensitif harus disegel/encrypted sebelum disimpan.
5. Kepala TPQ dan Super Admin dapat disiapkan sebagai pemegang akses awal; role lain harus diberi akses secara sadar.
6. Archive dipakai untuk menutup record; hard delete tidak disediakan sebagai operasi dashboard.

## Objek yang disiapkan

- Migration: `supabase/migrations/202608120027_tpq_private_vault_foundation.sql`
- Verification: `supabase/rehearsal/tpq_private_vault_foundation_verification.sql`
- Trial enable: `supabase/rehearsal/tpq_private_vault_trial_enable.sql`
- Trial disable: `supabase/rehearsal/tpq_private_vault_trial_disable.sql`
- Field decision template: `docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md`
- Table: `tpq_private_records`
- RPC capability: `tpq_private_capabilities()`
- RPC command: `command_tpq_private_record(...)`
- Feature flags:
  - `tpq_private_read_enabled`
  - `tpq_private_writes_enabled`

## Gate sebelum trial

1. DKM/Kepala TPQ menyetujui daftar field yang boleh disimpan.
2. Tentukan kebijakan consent, retention, dan backup data anak.
3. Tentukan metode sealing/encryption payload sebelum data masuk database.
4. Jalankan migration.
5. Jalankan verification dan pastikan semua `pass = true`.
6. Aktifkan trial hanya ketika operator yang berwenang siap mengetes.
7. Matikan lagi trial flag setelah selesai.

## Non-goal fase ini

- Belum membuat direktori data anak di UI.
- Belum membuat portal wali.
- Belum mengimpor data historis.
- Belum menampilkan data privat apa pun di website publik.
- Belum membuat export raport atau presensi individual.

## Catatan untuk operator non-teknis

Fitur ini seperti membuat lemari arsip yang terkunci. Lemarinya disiapkan dulu, tetapi belum boleh diisi sebelum aturan penyimpanan data anak disepakati.
