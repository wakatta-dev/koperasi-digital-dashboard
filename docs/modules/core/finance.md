# Finance API — Panduan Integrasi Frontend (Singkat)

Modul finance menyediakan pencatatan transaksi kas, akses histori, ekspor laporan, serta kompatibilitas modul buku kas (cashbook). Response konsisten menggunakan `APIResponse<T>` dan mendukung paginasi cursor di endpoint daftar.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Semua endpoint berada di bawah prefix `/transactions` dan `/cash` bagi tenant finance.

- POST `/transactions` — `finance officer`: catat transaksi kas → 201 `APIResponse<Transaction>`
- GET `/transactions?start=&end=&type=&category=&payment_method=&savings_type=&account_code=&business_unit_id=&min_amount=&max_amount=&term=&limit=&cursor=` — `finance officer`: daftar transaksi → 200 `APIResponse<Transaction[]>`
- GET `/transactions/export?start=&end=&type=&category=&payment_method=&format=` — `finance officer`: ekspor transaksi ke CSV/XLSX → 200 `file`
- GET `/transactions/:id/history?limit=&cursor=` — `finance officer`: histori perubahan transaksi → 200 `APIResponse<TransactionHistory[]>`
- PATCH `/transactions/:id` — `finance officer`: ubah transaksi → 200 `APIResponse<Transaction>`
- DELETE `/transactions/:id` — `finance officer`: hapus transaksi → 200 `APIResponse<{ id: number }>`
- POST `/cash/manual` — `finance officer`: catat pemasukan/pengeluaran manual (kompatibilitas cashbook) → 201 `CashEntry`
- GET `/cash/summary?start=&end=` — `finance officer`: ringkasan kas masuk/keluar → 200 `CashSummary`
- POST `/cash/export` — `finance officer`: ekspor ringkasan kas ke laporan → 200 `file`

> Tenant tipe tertentu (mis. `BUMDes`) mewajibkan `business_unit_id`. Service akan mengembalikan 400 bila konteks unit tidak dipenuhi. Gunakan query `format=csv` untuk ekspor CSV; default `xlsx`.

## Kategori Transaksi

- Umum: `simpanan`, `pinjaman`, `pembiayaan`, `operasional`, `penjualan`, `pembelian_aset`, `shu`, `non_simpan_pinjam`.
- BUMDes: `penjualan`, `operasional`, `pembelian_aset`, `sewa_aset`, `pendapatan_desa`.

## Skema Data Ringkas

- Transaction: `id:number`, `tenant_id:number`, `tenant_type:string`, `business_unit_id?:number`, `transaction_date:Rfc3339`, `type:'CashIn'|'CashOut'|'Transfer'`, `category:string`, `savings_type?:string`, `amount:number`, `payment_method:string`, `description?:string`, `ledger_entries:LedgerEntry[]`, `created_by:number`, `updated_by:number`, `created_at:Rfc3339`, `updated_at:Rfc3339`
- LedgerEntry: `id:number`, `transaction_id:number`, `account_code:string`, `account_name:string`, `debit:number`, `credit:number`
- TransactionHistory: `id:number`, `transaction_id:number`, `changed_by:number`, `old_values:string(JSON)`, `new_values:string(JSON)`, `changed_at:Rfc3339`
- CashEntry: `id:number`, `tenant_id:number`, `source:string`, `amount:number`, `type:'in'|'out'`, `description?:string`, `created_at:Rfc3339`
- CashSummary: `{ total_in: number, total_out: number }`

> Field `old_values`/`new_values` pada histori berupa string JSON hasil snapshot transaksi sebelum dan sesudah perubahan; gunakan parser di FE bila perlu diff visual.

## Payload Utama

- CreateTransactionRequest:
  - `transaction_date` (RFC3339), `type` (`'CashIn'|'CashOut'|'Transfer'`), `category` (string valid), `savings_type?` (string), `amount` (number), `payment_method` (string), `description?` (string), `business_unit_id?` (number), `debit_account_code` (string), `debit_account_name` (string), `credit_account_code` (string), `credit_account_name` (string)

- UpdateTransactionRequest:
  - Field sama seperti create namun opsional (`type`, `category`, dsb). Kosongkan field yang tidak diubah.

- ManualEntryRequest (`POST /cash/manual`):
  - `{ source: string, amount: number, type: 'in'|'out', description?: string }`

- CashExportRequest (`POST /cash/export`):
  - `{ report_type: string }` — gunakan nilai sesuai mapping laporan (contoh: `summary`, `detail`).

## Bentuk Response

- Endpoint transaksi mengembalikan `APIResponse<T>` dengan `meta.pagination` untuk daftar/histori.
- Endpoint cashbook (`/cash/...`) memakai respons langsung (bukan `APIResponse`) demi kompatibilitas legacy.
- Ekspor mengirim file biner dengan `Content-Type` `text/csv` atau `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

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
type LedgerEntry = {
  id: number;
  transaction_id: number;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
};

type Transaction = {
  id: number;
  tenant_id: number;
  tenant_type: string;
  business_unit_id?: number;
  transaction_date: Rfc3339String;
  type: 'CashIn' | 'CashOut' | 'Transfer';
  category: string;
  savings_type?: string;
  amount: number;
  payment_method: string;
  description?: string;
  ledger_entries: LedgerEntry[];
  evidences?: TransactionEvidence[];
  created_by: number;
  updated_by: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type TransactionEvidence = {
  id: number;
  transaction_id: number;
  file_name: string;
  object_name: string;
  file_url: string;
  content_type: string;
  uploaded_at: Rfc3339String;
};

type TransactionHistory = {
  id: number;
  transaction_id: number;
  changed_by: number;
  old_values: string; // JSON encoded
  new_values: string; // JSON encoded
  changed_at: Rfc3339String;
};

type CashEntry = {
  id: number;
  tenant_id: number;
  source: string;
  amount: number;
  type: 'in' | 'out';
  description?: string;
  created_at: Rfc3339String;
};

type CashSummary = {
  total_in: number;
  total_out: number;
};

// Requests
type CreateTransactionRequest = {
  transaction_date: Rfc3339String;
  type: 'CashIn' | 'CashOut' | 'Transfer';
  category: string;
  savings_type?: string;
  amount: number;
  payment_method: string;
  description?: string;
  business_unit_id?: number;
  debit_account_code: string;
  debit_account_name: string;
  credit_account_code: string;
  credit_account_name: string;
};

type UpdateTransactionRequest = Partial<CreateTransactionRequest> & {
  remove_evidence_ids?: number[];
};

type ManualEntryRequest = {
  source: string;
  amount: number;
  type: 'in' | 'out';
  description?: string;
};

type CashExportRequest = {
  report_type: string;
};

// Responses
type TransactionListResponse = APIResponse<Transaction[]>;
type TransactionDetailResponse = APIResponse<Transaction>;
type TransactionHistoryResponse = APIResponse<TransactionHistory[]>;
type TransactionDeleteResponse = APIResponse<{ id: number }>;

type CashEntryResponse = CashEntry;
type CashSummaryResponse = CashSummary;
```

> FE dapat menurunkan tipe `UpdateTransactionRequest` dari `CreateTransactionRequest` menggunakan `Partial` untuk menjaga keselarasan field, serta menyertakan `remove_evidence_ids` ketika perlu menghapus bukti lama.

## Paginasi (Cursor)

- `GET /transactions` dan `/transactions/:id/history` memakai cursor numerik (`id`) dengan `limit` default 10.
- `meta.pagination.next_cursor` dikirim saat masih ada data lanjutan; gunakan nilai tersebut sebagai query `cursor` berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: validasi query (`start`, `end`, `limit`, `cursor`, `business_unit_id`), payload transaksi, ataupun request cash export/manual salah.
- 401/403: konteks tenant hilang atau user tidak memiliki akses unit (`tenant context missing`, `authorization`).
- 404: transaksi tidak ditemukan saat update/delete/get history.
- 500: kegagalan internal (audit, ekspor file, akses repo) — tampilkan pesan umum dan sarankan coba ulang.

## Checklist Integrasi FE

- Validasi wajib `business_unit_id` saat tenant bertipe multi-unit (BUMDes) sebelum mengirim request.
- Gunakan filter tanggal (`start`, `end`) dalam format `YYYY-MM-DD` agar backend tidak mengembalikan error.
- Saat menampilkan histori perubahan, parse `old_values`/`new_values` ke objek untuk diff detail.
- Setelah membuat atau mengubah transaksi, refresh daftar agar saldo kas/book keeping tetap sinkron.
- Pastikan modul cashbook legacy diarahkan ke endpoint baru `/cash/...` untuk data terintegrasi.

## Tautan Teknis (Opsional)

- `internal/modules/core/finance/handler.go` — endpoint transaksi & ekspor.
- `internal/modules/core/finance/cashbook_handler.go` — kompatibilitas cashbook.
- `internal/modules/core/finance/service.go` — bisnis logika transaksi, audit, dan otorisasi unit.
