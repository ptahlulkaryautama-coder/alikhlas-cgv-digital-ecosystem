# TPQ Stand-alone Pilot Evidence Pack

Last updated: 2026-08-21

## Kesimpulan

App Pengampu TPQ sudah layak untuk pilot UI aman dengan data dummy/opaque. Pilot ini belum berarti sistem siap menerima data anak asli.

Status saat ini:

- Route internal tersedia: `/app/tpq/pengampu`.
- Route alias stand-alone tersedia: `/app/tpq/app`.
- Akses route memakai permission `tpq:read`.
- UI modul lengkap sudah terbentuk dari Beranda sampai Setting.
- Kas TPQ membaca finance read model yang sudah aman.
- Agenda membaca data public-safe.
- Modul akademik, raport, absensi, progres, santri, dan evaluasi pengampu belum membaca data privat.
- Print/export produksi masih terkunci.
- TPQ Private Vault SQL belum boleh dijalankan sampai checklist policy data anak disetujui.

## Bukti implementasi

| Area | Evidence | Catatan |
| --- | --- | --- |
| Route internal | `src/App.jsx` | Route `/app/tpq/pengampu` dan `/app/tpq/app` diarahkan ke App Pengampu TPQ. |
| Permission route | `src/services/accessPolicy.js` | Kedua route dilindungi permission `tpq:read`. |
| Shell halaman | `src/pages/TPQPengampu.jsx` | Memuat modul Beranda, Santri, Progres, Raport, Absensi, Kelas, Pengampu, Evaluasi Pengampu, Kas TPQ, Agenda, Laporan, Setting. |
| Beranda operator | `src/components/tpq/TPQPengampuHomeOverview.jsx` | Shortcut harian hanya memindahkan modul, bukan menyimpan data. |
| Alur akademik | `src/components/tpq/TPQAcademicFlowPreview.jsx` | Mengikat alur dummy/opaque `Absensi → Progres → Raport` tanpa data privat. |
| Student session pipeline | `src/components/tpq/TPQStudentSessionPipeline.jsx` | Simulasi satu kode santri opaque dari Absensi → Progres → Raport tanpa identitas anak. |
| Class mentor bridge | `src/components/tpq/TPQClassMentorEvaluationBridge.jsx` | Menghubungkan `Kelas → Pengampu → Evaluasi` dengan label dummy tanpa identitas staf. |
| Handoff sesi | `src/components/tpq/TPQDailySessionHandoffPreview.jsx` | Ringkasan akhir sesi dummy untuk review absensi, progres, dan bahan raport. |
| Readiness per modul | `src/components/tpq/TPQModulePilotChecklist.jsx` | Menampilkan status UI shell, data dummy, private vault, dan write RPC per modul. |
| Pilot readiness | `src/components/tpq/TPQPilotReadinessPreview.jsx` | Panel indikator; tidak menjalankan SQL dan tidak membuka private vault. |
| Role journey | `src/components/tpq/TPQRoleJourneyPreview.jsx` | Peta kerja Pengampu, Kepala TPQ, Bendahara TPQ, dan Admin DKM untuk pilot UI; di Beranda tombolnya hanya memindahkan modul awal tiap role. |
| Module action map | `src/components/tpq/TPQModuleActionMap.jsx` | Panduan per modul berisi aksi yang boleh dicoba, fitur yang masih terkunci, dan tautan modul terkait tanpa membaca/menulis data privat. |
| Raport preview | `src/components/tpq/TPQRaportPrintPreview.jsx` | Preview cetak memakai data dummy/opaque; belum memanggil `window.print`. |
| Raport print readiness | `src/components/tpq/TPQRaportPrintReadinessChecklist.jsx` | Checklist field, akses, audit print, dan output wali sebelum raport asli dicetak. |
| Absensi & progres | `src/components/tpq/TPQAttendanceQuickDraft.jsx`, `src/components/tpq/TPQProgressQuickDraft.jsx` | Mock input disabled sampai private vault aktif. |
| Kas TPQ | `src/components/tpq/TPQFinanceMiniSnapshot.jsx` | Read-only dari finance read model, tanpa detail pembayaran individu. |
| Agenda TPQ | `src/components/tpq/TPQAgendaMiniPreview.jsx` | Read-only dari agenda public-safe. |
| Laporan | `src/components/tpq/TPQReportsMiniPreview.jsx` | Export terkunci dan tidak memuat data privat. |
| Report assembly | `src/components/tpq/TPQReportAssemblyPreview.jsx` | Blueprint laporan bulanan/semester dari Absensi, Progres, Raport, Kas TPQ, dan Agenda tanpa export aktif. |
| Setting | `src/components/tpq/TPQSettingsMiniPreview.jsx` | Memuat backup readiness, restore rehearsal runbook, policy gate, pilot readiness, dan role matrix. |
| Runbook pilot | `docs/TPQ_STANDALONE_PILOT_RUNBOOK.md` | Panduan uji aman tanpa data privat. |
| Policy checklist | `docs/TPQ_PRIVATE_VAULT_DECISION_CHECKLIST.md` | Keputusan wajib sebelum data anak boleh masuk Supabase. |
| Field matrix | `docs/TPQ_PRIVATE_FIELD_MATRIX_TEMPLATE.md` | Template jenis field, status awal, dan akses awal sebelum private vault aktif. |

## Bukti batas privasi

Saat ini sistem sengaja menjaga batas berikut:

- tidak ada nama santri asli;
- tidak ada nama/nomor wali;
- tidak ada alamat;
- tidak ada absensi individu asli;
- tidak ada nilai/progres anak asli;
- tidak ada catatan perilaku anak asli;
- tidak ada pembayaran/SPP individu;
- tidak ada data pengampu personal;
- tidak ada public website projection dari modul privat TPQ;
- tidak ada direct browser mutation ke tabel private TPQ;
- tidak ada penyimpanan data privat ke `localStorage`;
- tidak ada print raport produksi.

## Skenario pilot yang sudah aman

Pilot aman boleh dilakukan untuk:

1. membuka route App TPQ;
2. mencoba navigasi modul;
3. mengecek apakah alur pengampu mudah dipahami;
4. mencoba tombol shortcut yang hanya pindah modul;
5. melihat alur `Absensi → Progres → Raport`;
6. melihat handoff sesi dummy setelah kelas;
7. mencoba shortcut role journey yang hanya berpindah modul;
8. melihat preview raport dummy;
9. melihat draft absensi/progres dummy;
10. melihat ringkasan Kas TPQ read-only;
11. melihat Agenda TPQ public-safe;
12. melihat Setting, role matrix, backup readiness, policy gate, dan pilot readiness;
13. mencatat feedback layout dan istilah.

## Skenario yang belum boleh

Jangan lakukan hal berikut sebelum policy data anak disetujui:

1. memasukkan nama anak asli;
2. memasukkan nomor wali/alamat;
3. mengunggah raport asli;
4. mencetak raport asli;
5. mengimpor data absensi/progres historis;
6. membuat export yang berisi data individu;
7. menjalankan TPQ Private Vault SQL di Supabase;
8. memberi akses semua kelas ke semua pengampu tanpa keputusan role;
9. menampilkan data anak di website publik;
10. memakai `localStorage` sebagai database TPQ.

## Exit gate menuju Private Vault Pilot

Lanjut ke TPQ Private Vault Pilot hanya jika:

- DKM/Kepala TPQ menyetujui checklist data anak;
- field list santri/wali/absensi/progres/raport sudah disepakati;
- template field private vault sudah ditandai field wajib, opsional, dan ditunda;
- role akses pengampu sudah disepakati;
- retensi data sudah disepakati;
- aturan export/print sudah disepakati;
- backup/restore rehearsal siap;
- semua test lokal tetap hijau.

## Verifikasi teknis terakhir

Per 2026-08-21:

- `npm run build` sukses;
- `npm test` sukses: 206/206 passed;
- test `TPQ standalone pilot runbook allows safe dry-run without private data or SQL` lulus;
- test `TPQ private vault decision checklist is non-technical and blocks SQL until policy approval` lulus.
