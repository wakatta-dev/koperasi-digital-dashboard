# Reporting API — Panduan Integrasi Frontend (Singkat)

Modul reporting menyediakan ringkasan keuangan tenant (finance, billing, cashflow, profit & loss, balance sheet), riwayat arsip laporan, ekspor file, serta laporan khusus vendor. Response memakai `APIResponse<T>` kecuali endpoint ekspor yang mengirim file.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json` (wajib untuk POST/PUT; opsional GET)
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

**Tenant (internal)**

- GET `/reports/finance?tenant_id=&start=&end=&group_by=&category=` — `tenant finance`: ringkasan transaksi → 200 `APIResponse<FinanceReportResponse>`
- GET `/reports/billing?tenant_id=&start=&end=` — `tenant finance`: metrik penagihan → 200 `APIResponse<BillingReportResponse>`
- GET `/reports/cashflow?tenant_id=&start=&end=` — `tenant finance`: arus kas masuk/keluar → 200 `APIResponse<CashflowReportResponse>`
- GET `/reports/profit-loss?tenant_id=&start=&end=` — `tenant finance`: laba rugi → 200 `APIResponse<ProfitLossReportResponse>`
- GET `/reports/balance-sheet?tenant_id=&start=&end=` — `tenant finance`: neraca → 200 `APIResponse<BalanceSheetReportResponse>`
- GET `/reports/export?tenant_id=&type=&start=&end=&format=` — `tenant finance`: ekspor laporan (PDF/XLSX) → 200 `file`
- GET `/reports/history?tenant_id=&term=&start_date=&end_date=&limit=&cursor=` — `tenant finance`: daftar arsip laporan → 200 `APIResponse<ReportArchive[]>`
- GET `/reports/tenant/:tenantType` — `tenant admin`: laporan khusus tipe tenant (`vendor|koperasi|bumdes|umkm`) → 200 `APIResponse<any>`

**Vendor khusus**

- GET `/vendor/reports/financial?start_date=&end_date=&group_by=` — `vendor admin`: laporan agregat tenant → 200 `APIResponse<FinancialReport>`
- POST `/vendor/reports/export` — `vendor admin`: ekspor laporan custom (`report_type`, `format`, `params`) → 200 `file`
- GET `/vendor/reports/exports?report_type=&term=&start_date=&end_date=&limit=&cursor=` — `vendor admin`: daftar ekspor → 200 `APIResponse<ReportExport[]>`

> Query tanggal pada laporan utama memakai format `YYYY-MM-DD`. Parameter `group_by` pada finance (`day|week|month|year`) dan vendor (`month|quarter|year`) menentukan agregasi periode. Endpoint tenant memerlukan `tenant_id` kecuali pengguna adalah vendor role (laporan lintas tenant).

## Skema Data Ringkas

- FinanceReportResponse: `total_income:number`, `total_expense:number`, `ending_balance:number`, `by_period:FinanceByPeriod[]`
- FinanceByPeriod: `period:string`, `income:number`, `expense:number`
- BillingReportResponse: `total_invoices:number`, `status_detail:{ draft, issued, paid, overdue }`, `revenue:{ outstanding:number, subscription:number }`, `overdue_invoices:OverdueInvoiceResponse[]`
- OverdueInvoiceResponse: `id:number`, `number:string`, `tenant_id:number`, `total:number`, `due_date:Rfc3339`
- CashflowReportResponse: `total_cash_in:number`, `total_cash_out:number`, `data:CashflowChartData[]`
- CashflowChartData: `label:string`, `cash_in:number`, `cash_out:number`
- ProfitLossReportResponse: `net_profit:number`, `data:ProfitLossChartData[]`
- ProfitLossChartData: `label:string`, `profit:number`, `loss:number`
- BalanceSheetReportResponse: `total_assets:number`, `total_liabilities:number`, `total_equity:number`, `breakdown:BalanceSheetBreakdown[]`
- BalanceSheetBreakdown: `account:string`, `amount:number`
- ReportArchive: `id:number`, `tenant_id:number`, `type:string`, `period_start:Rfc3339`, `period_end:Rfc3339`, `file_url:string`, `created_at:Rfc3339`
- ReportExport: `id:number`, `report_type:string`, `params:string(JSON)`, `file_url:string`, `created_at:Rfc3339`
- FinancialReport (vendor): struktur agregasi khusus vendor (total revenue per tenant, dst) sesuai service.

> `GenerateTenantReport` mengembalikan struktur dinamis berdasarkan tipe tenant (vendor/koperasi/BUMDes/UMKM). FE perlu melakukan branching sesuai nilai `tenantType` jika memanfaatkan endpoint tersebut.

## Payload Utama

- Ekspor tenant (`GET /reports/export`): gunakan query `type` (`finance|billing|cashflow|profit-loss|balance-sheet`), `start`, `end`, `format` (`pdf|xlsx`).

- Vendor ekspor (`POST /vendor/reports/export`):
  ```json
  {
    "report_type": "finance",
    "format": "pdf",
    "params": { "tenant_id": 1, "start_date": "2024-01-01", "end_date": "2024-01-31" }
  }
  ```

- Filter sejarah laporan mendukung `term` (search), `start_date`, `end_date`, `cursor`, `limit`.

## Bentuk Response

- Semua endpoint non-ekspor mengembalikan `APIResponse<T>` tanpa `meta.pagination` kecuali `history` dan vendor `exports` (memiliki `meta.pagination`).
- Ekspor mengirim file biner dengan `Content-Disposition` terisi nama laporan.

## TypeScript Types (Request & Response)

```ts
// Common
type Rfc3339String = string;

type Pagination = {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
};

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type FinanceByPeriod = {
  period: string;
  income: number;
  expense: number;
};

type FinanceReportResponse = {
  total_income: number;
  total_expense: number;
  ending_balance: number;
  by_period: FinanceByPeriod[];
};

type BillingStatusDetail = {
  draft: number;
  issued: number;
  paid: number;
  overdue: number;
};

type BillingRevenueDetail = {
  outstanding: number;
  subscription: number;
};

type OverdueInvoiceResponse = {
  id: number;
  number: string;
  tenant_id: number;
  total: number;
  due_date: Rfc3339String;
};

type BillingReportResponse = {
  total_invoices: number;
  status_detail: BillingStatusDetail;
  revenue: BillingRevenueDetail;
  overdue_invoices: OverdueInvoiceResponse[];
};

type CashflowChartData = {
  label: string;
  cash_in: number;
  cash_out: number;
};

type CashflowReportResponse = {
  total_cash_in: number;
  total_cash_out: number;
  data: CashflowChartData[];
};

type ProfitLossChartData = {
  label: string;
  profit: number;
  loss: number;
};

type ProfitLossReportResponse = {
  net_profit: number;
  data: ProfitLossChartData[];
};

type BalanceSheetBreakdown = {
  account: string;
  amount: number;
};

type BalanceSheetReportResponse = {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  breakdown: BalanceSheetBreakdown[];
};

type ReportArchive = {
  id: number;
  tenant_id: number;
  type: string;
  period_start: Rfc3339String;
  period_end: Rfc3339String;
  file_url: string;
  created_at: Rfc3339String;
};

type ReportExport = {
  id: number;
  report_type: string;
  params: string;
  file_url: string;
  created_at: Rfc3339String;
};

type VendorFinancialReport = Record<string, unknown>; // sesuaikan dengan struktur FE

// Responses
type FinanceReportAPIResponse = APIResponse<FinanceReportResponse>;
type BillingReportAPIResponse = APIResponse<BillingReportResponse>;
type CashflowReportAPIResponse = APIResponse<CashflowReportResponse>;
type ProfitLossReportAPIResponse = APIResponse<ProfitLossReportResponse>;
type BalanceSheetReportAPIResponse = APIResponse<BalanceSheetReportResponse>;
type ReportHistoryResponse = APIResponse<ReportArchive[]>;
type VendorFinancialReportResponse = APIResponse<VendorFinancialReport>;
type ReportExportListResponse = APIResponse<ReportExport[]>;
```

> Untuk vendor financial report, definisi tipe dapat disesuaikan dengan struktur data yang dikonsumsi FE (misal total per tenant, top revenue, dsb.).

## Paginasi (Cursor)

- `GET /reports/history` dan `GET /vendor/reports/exports` memakai cursor numerik (`id`) dengan `limit` default 10.
- Gunakan `meta.pagination.next_cursor` dari respons sebagai query `cursor` berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: `tenant_id` kosong, format tanggal salah, `group_by` tidak valid, payload ekspor tidak lengkap.
- 401/403: role tidak berhak (contoh vendor export butuh admin), atau laporan tenant tanpa izin (`forbidden`).
- 404: file arsip tidak ditemukan (jarang, ditangani di service).
- 500: kegagalan generasi laporan/ekspor (kesalahan repo, generator PDF/XLSX) — tampilkan pesan umum.

## Checklist Integrasi FE

- Gunakan komponen date-picker yang menghasilkan format `YYYY-MM-DD` untuk menghindari error parsing.
- Sediakan preset range (mingguan/bulanan) yang mengisi parameter `start` & `end` otomatis.
- Saat men-trigger ekspor, tampilkan indikator loading dan tangani response file (`blob`) dengan nama file dari header.
- Untuk riwayat laporan, gunakan `cursor` untuk infinite scroll dan saring via `term` jika pengguna mencari nama laporan.
- Terapkan guard UI agar vendor hanya melihat endpoint vendor, sedangkan tenant biasa tidak mengakses `vendor/*` routes.

## Tautan Teknis (Opsional)

- `internal/modules/core/report/handler.go` — implementasi laporan tenant.
- `internal/modules/core/report/vendor_handler.go` — laporan vendor agregat.
- `internal/modules/core/report/vendor_export_handler.go` — ekspor vendor & daftar file.
- `internal/modules/core/report/dto.go` — struktur respons laporan.
