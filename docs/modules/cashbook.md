# Modul Cashbook

Modul Cashbook menangani pencatatan kas manual, ringkasan, dan ekspor ringkasannya. Terintegrasi dengan modul Finance (pencatatan transaksi) dan Reporting (ekspor ringkasan).

Referensi implementasi utama terdapat pada:
- `internal/modules/finance/cashbook_entity.go`
- `internal/modules/finance/cashbook_service.go`
- `internal/modules/finance/cashbook_handler.go`
- `internal/modules/finance/cashbook_routes.go`

## Ringkasan Peran per Tenant

- Koperasi/UMKM/BUMDes: input kas manual (in/out), melihat ringkasan antar tanggal, ekspor ringkasannya.

## Arsitektur & Komponen

- Service: meneruskan pencatatan ke modul Finance dan integrasi ekspor ke reporting.
- Handler: HTTP endpoint create summary/export.

## Entitas & Skema Data

- CashEntry kini merupakan adaptor dari `finance.Transaction` dengan atribut: `id`, `tenant_id`, `source`, `amount`, `type` (`in|out`), `description`, `created_at`.

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID`.

- `POST /cash/manual` — buat entri kas manual.
- `GET /cash/summary` — ringkasan kas periode (query `start`/`end` opsional, RFC3339).
- `POST /cash/export` — ekspor ringkasan (menghasilkan file biner, content type dari service).

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant

- `POST /cash/manual`
  - Body ManualEntryRequest: `source`, `amount`, `type` (`in|out`), `description?`
  - Response 201: `data` CashEntry

- `GET /cash/summary`
  - Query: `start`, `end` (opsional, RFC3339)
  - Response 200: `data` ringkasan kas (`total_in`, `total_out`)

- `POST /cash/export`
  - Body: `{ "report_type": "..." }`
  - Response 200: file biner (header `Content-Type` di-set oleh handler)

## Contoh Payload & Response

- Create Manual Entry
```json
POST /cash/manual
{ "source": "operasional", "amount": 250000, "type": "in", "description": "Penjualan tunai" }
```

- Summary
```http
GET /cash/summary?start=2025-08-01T00:00:00Z&end=2025-08-31T23:59:59Z
```
Contoh response:
```json
{
  "total_in": 5000000,
  "total_out": 3200000
}
```

## Tautan Cepat

- Reporting: [reporting.md](reporting.md)
- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Dashboard: [dashboard.md](dashboard.md)
