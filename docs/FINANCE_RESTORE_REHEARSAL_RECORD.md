# Berita Acara Latihan Restore Keuangan

Status: baseline sumber tercatat pada 4 Agustus 2026; latihan ditunda untuk menghemat kuota project Supabase. Target restore terisolasi belum dibuat dan fitur koreksi ledger tetap terkunci.

## Batas keselamatan

- Project sumber adalah project integrasi Al Ikhlas saat ini dan tidak boleh dijadikan target restore.
- Target wajib berupa project Supabase berbeda dengan label jelas `AlIkhlas-Finance-Restore-Test`.
- Aplikasi lokal, Netlify, dan website publik tidak boleh diarahkan ke target latihan.
- Seluruh kill switch penulisan keuangan wajib `false` sebelum dan sesudah restore.
- File backup dan hasil manifest harus disimpan privat; jangan dimasukkan ke repository.

## Baseline sumber — 4 Agustus 2026

| Dataset | Baris | SHA-256 manifest |
|---|---:|---|
| `finance_audit_events` | 8 | `a2e6543fd69b5114636b2eb733f86f27eaf2d3deeaa8d86d423efbd214ae59a9` |
| `finance_feature_flags` | 4 | `45142645a24219b5b17eb3bf28577d15df6edb37e21a6d386d4f40c1a4724659` |
| `finance_import_batches` | 2 | `bad42201de16b06e047433c13496b6986942288f701b33802df76ac7b1f73e01` |
| `finance_manual_command_receipts` | 4 | `3815a4753ebacdeac56c7de14a0fa7690d3b10e07dd0800870ee2463fa095e91` |
| `finance_manual_entries` | 1 | `d56a451cfff125d3a4fb4a97a0d934ff20f437faf481473a18d26edc3b2242a1` |
| `finance_transactions` | 4 | `d35bfd945b58e99ac2f2552aa99221469da7d5b96f7ed356970e889b21fc3dff` |

Hash di atas merupakan bukti integritas, bukan bukti persetujuan angka keuangan produksi.

## Isian setelah restore

- Project reference target:
- Operator:
- Pemeriksa:
- Waktu mulai:
- Waktu selesai:
- Durasi:
- SHA-256 file backup:
- Semua pemeriksaan `finance_restore_gate.sql` lulus:
- Manifest sesudah restore identik:
- Temuan:
- Keputusan Bendahara/DKM:

Latihan belum boleh dinyatakan lulus sebelum seluruh isian selesai dan setiap hash sesudah restore identik dengan baseline.
