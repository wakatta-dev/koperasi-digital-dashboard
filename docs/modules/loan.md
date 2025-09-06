# Loans API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/loans/apply` — ajukan pinjaman → 201 `LoanApplication`
- POST `/loans/:id/approve` — setujui → 200 `LoanApplication`
- POST `/loans/:id/disburse` — cairkan → 204 (tanpa body)
- GET `/loans/:id/installments?limit=..&cursor=..` — daftar angsuran → 200 `APIResponse<LoanInstallment[]>`
- POST `/loans/installments/:id/pay` — bayar angsuran → 200 `LoanInstallment`
- GET `/loans/:id/release-letter` — surat lunas → 200 `APIResponse<{ message: string }>`

## Skema Data Ringkas

- LoanApplication: `id`, `tenant_id`, `member_id`, `amount`, `tenor`, `rate`, `purpose?`, `status` (`pending|approved|disbursed`), `created_at`, preload `installments[]`, `documents[]`
- LoanInstallment: `id`, `loan_id`, `due_date`, `amount`, `paid_amount`, `status` (`unpaid|paid`), `penalty`, `paid_at?`
- LoanDocument: `id`, `loan_id`, `file_url`, `type`

## Payload Utama

- ApplyRequest:
  - `member_id` (number), `amount` (number), `tenor` (number, bulan), `rate` (number, %), `purpose?` (string)

- Disburse payload:
  - `{ method: string }`

- PaymentRequest:
  - `amount` (number), `date` (RFC3339), `method` (string)

## Bentuk Response

- Endpoint create/update mengembalikan objek langsung; endpoint list/histori dibungkus `APIResponse<T>` dengan `meta.pagination`.

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
export interface LoanApplication {
  id: number;
  tenant_id: number;
  member_id: number;
  amount: number;
  tenor: number;
  rate: number;
  purpose?: string;
  status: 'pending' | 'approved' | 'disbursed';
  created_at: Rfc3339String;
}

export interface LoanInstallment {
  id: number;
  loan_id: number;
  due_date: Rfc3339String;
  amount: number;
  paid_amount: number;
  status: 'unpaid' | 'paid';
  penalty: number;
  paid_at?: Rfc3339String;
}

// Requests
export interface ApplicationRequest { amount: number; tenor: number; rate: number; purpose?: string }
export interface ApplyRequest extends ApplicationRequest { member_id: number }
export interface DisburseRequest { method: string }
export interface PaymentRequest { amount: number; date: Rfc3339String; method: string }

// Responses
export type ApplyLoanResponse = LoanApplication;
export type ApproveLoanResponse = LoanApplication;
export type DisburseLoanResponse = void; // 204
export type ListInstallmentsResponse = APIResponse<LoanInstallment[]>;
export type PayInstallmentResponse = LoanInstallment;
export type ReleaseLetterResponse = APIResponse<{ message: string }>;
```

## Paginasi (Cursor)

- Endpoint angsuran menggunakan cursor numerik (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: body/query tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 404: aplikasi/angsuran tidak ditemukan.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tampilkan denda (penalty) bila pembayaran melewati `due_date`.
- Sinkronkan status aplikasi/angsuran setelah aksi (approve, disburse, pay).

Tautan teknis (opsional): implementasi ada di `internal/modules/koperasi/loan/*.go` bila diperlukan detail lebih lanjut.

