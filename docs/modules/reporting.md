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
- Handler (HTTP): endpoint untuk finance summary dan billing summary.

## Entitas (DTO) & Skema

- FinanceReportResponse
  - `total_income`, `total_expense`, `ending_balance`, `by_period[]` (`month`, `income`, `expense`)
- BillingReportResponse
  - `total_invoices`, `total_paid`, `total_pending`, `outstanding_amount`, `overdue_invoices[]` (`id`, `number`, `tenant_id`, `total`, `due_date`)
- LedgerReportRow (untuk laporan detail di service): `account_code`, `account_name`, `debit`, `credit`

## Alur Bisnis Utama

1) Finance Summary (periode optional)
- Hitung total income/expense dan breakdown bulanan (`YYYY-MM`).
- Ending balance = income - expense di periode tersebut.

2) Billing Summary (periode optional)
- Hitung total invoice, paid, pending, outstanding (`pending+overdue`), dan daftar invoice overdue.

## Endpoint API

Semua response menggunakan format `APIResponse`.

- `GET /reports/finance?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — ringkasan kas per periode.
- `GET /reports/billing?tenant_id={id}&start={YYYY-MM-DD?}&end={YYYY-MM-DD?}` — ringkasan billing per periode.

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
    - `total_invoices`, `total_paid`, `total_pending`, `outstanding_amount`, `overdue_invoices[]` (`id`, `number`, `tenant_id`, `total`, `due_date`).

## Contoh Response (Finance)

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

## Status & Transisi

- Tidak ada status khusus; ini modul baca/agregasi.

## Paginasi & Response

- Tidak menggunakan paginasi; response berupa ringkasan agregat.

## Integrasi & Dampak ke Modul Lain

- Finance: sumber data transaksi kas dan ledger.
- Billing: sumber data invoice dan statusnya.

## Keamanan

- Isolasi tenant diberlakukan; `tenant_id` wajib pada query.

## Catatan Implementasi

- Ekspresi tanggal menyesuaikan dialektor DB (Postgres vs SQLite) untuk grouping bulanan.
- Tersedia metode service untuk laporan tambahan (cash flow, profit/loss, balance sheet) meski belum diekspos rute publik.

## Peran Modul Reporting per Jenis Tenant (Rangkuman)

- Vendor: agregasi lintas tenant (opsional bila dibuka).
- Koperasi/UMKM/BUMDes: monitoring kinerja keuangan dan kesehatan billing.

## Skenario Penggunaan

1. Bendahara melihat ringkasan kas bulan berjalan melalui `/reports/finance`.
2. Admin memantau jumlah invoice overdue melalui `/reports/billing`.
