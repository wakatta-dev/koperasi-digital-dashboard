# Test Case — Reporting (Koperasi)

Catatan rujukan: `docs/modules/reporting.md`, `internal/modules/reporting/*`

Endpoint tenant: `/reports/*` dengan query `tenant_id=<tenant_koperasi_id>`.

## Finance Summary

### KOP-REPT-001 — Finance summary (periode default)
- GET `/reports/finance?tenant_id=<id>` → 200 `data` FinanceReportResponse.

### KOP-REPT-002 — Finance summary dengan periode
- GET `/reports/finance?tenant_id=<id>&start=2025-08-01&end=2025-08-31` → 200.

## Billing Summary

### KOP-REPT-010 — Billing summary
- GET `/reports/billing?tenant_id=<id>&start=2025-08-01&end=2025-08-31` → 200 `data` BillingReportResponse.

## Cashflow / Profit-Loss / Balance Sheet

### KOP-REPT-020 — Cashflow report
- GET `/reports/cashflow?tenant_id=<id>&start=2025-08-01&end=2025-08-31` → 200 `data` CashflowReportResponse.

### KOP-REPT-021 — Profit/Loss report
- GET `/reports/profit-loss?tenant_id=<id>&start=2025-08-01&end=2025-08-31` → 200 `data` ProfitLossReportResponse.

### KOP-REPT-022 — Balance Sheet
- GET `/reports/balance-sheet?tenant_id=<id>&start=2025-08-01&end=2025-08-31` → 200 `data` BalanceSheetReportResponse.

## Export & History

### KOP-REPT-030 — Export report PDF
- GET `/reports/export?tenant_id=<id>&type=finance&start=2025-08-01&end=2025-08-31&format=pdf` → 200 file.

### KOP-REPT-032 — Export report XLSX
- GET `/reports/export?tenant_id=<id>&type=billing&start=2025-08-01&end=2025-08-31&format=xlsx` → 200 file XLSX.

### KOP-REPT-031 — History arsip laporan
- GET `/reports/history?tenant_id=<id>` → 200 `data[]` ReportArchive.

### KOP-REPT-050 — Integrasi history laporan
- GET `/reports/history?tenant_id=<id>` dengan header `X-Tenant-ID` → 200 `success`.

## Negative & Validasi

### KOP-REPT-040 — Validasi query
- Missing `tenant_id`, tanggal invalid → 400.

### KOP-REPT-041 — Tipe report invalid
- `type` di luar `finance|billing|cashflow|profit-loss|balance-sheet` → 400.
