# Workflow Artikel Kabar Masjid

Status: workflow test-only, media privat, single-account approval, archive/restore, dan release candidate sudah terverifikasi; write switch tetap mati saat tidak trial.

Alur: `Draft -> Dalam peninjauan -> Siap publik`. Artikel dapat `Ditolak`, diperbaiki sebagai draft baru, atau dipindahkan ke `Arsip`. Tombol “Delete” pada antarmuka harus berarti **Arsipkan**, bukan hard delete. Artikel arsip dapat dipulihkan menjadi Draft.

Setiap perintah memakai autentikasi Supabase, permission, optimistic version, idempotency key, audit event, dan kill switch `content_article_writes_enabled`. Berdasarkan keputusan operasional DKM, konten sosial masjid boleh ditandai siap publik oleh satu akun yang berwenang. Release ke website production tetap menjadi langkah terpisah di Pusat Rilis Website.

Website publik hanya boleh membaca artikel dengan `workflow_status = Siap publik`, `visibility = Publik`, dan `archived_at is null`.

Migration utama: `202608030007_content_articles_workflow.sql`. Jangan mengaktifkan kill switch di luar trial terkontrol. Aktivasi production membutuhkan backup/restore operasional, review konten, dan approval DKM/security.

## Trial terisolasi

Migration `202608030008_content_article_test_isolation.sql` memisahkan artikel `test` dari artikel `production`. Kebijakan baca publik hanya menerima `environment = 'production'`, sehingga artikel trial tidak tampil di website publik meskipun status workflow-nya sudah disetujui.

Aktifkan trial hanya dengan `supabase/rehearsal/content_article_trial_enable.sql`. Setelah pengujian selesai atau jika terjadi anomali, jalankan `supabase/rehearsal/content_article_trial_disable.sql`. Untuk konten sosial masjid, satu akun berwenang cukup untuk menandai siap publik; data test tetap tidak masuk website sampai dirilis dari Pusat Rilis Website.

## Hasil trial 3 Agustus 2026

- Create, live preview, save draft, edit, dan submit review lulus.
- Approval memakai akun berbeda dan separation of duties lulus.
- Archive, restore, reject dengan alasan, revisi, submit ulang, dan approval ulang lulus.
- Artikel uji tetap `environment = test` dan tidak muncul pada portal publik setelah disetujui.
- Bukti database menunjukkan creator dan reviewer berbeda, public projection tertutup, version bertambah, dan audit event tercatat.
- Otorisasi editorial per pengguna tidak mengubah role utama `guru_tpq`.
- Setelah trial, `content_article_writes_enabled` dan `content_article_test_mode_enabled` dikembalikan ke `false`.

Kesimpulan: workflow artikel test dinyatakan lulus. Aktivasi produksi tetap membutuhkan keputusan terpisah, backup/restore operasional, media-storage policy, dan persetujuan DKM/security.

## Fondasi upload foto privat — 4 Agustus 2026

Migration `202608040013_content_article_private_test_media.sql` menambahkan media artikel test-only dengan ketentuan:

- bucket `content-article-test-media` selalu privat;
- hanya JPG, PNG, dan WebP, maksimal 5 MB;
- object path diawali UID pembuat dan nama file memakai UUID;
- upload memerlukan `content:write` serta tiga kill switch test aktif;
- artikel menyimpan object path, bukan signed URL sementara;
- preview admin memakai signed URL satu jam; pembaca anonim tidak mendapat policy baca;
- penautan media hanya untuk artikel test milik pembuat yang masih `Draft` atau `Ditolak`;
- optimistic version, idempotency receipt, dan audit event wajib;
- kegagalan attach memicu pembersihan object orphan oleh browser pemilik.

Fondasi tetap default mati. Aktivasi trial memakai `content_article_media_trial_enable.sql`, dan penutupan wajib memakai `content_article_media_trial_disable.sql`. Media test tidak dipromosikan otomatis ke website publik.

### Hasil trial media — 5 Agustus 2026

- Artikel `uji-media-artikel-masjid` berhasil dibuat, diedit, diberi media privat, diajukan, dan disetujui menggunakan dua akun berbeda.
- Environment tetap `test`, status akhir `Siap publik`, dan akses `Pengurus`.
- Object media terbukti ada di bucket privat dan `cover_image_path` tidak kosong.
- Separation of duties, pengecualian dari proyeksi publik, serta signed preview untuk reviewer semuanya terverifikasi.
- Versi akhir artikel `6`, dengan `6` audit event dan tepat `1` audit event attach media.
- Perbaikan policy Storage `202608050014_fix_content_media_storage_policy.sql` menghilangkan akses langsung role browser ke tabel feature flag privat.
- UI slug, preview foto inline, dan label artikel test diperbaiki berdasarkan trial operator.

Hasil ini membuktikan alur test-only. Rilis production dilakukan melalui Pusat Rilis Website; konten test tidak tampil publik sebelum disalin secara eksplisit ke environment production.
