# TPQ Private Vault Decision Checklist

Last updated: 2026-08-21

Dokumen ini adalah checklist keputusan sebelum data santri, wali, absensi, progres, raport, dan evaluasi pengampu boleh masuk Supabase.

Tujuannya sederhana: app TPQ boleh lengkap, tetapi data anak harus diperlakukan seperti arsip privat, bukan seperti konten website.

## Status saat ini

- App TPQ stand-alone shell sudah ada.
- Semua modul masih aman/dummy/read-only.
- TPQ Private Vault SQL sudah disiapkan di repo, tetapi belum boleh dijalankan tanpa keputusan ini.
- Website publik tidak menerima data privat TPQ.

## Prinsip utama

1. Data anak tidak tampil di website publik.
2. Data anak tidak disimpan di `localStorage`.
3. Data anak tidak masuk bundle frontend.
4. Semua perubahan data privat harus lewat RPC Supabase yang diaudit.
5. Export/print harus punya alasan, role, dan catatan audit.
6. Hard delete tidak digunakan dari dashboard; arsip lebih aman.

## Keputusan 1 — Identitas santri yang boleh tampil

Rekomendasi awal: gunakan nama panggilan + kode opaque, bukan nama lengkap di semua layar harian.

| Opsi | Dampak |
| --- | --- |
| Kode opaque saja | Paling aman, tetapi pengampu bisa kurang nyaman saat input cepat |
| Nama panggilan + kode opaque | Seimbang untuk operasional harian |
| Nama lengkap | Lebih nyaman, tetapi risiko privasi lebih tinggi |

Keputusan:

- [ ] Kode opaque saja
- [ ] Nama panggilan + kode opaque
- [ ] Nama lengkap terbatas untuk role tertentu

## Keputusan 2 — Akses pengampu

Rekomendasi awal: pengampu hanya melihat kelas yang diampu.

| Opsi | Dampak |
| --- | --- |
| Hanya kelas yang diampu | Paling aman dan sesuai kebutuhan harian |
| Semua kelas TPQ | Lebih fleksibel, tetapi perlu kontrol lebih ketat |
| Semua data hanya Kepala TPQ | Aman, tetapi pengampu tidak bisa kerja mandiri |

Keputusan:

- [ ] Pengampu hanya melihat kelas yang diampu
- [ ] Pengampu bisa melihat semua kelas
- [ ] Hanya Kepala TPQ yang melihat semua kelas

## Keputusan 3 — Data wali santri

Rekomendasi awal: data wali tidak tampil di app pengampu biasa. Hanya Kepala TPQ/Admin terbatas.

Data yang mungkin disimpan:

- Nama wali
- Nomor kontak
- Relasi dengan santri
- Catatan komunikasi penting

Keputusan:

- [ ] Data wali tidak dimasukkan dulu
- [ ] Data wali dimasukkan, hanya Kepala TPQ/Admin
- [ ] Data wali dimasukkan, pengampu melihat sebagian

## Keputusan 4 — Absensi

Rekomendasi awal: simpan status hadir/izin/sakit/alfa, sesi, kelas, pengampu, dan catatan singkat yang sopan.

Data yang boleh:

- Tanggal sesi
- Kode santri
- Status hadir/izin/sakit/alfa
- Kode kelas
- Kode pengampu
- Catatan singkat

Data yang sebaiknya tidak ditulis:

- Alasan keluarga yang sensitif
- Kondisi kesehatan detail
- Catatan yang mempermalukan anak

Keputusan:

- [ ] Absensi hanya status
- [ ] Absensi status + catatan singkat
- [ ] Absensi status + catatan terbatas Kepala TPQ

## Keputusan 5 — Progres belajar

Rekomendasi awal: catat checkpoint belajar dan tindak lanjut, bukan penilaian keras.

Data yang boleh:

- Jalur belajar: Iqra, Al-Qur’an, Hafalan, Adab
- Checkpoint: halaman/surat/materi
- Tindak lanjut
- Catatan sopan dari pengampu

Keputusan:

- [ ] Progres hanya checkpoint
- [ ] Progres checkpoint + tindak lanjut
- [ ] Progres checkpoint + tindak lanjut + catatan pengampu

## Keputusan 6 — Raport dan print

Rekomendasi awal: print raport hanya untuk wali santri yang bersangkutan, bukan export massal bebas.

Aturan minimum:

- Print harus tercatat di audit.
- File/PDF tidak otomatis public.
- Tidak ada link publik untuk raport privat.
- Template raport disetujui Kepala TPQ.

Keputusan:

- [ ] Print manual dari halaman pengampu/kepala TPQ
- [ ] Generate PDF per santri dengan audit
- [ ] Export massal hanya untuk Kepala TPQ/Super Admin

## Keputusan 7 — Evaluasi pengampu

Rekomendasi awal: evaluasi pengampu hanya untuk Kepala TPQ dan Super Admin, bukan untuk semua pengampu.

Data yang boleh:

- Kehadiran mengajar
- Kesiapan materi
- Catatan pembinaan
- Tindak lanjut

Keputusan:

- [ ] Evaluasi hanya Kepala TPQ
- [ ] Evaluasi Kepala TPQ + Super Admin
- [ ] Evaluasi dapat dilihat pengampu masing-masing

## Keputusan 8 — Retensi data

Rekomendasi awal:

- Absensi: minimal 1 tahun ajaran.
- Progres dan raport: selama santri aktif + arsip terbatas.
- Evaluasi pengampu: 1–2 tahun atau sesuai keputusan DKM/TPQ.

Keputusan:

- [ ] 1 tahun ajaran
- [ ] Selama santri aktif
- [ ] Selama santri aktif + arsip terbatas

## Keputusan 9 — Backup dan restore

Rekomendasi awal: backup boleh, tetapi harus tercatat dan tidak dibagikan bebas.

Checklist:

- [ ] Backup hanya oleh role tertentu
- [ ] Backup mencatat siapa/kapan/alasan
- [ ] Restore rehearsal dilakukan di data test
- [ ] File backup privat tidak dikirim via grup umum

## Keputusan 10 — Portal wali santri

Rekomendasi awal: jangan dibuat dulu sampai App Pengampu dan private vault stabil.

Keputusan:

- [ ] Belum dibuat
- [ ] Dirancang setelah pilot pengampu
- [ ] Dibuat bersamaan, tetapi read-only terbatas

## Checklist sebelum menjalankan SQL

SQL TPQ Private Vault boleh dijalankan jika:

- [ ] Field data yang boleh disimpan sudah disetujui.
- [ ] Role akses sudah disetujui.
- [ ] Retensi data sudah disetujui.
- [ ] Aturan export/print sudah disetujui.
- [ ] Aturan backup/restore sudah disetujui.
- [ ] DKM/Kepala TPQ paham bahwa data anak tidak tampil di website publik.
- [ ] Trial hanya memakai data dummy/opaque dulu.

## File SQL yang akan dipakai setelah checklist disetujui

- Migration: `supabase/migrations/202608120027_tpq_private_vault_foundation.sql`
- Verification: `supabase/rehearsal/tpq_private_vault_foundation_verification.sql`
- Trial enable: `supabase/rehearsal/tpq_private_vault_trial_enable.sql`
- Trial disable: `supabase/rehearsal/tpq_private_vault_trial_disable.sql`

## Rekomendasi Codex

Untuk pilot pertama, pilih konfigurasi aman ini:

1. Nama panggilan + kode opaque.
2. Pengampu hanya melihat kelas yang diampu.
3. Data wali belum dimasukkan dulu.
4. Absensi status + catatan singkat.
5. Progres checkpoint + tindak lanjut.
6. Raport print per santri dengan audit.
7. Evaluasi pengampu hanya Kepala TPQ + Super Admin.
8. Export dan backup tetap terkunci sampai pilot stabil.
