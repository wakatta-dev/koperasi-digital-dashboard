# Reporting API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/reports/finance?tenant_id=..&start=..&end=..&group_by=..&category=..` → 200 `APIResponse<FinanceReportResponse>`
- GET `/reports/billing?tenant_id=..&start=..&end=..` → 200 `APIResponse<BillingReportResponse>`
- GET `/reports/cashflow?tenant_id=..&start=..&end=..` → 200 `APIResponse<CashflowReportResponse>`
- GET `/reports/profit-loss?tenant_id=..&start=..&end=..` → 200 `APIResponse<ProfitLossReportResponse>`
- GET `/reports/balance-sheet?tenant_id=..&start=..&end=..` → 200 `APIResponse<BalanceSheetReportResponse>`
- GET `/reports/export?tenant_id=..&type=..&start=..&end=..&format=pdf|xlsx` → 200 file
- GET `/reports/history?tenant_id=..` → 200 `APIResponse<ReportArchive[]>`
- GET `/reports/financial?start_date=..&end_date=..&group_by=..` (vendor) → 200 `APIResponse<FinancialReport>`
- GET `/reports/usage?tenant=..&module=..` (vendor) → 200 `APIResponse<UsageReport>`
- POST `/reports/export` (vendor) → 200 file
- GET `/reports/exports?cursor=..&limit=..&term=..&report_type=..&start_date=..&end_date=..` (vendor, limit default 10) → 200 `APIResponse<ReportExport[]>`

## Skema Data Ringkas

- FinanceReportResponse: `total_income`, `total_expense`, `ending_balance`, `by_period[]` (`period`, `income`, `expense`)
- BillingReportResponse: `total_invoices`, `status_detail` (`paid`, `pending`, `overdue`), `revenue` (`outstanding`, `subscription`), `overdue_invoices[]` (`id`, `number`, `tenant_id`, `total`, `due_date`)
- CashflowReportResponse: `total_cash_in`, `total_cash_out`, `data[]` (`label`, `cash_in`, `cash_out`)
- ProfitLossReportResponse: `net_profit`, `data[]` (`label`, `profit`, `loss`)
- BalanceSheetReportResponse: `total_assets`, `total_liabilities`, `total_equity`, `breakdown[]` (`account`, `amount`)
- ReportArchive: `id`, `tenant_id`, `type`, `period_start`, `period_end`, `file_url`, `created_at`
- ReportExport: `id`, `report_type`, `params`, `file_url`, `created_at`
- FinancialReport (vendor): ringkasan finansial lintas tenant menurut periode
- UsageReport (vendor): ringkasan penggunaan modul

## Payload Utama

- Query umum tenant: `tenant_id` (number), `start?` (`YYYY-MM-DD`), `end?` (`YYYY-MM-DD`), `group_by?` (`day|week|month|year`), `category?` (string)
- Vendor export: body `{ report_type: string, format?: 'pdf'|'xlsx', params: object }`
- Vendor export list: query `cursor?`, `limit?` (default 10), `term?`, `report_type?`, `start_date?` (`YYYY-MM-DD`), `end_date?` (`YYYY-MM-DD`)

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` kecuali endpoint yang mengembalikan file.
- Endpoint list menyediakan `meta.pagination` bila mendukung cursor.

## TypeScript Types (Request & Response)

```ts
// Common
export type Rfc3339String = string;

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}

// Tenant responses
export interface FinanceByPeriod { period: string; income: number; expense: number }
export interface FinanceReportResponse { total_income: number; total_expense: number; ending_balance: number; by_period: FinanceByPeriod[] }

export interface OverdueInvoiceResponse { id: number; number: string; tenant_id: number; total: number; due_date: Rfc3339String }
export interface BillingStatusDetail { paid: number; pending: number; overdue: number }
export interface BillingRevenueDetail { outstanding: number; subscription: number }
export interface BillingReportResponse { total_invoices: number; status_detail: BillingStatusDetail; revenue: BillingRevenueDetail; overdue_invoices: OverdueInvoiceResponse[] }

export interface CashflowChartData { label: string; cash_in: number; cash_out: number }
export interface CashflowReportResponse { total_cash_in: number; total_cash_out: number; data: CashflowChartData[] }

export interface ProfitLossChartData { label: string; profit: number; loss: number }
export interface ProfitLossReportResponse { net_profit: number; data: ProfitLossChartData[] }

export interface BalanceSheetBreakdown { account: string; amount: number }
export interface BalanceSheetReportResponse { total_assets: number; total_liabilities: number; total_equity: number; breakdown: BalanceSheetBreakdown[] }

export interface ReportArchive { id: number; tenant_id: number; type: string; period_start: Rfc3339String; period_end: Rfc3339String; file_url: string; created_at: Rfc3339String }
export interface ReportExport { id: number; report_type: string; params: string; file_url: string; created_at: Rfc3339String }

// Vendor responses (shape ringkas)
export interface FinancialReport { /* fields per vendor financial aggregation */ [k: string]: unknown }
export interface UsageReport { /* fields per vendor usage aggregation */ [k: string]: unknown }

// Responses
export type GetFinanceReportResponse = APIResponse<FinanceReportResponse>;
export type GetBillingReportResponse = APIResponse<BillingReportResponse>;
export type GetCashflowReportResponse = APIResponse<CashflowReportResponse>;
export type GetProfitLossReportResponse = APIResponse<ProfitLossReportResponse>;
export type GetBalanceSheetReportResponse = APIResponse<BalanceSheetReportResponse>;
export type GetReportHistoryResponse = APIResponse<ReportArchive[]>;
export type GetFinancialReportResponse = APIResponse<FinancialReport>; // vendor
export type GetUsageReportResponse = APIResponse<UsageReport>; // vendor
export type ListVendorReportExportsResponse = APIResponse<ReportExport[]>;
// Export endpoints return file (pdf/xlsx)
```

## Paginasi (Cursor)

- Endpoint history/exports menggunakan cursor (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: validasi `tenant_id`/query tidak valid.
- 401/403: token salah/tenant tidak aktif/role tidak sesuai.
- 404: arsip/ekspor tidak ditemukan.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tampilkan filter periode dan group_by yang konsisten (day/week/month/year).
- Tangani unduhan file dengan benar (pdf/xlsx).

Tautan teknis (opsional): implementasi ada di `internal/modules/core/reporting/*.go` bila diperlukan detail lebih lanjut.

