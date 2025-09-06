# Billing API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/plans?limit=..&cursor=..` — daftar plan → 200 `APIResponse<Plan[]>`
- POST `/plans` — buat plan → 201 `APIResponse<Plan>`
- GET `/plans/:id` — detail plan → 200 `APIResponse<Plan>`
- PUT `/plans/:id` — ubah plan → 200 `APIResponse<Plan>`
- PATCH `/plans/:id/status` — ubah status plan → 200 `APIResponse<Plan>`
- DELETE `/plans/:id` — hapus plan → 200 `APIResponse<{ id: number }>`
- GET `/invoices?limit=..&cursor=..` — vendor: daftar invoice → 200 `APIResponse<Invoice[]>`
- POST `/invoices` — vendor: buat invoice → 201 `APIResponse<Invoice>`
- GET `/invoices/:id` — vendor: detail invoice → 200 `APIResponse<Invoice>`
- PUT `/invoices/:id` — vendor: ubah invoice → 200 `APIResponse<Invoice>`
- PATCH `/invoices/:id/status` — vendor: ubah status → 200 `APIResponse<Invoice>`
- DELETE `/invoices/:id` — vendor: hapus → 200 `APIResponse<{ id: number }>`
- POST `/invoices/:id/payments` — vendor: terima pembayaran manual → 201 `APIResponse<Payment>`
- POST `/payments/:id/verify` — vendor: verifikasi pembayaran → 200 `APIResponse<Payment>`
- POST `/payment-gateways/:gateway/webhook` — webhook gateway → 200 `APIResponse<null>`
- GET `/client/invoices?limit=..&cursor=..` — client: daftar invoice → 200 `APIResponse<Invoice[]>`
- GET `/client/invoices/:id` — client: detail invoice → 200 `APIResponse<Invoice>`
- GET `/client/invoices/:id/audits` — client: audit invoice → 200 `APIResponse<StatusAudit[]>`
- GET `/client/subscription` — client: status subscription → 200 `APIResponse<TenantSubscription>`
- GET `/subscriptions?limit=..&cursor=..` — vendor: daftar subscription → 200 `APIResponse<TenantSubscription[]>`
- PATCH `/subscriptions/:id/status` — vendor: ubah status → 200 `APIResponse<TenantSubscription>`
- GET `/subscriptions/summary` — vendor: ringkasan → 200 `APIResponse<{ active: number; suspended: number; overdue: number }>`
- GET `/audits?limit=..&cursor=..` — vendor: daftar audit → 200 `APIResponse<StatusAudit[]>`

## Skema Data Ringkas

- Plan: `id`, `name`, `type`, `price`, `status`, `module_code`, `created_at`, `updated_at`
- TenantSubscription: `id`, `tenant_id`, `plan_id`, `start_date`, `end_date?`, `status`, `created_at`, `updated_at`, preload `plan`
- Invoice: `id`, `tenant_id`, `number`, `issued_at`, `due_date`, `subscription_id?`, `total`, `status` (`pending|paid|overdue`), `items[]`
- InvoiceItem: `id`, `invoice_id`, `description`, `quantity`, `price`
- Payment: `id`, `invoice_id`, `method`, `proof_url`, `amount?`, `status` (`pending|verified|rejected`), `gateway?`, `external_id?`, `paid_at?`, `created_at`
- StatusAudit: `id`, `entity_type` (`invoice|subscription`), `entity_id`, `old_status`, `new_status`, `changed_by`, `changed_at`

## Payload Utama

- Plan (create/update):
  - `name` (string), `type` (string), `price` (number), `module_code` (string)

- UpdatePlanStatusRequest:
  - `{ status: string }`

- Invoice (create/update):
  - `tenant_id` (number), `issued_at` (RFC3339), `due_date` (RFC3339), `subscription_id?` (number), `items[]` (`description`, `quantity`, `price`)

- UpdateInvoiceStatusRequest:
  - `{ status: 'pending'|'paid'|'overdue', note?: string }`

- PaymentRequest (client submit ke endpoint vendor):
  - `{ method: string, proof_url: string, gateway?: string, external_id?: string }`

- VerifyPaymentRequest (vendor verify):
  - `{ status: 'verified'|'rejected', gateway?: string, external_id?: string }`

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>`.
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

// Entities
export interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
  module_code: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TenantSubscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  start_date: Rfc3339String;
  end_date?: Rfc3339String;
  status: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  plan?: Plan;
}

export interface InvoiceItem { id: number; invoice_id: number; description: string; quantity: number; price: number }

export interface Invoice {
  id: number;
  tenant_id: number;
  number: string;
  issued_at: Rfc3339String;
  due_date: Rfc3339String;
  subscription_id?: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface Payment {
  id: number;
  invoice_id: number;
  method: string;
  proof_url: string;
  amount?: number;
  status: 'pending' | 'verified' | 'rejected';
  gateway?: string;
  external_id?: string;
  paid_at?: Rfc3339String;
  created_at: Rfc3339String;
}

export interface StatusAudit {
  id: number;
  entity_type: 'invoice' | 'subscription';
  entity_id: number;
  old_status: string;
  new_status: string;
  changed_by: number;
  changed_at: Rfc3339String;
}

// Requests
export interface UpdatePlanStatusRequest { status: string }
export interface UpdateInvoiceStatusRequest { status: 'pending' | 'paid' | 'overdue'; note?: string }
export interface PaymentRequest { method: string; proof_url: string; gateway?: string; external_id?: string }
export interface VerifyPaymentRequest { status: 'verified' | 'rejected'; gateway?: string; external_id?: string }

// Responses
export type ListPlansResponse = APIResponse<Plan[]>;
export type CreatePlanResponse = APIResponse<Plan>;
export type GetPlanResponse = APIResponse<Plan>;
export type UpdatePlanResponse = APIResponse<Plan>;
export type UpdatePlanStatusResponse = APIResponse<Plan>;
export type DeletePlanResponse = APIResponse<{ id: number }>;

export type ListInvoicesResponse = APIResponse<Invoice[]>;
export type CreateInvoiceResponse = APIResponse<Invoice>;
export type GetInvoiceResponse = APIResponse<Invoice>;
export type UpdateInvoiceResponse = APIResponse<Invoice>;
export type UpdateInvoiceStatusResponse = APIResponse<Invoice>;
export type DeleteInvoiceResponse = APIResponse<{ id: number }>;
export type CreatePaymentResponse = APIResponse<Payment>;
export type VerifyPaymentResponse = APIResponse<Payment>;

export type ListClientInvoicesResponse = APIResponse<Invoice[]>;
export type GetClientInvoiceResponse = APIResponse<Invoice>;
export type GetClientInvoiceAuditsResponse = APIResponse<StatusAudit[]>;
export type GetClientSubscriptionResponse = APIResponse<TenantSubscription>;

export type ListSubscriptionsResponse = APIResponse<TenantSubscription[]>;
export type UpdateSubscriptionStatusResponse = APIResponse<TenantSubscription>;
export type GetSubscriptionsSummaryResponse = APIResponse<{ active: number; suspended: number; overdue: number }>;
export type ListStatusAuditsResponse = APIResponse<StatusAudit[]>;
```

## Paginasi (Cursor)

- Endpoint list menggunakan cursor numerik (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field/body/query invalid.
- 401/403: token salah/tenant tidak aktif/role tidak sesuai.
- 404: resource tidak ditemukan (plan/invoice/subscription).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tampilkan status invoice/subscription dan alur verifikasi pembayaran dengan jelas.
- Saat verifikasi berhasil, sinkronkan fitur yang bergantung (modul tenant aktif kembali).

Tautan teknis (opsional): implementasi ada di `internal/modules/core/billing/*.go` bila diperlukan detail lebih lanjut.

