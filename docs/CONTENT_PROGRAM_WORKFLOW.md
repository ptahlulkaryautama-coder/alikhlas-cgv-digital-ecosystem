# Workflow Program & Kegiatan Supabase

Status: alur test-only terverifikasi, single-account approval aktif, dan release center production tersedia; write switch tetap mati saat tidak trial.

## Boundary

- Semua mutasi melalui `command_content_program`; browser tidak memperoleh INSERT/UPDATE/DELETE langsung.
- `content_program_writes_enabled` dan `content_program_test_mode_enabled` default `false`.
- Program hasil trial selalu `environment = test` dan dikecualikan dari policy baca website publik.
- Workflow: `Draft -> Dalam peninjauan -> Siap publik` atau `Ditolak`.
- Berdasarkan keputusan operasional DKM, satu akun berwenang cukup untuk menandai program sosial sebagai `Siap publik`. Rilis production tetap dilakukan terpisah melalui Pusat Rilis Website.
- Penghapusan permanen tidak tersedia; hanya arsip dan restore.
- Optimistic version, idempotency receipt, rate limit, dan audit event diterapkan pada setiap command.

## Hasil trial — 5 Agustus 2026

- `Uji Integrasi Program Masjid` berhasil dibuat dan disimpan ulang setelah refresh.
- Preview form, edit draft, submit review, dan approval akun kedua berhasil.
- Status akhir `Siap publik`, visibility `Pengurus`, environment `test`, version `4`.
- Pembuat dan reviewer terisi serta berbeda.
- Program tetap dikecualikan dari proyeksi publik.
- Empat audit event tercatat.
- Refresh UI diperbaiki agar menunggu pembacaan Supabase selesai sebelum aksi dinyatakan selesai.
- Panel workflow dipadatkan, status sumber dibuat ringkas, CTA duplikat/read-only lama dihapus, dan stepper operator ditambahkan: tambah/edit, preview, siap publik, rilis dari Pengaturan.

Label `Siap publik` pada lingkungan test berarti konten telah lolos pemeriksaan, bukan telah dipublikasikan ke website. Aktivasi production memerlukan gate dan keputusan terpisah.
