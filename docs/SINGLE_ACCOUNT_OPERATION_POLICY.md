# Single-Account Operation Policy

Keputusan operasional DKM: Artikel, media, Program, Agenda, import keuangan, pencatatan keuangan manual, dan modul TPQ mendatang tidak mewajibkan approval akun kedua.

## Alur

`Input → Preview/validasi → Publikasikan → Edit/koreksi bila diperlukan`

## Pengaman yang tidak dihapus

- Supabase Auth dan permission per modul.
- RLS dan pemisahan proyeksi publik/pribadi.
- Kill switch dan isolasi `test`/`production`.
- Validasi server, version checking, idempotency, rate limit, dan audit before/after.
- Rekonsiliasi file keuangan sebelum publikasi.
- Arsip/pulihkan tanpa hard delete.
- Ledger yang sudah terbit dikoreksi dengan entri koreksi/reversal agar jejak lama tidak hilang.
- Data santri tetap privat; tidak pernah masuk proyeksi website publik.

Migration `202608100017_single_account_workflows.sql` menghapus larangan self-approval pada workflow lama dan mengizinkan pemilik dengan write permission menyelesaikan publikasi. Nama kolom audit lama seperti `reviewed_by` dipertahankan untuk kompatibilitas, tetapi dapat berisi akun operator yang sama.
