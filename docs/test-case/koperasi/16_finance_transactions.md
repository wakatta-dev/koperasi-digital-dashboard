# Test Case — Finance/Transactions (Koperasi)

Catatan rujukan: `docs/modules/finance_transactions.md`, `internal/modules/finance/*`

## Create → List → History → Update → Delete → Export

### KOP-FIN-001 — Buat transaksi kas masuk (CashIn)
- POST `/transactions` body:
  {
    "transaction_date": "2025-09-01T10:00:00Z",
    "type": "CashIn",
    "category": "operasional",
    "amount": 250000,
    "payment_method": "transfer",
    "description": "Penjualan",
    "debit_account_code": "101",
    "debit_account_name": "Cash",
    "credit_account_code": "400",
    "credit_account_name": "Sales"
  }
- Hasil: 201 `data` Transaction + `ledger_entries` debit/kredit.

### KOP-FIN-002 — Buat transaksi kas keluar (CashOut)
- POST body `type=CashOut` dan kategori sesuai → 201.

### KOP-FIN-003 — Daftar transaksi (filter)
- GET `/transactions?start=2025-09-01&end=2025-09-30&type=CashIn&category=operasional&min_amount=100000` → 200 `data[]`.

### KOP-FIN-004 — Riwayat perubahan transaksi
- GET `/transactions/{id}/history` → 200 `data[]`.

### KOP-FIN-005 — Perbarui transaksi
- PATCH `/transactions/{id}` body `{ "amount": 300000, "description": "Penjualan retail" }` → 200 `data` terbaru, audit tercatat.

### KOP-FIN-006 — Hapus transaksi
- DELETE `/transactions/{id}` → 200 `data.id`.

### KOP-FIN-007 — Ekspor transaksi (CSV default)
- GET `/transactions/export?format=csv&start=2025-09-01&end=2025-09-30` → 200 file biner `text/csv`.

## Negative & Validasi

### KOP-FIN-020 — Body invalid
- `amount<=0`, `type` bukan `CashIn|CashOut|Transfer`, akun debit/kredit kosong → 400.

### KOP-FIN-021 — Filter invalid
- `start/end` format salah atau `min_amount/max_amount` non-angka → 400.

### KOP-FIN-022 — Akses tanpa header/cross-tenant
- 401/403/404 sesuai middleware.

