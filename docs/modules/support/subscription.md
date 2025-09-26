# Subscription (Tenant Management) API — Panduan Integrasi Frontend (Singkat)

Modul subscription mengelola siklus hidup tenant di bawah vendor: pembuatan tenant, pembaruan profil, status aktif/nonaktif, manajemen user tenant, serta aktivasi modul. Tersedia juga endpoint publik berdasarkan domain dan self-service untuk tenant itu sendiri.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (untuk endpoint vendor & client)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; beberapa jalur memerlukan role vendor super/admin.

## Ringkasan Endpoint

**Vendor Admin (`/tenants`)**

- GET `/tenants?term=&type=&status=&limit=&cursor=` — daftar tenant → 200 `APIResponse<TenantDetail[]>`
- POST `/tenants` — buat tenant baru → 201 `APIResponse<TenantDetail>`
- GET `/tenants/:id` — detail tenant → 200 `APIResponse<TenantDetail>`
- PATCH `/tenants/:id` — perbarui info tenant → 200 `APIResponse<TenantDetail>`
- PATCH `/tenants/:id/status` — ubah status (`active|inactive|suspended`) → 200 `APIResponse<{ status: string }>`
- POST `/tenants/:id/users` — tambahkan user tenant → 201 `APIResponse<TenantUser>`
- GET `/tenants/:id/users?term=&role=&status=&limit=&cursor=` — daftar user tenant → 200 `APIResponse<TenantUser[]>`
- GET `/tenants/:id/modules?term=&enabled=&limit=&cursor=` — daftar modul aktif → 200 `APIResponse<TenantModule[]>`
- PATCH `/tenants/:id/modules` — aktif/nonaktifkan modul → 200 `APIResponse<TenantModule>`

**Publik**

- GET `/tenant/by-domain?domain=` — lookup tenant berdasarkan domain → 200 `APIResponse<TenantDetail>`

**Client Self-service (`/client/tenant`)**

- GET `/client/tenant/profile` — lihat profil tenant → 200 `APIResponse<TenantDetail>`
- PATCH `/client/tenant/profile` — perbarui profil tenant sendiri → 200 `APIResponse<TenantDetail>`

> Endpoint vendor beroperasi dengan cursor numerik (ID tenant). Self-service hanya dapat mengubah field tertentu (nama/domain/kontak/alamat) dan membutuhkan peran tenant admin.

## Skema Data Ringkas

- TenantDetail: `id:number`, `name:string`, `legal_entity?:string`, `domain:string`, `type:'koperasi'|'bumdes'|'umkm'|'vendor'`, `contact_email:string`, `contact_phone:string`, `address:string`, `logo_url?:string`, `business_category?:string`, `description?:string`, `social_links?:Record<string,string>`, `status:'active'|'inactive'|'suspended'`, `is_active:boolean`, `suspended_at?:Rfc3339`, `primary_plan_id?:number`, audit timestamp.
- TenantUser: `id:string`, `user_id:number`, `tenant_role_id:number`, `email:string`, `full_name:string`, audit timestamp.
- TenantModule: `id:string`, `module_id:string`, `code:string`, `name:string`, `status:'aktif'|'nonaktif'`, `business_unit_id?:number`, `start_date?:Rfc3339`, `end_date?:Rfc3339`, audit timestamp.
- TenantPlan: `tenant_id:number`, `plan_id:number`, `is_primary:boolean`.

> Tipe tenant mengikuti konstanta `schema.TenantType*`. Status boolean `is_active` mencerminkan nilai `status` (`active` => true); gunakan ini untuk menyesuaikan UI toggle.

## Payload Utama

- CreateTenantRequest:
  - `{ name: string, type: 'koperasi'|'bumdes'|'umkm', domain: string, primary_plan_id?: number, module_ids?: string[] }`

- UpdateTenantRequest:
  - `{ name: string, type: string, domain: string, contact_email: string, contact_phone: string, address: string }`

- UpdateStatusRequest:
  - `{ status: 'active' | 'inactive' | 'suspended' }`

- AddUserRequest:
  - `{ email: string, password: string, full_name: string, tenant_role_id: number }`

- UpdateModuleRequest:
  - `{ module_id: string, status: 'aktif' | 'nonaktif' }`

- UpdateTenantProfileRequest (self-service):
  - `{ name?: string, domain?: string, contact_email?: string, contact_phone?: string, address?: string, logo_url?: string, business_category?: string, description?: string, social_links?: Record<string, string> }`

- ListTenants query: `term`, `type`, `status`, `limit` (default 10), `cursor` (string ID numerik).
- ListUsers query: `term`, `role` (tenant role ID), `status` (`true|false`), `limit`, `cursor` (UUID).
- ListModules query: `term`, `enabled` (`true|false`), `limit` (default 10), `cursor` (UUID).

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dengan `meta.pagination` di endpoint daftar (`/tenants`, `/tenants/:id/users`).
- Operasi ubah modul mengembalikan modul terbaru sehingga FE dapat menyegarkan daftar tanpa memuat ulang.

## TypeScript Types (Request & Response)

```ts
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

type TenantDetail = {
  id: number;
  name: string;
  legal_entity?: string;
  domain: string;
  type: 'koperasi' | 'bumdes' | 'umkm' | 'vendor';
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url?: string;
  business_category?: string;
  description?: string;
  social_links?: Record<string, string>;
  status: 'active' | 'inactive' | 'suspended';
  is_active: boolean;
  suspended_at?: Rfc3339String;
  primary_plan_id?: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type TenantUser = {
  id: string;
  user_id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type TenantModule = {
  id: string;
  tenant_id: number;
  module_id: string;
  business_unit_id?: number;
  status: 'aktif' | 'nonaktif';
  start_date?: Rfc3339String;
  end_date?: Rfc3339String;
  code: string;
  name: string;
};

type CreateTenantRequest = {
  name: string;
  type: 'koperasi' | 'bumdes' | 'umkm';
  domain: string;
  primary_plan_id?: number;
  module_ids?: string[];
};

type UpdateTenantRequest = {
  name: string;
  type: string;
  domain: string;
  contact_email: string;
  contact_phone: string;
  address: string;
};

type UpdateStatusRequest = {
  status: 'active' | 'inactive' | 'suspended';
};

type AddUserRequest = {
  email: string;
  password: string;
  full_name: string;
  tenant_role_id: number;
};

type UpdateModuleRequest = {
  module_id: string;
  status: 'aktif' | 'nonaktif';
};

type UpdateTenantProfileRequest = Partial<{
  name: string;
  domain: string;
  contact_email: string;
  contact_phone: string;
  address: string;
}>;

type TenantListResponse = APIResponse<TenantDetail[]>;
type TenantDetailResponse = APIResponse<TenantDetail>;
type TenantUserListResponse = APIResponse<TenantUser[]>;
type TenantModuleListResponse = APIResponse<TenantModule[]>;
```

> FE self-service dapat memanfaatkan `Partial` untuk mengirim hanya field yang diubah. Pastikan domain baru melewati validasi `hostname` sebelum submit.

## Paginasi (Cursor)

- `GET /tenants` memakai cursor numerik (`id`) dengan `limit` default 10, sedangkan `GET /tenants/:id/users` dan `/tenants/:id/modules` menggunakan cursor string (UUID).
- Simpan `meta.pagination.next_cursor` dan kirim kembali saat memuat halaman berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload invalid (domain tidak valid, email salah, modul/plan tidak ditemukan).
- 401/403: role tidak memiliki izin (mis. non-vendor mencoba mengakses `/tenants`).
- 404: tenant atau user tidak ditemukan saat Get/Update/Delete.
- 409: domain sudah dipakai (diterjemahkan sebagai 400 dengan pesan spesifik).
- 500: kegagalan internal (sinkron plan, repositori) — tampilkan pesan umum dan sarankan coba ulang.

## Checklist Integrasi FE

- Validasi domain & email secara client-side sebelum mengirim untuk mengurangi error 400.
- Gunakan cursor pagination untuk tabel tenant & user; tampilkan filter `type` dan `status` agar pencarian lebih mudah.
- Saat mengubah status tenant, informasikan konsekuensinya (akses modul, login user) dan refresh daftar modul bila perlu.
- Pastikan update profil self-service hanya mengirim field yang berubah untuk menghindari overwrite tidak disengaja.
- Saat mengaktifkan/nonaktifkan modul, kirim nilai status `'aktif'` / `'nonaktif'` sesuai enum backend dan refresh daftar modul berdasarkan filter `enabled`.

## Tautan Teknis (Opsional)

- `internal/modules/support/subscription/handler.go` — implementasi endpoint tenant/vendor/client.
- `internal/modules/support/subscription/service.go` — logika create/update, modul, dan user tenant.
- `internal/modules/support/subscription/entity.go` — struktur `TenantDetail`, `TenantModule`, `TenantUser`.
