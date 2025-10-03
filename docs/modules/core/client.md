# Clients API — Panduan Integrasi Frontend (Singkat)

Modul clients menyediakan daftar tenant, pengelolaan plan utama, update status, serta timeline aktivitas untuk admin vendor. Response terbungkus `APIResponse<T>` dengan dukungan paginasi cursor.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>` (role vendor admin)
- `X-Tenant-ID`: `number` (opsional untuk vendor global, tetap sertakan nilai default)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

- GET `/api/clients?term=&type=&status=&limit=&cursor=` — `vendor admin`: daftar tenant → 200 `APIResponse<Client[]>`
- PUT `/api/clients/:id/plan` — `vendor admin`: ganti primary plan tenant → 200 `APIResponse<ActivePlan>`
- PATCH `/api/clients/:id/status` — `vendor admin`: ubah status tenant (`active|inactive|suspended`) → 200 `APIResponse<{ id: number; status: string; is_active: boolean }>`
- GET `/api/clients/:id/activity?limit=&cursor=` — `vendor admin`: timeline aktivitas tenant → 200 `APIResponse<ActivityEntry[]>`

> Query `limit` default 10 (minimal 1). `cursor` memakai `id` terakhir (GET list) atau token timeline (activity) yang diberikan pada `meta.pagination.next_cursor`.

## Skema Data Ringkas

- Client: `id:number`, `name:string`, `domain:string`, `type:string`, `status:'active'|'inactive'|'suspended'`, `is_active:boolean`, `suspended_at?:Rfc3339`, `primary_plan_id?:number`, `active_plan?:ActivePlan`
- ActivePlan: `subscription_id:number`, `plan_id:number`, `plan_name:string`, `plan_type:'package'|'addon'`, `price:number`, `start_date:Rfc3339`, `end_date?:Rfc3339`, `status:string`
- ActivityEntry: `type:'plan'|'payment'|'ticket'`, `action:string`, `reference?:string`, `status?:string`, `message?:string`, `amount?:number`, `actor_id?:number`, `occurred_at:Rfc3339`, `metadata?:Record<string,unknown>`

> Bidang `type` & `status` mengikuti audit origin (`plan`, `payment`, `ticket`). UI dapat menampilkan ikon/warna berbeda berdasarkan kombinasi tersebut.

## Payload Utama

- UpdatePlanRequest:
  - `{ plan_id: number }`

- UpdateStatusRequest:
  - `{ status: 'active' | 'inactive' | 'suspended' }`

- Tidak ada payload tambahan untuk endpoint list/activity.

## Bentuk Response

- Semua endpoint menggunakan `APIResponse<T>`; daftar (`/api/clients`, `/api/clients/:id/activity`) menyertakan `meta.pagination` bila data berkelanjutan.
- Update status mengembalikan payload ringkas yang mencantumkan `is_active` hasil evaluasi server.

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
type ActivePlan = {
  subscription_id: number;
  plan_id: number;
  plan_name: string;
  plan_type: 'package' | 'addon';
  price: number;
  start_date: Rfc3339String;
  end_date?: Rfc3339String;
  status: string;
};

type Client = {
  id: number;
  name: string;
  domain: string;
  type: string;
  status: 'active' | 'inactive' | 'suspended';
  is_active: boolean;
  suspended_at?: Rfc3339String;
  primary_plan_id?: number;
  active_plan?: ActivePlan;
};

type ActivityEntry = {
  type: 'plan' | 'payment' | 'ticket';
  action: string;
  reference?: string;
  status?: string;
  message?: string;
  amount?: number;
  actor_id?: number;
  occurred_at: Rfc3339String;
  metadata?: Record<string, unknown>;
};

// Requests
type UpdatePlanRequest = {
  plan_id: number;
};

type UpdateStatusRequest = {
  status: 'active' | 'inactive' | 'suspended';
};

// Responses
type ClientListResponse = APIResponse<Client[]>;
type ClientPlanResponse = APIResponse<ActivePlan>;
type ClientStatusResponse = APIResponse<{ id: number; status: string; is_active: boolean }>;
type ClientActivityResponse = APIResponse<ActivityEntry[]>;
```

> Alihkan definisi ke FE SDK dengan alias `type` agar sesuai d.ts internal.

## Paginasi (Cursor)

- `GET /clients` memakai cursor numerik (`id`).
- `GET /clients/:id/activity` mengembalikan cursor berbasis timestamp internal; gunakan string dari `meta.pagination.next_cursor` apa adanya.

## Error Singkat yang Perlu Ditangani

- 400: `limit` tidak valid, `cursor` korup, atau payload gagal validasi (`plan_id`, `status`).
- 401/403: token invalid atau aktor tanpa hak admin vendor.
- 404: tenant tidak ditemukan saat update plan/status.
- 500: kegagalan service agregasi (misal audit service down) → tampilkan notifikasi umum dan coba ulang.

## Checklist Integrasi FE

- Sediakan filter `type` dan `status` agar daftar tenant mudah dipilah.
- Gunakan data `active_plan` untuk menampilkan plan saat ini dan aksi ganti plan.
- Tampilkan `is_active` setelah update status untuk memutuskan badge/aksi lanjutan di UI.
- Saat menampilkan timeline, gabungkan metadata (contoh `amount`) untuk format jumlah dan tautan referensi.

## Tautan Teknis (Opsional)

- `internal/modules/core/client/handler.go` — implementasi endpoint & validasi.
- `internal/modules/core/client/service.go` — agregasi data tenant, plan, dan aktivitas.
- `internal/modules/core/client/routes.go` — daftar route `/api/clients`.
