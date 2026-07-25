# Rencana Migrasi & Perlindungan Privasi Modul TPQ Al Mardhotillah

Dokumen ini mendefinisikan strategi migrasi dan perlindungan privasi data santri untuk rekonstruksi modul **TPQ Al Mardhotillah** pada proyek **Masjid Al Ikhlas CGV v2**.

---

## 🔒 1. Kebijakan Privasi & Batasan Migrasi (Strict Privacy Policy)

> [!IMPORTANT]
> **FITUR YANG MEMBUTUHKAN SECURE DATABASE DILARANG DIMIGRASIKAN KE DALAM PROTOTYPE FRONTEND.**
>
> Aturan Privasi Komplit:
> 1. **Tanpa Nama Santri**: Tidak boleh menampilkan daftar nama anak di area manapun tanpa otentikasi backend.
> 2. **Tanpa Kontak Orang Tua**: Tidak ada nomor telepon atau alamat wali santri.
> 3. **Tanpa Nilai & Raport**: Tidak ada penginputan atau penampilan nilai perorangan.
> 4. **Tanpa Identitas Presensi**: Tidak ada presensi harian berbasis nama anak.
> 5. **Tanpa Data Pembayaran**: Tidak ada pembukuan SPP per individu santri.
> 6. **Tanpa Foto Pribadi**: Tidak ada foto anak kecuali foto dokumentasi kegiatan umum yang telah disetujui DKM.

---

## 🗺️ 2. Peta Komponen React & Klasifikasi Migrasi

### 🟢 A. Safe to Migrate Now (Akses Agregat & Informasi Umum)
Komponen ini aman dimigrasikan karena hanya menyajikan informasi struktural dan angka statistik tanpa PII:
- **`TPQOverviewBanner.jsx`**: Banner pengenalan TPQ Al Mardhotillah & Masjid Al Ikhlas CGV.
- **`TPQKPIGrid.jsx`**: Statistik agregat (Total Santri: 48, Total Kelompok: 4, Total Pengajar: 4, Kehadiran: 94%).
- **`TPQKelasGrid.jsx`**: Informasi nama kelompok belajar, jadwal mengajar, dan ruang kelas tanpa rincian nama santri.
- **`TPQKurikulumRoadmap.jsx`**: Peta jalan akademik (Iqra 1–6 & Juz 30) sebagai panduan belajar warga.
- **`TPQAgendaList.jsx`**: Kalender kegiatan TPQ (terklasifikasi runtime-safe via `src/utils/tpqDateUtils.js`).

### 🛑 B. Do Not Migrate (Requires Secure Database & Auth)
Komponen berikut **TIDAK DIMIGRASIKAN** sampai backend produksi dengan otentikasi & enkripsi database siap:
- `TPQSantriDirectory` — **DITUNDA** (Membutuhkan database terenkripsi & otentikasi wali/pengurus).
- `TPQStudentEvaluator` — **DITUNDA** (Mengandung nilai & catatan individu santri).
- `TPQRaportGenerator` — **DITUNDA** (Mengandung lembar nilai & predikat anak).
- `TPQAttendanceTracker` — **DITUNDA** (Mengandung identitas presensi harian per santri).
- `TPQPaymentLedger` — **DITUNDA** (Mengandung rincian SPP per individu).
- `TPQTeacherHonorarium` — **DITUNDA** (Mengandung gaji/insentif ustadz).
- `TPQDatabaseReset` — **DITUNDA** (Aksi destruktif tanpa otentikasi backend).

---

## 🛡️ 3. Pedoman Keamanan Frontend

- **Batas Tanggung Jawab (Scope Boundary)**: `src/` disesuaikan hanya pada komponen dan data layer TPQ yang aman.
- **Utility Klasifikasi Tanggal (`src/utils/tpqDateUtils.js`)**: Klasifikasi agenda (past vs future) dilakukan secara runtime-safe berdasarkan komponen tanggal lokal pengguna (`getLocalISODate`), menghindari masalah offset UTC midnight dan bebas dari tanggal review yang di-hardcode.
- **Tidak Ada Logika JS Legacy**: Script inline legacy pada `TPQ_v8.html` tidak disalin atau dieksekusi langsung ke dalam React.
- **Bilah Informasi Prototipe**: Halaman TPQ menampilkan pemberitahuan bahwa fitur buku penghubung digital & portal wali santri disiapkan pada pengembangan selanjutnya saat backend terenkripsi telah aktif.
