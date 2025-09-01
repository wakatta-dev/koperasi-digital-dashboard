# Test Case — Cashbook (Koperasi)

Catatan rujukan: `docs/modules/cashbook.md`, `internal/modules/cashbook/*`

## Entri Manual, Ringkasan, Ekspor

### KOP-CBK-001 — Entri kas manual IN
- POST `/coop/cash/manual` body `{ "amount": 250000, "type": "in", "category": "operasional", "note": "Penjualan tunai" }` → 201 `data` CashEntry.

### KOP-CBK-002 — Entri kas manual OUT
- POST body `{ "amount": 120000, "type": "out", "category": "operasional", "note": "Pembelian ATK" }` → 201.

### KOP-CBK-003 — Ringkasan periode
- GET `/coop/cash/summary?start=2025-08-01T00:00:00Z&end=2025-08-31T23:59:59Z` → 200 `data` ringkasan.

### KOP-CBK-004 — Ekspor ringkasan
- POST `/coop/cash/export` body `{ "report_type": "summary" }` → 200 file biner (`Content-Type` sesuai handler).

## Negative & Validasi

### KOP-CBK-020 — Body invalid
- `amount<=0` atau `type` bukan `in|out` → 400.

### KOP-CBK-021 — Query waktu invalid
- `start/end` format salah → 400.

### KOP-CBK-022 — Rentang waktu tidak logis
- `start > end` → 400.

### KOP-CBK-023 — Tipe ekspor tidak didukung
- POST `/coop/cash/export` body `{ "report_type": "unknown" }` → 400/500 sesuai implementasi.
