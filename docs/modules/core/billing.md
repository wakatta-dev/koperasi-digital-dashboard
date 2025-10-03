# Billing API — Panduan Integrasi Frontend (Singkat)

Modul billing mencakup pengelolaan plan, invoice, payment, dan subscription untuk vendor serta interaksi tenant (client). Seluruh response menggunakan `APIResponse<T>` dengan dukungan paginasi cursor.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>` (seluruh endpoint vendor/client; webhook payment dikecualikan)
- `X-Tenant-ID`: `number` (wajib untuk konteks tenant dan invoice)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

- Vendor GET `/api/plans?term=&status=&limit=&cursor=` — daftar plan → 200 `APIResponse<Plan[]>`
- Vendor POST `/api/plans` — buat plan baru (`type` = `package|addon`) → 201 `APIResponse<Plan>`
- Vendor GET `/api/plans/:id` — detail plan → 200 `APIResponse<Plan>`
- Vendor PUT `/api/plans/:id` — perbarui plan → 200 `APIResponse<Plan>`
- Vendor PATCH `/api/plans/:id/status` — ubah status plan (`active|inactive`) → 200 `APIResponse<Plan>`
- Vendor DELETE `/api/plans/:id` — hapus plan → 200 `APIResponse<{ id: number }>`
- Vendor GET `/api/invoices?tenant=&business_unit_id=&year=&status=&term=&limit=&cursor=` — daftar invoice → 200 `APIResponse<Invoice[]>`
- Vendor POST `/api/invoices` — buat invoice → 201 `APIResponse<Invoice>`
- Vendor GET `/api/invoices/:id` — detail invoice → 200 `APIResponse<Invoice>`
- Vendor PUT `/api/invoices/:id` — perbarui invoice (items, due date, note) → 200 `APIResponse<Invoice>`
- Vendor PATCH `/api/invoices/:id/status` — transisi status (`issued|paid|overdue`) → 200 `APIResponse<Invoice>`
- Vendor POST `/api/invoices/:id/send` — kirim invoice (email/download) → 200 `APIResponse<{ message: string }>`
- Vendor DELETE `/api/invoices/:id` — hapus invoice → 200 `APIResponse<{ id: number }>`
- Vendor GET `/api/invoices/:id/payments?status=&limit=&cursor=` — histori payment invoice → 200 `APIResponse<Payment[]>`
- Vendor POST `/api/invoices/:id/payments` — catat manual payment (`method=manual`) → 201 `APIResponse<Payment>`
- Vendor GET `/api/payments?tenant=&invoice=&status=&limit=&cursor=` — histori payment tenant → 200 `APIResponse<Payment[]>`
- Vendor GET `/api/payments/:id` — detail payment → 200 `APIResponse<Payment>`
- Vendor POST `/api/payments/:id/verify` — verifikasi payment (`status=pending|verified|rejected`) → 200 `APIResponse<Payment>`
- Vendor GET `/api/subscriptions?status=&tenant=&business_unit_id=&term=&limit=&cursor=` — daftar subscription → 200 `APIResponse<TenantSubscription[]>`
- Vendor GET `/api/subscriptions/:id` — detail subscription → 200 `APIResponse<TenantSubscription>`
- Vendor GET `/api/subscriptions/summary` — ringkasan status subscription → 200 `APIResponse<Record<string, number>>`
- Vendor PATCH `/api/subscriptions/:id/status` — ubah status (`active|paused|terminated`) → 200 `APIResponse<TenantSubscription>`
- Vendor GET `/api/audits?entity=&status=&role=&user=&date=&term=&limit=&cursor=` — log status plan/invoice/addon → 200 `APIResponse<StatusAudit[]>`
- Client GET `/api/client/invoices?status=&term=&year=&business_unit_id=&limit=&cursor=` — daftar invoice tenant → 200 `APIResponse<Invoice[]>`
- Client GET `/api/client/invoices/:id` — detail invoice tenant → 200 `APIResponse<Invoice>`
- Client GET `/api/client/invoices/:id/audits?limit=&cursor=` — audit status invoice → 200 `APIResponse<StatusAudit[]>`
- Client POST `/api/client/addons` — beli addon plan → 201 `APIResponse<{ invoice: Invoice; subscriptions: TenantSubscription[] }>`
- Client DELETE `/api/client/addons/:id` — batalkan addon → 200 `APIResponse<{ id: number }>`
- Client GET `/api/client/subscription` — status berlangganan saat ini → 200 `APIResponse<Record<string, string>>`
- Gateway POST `/api/payment-gateways/:gateway/webhook` — terima webhook gateway → 200 `APIResponse<void>`

> Query `limit` default 10 (minimal 1). `cursor` berupa `id` terakhir bertipe string angka. Filter `status` mengikuti enum masing-masing entity, sedangkan `term` melakukan pencarian fuzzy.

## Skema Data Ringkas

- Plan: `id:number`, `name:string`, `type:'package'|'addon'`, `price:number`, `status:'active'|'inactive'`, `module_code?:string`, `module_ids?:string[]`, `created_at:Rfc3339`, `updated_at:Rfc3339`
- Invoice: `id:number`, `tenant_id:number`, `business_unit_id?:number`, `number:string`, `issued_at:Rfc3339`, `due_date:Rfc3339`, `subscription_id?:number`, `total:number`, `status:'draft'|'issued'|'paid'|'overdue'`, `note?:string`, `items:InvoiceItem[]`
- InvoiceItem: `id:number`, `invoice_id:number`, `plan_id?:number`, `description:string`, `quantity:number`, `price:number`
- Payment: `id:number`, `invoice_id:number`, `business_unit_id?:number`, `method:string`, `proof_url:string`, `amount:number`, `status:'pending'|'verified'|'rejected'`, `gateway?:'midtrans'`, `external_id?:string`, `paid_at:Rfc3339`, `created_at:Rfc3339`
- TenantSubscription: `id:number`, `tenant_id:number`, `business_unit_id?:number`, `plan_id:number`, `start_date:Rfc3339`, `end_date?:Rfc3339`, `next_billing_date?:Rfc3339`, `status:'active'|'pending'|'overdue'|'paused'|'terminated'`, `plan?:Plan`
- StatusAudit: `id:number`, `entity:string`, `ref_id:number`, `from_status:string`, `to_status:string`, `note?:string`, `actor_id?:number`, `created_at:Rfc3339`

> Konteks tenant multi-unit: tenant tipe `BUMDes` wajib menyertakan `business_unit_id` pada operasi invoice/addon/purchase.

## Payload Utama

- Plan (create/update):
  - `name` (string), `type` (`'package'|'addon'`), `price` (number), `module_code?` (string), `module_ids?` (string[])

- UpdatePlanStatus:
  - `{ status: 'active' | 'inactive' }`

- Invoice (create/update):
  - `tenant_id` (number), `business_unit_id?` (number), `due_date` (RFC3339), `subscription_id?` (number), `items` (`{ description:string, quantity:number, price:number, plan_id?:number }[]`), `note?` (string)

- UpdateInvoiceStatus:
  - `{ status: 'issued' | 'paid' | 'overdue', note?: string }`

- SendInvoice:
  - `{ mode: 'email'|'download', to?: string[], cc?: string[], bcc?: string[], subject?: string, message?: string }`

- PaymentRequest (manual payment):
  - `{ method: 'manual', proof_url: string, gateway?: 'midtrans', external_id?: string }`

- VerifyPaymentRequest:
  - `{ status: 'pending'|'verified'|'rejected', gateway?: 'midtrans', external_id?: string }`

- PurchaseAddonRequest:
  - `{ plan_ids: number[], business_unit_id?: number }`

- UpdateSubscriptionStatus:
  - `{ status: 'active'|'paused'|'terminated' }`

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>`; daftar menyediakan `meta.pagination` (`next_cursor`, `has_next`, dsb).
- Mutasi sederhana (delete plan/invoice, cancel addon) memakai payload ringkas (`{ id: number }` atau peta serupa).
- Webhook gateway merespon kosong (`data = null`).

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
type Plan = {
  id: number;
  name: string;
  type: 'package' | 'addon';
  price: number;
  status: 'active' | 'inactive';
  module_code?: string;
  module_ids?: string[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type InvoiceItem = {
  id: number;
  invoice_id: number;
  plan_id?: number;
  description: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id: number;
  tenant_id: number;
  business_unit_id?: number;
  number: string;
  issued_at: Rfc3339String;
  due_date: Rfc3339String;
  subscription_id?: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  note?: string;
  items: InvoiceItem[];
};

type Payment = {
  id: number;
  invoice_id: number;
  business_unit_id?: number;
  method: string;
  proof_url: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  gateway?: 'midtrans';
  external_id?: string;
  paid_at: Rfc3339String;
  created_at: Rfc3339String;
};

type TenantSubscription = {
  id: number;
  tenant_id: number;
  business_unit_id?: number;
  plan_id: number;
  start_date: Rfc3339String;
  end_date?: Rfc3339String;
  next_billing_date?: Rfc3339String;
  status: 'active' | 'pending' | 'overdue' | 'paused' | 'terminated';
  plan?: Plan;
};

// Requests
type CreatePlanRequest = Plan;
type UpdatePlanRequest = Plan;

type UpdatePlanStatusRequest = {
  status: 'active' | 'inactive';
};

type CreateInvoiceRequest = Pick<Invoice, 'tenant_id' | 'business_unit_id' | 'due_date' | 'subscription_id' | 'items' | 'note'>;

type UpdateInvoiceStatusRequest = {
  status: 'issued' | 'paid' | 'overdue';
  note?: string;
};

type SendInvoiceRequest = {
  mode: 'email' | 'download';
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  message?: string;
};

type PaymentRequest = {
  method: 'manual';
  proof_url: string;
  gateway?: 'midtrans';
  external_id?: string;
};

type VerifyPaymentRequest = {
  status: 'pending' | 'verified' | 'rejected';
  gateway?: 'midtrans';
  external_id?: string;
};

type PurchaseAddonRequest = {
  plan_ids: number[];
  business_unit_id?: number;
};

type UpdateSubscriptionStatusRequest = {
  status: 'active' | 'paused' | 'terminated';
};

type StatusAudit = {
  id: number;
  entity: string;
  ref_id: number;
  from_status: string;
  to_status: string;
  note?: string;
  actor_id?: number;
  created_at: Rfc3339String;
};

// Responses
type PlanListResponse = APIResponse<Plan[]>;
type PlanDetailResponse = APIResponse<Plan>;
type PlanDeleteResponse = APIResponse<{ id: number }>;

type InvoiceListResponse = APIResponse<Invoice[]>;
type InvoiceDetailResponse = APIResponse<Invoice>;
type InvoiceActionResponse = APIResponse<{ message: string }>;
type InvoiceDeleteResponse = APIResponse<{ id: number }>;

type PaymentListResponse = APIResponse<Payment[]>;
type PaymentDetailResponse = APIResponse<Payment>;

type SubscriptionListResponse = APIResponse<TenantSubscription[]>;
type SubscriptionDetailResponse = APIResponse<TenantSubscription>;
type SubscriptionSummaryResponse = APIResponse<Record<string, number>>;

type AddonPurchaseResponse = APIResponse<{ invoice: Invoice; subscriptions: TenantSubscription[] }>;
type AuditListResponse = APIResponse<StatusAudit[]>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts internal dan mudah dipakai pada FE SDK.

## Paginasi (Cursor)

- Seluruh endpoint daftar menggunakan cursor numerik (`id`) dengan `limit` default 10; beberapa menerima filter tambahan (`status`, `tenant`, `business_unit_id`, `term`).
- Endpoint `/api/audits` menambahkan filter `entity`, `role`, `user`, dan `date`. Seluruh parameter bersifat opsional, namun `business_unit_id` wajib bagi tenant tipe `BUMDes` pada audit invoice.
- Baca `meta.pagination.next_cursor`; kirim sebagai `cursor` pada permintaan berikutnya selama `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: validasi gagal (`limit`, `cursor`, `plan_ids`, `method`, transisi status tidak sah) atau body tidak bisa diparse.
- 401/403: token tidak valid, tenant context hilang (`tenant context missing`), atau role tidak berhak.
- 404: resource tidak ditemukan (plan, invoice, pembayaran, subscription) atau akses silang tenant.
- 409/422 tersirat melalui pesan validasi (invoice number duplikat, addon modul penuh) → ditangani sebagai 400.
- 500: kegagalan internal (audit log, notifikasi, gateway processing) — tampilkan pesan generik kepada pengguna.

## Checklist Integrasi FE

- Pastikan semua request tenant menyertakan `Authorization` dan `X-Tenant-ID`, terutama untuk endpoint client.
- Terapkan guard status saat menampilkan action: hanya plan `active` yang bisa dipilih; invoice `paid` tidak menampilkan tombol bayar.
- Tangani transisi invoice & subscription dengan optimistik update setelah respons sukses.
- Saat membeli addon, de-duplikasi pilihan `plan_ids` dan minta `business_unit_id` untuk tenant tipe BUMDes.
- Sinkronkan histori payment setelah upload bukti, kemudian panggil verifikasi bila dibutuhkan.
- Manfaatkan filter `/api/audits` untuk investigasi perubahan status; tampilkan pencarian berdasarkan `entity` atau `role` agar audit trail mudah diinspeksi.

## Tautan Teknis (Opsional)

- `internal/modules/core/billing/plan/handler.go` — logika utama plan, invoice, payment, subscription.
- `internal/modules/core/billing/payment/handler.go` — endpoint histori & verifikasi payment.
- `internal/modules/core/billing/subscription/handler.go` — ringkasan & status subscription.
- `internal/modules/core/billing/routes.go` — daftar routing lengkap dan grouping vendor/client.
