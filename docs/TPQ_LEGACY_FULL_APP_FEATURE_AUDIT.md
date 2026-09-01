# TPQ Legacy Full App Feature Audit

Sumber referensi: `C:/Users/lenovo/Downloads/TPQ_v8_raport_input (6).html`  
Status: referensi desain dan cakupan fitur; logic/data legacy tidak disalin langsung.

## Ringkasan

Versi HTML lama adalah sistem TPQ lengkap berbasis browser/localStorage. Modulnya jauh lebih luas dari placeholder App Pengampu awal.

Modul utama yang terdeteksi:

1. Beranda.
2. Santri.
3. Progres.
4. Raport.
5. Absensi.
6. Kelas.
7. Pengampu.
8. Evaluasi Pengampu.
9. Kas TPQ.
10. Agenda.
11. Laporan.
12. Setting.

Fitur operasional:

- Backup/export dan import data.
- Upload logo/foto.
- Dark mode dan ukuran font.
- Tahun ajaran.
- Print/cetak raport per kelas.
- Modal tambah/edit/delete untuk banyak modul.

## Storage legacy yang ditemukan

Legacy menyimpan data di `localStorage`:

- `tpq5_kelas`
- `tpq5_santri`
- `tpq5_eval`
- `tpq5_pengampu`
- `tpq5_raport`
- `tpq5_kas`
- `tpq5_agenda`
- `tpq5_absensi`
- `tpq5_eval_pengampu`
- `tpq5_absensi_pengampu`
- `tpq5_years`
- `tpq5_ay`
- `tpq5_id`
- `tpq5_logo`
- `tpq5_dark`
- `tpq5_fs`
- `tpq5_ph_*`

Di versi Supabase, data-data ini tidak boleh dipindahkan mentah ke `localStorage` karena berisi data anak, wali, absensi, nilai, dan catatan privat.

## Feature mapping ke versi React + Supabase

| Legacy module | Target React module | Supabase boundary | Public website |
|---|---|---|---|
| Beranda | Ringkasan Kepala TPQ/Pengampu | Agregat privat + projection aman | Agregat aman saja |
| Santri | Direktori privat santri | TPQ Private Vault / private tables | Tidak tampil |
| Progres | Catatan progres belajar | RPC privat + audit | Tidak tampil |
| Raport | Input dan print raport | RPC privat + report renderer | Tidak tampil |
| Absensi | Absensi kelas/santri | RPC privat + audit | Agregat aman bila disetujui |
| Kelas | Master kelas/kelompok | Private/admin config + public-safe projection | Jadwal umum |
| Pengampu | Master pengampu | Private/admin config | Nama staf hanya jika disetujui |
| Evaluasi Pengampu | Evaluasi internal staf | Private only | Tidak tampil |
| Kas TPQ | Keuangan TPQ | Finance ledger yang sudah dibuat | Ringkasan transparansi jika approved |
| Agenda | Agenda TPQ | Content agenda workflow | Agenda publik jika released |
| Laporan | Rekap internal | Read-only private reports | Tidak tampil |
| Setting | Identitas/tahun ajaran | Admin config | Sebagian identitas umum |

## Keputusan arsitektur

1. App Pengampu harus berkembang menjadi “TPQ Operating App”, bukan sekadar form kecil.
2. Fitur finance TPQ tidak perlu dibangun ulang dari legacy; sudah masuk jalur ledger/import/manual/correction yang lebih aman.
3. Fitur print Raport perlu dibangun sebagai renderer terpisah agar layout cetak stabil.
4. Data santri/wali/progres/absensi/raport/evaluasi pengampu harus tetap private.
5. Backup production tidak boleh berupa export localStorage tanpa proteksi. Backup harus berupa manifest/audit terkontrol.

## Rekomendasi phase implementasi

### Phase A - Shell dan navigasi

- Sidebar/segmen modul TPQ lengkap.
- Route internal untuk App Pengampu.
- Placeholder per modul tanpa data privat.

### Phase B - Master data privat

- Tahun ajaran.
- Kelas/kelompok.
- Pengampu.
- Direktori santri.

### Phase C - Operasional harian

- Absensi cepat.
- Progres belajar.
- Agenda internal.

### Phase D - Raport

- Input nilai.
- Rekap predikat.
- Preview raport.
- Print raport.

### Phase E - Laporan dan evaluasi

- Laporan kelas.
- Evaluasi pengampu.
- Export internal terproteksi.

### Phase F - Finance TPQ alignment

- Hubungkan Kas TPQ legacy concept ke ledger TPQ yang sudah dibuat.
- Jangan menyimpan SPP per anak di public projection.

## Risiko yang harus dijaga

- Jangan menampilkan nama anak/wali di website publik.
- Jangan masukkan data lama mentah ke repository frontend.
- Jangan memakai localStorage sebagai database privat.
- Jangan menambahkan hard delete untuk data akademik/finance.
- Jangan membuat print raport membaca data dari public endpoint.
