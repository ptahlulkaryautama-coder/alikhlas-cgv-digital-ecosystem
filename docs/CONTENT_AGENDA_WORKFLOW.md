# Content Agenda Workflow

Agenda & Kalender memakai `content_agenda` di Supabase dengan perubahan melalui RPC server-side saja. Browser tidak memperoleh hak `insert`, `update`, atau `delete` langsung.

## Alur

1. Operator membuat atau mengubah Draft pada lingkungan `test`.
2. Operator mengajukan pemeriksaan.
3. Akun yang memiliki otoritas konten dapat menandai agenda sebagai `Siap publik`. Berdasarkan keputusan operasional DKM, approval akun kedua tidak diwajibkan untuk agenda sosial masjid.
4. Agenda berstatus `Siap publik` tetap tidak tampil di website selama `environment = test`.
5. Rilis ke website production tetap dilakukan terpisah dari Pusat Rilis Website.
6. Agenda yang batal harus dibatalkan dengan alasan. Data diarsipkan atau dipulihkan tanpa hard delete.

## Pengaman

- Dua kill switch default `false`: `content_agenda_writes_enabled` dan `content_agenda_test_mode_enabled`.
- Single-account approval diperbolehkan untuk mempercepat workflow konten sosial, tetapi tetap memerlukan permission, versioning, kill switch, dan audit.
- Versi wajib cocok untuk mencegah penimpaan perubahan baru.
- Kunci idempotensi mencegah perintah ganda.
- Maksimal 30 perintah per akun dalam 15 menit.
- Semua aksi dicatat di `audit_events`.
- Proyeksi publik hanya menerima `production + Publik + Siap publik`.
- Tidak tersedia hard delete.

## Urutan uji terbatas

1. Jalankan migrasi `202608050016_content_agenda_workflow.sql`.
2. Jalankan `content_agenda_foundation_verification.sql`.
3. Aktifkan kedua switch dengan `content_agenda_trial_enable.sql`.
4. Buat Agenda test, preview kalender, lalu tandai `Siap publik` memakai akun berwenang.
5. Verifikasi Agenda test tidak muncul pada website publik.
6. Matikan kedua switch dengan `content_agenda_trial_disable.sql`.
