# Kontrak Koreksi Keuangan

Status: foundation dan UI siap di kode; migration Supabase belum dijalankan.

## Prinsip

- Transaksi dan batch asli tidak diubah atau dihapus.
- Koreksi dibuat sebagai reversal yang mengimbangi nilai lama dan entri pengganti bila diperlukan.
- Koreksi wajib menyebut batch/transaksi sumber, alasan, bukti, pembuat, pemeriksa, dan waktu server.
- Aturan awal "pembuat tidak boleh menyetujui koreksinya sendiri" sudah diganti oleh keputusan single-account release untuk operasional sosial masjid.
- Single-account release diperbolehkan sesuai keputusan operasional DKM, tetapi tetap harus melalui audit dan permission.
- Koreksi mengikuti workflow `draft -> under_review -> approved -> published`; UI dapat merangkai submit, approve, dan publish untuk akun berotoritas.
- Idempotency key wajib mencegah koreksi ganda akibat klik ulang atau retry jaringan.
- Satu transaksi tidak boleh mempunyai dua koreksi aktif.

## Implementasi yang sudah disiapkan

1. Migration `202608120026_finance_correction_reversal_foundation.sql`.
2. RPC `finance_correction_capabilities(scope)`.
3. RPC `command_finance_correction(...)`.
4. Tabel draft koreksi dan receipt idempotency.
5. RLS aktif dan browser role tidak punya akses insert/update/delete langsung.
6. Publish membuat batch ledger baru bertipe `correction`.
7. Reversal dan transaksi pengganti ditulis sebagai transaksi baru; transaksi sumber tidak diedit.
8. UI tersedia di Keuangan DKM dan TPQ dengan alur operator: pilih transaksi, isi alasan, simpan draft, publikasikan reversal.

## Gate sebelum trial Supabase

1. Latihan backup/restore dinyatakan lulus sebelum koreksi dipakai untuk data production.
2. Jalankan migration `supabase/migrations/202608120026_finance_correction_reversal_foundation.sql`.
3. Jalankan verification `supabase/rehearsal/finance_correction_foundation_verification.sql`.
4. Pastikan semua hasil verification `true`.
5. Baru aktifkan flag trial melalui `supabase/rehearsal/finance_correction_trial_enable.sql`.
6. Setelah trial selesai, matikan lagi melalui `supabase/rehearsal/finance_correction_trial_disable.sql`.

Hard delete dan edit langsung pada `finance_transactions` tetap dilarang.
