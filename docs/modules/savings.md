# Savings API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/savings/:member_id/deposit` — setoran → 201 `SavingsTransaction`
- POST `/savings/:transaction_id/verify` — verifikasi setoran manual → 200 `SavingsTransaction`
- POST `/savings/:member_id/withdraw` — ajukan penarikan → 201 `SavingsTransaction`
- POST `/savings/:transaction_id/approve` — setujui penarikan → 200 `SavingsTransaction`
- GET `/savings/:member_id/transactions?limit=..&cursor=..` — riwayat transaksi → 200 `APIResponse<SavingsTransaction[]>`
- GET `/savings/:transaction_id/proof` — bukti transaksi → 200 `APIResponse<string>`

## Skema Data Ringkas

- SavingsAccount: `id`, `member_id`, `type`, `balance`, `created_at`, `updated_at`
- SavingsTransaction: `id`, `account_id`, `amount`, `method`, `status` (`pending|verified|approved`), `type`, `proof_url`, `created_at`

## Payload Utama

- DepositRequest:
  - `type` (string), `amount` (number), `method` (string), `fee?` (number)

- WithdrawalRequest:
  - `type` (string), `amount` (number), `method` (string), `fee?` (number)

## Bentuk Response

- POST/GET di atas mengembalikan objek langsung untuk transaksi tunggal, sementara endpoint list dibungkus `APIResponse<T>` dengan `meta.pagination`.

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
export interface SavingsAccount {
  id: number;
  member_id: number;
  type: string;
  balance: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface SavingsTransaction {
  id: number;
  account_id: number;
  amount: number;
  method: string;
  status: 'pending' | 'verified' | 'approved';
  type: string; // setoran|penarikan (domain)
  proof_url: string;
  created_at: Rfc3339String;
}

// Requests
export interface DepositRequest { type: string; amount: number; method: string; fee?: number }
export interface WithdrawalRequest { type: string; amount: number; method: string; fee?: number }

// Responses
export type DepositResponse = SavingsTransaction;
export type VerifyDepositResponse = SavingsTransaction;
export type WithdrawResponse = SavingsTransaction;
export type ApproveWithdrawalResponse = SavingsTransaction;
export type ListSavingsTransactionsResponse = APIResponse<SavingsTransaction[]>;
export type GetProofResponse = APIResponse<string>;
```

## Paginasi (Cursor)

- Endpoint `GET /savings/:member_id/transactions` menggunakan cursor numerik (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: body/query tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 404: transaksi tidak ditemukan pada verifikasi/approve/proof.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tampilkan status transaksi dan saldo terkini pasca operasi.
- Gunakan `proof_url` untuk menampilkan/unduh bukti transaksi.

Tautan teknis (opsional): implementasi ada di `internal/modules/savings/*.go` bila diperlukan detail lebih lanjut.

