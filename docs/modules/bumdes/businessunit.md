# Business Unit API — Panduan Integrasi Frontend (Singkat)

Modul unit usaha BUMDes menangani registrasi, pemutakhiran, dan pelaporan kinerja tiap unit usaha beserta transaksi kas sederhana. Endpoint dijaga oleh role operasional BUMDes dan seluruh response memakai `APIResponse<T>`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Seluruh endpoint berada di prefix `/bumdes/business-units` dan memerlukan role `SuperAdmin|Manajer|Admin BUMDes|Admin Unit|Kasir Unit`.

- GET `/bumdes/business-units` — `pengelola unit`: daftar unit usaha → 200 `APIResponse<ListBusinessUnitResponse>`
- POST `/bumdes/business-units` — `pengelola unit`: buat unit usaha → 201 `APIResponse<BusinessUnit>`
- GET `/bumdes/business-units/:id` — `pengelola unit`: detail unit → 200 `APIResponse<BusinessUnit>`
- PUT `/bumdes/business-units/:id` — `pengelola unit`: ubah profil unit → 200 `APIResponse<BusinessUnit>`
- POST `/bumdes/business-units/:id/transactions` — `pengelola unit`: catat transaksi kas → 201 `APIResponse<BusinessTransaction>`
- GET `/bumdes/business-units/:id/transactions` — `pengelola unit`: riwayat transaksi (`start_date`, `end_date`) → 200 `APIResponse<ListTransactionsResponse>`
- GET `/bumdes/business-units/:id/performance` — `pengelola unit`: ringkasan omzet vs biaya per bulan (`month=YYYY-MM`) → 200 `APIResponse<PerformanceSummary>`
- GET `/bumdes/business-units/report/comparison` — `manajemen`: perbandingan multi-unit (`start`, `end`, `unit_ids=1,2`) → 200 `APIResponse<UnitComparisonResponse>`
- POST `/bumdes/business-units/low-stock-alerts/trigger` — `manajemen`: jalankan notifikasi stok minim (`unit_id?`) → 200 `APIResponse<{ notifications: number }>`

> Parameter tanggal memakai format `YYYY-MM-DD`; validasi gagal mengembalikan 400 dengan penjelasan field.

## Skema Data Ringkas

- BusinessUnit: `id:number`, `tenant_id:number`, `name:string`, `business_type:string|null`, `manager_name:string|null`, `is_active:boolean`, `created_at:Rfc3339`, `updated_at:Rfc3339`, `assignments?:BusinessUnitAssignment[]`
- BusinessUnitAssignment: `id:number`, `business_unit_id:number`, `user_id:number`, `role:string`, `created_at:Rfc3339`
- BusinessTransaction: `id:number`, `unit_id:number`, `txn_type:'income'|'expense'`, `amount:number`, `description:string|null`, `txn_date:Rfc3339 date`, `created_at:Rfc3339`
- UnitComparisonItem: `unit_id:number`, `unit_name:string`, `revenue:number`, `expense:number`, `net_profit:number`
- PerformanceSummary: `omzet:number`, `operational_costs:number`

> Response list membungkus data utama di dalam `{ items: [...] }`; UI perlu menampilkan transaksi terbaru dan agregasi bersumber dari service.

## Payload Utama

- CreateBusinessUnitRequest (create):
  - `name` (string, wajib); `business_type` (string?); `manager_name` (string?)

- UpdateBusinessUnitRequest (update):
  - `name?` (string); `business_type?` (string); `manager_name?` (string); `is_active?` (boolean)

- CreateTransactionRequest (catat transaksi):
  - `txn_type` (`'income'|'expense'`); `amount` (number > 0); `description?` (string); `txn_date` (RFC3339 date)

- Tidak ada payload status khusus; trigger low stock tidak membutuhkan body.

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>`; list tidak membawa `meta.pagination` (selalu seluruh item).
- `ListTransactionsResponse` dan `UnitComparisonResponse` selalu berada dalam `data`. Pastikan UI membaca `data.items` sebelum mapping.

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

// Entities
type BusinessUnitAssignment = {
  id: number;
  business_unit_id: number;
  user_id: number;
  role: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type BusinessUnit = {
  id: number;
  tenant_id: number;
  name: string;
  business_type: string | null;
  manager_name: string | null;
  is_active: boolean;
  assignments?: BusinessUnitAssignment[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type BusinessTransaction = {
  id: number;
  unit_id: number;
  tenant_id: number;
  txn_type: 'income' | 'expense';
  amount: number;
  description: string | null;
  txn_date: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type PerformanceSummary = {
  omzet: number;
  operational_costs: number;
};

type UnitComparisonItem = {
  unit_id: number;
  unit_name: string;
  revenue: number;
  expense: number;
  net_profit: number;
};

type UnitComparisonResponse = {
  items: UnitComparisonItem[];
};

type ListBusinessUnitResponse = {
  items: BusinessUnit[];
};

type ListTransactionsResponse = {
  items: BusinessTransaction[];
};

type LowStockTriggerResponse = {
  notifications: number;
};

// Requests
type CreateBusinessUnitRequest = {
  name: string;
  business_type?: string;
  manager_name?: string;
};

type UpdateBusinessUnitRequest = {
  name?: string;
  business_type?: string;
  manager_name?: string;
  is_active?: boolean;
};

type CreateTransactionRequest = {
  txn_type: 'income' | 'expense';
  amount: number;
  description?: string;
  txn_date: Rfc3339String;
};

// Responses
type ListUnitsResponse = APIResponse<ListBusinessUnitResponse>;
type CreateUnitResponse = APIResponse<BusinessUnit>;
type GetUnitResponse = APIResponse<BusinessUnit>;
type UpdateUnitResponse = APIResponse<BusinessUnit>;
type CreateTransactionResponse = APIResponse<BusinessTransaction>;
type ListTransactionsAPIResponse = APIResponse<ListTransactionsResponse>;
type PerformanceResponse = APIResponse<PerformanceSummary>;
type ComparisonResponse = APIResponse<UnitComparisonResponse>;
type LowStockResponse = APIResponse<LowStockTriggerResponse>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Endpoint daftar unit/transaksi tidak memakai cursor maupun `limit`; response berisi semua data yang ditemukan.

## Error Singkat yang Perlu Ditangani

- 400: body tidak dapat diparse, validasi tanggal (`month`, `start_date`, `end_date`), atau `txn_type/amount` salah.
- 401/403: token salah atau role tidak memenuhi `RequireRoles`; error dari service `ErrUnitAccessForbidden` juga memunculkan 403.
- 404: unit atau transaksi tidak ditemukan saat akses detail.
- 503: trigger low stock gagal ketika notifier tidak terpasang.

## Checklist Integrasi FE

- Selalu kirim `month` saat meminta performa bulanan; format `YYYY-MM` harus valid.
- Terapkan filter tanggal pada riwayat transaksi sebelum menampilkan grafik atau ekspor.
- Tampilkan hasil trigger low stock agar admin tahu berapa notifikasi yang terkirim.
- Tangani state `is_active` untuk menonaktifkan unit dari pilihan saat membuat transaksi/produk.

## Tautan Teknis (Opsional)

- internal/modules/bumdes/businessunit/handler.go — detail handler & routing.
- internal/modules/bumdes/businessunit/service.go — aturan akses dan kalkulasi performa.
