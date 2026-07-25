# Finance Data Backlog & Verification Audit

Dokumen ini mencatat ketidaksesuaian/diskrepansi data keuangan yang ditemukan pada proyek Masjid Al Ikhlas CGV v2. Mengikuti arahan audit, seluruh nilai angka **TIDAK DIUBAH ATAU DIKALKULASI ULANG** pada tugas ini, melainkan dicatat di sini untuk diverifikasi bersama pihak pengurus/bendahara DKM.

---

## Daftar Diskrepansi Data Keuangan

### 1. Perhitungan Jumlah Transaksi Periode Juni 2026
- **File / Komponen**: `src/data/siteContent.js` (`financePeriods.juni2026`) & `src/components/transparency/FinanceSummary.jsx`
- **Periode**: Juni 2026
- **Nilai Terpampang**: 
  - `kasMasuk`: Rp 12.850.000 (`24 transaksi`)
  - `kasKeluar`: Rp 7.650.000 (`18 transaksi`)
  - `transactionCount`: 24
- **Isu Ditemukan**: Tabel rincian transaksi mock `mockTransactionsJuni` di `dashboardMockData.js` memiliki 42 entri transaksi, namun meta data `transactionCount` menyebutkan 24 transaksi. Perlu konfirmasi total transaksi riil dari buku kas fisik DKM.
- **Status**: `Pending source verification`

---

### 2. Duplikasi Struktur Transaksi Juni 2026 & Mei 2026
- **File / Komponen**: `src/data/dashboardMockData.js` (`mockTransactionsJuni` & `mockTransactionsMei`)
- **Periode**: Mei 2026 & Juni 2026
- **Nilai Terpampang**:
  - Juni 2026 Row 1: `27 Jun · Infaq Sholat Idul Adha · Rp 4.874.000`
  - Mei 2026 Row 1: `27 Mei · Infaq Sholat Idul Adha · Rp 4.874.000`
- **Isu Ditemukan**: Seluruh baris transaksi pada `mockTransactionsJuni` identik dengan `mockTransactionsMei` (deskripsi, kategori, dan nominal), hanya nama bulan yang diubah. Ini mengindikasikan data transaksi Juni 2026 menggunakan data placeholder duplikat dari Mei 2026.
- **Status**: `Pending source verification`

---

### 3. Target Anggaran vs Realisasi Penggunaan Kas
- **File / Komponen**: `src/data/dashboardMockData.js` (`mockAnggaran`) & `src/components/donation/DonationKpi.jsx`
- **Periode**: Juni 2026
- **Nilai Terpampang**:
  - Operasional Masjid: Realisasi `Rp 3.250.000` / Target `Rp 7,8 jt` (42%)
  - Pendidikan & TPQ: Realisasi `Rp 1.700.000` / Target `Rp 7,5 jt` (22%)
  - Kebersihan & Fasilitas: Realisasi `Rp 1.450.000` / Target `Rp 7,8 jt` (19%)
  - Sosial & Kegiatan: Realisasi `Rp 1.250.000` / Target `Rp 7,2 jt` (17%)
- **Isu Ditemukan**: Total target anggaran (Rp 30,3 jt) dan persentase yang ditampilkan (`42%`, `22%`, `19%`, `17%`) mengacu pada porsi terhadap total pengeluaran (Rp 7.650.000), bukan persentase pencapaian terhadap nilai target rupiah. Target nominal rupiah masih bersifat ilustratif.
- **Status**: `Pending source verification`

---

### 4. Pembulatan Ringkasan Transparansi Homepage
- **File / Komponen**: `src/data/siteContent.js` (`transparencyStats`) & `src/components/website/TransparencyPreview.jsx`
- **Periode**: Juni 2026
- **Nilai Terpampang**:
  - `Dana Masuk`: `Rp 12,85 jt`
  - `Dana Terpakai`: `Rp 7,65 jt`
  - `Alokasi Dana`: `59% terpakai`
- **Isu Ditemukan**: Persentase `59% terpakai` berasal dari `7.650.000 / 12.850.000 = 59,53%` (dibulatkan ke bawah menjadi 59%). Angka pembulatan ini dipertahankan tepat sesuai data awal.
- **Status**: `Pending source verification`
