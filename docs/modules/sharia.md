# Sharia Financing API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/sharia-financings/apply` — ajukan pembiayaan → 201 `ShariaFinancing`
- POST `/sharia-financings/:id/approve` — setujui → 200 `ShariaFinancing`
- POST `/sharia-financings/:id/disburse` — cairkan → 204 (tanpa body)
- GET `/sharia-financings/:id/installments?term=..&status=..&due_date=..&limit=..&cursor=..` — daftar angsuran (limit default 10) → 200 `APIResponse<ShariaInstallment[]>`
- POST `/sharia-financings/installments/:id/pay` — bayar angsuran → 200 `ShariaInstallment`
- GET `/sharia-financings/:id/release-letter` — surat lunas → 200 `APIResponse<{ message: string }>`

## Skema Data Ringkas

- ShariaFinancing: `id`, `tenant_id`, `member_id`, `akad_type`, `amount`, `margin`, `tenor`, `status`, `created_at`, preload `installments[]`, `documents[]`
- ShariaInstallment: `id`, `financing_id`, `due_date`, `amount`, `paid_amount`, `status` (`unpaid|paid`), `penalty`, `paid_at?`

## Payload Utama

- ApplyRequest:
  - `member_id` (number), `akad_type` (string), `amount` (number), `margin` (number), `tenor` (number)

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
export interface ShariaFinancing {
  id: number;
  tenant_id: number;
  member_id: number;
  akad_type: string;
  amount: number;
  margin: number;
  tenor: number;
  status: 'pending' | 'approved' | 'disbursed';
  created_at: Rfc3339String;
}

export interface ShariaInstallment {
  id: number;
  financing_id: number;
  due_date: Rfc3339String;
  amount: number;
  paid_amount: number;
  status: 'unpaid' | 'paid';
  penalty: number;
  paid_at?: Rfc3339String;
}

// Requests
export interface ApplicationRequest { akad_type: string; amount: number; margin: number; tenor: number }
export interface ApplyRequest extends ApplicationRequest { member_id: number }
export interface DisburseRequest { method: string }
export interface PaymentRequest { amount: number; date: Rfc3339String; method: string }

// Responses
export type ApplyShariaFinancingResponse = ShariaFinancing;
export type ApproveShariaFinancingResponse = ShariaFinancing;
export type DisburseShariaFinancingResponse = void; // 204
export type ListShariaInstallmentsResponse = APIResponse<ShariaInstallment[]>;
export type PayShariaInstallmentResponse = ShariaInstallment;
export type ShariaReleaseLetterResponse = APIResponse<{ message: string }>;
```

## Paginasi (Cursor)

- Endpoint angsuran menggunakan cursor numerik (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: body/query tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 404: pembiayaan/angsuran tidak ditemukan.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tampilkan margin/akad pada UI agar pengguna paham struktur pembiayaan.
- Sinkronkan status aplikasi/angsuran setelah aksi (approve, disburse, pay).

Tautan teknis (opsional): implementasi ada di `internal/modules/koperasi/sharia/*.go` bila diperlukan detail lebih lanjut.
