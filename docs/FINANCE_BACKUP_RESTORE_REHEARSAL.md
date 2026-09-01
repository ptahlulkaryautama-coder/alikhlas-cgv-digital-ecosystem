# Latihan Backup dan Restore Keuangan

Dokumen ini adalah panduan operator untuk membuktikan bahwa data keuangan dapat dipulihkan. Latihan harus dilakukan pada target terisolasi, bukan pada database utama.

## Batas keselamatan

- Pastikan `finance_import_writes_enabled` dan `finance_import_test_mode_enabled` bernilai `false`.
- Jangan memilih **Reset database**, menghapus project, atau menjalankan restore ke project utama.
- Jangan mengunduh backup ke folder publik atau membagikannya melalui chat/email.
- Backup mengandung data internal. Simpan terenkripsi dan batasi akses kepada Super Admin/Bendahara yang ditunjuk.
- Tidak ada hard delete. Koreksi keuangan kelak menggunakan reversal atau batch pengganti yang tetap meninggalkan audit trail.

## Yang perlu disiapkan

1. Super Admin Supabase.
2. Database target restore terpisah dengan label jelas, misalnya `AlIkhlas-Finance-Restore-Test`.
3. Folder lokal terenkripsi untuk file backup dan dua hasil manifest CSV.
4. Waktu mulai, nama operator, nama pemeriksa, dan nomor tiket/berita acara.

## A. Membuat baseline

1. Buka SQL Editor pada project utama.
2. Jalankan `supabase/rehearsal/finance_backup_manifest.sql`.
3. Unduh hasilnya sebagai `manifest-before.csv`.
4. Catat jumlah batch DKM, batch TPQ, transaksi, audit event, dan status kedua kill switch.
5. Jika salah satu kill switch aktif, hentikan latihan.

## B. Mengambil backup

Gunakan fasilitas backup resmi Supabase atau `pg_dump` dengan kredensial database yang hanya dimasukkan pada terminal lokal. Jangan menyimpan password dalam repository atau screenshot.

Backup minimal harus mencakup schema `public`, data, enum, function, policy RLS, trigger, serta tabel autentikasi yang diperlukan untuk target latihan. Catat waktu mulai dan selesai, ukuran file, serta SHA-256 file backup.

## C. Restore terisolasi

1. Pastikan URL/project reference target berbeda dari project utama.
2. Restore backup ke target latihan.
3. Jangan mengubah DNS, Netlify environment, atau konfigurasi aplikasi agar menunjuk ke target ini.
4. Segera pastikan kedua finance kill switch tetap `false`.
5. Jalankan `supabase/rehearsal/finance_restore_gate.sql`. Semua baris harus menghasilkan `pass = true`.
6. Jalankan kembali `finance_backup_manifest.sql` pada target dan simpan sebagai `manifest-after.csv`.

## D. Kriteria lulus

- `manifest-before.csv` dan `manifest-after.csv` mempunyai `row_count` serta `content_hash` identik pada setiap baris.
- Seluruh restore gate menghasilkan `true`.
- Login target latihan tidak digunakan untuk operasi produksi.
- Riwayat batch DKM dan TPQ dapat dibaca sesuai role.
- Jejak audit hanya terlihat oleh role dengan `audit:read`.
- Durasi restore dicatat dan dapat diterima oleh Bendahara/DKM.

## E. Berita acara singkat

Catat: tanggal, operator, pemeriksa, sumber backup, target restore, SHA-256 backup, waktu mulai/selesai, durasi, hasil manifest, hasil gate, temuan, keputusan lulus/gagal, dan tanda persetujuan Bendahara.

Jika satu pemeriksaan gagal, tandai latihan **gagal**, jangan mengaktifkan write atau publikasi, simpan bukti hasil, lalu lakukan analisis sebelum mengulang dengan backup baru.

