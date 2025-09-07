# Finance Transactions API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/transactions` — buat transaksi → 201 `APIResponse<Transaction>`
- GET `/transactions?start=..&end=..&type=..&category=..&min_amount=..&max_amount=..&term=..&account_code=..&limit?=..&cursor=..` — daftar → 200 `APIResponse<Transaction[]>`
- GET `/transactions/:id/history?limit?=..&cursor=..` — histori → 200 `APIResponse<TransactionHistory[]>`
- PATCH `/transactions/:id` — ubah transaksi → 200 `APIResponse<Transaction>`
- DELETE `/transactions/:id` — hapus → 200 `APIResponse<{ id: number }>`
- GET `/transactions/export?start=..&end=..&type=..&category=..&format=csv|xlsx` — ekspor → 200 file

## Skema Data Ringkas

- Transaction: `id`, `tenant_id`, `transaction_date`, `type` (`CashIn|CashOut|Transfer`), `category`, `amount`, `payment_method`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `ledger_entries[]`
- TransactionHistory: `id`, `transaction_id`, `changed_by`, `old_values`, `new_values`, `changed_at`
- LedgerEntry: lihat `internal/modules/core/finance/ledger.go` (opsional untuk FE)

## Payload Utama

- CreateTransactionRequest:
  - `transaction_date` (RFC3339), `type` (`CashIn|CashOut|Transfer`), `category` (string), `amount` (number), `payment_method` (string), `description?` (string)
  - `debit_account_code/name`, `credit_account_code/name` (string)

- UpdateTransactionRequest:
  - Bidang sama seperti create, semuanya opsional.

- Filter query (list/export):
  - `start` (YYYY-MM-DD), `end` (YYYY-MM-DD), `type?`, `category?`, `min_amount?`, `max_amount?`, `term?`, `account_code?`, serta `limit?` (default 10) + `cursor` untuk list.

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` kecuali ekspor yang mengembalikan file.
- Endpoint list/histori menyediakan `meta.pagination` bila mendukung cursor.

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

// Entities
export type TransactionType = 'CashIn' | 'CashOut' | 'Transfer';

export interface LedgerEntry {
  id: number;
  transaction_id: number;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
}

export interface Transaction {
  id: number;
  tenant_id: number;
  transaction_date: Rfc3339String;
  type: TransactionType;
  category: string;
  amount: number;
  payment_method: string;
  description: string;
  ledger_entries: LedgerEntry[];
  created_by: number;
  updated_by: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TransactionHistory {
  id: number;
  transaction_id: number;
  changed_by: number;
  old_values: string; // JSON string
  new_values: string; // JSON string
  changed_at: Rfc3339String;
}

// Requests
export interface CreateTransactionRequest {
  transaction_date: Rfc3339String;
  type: TransactionType;
  category: string;
  amount: number;
  payment_method: string;
  description?: string;
  debit_account_code: string;
  debit_account_name: string;
  credit_account_code: string;
  credit_account_name: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface ListTransactionsQuery {
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
  type?: TransactionType;
  category?: string;
  min_amount?: number;
  max_amount?: number;
  term?: string;
  account_code?: string;
  limit?: number; // default 10
  cursor?: string;
}

// Responses
export type CreateTransactionResponse = APIResponse<Transaction>;
export type ListTransactionsResponse = APIResponse<Transaction[]>;
export type GetTransactionHistoryResponse = APIResponse<TransactionHistory[]>;
export type UpdateTransactionResponse = APIResponse<Transaction>;
export type DeleteTransactionResponse = APIResponse<{ id: number }>;
// Export returns a file (csv|xlsx)
```

## Paginasi (Cursor)

- Endpoint list/histori menggunakan cursor numerik (`id`). `limit` opsional (default 10).
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field/body/query invalid.
- 401/403: token salah/tenant tidak aktif.
- 404: resource tidak ditemukan (id salah atau bukan milik tenant).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Implementasi filter tanggal (YYYY-MM-DD) dan handle paginasi cursor.
- Untuk ekspor, tangani `Content-Type` dan `Content-Disposition` untuk unduhan.

Tautan teknis (opsional): implementasi ada di `internal/modules/core/finance/*.go` bila diperlukan detail lebih lanjut.
- `type` (string, enum: `CashIn`, `CashOut`, `Transfer`)
- `category` (string)
- `amount` (float64)
- `payment_method` (string)
- `description` (string)
- `created_by` (uint)
- `updated_by` (uint)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Ringkasan struktur `LedgerEntry`:

- `id` (uint, primary key)
- `transaction_id` (uint, FK ke `cash_transactions`)
- `account_code` (string)
- `account_name` (string)
- `debit` (float64)
- `credit` (float64)

Enum dan konstanta penting:
- `TransactionTypeCashIn` = `CashIn`
- `TransactionTypeCashOut` = `CashOut`
- `TransactionTypeTransfer` = `Transfer`
- `TransactionCategories` = ["simpanan", "pinjaman", "operasional", "penjualan", "pembelian_aset"]

## Alur Bisnis Utama

1) **Pencatatan Transaksi Umum**
   - Menggunakan `CreateTransaction` yang menerima akun debit/kredit dan menulis dua entri `LedgerEntry` secara otomatis.
   - Setiap operasi dicatat dalam `StatusAudit` untuk pelacakan perubahan.

2) **Pencatatan Kas Masuk Otomatis**
   - Dipanggil oleh modul Billing saat pembayaran invoice diverifikasi menggunakan `CreateTransaction`.
   - Menyimpan transaksi dengan tipe `CashIn`, amount sesuai nilai pembayaran, dan deskripsi misalnya `payment {id}`.

3) **Pelaporan**
   - Modul Reporting mengagregasi `Transaction` untuk menghitung total pemasukan, pengeluaran, dan ringkasan per periode.

## Endpoint API

Modul ini menyediakan endpoint dasar untuk mengelola transaksi serta ekspor data.

### Format Response Standar (APIResponse)

```json
{
  "success": true,
  "message": "success",
  "data": {},
  "meta": {
    "request_id": "<uuid>",
    "timestamp": "2025-08-25T10:00:00Z",
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null,
      "has_next": false,
      "has_prev": false,
      "limit": 10
    }
  },
  "errors": null
}
```

- `POST /transactions` — tambah transaksi.
- `GET /transactions?limit?={n}&cursor={c?}` — daftar transaksi.
- `GET /transactions/{id}/history?limit?={n}&cursor={c?}` — riwayat perubahan.
- `PATCH /transactions/{id}` — perbarui transaksi.
- `DELETE /transactions/{id}` — hapus transaksi.
- `GET /transactions/export` — ekspor data transaksi (format `csv|xlsx`).

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau gunakan domain)

- `POST /transactions`
  - Body CreateTransactionRequest:
    - `transaction_date` (RFC3339, opsional; default now)
    - `type` (wajib, `CashIn|CashOut|Transfer`)
    - `category` (wajib, salah satu dari `simpanan|pinjaman|operasional|penjualan|pembelian_aset`)
    - `amount` (wajib, number)
    - `payment_method` (wajib, string)
    - `description` (opsional)
    - `debit_account_code`, `debit_account_name` (wajib)
    - `credit_account_code`, `credit_account_name` (wajib)
  - Response 201: `data` Transaction lengkap beserta `ledger_entries` debit/kredit.

  - `GET /transactions`
    - Query filter (opsional):
      - `start` (YYYY-MM-DD), `end` (YYYY-MM-DD)
      - `type` (`CashIn|CashOut|Transfer`)
      - `category` (lihat kategori di atas)
      - `min_amount` (number), `max_amount` (number)
      - `term` (string), `account_code` (string)
    - `limit` (opsional, int, default 10), `cursor` (opsional, string)
  - Response 200: `data` array Transaction + `meta.pagination`.

  - `GET /transactions/{id}/history`
    - Path: `id` (int, wajib)
    - Query: `limit` (opsional, int, default 10), `cursor` (opsional, string)
    - Response 200: `data` array TransactionHistory + `meta.pagination`; 404 jika transaksi tidak ditemukan pada tenant yang sama.

- `PATCH /transactions/{id}`
  - Path: `id` (int, wajib)
  - Body UpdateTransactionRequest (seluruh field opsional; yang diisi akan diperbarui):
    - `transaction_date`, `type`, `category`, `amount`, `payment_method`, `description`, `debit_*`, `credit_*`
  - Response 200: `data` Transaction terbaru + riwayat audit dicatat.

- `DELETE /transactions/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` `{ "id": <int> }` dan audit penghapusan dicatat.

- `GET /transactions/export`
  - Query filter sama dengan `GET /transactions` + `format` (`csv`|`xlsx`, opsional, default `csv`)
  - Response 200: file CSV/XLSX untuk diunduh.

## Paginasi & Response

- Listing transaksi dan riwayat menggunakan `limit` dan `cursor` string.
- Response dibungkus `APIResponse` dengan `meta.pagination`.

Contoh response `GET /transactions`:
```json
{
  "success": true,
  "message": "success",
  "data": [
    {"id": 1, "amount": 1000}
  ],
  "meta": {
    "request_id": "...",
    "timestamp": "2025-08-25T10:00:00Z",
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null,
      "has_next": false,
      "has_prev": false,
      "limit": 10
    }
  },
  "errors": null
}
```

## Status & Transisi

- `type` menentukan arah transaksi: `CashIn` (kas masuk), `CashOut` (kas keluar), atau `Transfer`.
- Kategori transaksi ditentukan oleh `category`.
- Tidak ada status lain yang dilacak.

## Integrasi & Dampak ke Modul Lain

 - **Billing**: Setelah payment diverifikasi, Billing menggunakan `CreateTransaction` untuk mencatat kas masuk.
 - **Reporting**: Menggunakan tabel `cash_transactions` untuk menyusun ringkasan keuangan (total pemasukan/pengeluaran dan tren bulanan).

## Keamanan

- Semua endpoint dilindungi middleware; konteks tenant diverifikasi sebelum transaksi dicatat.

## Catatan Implementasi

- Modul ini minimalis dan dapat diperluas dengan pencatatan kas keluar, pencatatan saldo, atau integrasi dengan sistem akuntansi lain.
- Handler/API dapat diperluas jika dibutuhkan akses langsung oleh pengguna atau layanan lain.

## Peran Modul Finance/Transactions per Jenis Tenant (Rangkuman)

- Vendor: melihat akumulasi transaksi kas untuk kepentingan audit dan pelaporan.
- Koperasi/UMKM/BUMDes: transaksi mereka tercatat secara otomatis; dapat digunakan untuk melihat histori keuangan di masa depan.

## Skenario Penggunaan

### 1. Pencatatan Pembayaran Langganan

1. Tenant melakukan pembayaran dan diverifikasi oleh Vendor melalui modul Billing.
2. Billing memanggil `CreateTransaction` dengan `tenant_id`, `amount`, dan deskripsi pembayaran.
3. Transaksi kas tersimpan dan dapat diringkas oleh modul Reporting.

### 2. Ekstensi Pencatatan Kas Keluar

1. Sistem atau pengguna menambahkan kemampuan `RecordCashOut`.
2. Setiap pengeluaran (misal refund) dicatat dengan tipe `CashOut`.
3. Laporan keuangan mencerminkan saldo kas yang lebih akurat.

## Tautan Cepat

- Billing: [billing.md](billing.md)
- Reporting: [reporting.md](reporting.md)
- Cashbook: [cashbook.md](cashbook.md)
- Dashboard: [dashboard.md](dashboard.md)
