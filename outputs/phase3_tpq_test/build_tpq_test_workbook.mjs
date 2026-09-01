import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.dirname(fileURLToPath(import.meta.url));
const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Import_Transaksi");
sheet.showGridLines = false;

const headers = [
  "Tanggal", "Jenis", "Kategori", "Subkategori", "Dana/Tujuan", "Kode Santri",
  "Keterangan Publik", "Metode", "Nominal (Rp)", "Referensi Eksternal", "Status", "Catatan Internal",
];

sheet.getRange("A1:L1").merge();
sheet.getRange("A1").values = [["SIMULASI IMPOR KEUANGAN TPQ — DATA FIKTIF"]];
sheet.getRange("A2:L2").merge();
sheet.getRange("A2").values = [["Periode Agustus 2026 | Saldo awal Rp1.000.000 | Saldo akhir pembanding Rp1.275.000"]];
sheet.getRange("A4:L4").values = [headers];
sheet.getRange("A5:L7").values = [
  [new Date("2026-08-03T00:00:00Z"), "Pemasukan", "SPP", "SPP Bulanan", "Operasional TPQ", "TEST-SANTRI-001", "Pembayaran SPP fiktif", "Transfer", 200000, "TEST-TPQ-202608-0001", "Draft", "Khusus simulasi Phase 3"],
  [new Date("2026-08-05T00:00:00Z"), "Pemasukan", "Infaq TPQ", "Infaq Umum", "Operasional TPQ", "", "Infaq TPQ fiktif", "Tunai", 150000, "TEST-TPQ-202608-0002", "Draft", "Khusus simulasi Phase 3"],
  [new Date("2026-08-07T00:00:00Z"), "Pengeluaran", "ATK", "Alat Tulis", "Operasional TPQ", "", "Pembelian ATK fiktif", "Tunai", 75000, "TEST-TPQ-202608-0003", "Draft", "Khusus simulasi Phase 3"],
];

sheet.getRange("A1:L1").format = { fill: "#14532D", font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
sheet.getRange("A2:L2").format = { fill: "#DCFCE7", font: { color: "#166534" }, verticalAlignment: "center" };
sheet.getRange("A4:L4").format = { fill: "#166534", font: { bold: true, color: "#FFFFFF" }, wrapText: true, verticalAlignment: "center" };
sheet.getRange("A5:L7").format = { font: { color: "#0000FF" }, verticalAlignment: "center" };
sheet.getRange("A5:A7").format.numberFormat = "yyyy-mm-dd";
sheet.getRange("I5:I7").format.numberFormat = "#,##0;[Red](#,##0);-";
sheet.getRange("A4:L7").format.borders = { preset: "inside", style: "thin", color: "#D1D5DB" };
sheet.getRange("A1:L7").format.autofitColumns();
sheet.getRange("A1:L7").format.autofitRows();
sheet.getRange("A:A").format.columnWidth = 14;
sheet.getRange("C:C").format.columnWidth = 18;
sheet.getRange("D:E").format.columnWidth = 20;
sheet.getRange("F:F").format.columnWidth = 20;
sheet.getRange("G:G").format.columnWidth = 26;
sheet.getRange("J:J").format.columnWidth = 24;
sheet.getRange("L:L").format.columnWidth = 24;
sheet.freezePanes.freezeRows(4);

const inspect = await workbook.inspect({ kind: "table", range: "Import_Transaksi!A1:L7", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 12 });
console.log(inspect.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 50 }, summary: "formula errors" });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: "Import_Transaksi", range: "A1:L7", scale: 1.5, format: "png" });
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/Simulasi_Import_Keuangan_TPQ_Agustus_2026.xlsx`);
