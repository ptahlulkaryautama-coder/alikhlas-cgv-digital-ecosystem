# Panduan Eksekusi Supabase untuk Pengurus Non-Developer

## Tujuan

Supabase akan menjadi satu sumber data untuk Web publik, Dashboard pengurus, dan TPQ. Tahap pertama ini hanya membangun pagar keamanan dan struktur akun. Belum ada data Program, data santri, atau data keuangan yang dipindahkan.

## Istilah sederhana

- **Database**: lemari data online.
- **Table**: laci data, misalnya daftar akun.
- **Auth**: pemeriksa identitas saat login.
- **Role**: jabatan akun, misalnya Sekretaris atau Kepala TPQ.
- **Permission**: tindakan yang boleh dilakukan jabatan tersebut.
- **RLS**: satpam di setiap laci database. Walaupun seseorang mengetahui alamat database, ia hanya bisa mengambil baris yang diizinkan.
- **Migration**: instruksi SQL bernomor urut untuk membangun atau mengubah database secara terkendali.
- **Audit event**: catatan siapa melakukan apa dan kapan.

## Yang sudah dibuat di repository

1. `supabase/config.toml`: konfigurasi pengembangan lokal.
2. Migration `202608010001_auth_permissions_audit_foundation.sql`.
3. Tabel `profiles`, `role_permissions`, `user_roles`, dan `audit_events`.
4. Delapan role: Super Admin, Ketua DKM, Sekretaris, Bendahara, Humas, Kepala TPQ, Guru TPQ, dan Viewer.
5. RLS dan explicit database grants.
6. Client React yang hanya menerima URL dan publishable key.
7. Automated tests untuk menjaga finance dan data pribadi TPQ tetap di luar migration ini.

## Status online per 2 Agustus 2026

- Project Supabase khusus Masjid Al Ikhlas sudah terhubung.
- Migration foundation sudah diterapkan melalui SQL Editor.
- Empat tabel foundation dan seluruh RLS dasarnya sudah diverifikasi.
- Self-signup dan anonymous sign-in sudah dinonaktifkan.
- Belum ada akun Auth aplikasi atau data bisnis.
- Bukti teknis tercatat di `docs/SUPABASE_FOUNDATION_DEPLOYMENT_RECORD.md`.

## Yang belum dilakukan

- Belum membuat akun pengurus.
- Belum memindahkan data Sheets.
- Belum mengaktifkan tombol tambah, edit, arsip, atau hapus.
- Belum menyentuh angka keuangan ataupun data individu TPQ.

## Tindakan yang dibutuhkan dari pemilik project pada checkpoint berikutnya

1. Tentukan satu orang sebagai pemilik akun Supabase organisasi/DKM.
2. Buat project Supabase baru khusus Masjid Al Ikhlas. Jangan memakai database Portal Warga.
3. Pilih region terdekat yang disetujui DKM.
4. Simpan password database di password manager; jangan kirim melalui chat atau commit Git.
5. Dari **Project Settings → API**, salin:
   - Project URL
   - Publishable key (atau legacy anon key jika dashboard masih memakai format lama)
6. Nilai tersebut nanti dimasukkan ke `.env.local`, bukan `.env.example`.
7. Jangan pernah memasukkan `service_role` atau secret key ke variabel yang diawali `VITE_`.

Codex dapat memandu layar demi layar ketika project Supabase online akan dibuat. Jangan menjalankan SQL sendiri sebelum migration dan RLS tests dinyatakan lulus.

## Gate sebelum tahap Program

- Migration dapat dijalankan pada database test kosong.
- Akun baru otomatis mendapat profile berstatus `invited`.
- Akun invited dan suspended tidak mendapat permission.
- Hanya Super Admin yang dapat menetapkan role.
- Pengguna tidak dapat meningkatkan status atau role sendiri.
- Browser tidak dapat menulis langsung ke audit log.
- Build dan semua contract tests lulus.

## Rollback tahap ini

Tahap ini belum diterapkan online sehingga rollback cukup dilakukan di Git. Setelah migration diterapkan online, migration yang sudah dijalankan tidak boleh diedit; koreksi harus dibuat sebagai migration baru bernomor lebih besar.
