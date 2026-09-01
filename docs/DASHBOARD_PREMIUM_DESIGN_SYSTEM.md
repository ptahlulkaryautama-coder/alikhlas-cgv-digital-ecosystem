# Dashboard Premium Design System

Status: **Aktif — source of truth UI internal**  
Versi: **1.0 / 3 Agustus 2026**

## Arah visual

Dashboard memakai karakter **quiet premium, trustworthy, operational**: hijau hutan sebagai identitas, ivory hangat untuk ruang kerja, dan emas hanya sebagai aksen keputusan/status penting. Kualitas premium dibangun melalui hierarchy, ritme, kontras, dan detail interaksi—bukan dekorasi berlebihan.

## Prinsip

1. Satu primary action per konteks keputusan.
2. Semua target interaktif minimum 44px dan mempunyai hover, pressed, focus-visible, serta disabled state.
3. Spacing mengikuti skala 4/8: `4, 8, 12, 16, 24, 32, 40, 48`.
4. Radius: kontrol `10-12px`, kartu `16-20px`, panel utama `24px`.
5. Shadow hanya tiga tingkat: surface, elevated, overlay.
6. Status selalu berupa teks + warna; warna tidak menjadi satu-satunya petunjuk.
7. Angka keuangan memakai tabular figures.
8. Mobile tidak boleh memiliki horizontal overflow pada layout utama.
9. Motion 150-240ms dan menghormati `prefers-reduced-motion`.
10. Data prototype, fallback, test, approved, dan published harus selalu dibedakan secara eksplisit.

## Token utama

- Forest 950 `#08291c`
- Forest 900 `#0d3826`
- Forest 700 `#17603f`
- Gold 500 `#c6a15b`
- Ivory 50 `#fbfaf6`
- Ivory 100 `#f5f1e8`
- Ink `#10251b`
- Muted `#667b70`
- Border `rgba(20, 72, 47, .12)`

## Urutan penerapan

1. Dashboard shell: sidebar, prototype rail, topbar, page canvas.
2. Shared primitives: buttons, cards, inputs, pills, tables. **Diterapkan 3 Agustus 2026.**
3. Finance DKM/TPQ and approval workflow. **Diterapkan 3 Agustus 2026.**
4. Program, agenda, reports, documents, inventory, settings. **Shared layer diterapkan 3 Agustus 2026; penghapusan inline style berjalan bertahap.**
   - Program dan Agenda: inline style sudah dihapus seluruhnya pada 3 Agustus 2026.
   - Laporan & Arsip: inline style dikurangi dari 28 menjadi maksimal 5 pada 3 Agustus 2026.
   - Pengaturan: inline style dikurangi dari 58 menjadi 5 nilai warna tema yang bersifat dinamis pada 3 Agustus 2026; form dan informasi sistem kini memakai primitive responsif bersama.
5. Mobile QA and removal of obsolete inline styles.

## Anti-pattern

- emoji sebagai structural icon;
- status badge besar tanpa hierarchy;
- kartu kosong berukuran berlebihan;
- raw hex baru di JSX;
- tombol aktif yang terlihat disabled;
- placeholder sebagai satu-satunya label;
- shadow/radius acak per halaman;
- data test yang tampak seperti laporan resmi.
