# Test Case — Reporting (Vendor)

Catatan rujukan: `docs/modules/reporting.md`, `internal/modules/reporting/vendor_routes.go`, `vendor_handler.go`, `vendor_usage_handler.go`, `vendor_export_handler.go`

## Financial Report (Vendor)

### VND-REPT-001 — Financial report default (tanpa filter)
- Langkah: GET `/vendor/reports/financial` sebagai `admin_vendor` atau `super_admin_vendor`.
- Hasil: 200 `data` `FinancialReport` (isi sesuai data uji).

### VND-REPT-002 — Financial report dengan periode (start_date/end_date)
- Langkah: GET `/vendor/reports/financial?start_date=2025-08-01&end_date=2025-08-31`.
- Hasil: 200 `data` dalam rentang waktu tersebut.

### VND-REPT-003 — Group by period
- Langkah: GET `/vendor/reports/financial?group_by=month` (coba `quarter`, `year`).
- Hasil: 200; struktur sesuai grouping.

### VND-REPT-004 — Validasi parameter tanggal/group_by invalid
- Langkah:
  - `start_date=2025-13-01` → 400 `errors.start_date`=`invalid start_date`
  - `end_date=abc` → 400 `errors.end_date`
  - `group_by=invalid` → 400 `errors.group_by`=`invalid group_by`

### VND-REPT-005 — Forbidden untuk role bukan vendor
- Langkah: GET `/vendor/reports/financial` dengan role bukan vendor.
- Hasil: 403 `errors.role`=`forbidden`.

## Usage Report (Vendor)

### VND-REPT-010 — Usage report tanpa filter
- Langkah: GET `/vendor/reports/usage` sebagai `admin_vendor`.
- Hasil: 200 `data` `UsageReport`.

### VND-REPT-011 — Usage report filter tenant/module
- Langkah: GET `/vendor/reports/usage?tenant=<tenant_client_id>&module=billing`.
- Hasil: 200 `data` terfilter.

### VND-REPT-012 — Validasi tenant non-angka
- Langkah: GET `/vendor/reports/usage?tenant=abc`.
- Hasil: 400 `errors.tenant`=`invalid tenant`.

### VND-REPT-013 — Forbidden jika role bukan `admin_vendor`
- Langkah: GET `/vendor/reports/usage` sebagai role non-vendor.
- Hasil: 403 `errors.role`=`forbidden`.

## Export Report (Vendor)

### VND-REPT-020 — Export report sukses
- Langkah: POST `/vendor/reports/export` body `{ "report_type": "financial", "format": "pdf", "params": {"start_date": "2025-08-01", "end_date": "2025-08-31"} }`.
- Hasil: 200; header `Content-Type` sesuai (`application/pdf`), response berupa file biner.

### VND-REPT-021 — List report exports
- Langkah: GET `/vendor/reports/exports`.
- Hasil: 200 `data[]` `ReportExport`.

### VND-REPT-022 — Validasi export body invalid
- Langkah: POST `/vendor/reports/export` body tidak bisa di-parse atau `report_type` tidak didukung.
- Hasil: 400/500 dengan `errors.export` / `errors.body`.

### VND-REPT-023 — Export XLSX
- Langkah: POST `/vendor/reports/export` body `{ "report_type": "financial", "format": "xlsx", "params": {"start_date": "2025-08-01", "end_date": "2025-08-31"} }`.
- Hasil: 200 dengan `Content-Type` sesuai XLSX; file terunduh.
