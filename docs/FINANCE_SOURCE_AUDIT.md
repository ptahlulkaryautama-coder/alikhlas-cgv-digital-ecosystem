# Finance Source-of-Truth Audit Report

**Date of Audit**: 2026-07-25  
**Project**: Masjid Al Ikhlas CGV Digital Ecosystem  
**Audit Scope**: Verification of financial data sources, reconciliation of conflicting period figures (May & June 2026), transaction-level audit, calculation integrity, and evidence validation.  
**Audit Policy**: Strictly read-only audit. No runtime financial figures or application code in `src/` have been modified during this phase.

---

## 1. Executive Findings

1. **Absence of Official Authoritative Financial Source**:  
   The directory `private-source/finance/` is absent in the repository. No physical or digital financial report carrying official authorization (e.g., signed PDF by Bendahara DKM Al Ikhlas) was identified in the repository codebase.

2. **Unresolved May 2026 Figures Across 5 Evidence Layers**:  
   Financial figures for May 2026 are disputed across five distinct software and data layers:
   - **Layer 1 (UI Summary Cards in `siteContent.js`)**: Stated Income Rp 19.431.000, Expense Rp 8.268.292, Ending Balance Rp 11.162.708.
   - **Layer 2 (JavaScript Transaction Array `mockTransactionsMei` in `dashboardMockData.js`)**: 42 records, calculated Income Rp 19.431.000, calculated Expense Rp 6.149.396, calculated Ending Balance Rp 13.281.604 (Expense is lower by Rp 2.118.896 because utility bills PLN Rp 1.885.896 & WiFi Rp 233.000 were omitted from the JS array).
   - **Layer 3 (Excel Master Data Sheet `02_Keuangan` in `Master_Data_V1_Al_Ikhlas_Digital_Ecosystem.xlsx`)**: 44 records (IDs 1–44), calculated Income Rp 19.431.000, calculated Expense Rp 8.268.292, calculated Ending Balance Rp 11.162.708.
   - **Layer 4 (Legacy HTML Static Dashboard `DKM Al Ikhlas.html`)**: Stated Income Rp 19.069.526, Expense Rp 5.599.396, Ending Balance Rp 13.470.130 (32 entries recorded).
   - **Layer 5 (Derived Calculations)**: Ratios derived from card summaries (e.g., `59% terpakai`, `42%` operasional allocation share).  
   *Conclusion*: **Belum dapat ditetapkan sebagai data resmi.** Neither version or evidence layer can be declared canonical without signed physical/digital documentation from the DKM Treasurer (Bendahara).

3. **Severe June 2026 Data Discrepancy**:  
   - The June 2026 summary card ([`siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L162-L190)) displays: Income Rp 12.850.000, Expense Rp 7.650.000, Surplus Rp 5.200.000, Transaction Count: 24.
   - The backing transaction array (`mockTransactionsJuni` in [`dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L183-L226)) contains **42 records** totaling Income Rp 19.431.000 and Expense Rp 6.149.396.
   - Empirical analysis confirms `mockTransactionsJuni` is a 100% copy-paste clone of `mockTransactionsMei` with only date label string replacements (`27 Mei` $\rightarrow$ `27 Jun`).

4. **Cross-Period Continuity Breakdown**:  
   The June 2026 reported ending balance (Rp 5.200.000) reflects solely June's net monthly cash flow ($12.850.000 - 7.650.000 = 5.200.000$) and ignores carry-over balance from May 2026 (whether Version A Rp 13.470.130 or Layer 1/3 Rp 11.162.708).

5. **Misleading Budget Realization Calculations**:  
   The "Realisasi Anggaran" percentages in [`dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L58-L63) (`42%`, `22%`, `19%`, `17%`) compute each category's share of total monthly expenditure ($\text{Category Expense} / \text{Total Expense}$), rather than performance against an approved budget target. No approved budget target document exists in the repository.

---

## 2. Source Inventory

The following table inventory maps every financial data source identified across the codebase:

| Filename / Source | Relative Path | File Type | Period | Apparent Author / Origin | Revision / Timestamp | Data Content |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `FINANCE_DATA_BACKLOG.md` | [`docs/FINANCE_DATA_BACKLOG.md`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/docs/FINANCE_DATA_BACKLOG.md) | Markdown | May–June 2026 | Developer / Auditor | 2026-07-25 | Discrepancy backlog documentation |
| `DKM Al Ikhlas.html` | [`Legacy/dashboard/DKM Al Ikhlas.html`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/Legacy/dashboard/DKM%20Al%20Ikhlas.html#L1250-L1270) | HTML / JS Static | May 2026 | Initial Prototype Developer | Legacy Version | Summary card (Layer 4) + 32-line table |
| `Master_Data_V1_Al_Ikhlas_Digital_Ecosystem (2) (2).xlsx` | [`Legacy/data/Master_Data_V1_Al_Ikhlas_Digital_Ecosystem (2) (2).xlsx`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/Legacy/data/Master_Data_V1_Al_Ikhlas_Digital_Ecosystem%20(2)%20(2).xlsx) | Excel Spreadsheet | May 2026 | DKM System Architect (Sheet `02_Keuangan`) | Master V1 | 44 transaction records (Layer 3) |
| `siteContent.js` | [`src/data/siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L134-L236) | JavaScript Data | May–June 2026 | Frontend Developer | App Runtime | Summary cards (`mei2026` & `juni2026` - Layer 1) |
| `dashboardMockData.js` | [`src/data/dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L20-L270) | JavaScript Data | Jan–June 2026 | Frontend Developer | App Runtime | Summary KPI, chart data, 42-item mock transaction arrays (Layer 2 & 5) |
| `documentsData.js` | [`src/data/documentsData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/documentsData.js#L55-L61) | JavaScript Data | Dec 2025–May 2026 | Frontend Developer | App Runtime | Metadata references to LPJ and internal audit files |
| `DonationKpi.jsx` | [`src/components/donation/DonationKpi.jsx`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/components/donation/DonationKpi.jsx#L4-L37) | React Component | June 2026 | Frontend Developer | App Runtime | Hardcoded KPI values & achievement ratio (Layer 5) |
| `api.js` | [`src/services/api.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/services/api.js#L184-L260) | JavaScript Service | June 2026 | Backend / GAS Connector | App Runtime | GAS API connector (`02_Keuangan` fetch logic) |

---

## 3. Evidence Hierarchy Classification

1. **Authoritative Official Source**:  
   - *Status*: **NONE FOUND IN REPOSITORY**.  
   - *Criteria*: Signed PDF report from Bendahara DKM, stamped bank statement, or verified live Google Apps Script production database.
2. **Official but Superseded / Legacy Draft**:  
   - [`Legacy/dashboard/DKM Al Ikhlas.html`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/Legacy/dashboard/DKM%20Al%20Ikhlas.html#L1250-L1270) (Layer 4).
   - [`Legacy/data/Master_Data_V1_Al_Ikhlas_Digital_Ecosystem (2) (2).xlsx`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/Legacy/data/Master_Data_V1_Al_Ikhlas_Digital_Ecosystem%20(2)%20(2).xlsx) (Layer 3).
3. **Provisional Working Source**:  
   - [`src/data/siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L134-L190) (Layer 1: `financePeriods.mei2026` & `juni2026`).
4. **Derived Calculation**:  
   - `transparencyStats` in [`siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L192-L197) (Layer 5: `59% terpakai`).
   - `mockAnggaran` in [`dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L58-L63) (Layer 5: `42%`, `22%`, `19%`, `17%`).
   - `DonationKpi` achievement in [`DonationKpi.jsx`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/components/donation/DonationKpi.jsx#L8) (Layer 5: `85.6%`).
5. **UI Mock / Demo Data**:  
   - `mockTransactionsJuni` and `mockTransactionsMei` in [`dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L183-L271) (Layer 2).
6. **Unknown Provenance**:  
   - June 2026 summary values (Kas masuk Rp 12.850.000, Kas keluar Rp 7.650.000). No detailed transaction ledger supporting these exact totals exists in the repository.

---

## 4. Five Evidence Layer Inventory & Independent Calculation Matrix

To prevent treating Version B as one single dataset, the table below records the independently recalculated totals for each evidence layer:

### May 2026 Evidence Layers

| Evidence Layer | Exact Source Path | Stated/Calculated Income (Rp) | Stated/Calculated Expense (Rp) | Net Movement (Rp) | Opening Balance | Closing Balance (Rp) | Record Count | Duplicate Count | Evidence Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Layer 1: UI Summary Cards** | [`src/data/siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L135-L146) | 19.431.000 | 8.268.292 | +11.162.708 | Not Stated | 11.162.708 | Hint: 44 tx | 0 | Provisional |
| **Layer 2: JS Transaction Array** | [`src/data/dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L228-L271) | 19.431.000 (Sum) | 6.149.396 (Sum) | +13.281.604 | Not Present | 13.281.604 (Calc) | 42 records | 4 pairs (8 records) | Discrepant (Missing PLN & WiFi) |
| **Layer 3: Excel Master Sheet** | [`Legacy/data/Master_Data_V1_Al_Ikhlas_Digital_Ecosystem (2) (2).xlsx`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/Legacy/data/Master_Data_V1_Al_Ikhlas_Digital_Ecosystem%20(2)%20(2).xlsx) (Sheet `02_Keuangan`) | 19.431.000 (Sum) | 8.268.292 (Sum) | +11.162.708 | Not Present | 11.162.708 (Calc) | 44 records (IDs 1–44) | 7 pairs (14 records) | Master Draft |
| **Layer 4: Legacy HTML Dashboard** | [`Legacy/dashboard/DKM Al Ikhlas.html`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/Legacy/dashboard/DKM%20Al%20Ikhlas.html#L1252-L1262) | 19.069.526 | 5.599.396 | +13.470.130 | Not Present | 13.470.130 | 32 records (Hint: 34/17) | Unverified | Legacy Prototype |
| **Layer 5: Derived Calculations** | [`src/data/siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L192-L197), [`src/data/dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L58-L63) | Derived from Layer 1/3 | Derived from Layer 1/3 | N/A | N/A | N/A | N/A | N/A | Derived Ratio |

### June 2026 Evidence Layers

| Evidence Layer | Exact Source Path | Stated/Calculated Income (Rp) | Stated/Calculated Expense (Rp) | Net Movement (Rp) | Opening Balance | Closing Balance (Rp) | Record Count | Duplicate Count | Evidence Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Layer 1: UI Summary Cards** | [`src/data/siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L162-L175) | 12.850.000 | 7.650.000 | +5.200.000 | Not Carried Over | 5.200.000 | Hint: 24 tx | 0 | Provisional (Unbacked) |
| **Layer 2: JS Transaction Array** | [`src/data/dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L183-L226) | 19.431.000 (Sum) | 6.149.396 (Sum) | +13.281.604 | Not Present | 13.281.604 (Calc) | 42 records | 42 records (100% clone of May) | Placeholder Clone |
| **Layer 5: Derived Calculations** | [`src/data/siteContent.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/siteContent.js#L192-L197), [`DonationKpi.jsx`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/components/donation/DonationKpi.jsx#L8) | 12.850.000 | 7.650.000 | +5.200.000 | N/A | N/A | N/A | N/A | Derived Ratios (`59%`, `85.6%`) |

---

## 5. Independent Calculation & Discrepancy Breakdown

### Independent Calculation of Layer 2 (`mockTransactionsMei`)
- Sum of `masuk` fields: $4.874k + 1.500k + 1.388k + 200k + 500k + 200k + 1.283k + 150k + 150k + 322k + 1.632k + 100k + 250k + 150k + 150k + 300k + 400k + 2.241k + 150k + 300k + 500k + 2.241k + 150k + 300k = \mathbf{\text{Rp } 19.431.000}$.
- Sum of `keluar` fields: $250k + 200k + 500k + 250k + 150k + 150k + 630.500 + 250k + 100k + 150k + 150k + 250k + 300k + 250k + 150k + 300k = \mathbf{\text{Rp } 6.149.396}$.
- **Net Result**: $\text{Rp } 19.431.000 - 6.149.396 = \mathbf{\text{Rp } 13.281.604}$.
- **Root Cause of Discrepancy vs Layer 1 & 3**:
  In Excel Sheet `02_Keuangan` (Layer 3), Rows 46 and 47 contain:
  - ID 43: PLN Payment Rp 1.885.896
  - ID 44: WiFi Payment Rp 233.000
  Total utility expenses = $\text{Rp } 1.885.896 + 233.000 = \mathbf{\text{Rp } 2.118.896}$.
  Adding utility expenses to Layer 2 expense sum: $6.149.396 + 2.118.896 = \mathbf{\text{Rp } 8.268.292}$, which matches Layer 1 & 3!

---

## 6. Duplicate Candidates Inventory

The table below catalogs duplicate records identified across Layer 2 and Layer 3:

| Date / Label | Description / Item | Amount (Rp) | Type | Record Identifiers / Positions | Reason for Duplicate Appearance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 Mei / Jun | Pembayaran Bisyaroh Imam | Rp 250.000 | Keluar | Layer 2 Pos 31 & Pos 37 | Identical date, category, description, and nominal entered twice in array |
| 1 Mei / Jun | Infaq Jumat | Rp 2.241.000 | Masuk | Layer 2 Pos 32 & Pos 38 | Identical Friday donation amount and description duplicated on same date |
| 1 Mei / Jun | Pembayaran Jumber Meteora 62 | Rp 300.000 | Keluar | Layer 2 Pos 33 & Pos 40 | Duplicate expense entry for same cluster payment |
| 1 Mei / Jun | Infaq Jumber Meteora 62 TF ke rekening | Rp 300.000 | Masuk | Layer 2 Pos 35 & Pos 42 | Duplicate income entry for same cluster transfer |
| 2026-05-01 | Infaq Jumber Meteora 62 TF ke rekening | Rp 300.000 | Masuk | Layer 3 ID 1 (Row 4) & ID 38 (Row 41) | Record duplicated at bottom of Excel sheet `02_Keuangan` |
| 2026-05-01 | Infaq Jumber Aurora 42 TF ke rekening | Rp 150.000 | Masuk | Layer 3 ID 2 (Row 5) & ID 39 (Row 42) | Record duplicated at bottom of Excel sheet `02_Keuangan` |
| 2026-05-01 | Pembayaran Jumber Meteora 62 | Rp 300.000 | Keluar | Layer 3 ID 3 (Row 6) & ID 40 (Row 43) | Record duplicated at bottom of Excel sheet `02_Keuangan` |
| 2026-05-01 | Infaq Jumat | Rp 2.241.000 | Masuk | Layer 3 ID 5 (Row 8) & ID 41 (Row 44) | Record duplicated at bottom of Excel sheet `02_Keuangan` |
| 2026-05-01 | Pembayaran Bisyaroh Imam | Rp 250.000 | Keluar | Layer 3 ID 6 (Row 9) & ID 42 (Row 45) | Record duplicated at bottom of Excel sheet `02_Keuangan` |
| 2026-05-03 | Pembayaran Listrik PLN | Rp 1.885.896 | Keluar | Layer 3 ID 8 (Row 11) & ID 43 (Row 46) | Utility bill duplicate entry in Excel sheet |
| 2026-05-03 | Pembayaran WiFi | Rp 233.000 | Keluar | Layer 3 ID 9 (Row 12) & ID 44 (Row 47) | Internet bill duplicate entry in Excel sheet |

---

## 7. Cross-Period Continuity Review

- **May 2026 Ending Balance**:
  - Layer 4 (Legacy): Rp 13.470.130
  - Layer 1 & 3 (UI / Excel): Rp 11.162.708
  - Layer 2 (JS Array): Rp 13.281.604
- **June 2026 Opening Balance**: Rp 0 (Implicitly omitted in UI summary cards).
- **June 2026 Ending Balance Displayed**: Rp 5.200.000.
- **Continuity Deficit**:
  - If Layer 1/3 May ending balance (Rp 11.162.708) is carried forward, true June ending balance should be:  
    $$\text{Cumulative Balance} = 11.162.708 + 12.850.000 - 7.650.000 = \text{Rp } 16.362.708$$
- **Finding**: The UI displays net monthly surplus (Rp 5.200.000) under the field label `saldoAkhir`. This violates cash-book accounting continuity rules.

---

## 8. Budget Realization Percentage Review

Analysis of `mockAnggaran` in [`dashboardMockData.js`](file:///C:/Users/lenovo/Desktop/afiryu-project/Masjid%20Al%20Ikhlas/alikhlas-cgv-v2/src/data/dashboardMockData.js#L58-L63):

1. **Category Data**:
   - Operasional Masjid: Realisasi Rp 3.250.000 / Target Rp 7,8 jt $\rightarrow$ Displayed `42%`
   - Pendidikan & TPQ: Realisasi Rp 1.700.000 / Target Rp 7,5 jt $\rightarrow$ Displayed `22%`
   - Kebersihan & Fasilitas: Realisasi Rp 1.450.000 / Target Rp 7,8 jt $\rightarrow$ Displayed `19%`
   - Sosial & Kegiatan: Realisasi Rp 1.250.000 / Target Rp 7,2 jt $\rightarrow$ Displayed `17%`

2. **Mathematical Verification**:
   - Total Monthly Expense = $\text{Rp } 3.250.000 + 1.700.000 + 1.450.000 + 1.250.000 = \text{Rp } 7.650.000$.
   - Operasional ratio: $3.250.000 / 7.650.000 = 42.48\% \rightarrow \mathbf{42\%}$.
   - Pendidikan ratio: $1.700.000 / 7.650.000 = 22.22\% \rightarrow \mathbf{22\%}$.
   - Kebersihan ratio: $1.450.000 / 7.650.000 = 18.95\% \rightarrow \mathbf{19\%}$.
   - Sosial ratio: $1.250.000 / 7.650.000 = 16.33\% \rightarrow \mathbf{17\%}$ (rounded).
   - Sum of percentages: $42\% + 22\% + 19\% + 17\% = 100\%$.

3. **Finding**:
   - The percentage displayed is **Expense Allocation Share** (portion of current month's expenses), NOT realization against the target.
   - The term *"Realisasi Anggaran"* is business-inaccurate as no formal approved budget target exists. Target values (totaling Rp 30.3m) are illustrative placeholders.

---

## 9. Unresolved Evidence Gaps & Bendahara Checklist

### Unresolved Gaps
1. Absence of signed physical or PDF monthly cash report for May and June 2026.
2. Missing bank statements (BSI account 1500600069) for May and June 2026.
3. Unconfirmed true opening balance for May 2026 (assumed Rp 0 in prototypes).
4. Missing actual June 2026 transaction ledger (since Layer 2 June is a copy of May).

### Checklist of Required Documents from Bendahara DKM
- [ ] **Dokumen 1**: Signed PDF or physical Buku Kas DKM for May 2026.
- [ ] **Dokumen 2**: Signed PDF or physical Buku Kas DKM for June 2026.
- [ ] **Dokumen 3**: Bank Statement (Rekening Koran BSI 1500600069) for May & June 2026.
- [ ] **Dokumen 4**: Verified list of total cash-in, cash-out, and cumulative ending balance as of May 31, 2026, and June 30, 2026.
- [ ] **Dokumen 5**: Approved DKM Annual/Monthly Budget Target Document (Rencana Anggaran Biaya / RAB).

---

## 10. Privacy & Anonymization Audit Notes

In compliance with Privacy Rule 8:
- No personal donor names, personal phone numbers, or private notes have been copied into this audit report.
- Specific cluster unit numbers have been generalized as *Cluster Donor* references where applicable.
- Public donation account information (BSI Rekening 1500600069) is cited only as referenced in official public portal headers.
