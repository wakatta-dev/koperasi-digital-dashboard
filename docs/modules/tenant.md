# Tenant API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/tenants?limit=..&cursor=..` — vendor: daftar tenant → 200 `APIResponse<Tenant[]>`
- POST `/tenants` — vendor: buat tenant → 201 `APIResponse<Tenant>`
- GET `/tenants/:id` — vendor: detail tenant → 200 `APIResponse<Tenant>`
- PATCH `/tenants/:id` — vendor: ubah `name`/`type` → 200 `APIResponse<Tenant>`
- PATCH `/tenants/:id/status` — ubah `is_active` → 200 `APIResponse<{ is_active: boolean }>`
- POST `/tenants/:id/users` — client: tambah user → 201 `APIResponse<{ user_id: number }>`
- GET `/tenants/:id/users?limit=..&cursor=..` — client: daftar user → 200 `APIResponse<UserTenantAccess[]>`
- GET `/tenants/:id/modules?limit=..&cursor=..` — client: daftar modul → 200 `APIResponse<TenantModule[]>`
- PATCH `/tenants/:id/modules` — client: ubah status modul → 200 `APIResponse<{ module_id: string; status: string }>`
- GET `/tenant/by-domain?domain=..` — publik lookup domain → 200 `APIResponse<{ tenant_id: number; nama: string; type: string; is_active: boolean }>`
- POST `/vendor/tenants` — registrasi tenant (publik) → 201 `APIResponse<{ registration_id: string }>`
- POST `/vendor/tenants/verify` — verifikasi OTP → 200 `APIResponse<null>`
- PATCH `/vendor/tenants/:id/status` — admin vendor: ubah status → 200 `APIResponse<{ is_active: boolean }>`

## Skema Data Ringkas

- Tenant: `id`, `name`, `domain`, `type`, `status`, `is_active`, `primary_plan_id?`, `created_at`, `updated_at`
- UserTenantAccess: `id` (uuid), `user_id`, `tenant_id`, `tenant_role_id`, `email`, `full_name`, timestamps
- Module: `id` (uuid), `name`, `code`, `description`, timestamps
- TenantModule: `id` (uuid), `tenant_id`, `module_id`, `status`, `start_date?`, `end_date?`, `name`, `code`, timestamps

## Payload Utama

- CreateTenantRequest / UpdateTenantRequest:
  - `name` (string, wajib)
  - `type` (string, wajib)
  - `domain` (string, wajib untuk create)

- UpdateStatusRequest:
  - `is_active` (boolean, wajib)

- AddUserRequest:
  - `email` (string, wajib, email valid)
  - `password` (string, wajib)
  - `full_name` (string, wajib)
  - `tenant_role_id` (number, wajib)

- UpdateModuleRequest:
  - `module_id` (string uuid, wajib)
  - `status` (string, wajib; `aktif|nonaktif`)

- RegisterRequest (publik):
  - `name`, `domain`, `type`, `full_name`, `email`, `password`, `primary_plan_id`, `addon_plan_ids?`

- VerifyRequest (publik):
  - `registration_id`, `otp`

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
export interface Tenant {
  id: number;
  name: string;
  domain: string;
  type: string;
  status: string;
  is_active: boolean;
  primary_plan_id?: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface UserTenantAccess {
  id: string; // uuid
  user_id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface Module {
  id: string; // uuid
  name: string;
  code: string;
  description: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TenantModule {
  id: string; // uuid
  tenant_id: number;
  module_id: string;
  status: string; // aktif|nonaktif
  start_date?: Rfc3339String;
  end_date?: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  name: string; // denormalized
  code: string; // denormalized
}

// Requests
export interface CreateTenantRequest { name: string; type: string; domain: string; }
export interface UpdateTenantRequest { name: string; type: string; }
export interface UpdateStatusRequest { is_active: boolean; }
export interface AddUserRequest { email: string; password: string; full_name: string; tenant_role_id: number; }
export interface UpdateModuleRequest { module_id: string; status: 'aktif' | 'nonaktif'; }
export interface RegisterRequest { name: string; domain: string; type: string; full_name: string; email: string; password: string; primary_plan_id: number; addon_plan_ids?: number[]; }
export interface VerifyRequest { registration_id: string; otp: string; }

// Responses
export type ListTenantsResponse = APIResponse<Tenant[]>;
export type CreateTenantResponse = APIResponse<Tenant>;
export type GetTenantResponse = APIResponse<Tenant>;
export type UpdateTenantResponse = APIResponse<Tenant>;
export type UpdateTenantStatusResponse = APIResponse<{ is_active: boolean }>;
export type AddTenantUserResponse = APIResponse<{ user_id: number }>;
export type ListTenantUsersResponse = APIResponse<UserTenantAccess[]>;
export type ListTenantModulesResponse = APIResponse<TenantModule[]>;
export type UpdateTenantModuleResponse = APIResponse<{ module_id: string; status: string }>;
export type LookupTenantByDomainResponse = APIResponse<{ tenant_id: number; nama: string; type: string; is_active: boolean }>;
export type VendorRegisterTenantResponse = APIResponse<{ registration_id: string }>;
export type VendorVerifyTenantResponse = APIResponse<null>;
export type VendorUpdateTenantStatusResponse = APIResponse<{ is_active: boolean }>;
```

## Paginasi (Cursor)

- `GET /tenants` menggunakan cursor numerik (`id`).
- `GET /tenants/:id/users` dan `GET /tenants/:id/modules` menggunakan cursor string (uuid id baris terakhir).
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field (validasi body/query).
- 401/403: token salah/tenant tidak aktif/tidak berhak (khusus operasi vendor).
- 404: resource tidak ditemukan (tenant/users/modules).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID` pada endpoint non-publik.
- Pastikan pemanggilan create tenant hanya dari tenant bertipe vendor.
- Implementasikan paginasi cursor untuk list tenants/users/modules.
- Sinkronkan UI status tenant dan status modul setelah perubahan.

Tautan teknis (opsional): implementasi ada di `internal/modules/tenant/*.go` bila diperlukan detail lebih lanjut.
2. Admin Tenant menambahkan user internal ke tenant (`POST /tenants/{id}/users`).
3. Admin Tenant mengaktifkan modul yang diperlukan (`PATCH /tenants/{id}/modules`).
4. Sistem Billing otomatis menonaktifkan modul saat langganan `suspended` dan mengaktifkan kembali saat `paid`.
