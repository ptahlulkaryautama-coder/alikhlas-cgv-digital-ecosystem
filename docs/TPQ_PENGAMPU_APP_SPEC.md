# TPQ Pengampu App Spec

Status: product spec siap; shell operasional semua menu utama sudah punya preview aman/read-only; implementasi data privat penuh belum dimulai.

## Tujuan

Membuat app operasional TPQ yang lengkap seperti referensi HTML legacy, tetapi dibangun ulang dengan React + Supabase + privacy boundary.

App ini harus mencakup akademik, operasional, keuangan TPQ, laporan, dan cetak raport.

App ini bukan website publik. App ini adalah workspace internal untuk pengampu/Kepala TPQ yang login.

## Stand-alone app direction

App TPQ bisa dipisahkan menjadi pengalaman stand-alone, misalnya route internal `/app/tpq/app`, route publik-terproteksi `/tpq-app`, atau subdomain khusus seperti `tpq.alikhlascgv...`, tanpa kehilangan integrasi dengan Dashboard DKM.

Prinsipnya:

- Stand-alone di sisi tampilan dan navigasi, agar pengampu tidak perlu masuk ke dashboard DKM yang kompleks.
- Tetap memakai Supabase Auth, role, permission, RLS, RPC, dan audit trail yang sama.
- Tetap memakai finance ledger TPQ yang sama, bukan buku kas kedua.
- Tetap memakai Agenda/Kabar/Program public projection yang sama jika ada konten yang perlu tampil ke warga.
- Data santri, absensi, nilai, wali, dan raport tetap berada di private vault/area privat; tidak disalin ke website publik.

Dengan model ini, TPQ terasa seperti aplikasi sendiri, tetapi secara keamanan dan data tetap satu ekosistem.

## Pengguna utama

- Pengampu TPQ / Guru TPQ
- Kepala TPQ
- Super Admin untuk monitoring dan bantuan teknis

## Prinsip desain

1. Mobile-first; pengampu kemungkinan input dari HP setelah kelas.
2. Satu layar = satu tugas.
3. Tidak ada data anak di website publik.
4. Data anak/wali hanya tampil sesuai role dan kebijakan privacy.
5. Input cepat, bisa draft, dan bisa dikoreksi.
6. Audit tetap aktif.
7. Jangan bergantung pada WhatsApp/manual chat sebagai sumber final.

## Modul fase 1

### 1. Beranda Pengampu / Kepala TPQ

Isi:

- Jadwal mengajar hari ini.
- Kelompok yang diampu.
- Ringkasan santri aktif.
- Ringkasan absensi/progres.
- Ringkasan kas TPQ yang berasal dari ledger aman.
- Checklist tugas cepat:
  - catat kehadiran,
  - catat progres/iqra/hafalan,
  - catatan untuk Kepala TPQ,
  - lihat agenda TPQ.

### 2. Absensi cepat

Target:

- Pilih kelas/sesi.
- Tandai hadir/izin/sakit/alfa.
- Simpan draft.
- Kirim untuk rekap Kepala TPQ.

Catatan:

- Nama anak hanya boleh tampil di app privat setelah policy disetujui.
- Public dashboard hanya boleh melihat agregat, misalnya persentase hadir per kelas.

### 3. Progres belajar

Target:

- Catat level Iqra/Al-Qur'an.
- Catat hafalan.
- Catat catatan pendek pengampu.

Catatan:

- Catatan sensitif harus hati-hati dan tidak boleh tampil publik.
- Perlu template pilihan agar bahasa catatan sopan dan tidak merendahkan anak.

### 4. Agenda dan pengumuman internal

Target:

- Pengampu melihat agenda TPQ.
- Kepala TPQ bisa memberi pengumuman internal.

Catatan:

- Pengumuman untuk wali/public tetap lewat workflow Kabar/Agenda, bukan langsung dari app pengampu.

## Modul lengkap target

Mengacu ke HTML legacy `TPQ_v8_raport_input (6).html`, target jangka menengah meliputi:

| Area | Modul | Target |
|---|---|---|
| Utama | Beranda | Ringkasan akademik, kas, aktivitas, dan jadwal |
| Akademik | Santri | Direktori privat santri, status, kelas, kurikulum |
| Akademik | Progres | Capaian Iqra/Al-Qur’an/hafalan dan catatan pengampu |
| Akademik | Raport | Input nilai, preview raport, print raport |
| Akademik | Absensi | Absensi santri per kelas/periode |
| Akademik | Kelas | Kelompok belajar, jadwal, ruang, wali kelas/pengampu |
| SDM TPQ | Pengampu | Data pengampu, jadwal, peran |
| SDM TPQ | Evaluasi Pengampu | Absensi pengampu dan penilaian internal |
| Operasional | Kas TPQ | Read model dari ledger TPQ, input tetap lewat finance workflow |
| Operasional | Agenda | Agenda TPQ internal/public-safe |
| Lainnya | Laporan | Rekap kelas, absensi, progres, kas, dan raport |
| Lainnya | Setting | Identitas lembaga, tahun ajaran, preferensi tampilan |
| Utilitas | Backup/Import | Diganti dengan backup manifest terproteksi, bukan localStorage bebas |

## Modul fase berikutnya

- Buku penghubung wali.
- Raport digital.
- Dokumen administrasi santri.
- Export rekap semester.
- Portal wali santri.

## Data boundary

Data yang boleh tampil di app pengampu setelah private vault siap:

- Opaque child reference atau nama sesuai policy internal.
- Kelas/kelompok yang diampu.
- Status kehadiran.
- Progres belajar.
- Catatan internal terbatas.

Data yang tidak boleh tampil di website publik:

- Nama anak.
- Nama/nomor wali.
- Alamat.
- Presensi individu.
- Nilai/progres individu.
- Catatan perilaku.
- Pembayaran/SPP individu.

## Arsitektur yang disarankan

1. Route internal: `/app/tpq/pengampu`.
2. Permission minimal: `tpq:read`.
3. Fitur tulis privat butuh permission baru, misalnya `tpq:private_write`.
4. Semua mutasi lewat RPC Supabase, bukan direct table mutation.
5. Data sensitif memakai TPQ Private Data Vault atau tabel privat terenkripsi/tersegel.
6. Public projection tetap terpisah dan hanya agregat.
7. Print Raport memakai renderer khusus dari data privat yang sudah diotorisasi.
8. Kas TPQ memakai finance ledger yang sudah dibuat; jangan membuat buku kas privat terpisah tanpa rekonsiliasi.

## Step implementasi

1. Buat placeholder route dan halaman pengampu. ✅
2. Tampilkan peta modul lengkap tanpa data privat.
2a. Buat Beranda Pengampu yang menggabungkan shortcut tugas harian aman dan preview stand-alone mobile app. ✅ awal
3. Jalankan private vault migration setelah kebijakan disetujui.
4. Buat schema tahun ajaran, kelas, pengampu, dan santri privat.
5. Buat UI absensi dummy/test. ✅ awal
6. Buat UI progres dummy/test. ✅ awal
7. Buat preview dan print raport dari data dummy/test. ✅ workflow preview awal
8. Buat preview kelas dan peran pengampu dummy/test. ✅ awal
9. Buat preview direktori Santri private-vault tanpa data anak. ✅ awal
10. Buat preview Evaluasi Pengampu private-only tanpa data personal. ✅ awal
11. Hubungkan Kas TPQ ke finance read model. ✅ read-only awal
12. Hubungkan Agenda TPQ ke agenda public-safe read-only. ✅ awal
13. Buat preview Laporan TPQ dummy/read-only. ✅ awal
14. Buat preview Setting TPQ dummy/read-only untuk arah stand-alone. ✅ awal
15. Siapkan route alias internal `/app/tpq/app` untuk arah stand-alone. ✅ awal
16. Siapkan runbook dan evidence pack pilot aman tanpa data privat. ✅ awal
17. Uji dengan akun `guru_tpq` dan `kepala_tpq`.
18. Pastikan public bundle tidak berisi data privat.

## Keputusan yang masih perlu dari DKM/TPQ

1. Apakah pengampu boleh melihat nama santri lengkap, atau cukup nama panggilan/kode?
2. Apakah wali santri akan punya portal sendiri?
3. Berapa lama catatan absensi/progres disimpan?
4. Siapa yang boleh export laporan?
5. Apakah semua pengampu melihat semua kelas, atau hanya kelas yang diampu?
