# Modul Reporting

Dokumentasi ini menjelaskan peran, arsitektur, entitas data (DTO), endpoint API, dan alur bisnis dari modul Reporting. Modul ini menyediakan ringkasan laporan keuangan dan billing berdasarkan data modul Finance dan Billing.

Referensi implementasi utama terdapat pada:
- `internal/modules/reporting/dto.go`
- `internal/modules/reporting/repository.go`
- `internal/modules/reporting/service.go`
- `internal/modules/reporting/handler.go`
- `internal/modules/reporting/routes.go`

## Ringkasan Peran per Tenant

- Vendor: menganalisis kinerja tenant melalui metrik agregat (opsional, tergantung kebutuhan akses).
- Koperasi/UMKM/BUMDes: melihat ringkasan pemasukan/pengeluaran dan status billing per periode.

## Arsitektur & Komponen

- Repository: query agregasi ke tabel `cash_transactions`, `ledger_entries`, dan `billing.invoices` (grouping by month/per account).
- Service: merangkai DTO laporan dari hasil agregasi repository.
- Handler (HTTP): endpoint untuk finance summary, billing summary, cash flow, profit/loss, dan balance sheet.

## Entitas (DTO) & Skema

- FinanceReportResponse
  - `total_income`, `total_expense`, `ending_balance`, `by_period[]` (`month`, `income`, `expense`)
- BillingReportResponse
  - `total_invoices`, `status_detail{paid,pending,overdue}`, `revenue{outstanding,subscription}`, `overdue_invoices[]` (`id`, `number`, `tenant_id`, `total`, `due_date`)
- CashflowReportResponse
  - `total_cash_in`, `total_cash_out`, `data[]` (`label`, `cash_in`, `cash_out`)
- ProfitLossReportResponse
  - `net_profit`, `data[]` (`label`, `profit`, `loss`)
- BalanceSheetReportResponse
  - `total_assets`, `total_liabilities`, `breakdown[]` (`account`, `amount`)
- LedgerReportRow (untuk kebutuhan internal di service): `account_code`, `account_name`, `debit`, `credit`
- ReportExport
  - `id`, `report_type`, `params`, `file_url`, `created_at`
- ReportArchive
  - `id`, `tenant_id`, `type`, `period_start`, `period_end`, `file_url`, `created_at`
- AccountMapping
  - `id`, `account_code`, `category`, `cash_flow_type?`

## Alur Bisnis Utama

1) Finance Summary (periode optional)
- Hitung total income/expense dan breakdown bulanan (`YYYY-MM`).
- Ending balance = income - expense di periode tersebut.

2) Billing Summary (periode optional)
- Hitung total invoice, paid, pending, outstanding (`pending+overdue`), dan daftar invoice overdue.

## Endpoint API

Semua response menggunakan format `APIResponse`.

### Tenant
- `GET /reports/finance?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — ringkasan kas per periode.
- `GET /reports/billing?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — ringkasan billing per periode.
- `GET /reports/cashflow?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — ringkasan arus kas beserta total in/out per kategori.
- `GET /reports/profit-loss?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — laporan laba rugi beserta net profit per akun.
- `GET /reports/balance-sheet?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — laporan neraca dengan total aset/liabilitas dan breakdown akun.
- `GET /reports/export?tenant_id={id}&type={finance|billing|cashflow|profit-loss|balance-sheet}&start={YYYY-MM-DD}&end={YYYY-MM-DD}&format={pdf|xlsx?}` — unduh file laporan.
- `GET /reports/history?tenant_id={id}` — daftar arsip laporan yang pernah diekspor.

### Vendor
- `GET /reports/financial?start_date={YYYY-MM-DD?}&end_date={YYYY-MM-DD?}&group_by={month|quarter|year?}` — ringkasan keuangan vendor.
- `GET /reports/usage?tenant={id?}&module={code?}` — ringkasan penggunaan tenant/modul.
- `POST /reports/export` — ekspor laporan vendor.
- `GET /reports/exports?limit={n}&cursor={c?}` — daftar ekspor laporan vendor.

Keamanan: semua endpoint dilindungi `Bearer` token + `XTenantID`.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `GET /reports/finance`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, `YYYY-MM-DD`)
    - `end` (opsional, `YYYY-MM-DD`)
  - Response 200: `data` FinanceReportResponse
    - `total_income`, `total_expense`, `ending_balance`, `by_period[]` (`month`, `income`, `expense`).

- `GET /reports/billing`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, `YYYY-MM-DD`)
    - `end` (opsional, `YYYY-MM-DD`)
  - Response 200: `data` BillingReportResponse
    - `total_invoices`, `status_detail` (jumlah `paid`, `pending`, `overdue`), `revenue` (`outstanding`, `subscription`), `overdue_invoices[]` (`id`, `number`, `tenant_id`, `total`, `due_date`).

- `GET /reports/cashflow`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, `YYYY-MM-DD`)
    - `end` (opsional, `YYYY-MM-DD`)
  - Response 200: `data` CashflowReportResponse
    - `total_cash_in`, `total_cash_out`, `data[]` (`label`, `cash_in`, `cash_out`).

- `GET /reports/profit-loss`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, `YYYY-MM-DD`)
    - `end` (opsional, `YYYY-MM-DD`)
  - Response 200: `data` ProfitLossReportResponse
    - `net_profit`, `data[]` (`label`, `profit`, `loss`).

- `GET /reports/balance-sheet`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, `YYYY-MM-DD`)
    - `end` (opsional, `YYYY-MM-DD`)
  - Response 200: `data` BalanceSheetReportResponse
    - `total_assets`, `total_liabilities`, `breakdown[]` (`account`, `amount`).

- `GET /reports/export`
  - Query:
    - `tenant_id` (wajib, int)
    - `type` (wajib, salah satu tipe laporan di atas)
    - `start` (wajib, `YYYY-MM-DD`)
    - `end` (wajib, `YYYY-MM-DD`)
    - `format` (opsional, default `pdf`, opsi `pdf|xlsx`)
  - Response 200: file biner (Content-Type sesuai `format`, dengan header `Content-Disposition`).

- `GET /reports/history`
  - Query:
    - `tenant_id` (wajib, int)
  - Response 200: `data` array `ReportArchive` (riwayat arsip laporan yang tersedia).

- `GET /reports/financial`
  - Query:
    - `start_date` (opsional, `YYYY-MM-DD`)
    - `end_date` (opsional, `YYYY-MM-DD`)
    - `group_by` (opsional, `month|quarter|year`)
  - Response 200: `data` FinancialReport

- `GET /reports/usage`
  - Query:
    - `tenant` (opsional, int)
    - `module` (opsional, string)
  - Response 200: `data` UsageReport

- `POST /reports/export`
  - Body JSON:
    - `report_type` (wajib, string)
    - `format` (opsional, default `pdf`, opsi `pdf|xlsx`)
    - `params` (wajib, objek parameter laporan)
  - Response 200: file biner (Content-Type sesuai `format`)

- `GET /reports/exports`
  - Query: `limit` (wajib, int), `cursor` (opsional, string id)
  - Response 200: `data` array `ReportExport` + `meta.pagination`

## Contoh Request & Response

### Tenant

#### `GET /reports/finance`
```http
GET /reports/finance?tenant_id=1&start=2025-07-01&end=2025-08-31
```
```json
{
  "total_income": 15000000,
  "total_expense": 5000000,
  "ending_balance": 10000000,
  "by_period": [
    {"month": "2025-07", "income": 6000000, "expense": 2000000},
    {"month": "2025-08", "income": 9000000, "expense": 3000000}
  ]
}
```

#### `GET /reports/billing`
```http
GET /reports/billing?tenant_id=1&start=2025-07-01&end=2025-08-31
```
```json
{
  "total_invoices": 4,
  "status_detail": {
    "paid": 2,
    "pending": 1,
    "overdue": 1
  },
  "revenue": {
    "outstanding": 750,
    "subscription": 300
  },
  "overdue_invoices": [
    {"id": 3, "number": "INV3", "tenant_id": 1, "total": 250, "due_date": "2025-08-01T00:00:00Z"}
  ]
}
```

#### `GET /reports/cashflow`
```http
GET /reports/cashflow?tenant_id=1&start=2025-07-01&end=2025-08-31
```
```json
{
  "total_cash_in": 1200,
  "total_cash_out": 800,
  "data": [
    {"label": "operational", "cash_in": 700, "cash_out": 500},
    {"label": "investment", "cash_in": 500, "cash_out": 300}
  ]
}
```

#### `GET /reports/profit-loss`
```http
GET /reports/profit-loss?tenant_id=1&start=2025-07-01&end=2025-08-31
```
```json
{
  "net_profit": 400,
  "data": [
    {"label": "sales", "profit": 700, "loss": 200},
    {"label": "other", "profit": 100, "loss": 200}
  ]
}
```

#### `GET /reports/balance-sheet`
```http
GET /reports/balance-sheet?tenant_id=1&start=2025-07-01&end=2025-08-31
```
```json
{
  "total_assets": 1500,
  "total_liabilities": 900,
  "breakdown": [
    {"account": "cash", "amount": 600},
    {"account": "inventory", "amount": 900}
  ]
}
```

#### `GET /reports/export`
```http
GET /reports/export?tenant_id=1&type=finance&start=2025-07-01&end=2025-07-31&format=pdf
```
Response: file biner (Content-Type sesuai `format`).

#### `GET /reports/history`
```http
GET /reports/history?tenant_id=1
```
```json
[
  {
    "id": 1,
    "tenant_id": 1,
    "type": "finance",
    "period_start": "2025-07-01T00:00:00Z",
    "period_end": "2025-07-31T23:59:59Z",
    "file_url": "https://cdn.example/reports/finance-2025-07.pdf",
    "created_at": "2025-08-01T10:00:00Z"
  }
]
```

### Vendor

#### `GET /reports/financial`
```http
GET /reports/financial?start_date=2025-01-01&end_date=2025-03-31&group_by=month
```
```json
{
  "revenue_by_period": [
    {"period": "2025-01", "amount": 1000},
    {"period": "2025-02", "amount": 1500}
  ],
  "revenue_by_product": [
    {"product": "subscription", "amount": 2000},
    {"product": "addon", "amount": 500}
  ],
  "cash_in": 5000,
  "cash_out": 3000,
  "profit": 2000
}
```

#### `GET /reports/usage`
```http
GET /reports/usage?tenant=1&module=billing
```
```json
{
  "top_modules": [
    {"module_code": "billing", "total": 100},
    {"module_code": "savings", "total": 50}
  ],
  "tenant_usage": [
    {"module_code": "billing", "count": 80},
    {"module_code": "savings", "count": 20}
  ]
}
```

#### `POST /reports/export`
```json
POST /reports/export
{
  "report_type": "financial",
  "format": "pdf",
  "params": {"start_date": "2025-01-01", "end_date": "2025-03-31"}
}
```
Response: file biner (Content-Type sesuai `format`).

#### `GET /reports/exports`
```http
GET /reports/exports?limit=10
```
```json
{
  "data": [
    {
      "id": 1,
      "report_type": "financial",
      "params": "{\"start_date\":\"2025-01-01\",\"end_date\":\"2025-03-31\"}",
      "file_url": "https://cdn.example/exports/report1.pdf",
      "created_at": "2025-03-31T10:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null
    }
  }
}
```

## Status & Transisi

- Tidak ada status khusus; ini modul baca/agregasi.

## Paginasi & Response

- Sebagian besar endpoint tidak menggunakan paginasi.
- `GET /reports/exports` mendukung `limit` & `cursor` dan mengembalikan `meta.pagination`.

## Integrasi & Dampak ke Modul Lain

- Finance: sumber data transaksi kas dan ledger.
- Billing: sumber data invoice dan statusnya.

## Keamanan

- Isolasi tenant diberlakukan; `tenant_id` wajib pada query.

## Catatan Implementasi

- Ekspresi tanggal menyesuaikan dialektor DB (Postgres vs SQLite) untuk grouping bulanan.
- Endpoint cash flow, profit/loss, dan balance sheet menyertakan KPI ringkas dan struktur khusus untuk visualisasi.

## Peran Modul Reporting per Jenis Tenant (Rangkuman)

- Vendor: agregasi lintas tenant (opsional bila dibuka).
- Koperasi/UMKM/BUMDes: monitoring kinerja keuangan dan kesehatan billing.

## Skenario Penggunaan

1. Bendahara melihat ringkasan kas bulan berjalan melalui `/reports/finance`.
2. Admin memantau jumlah invoice overdue melalui `/reports/billing`.
3. Akuntan menyusun laporan neraca melalui `/reports/balance-sheet`.

## Tautan Cepat

- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Billing: [billing.md](billing.md)
- Dashboard: [dashboard.md](dashboard.md)
