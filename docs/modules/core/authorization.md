# Authorization API — Panduan Integrasi Frontend (Singkat)

Modul authorization menata role, permission, dan assignment antar tenant serta user internal. Seluruh response memakai `APIResponse<T>` dan memerlukan konteks tenant yang konsisten.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>` (dibutuhkan di seluruh endpoint)
- `X-Tenant-ID`: `number` (menetapkan scope tenant aktif)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Semua route berada di prefix `/roles` dan `/users/:id/roles` bagi admin tenant.

- GET `/roles?term=&permission=&limit=&cursor=` — `tenant admin`: daftar role tenant → 200 `APIResponse<Role[]>`
- POST `/roles` — `tenant admin`: buat role baru → 201 `APIResponse<Role>`
- PUT `/roles/:id` — `tenant admin`: ubah nama/deskripsi role → 200 `APIResponse<Role>`
- DELETE `/roles/:id` — `tenant admin`: hapus role tenant → 200 `APIResponse<{ id: number }>`
- POST `/roles/tenants` — `tenant admin`: hubungkan role ke tenant → 201 `APIResponse<TenantRole>`
- GET `/roles/:id/permissions?term=&permission=&limit=&cursor=` — `tenant admin`: daftar permission role → 200 `APIResponse<PermissionView[]>`
- POST `/roles/:id/permissions` — `tenant admin`: tambah permission baru → 201 `APIResponse<{ obj: string; act: string }>`
- DELETE `/roles/:id/permissions/:pid` — `tenant admin`: cabut permission → 200 `APIResponse<{ id: number }>`
- GET `/users/:id/roles?term=&role=&permission=&limit=&cursor=` — `tenant admin`: daftar role milik user → 200 `APIResponse<RoleUser[]>`
- POST `/users/:id/roles` — `tenant admin`: assign role ke user tenant → 201 `APIResponse<{ user_id: number; role_id: number }>`
- DELETE `/users/:id/roles/:rid` — `tenant admin`: cabut role dari user → 200 `APIResponse<{ user_id: number; role_id: number }>`

> Query `limit` default 10 (minimal 1). `cursor` memakai ID terakhir sebagai angka string. `term` melakukan pencarian fuzzy pada nama/label, sementara `permission` dan `role` memfilter object:action atau nama role.

## Skema Data Ringkas

- Role: `id:number`, `name:string`, `jenis_tenant:string`, `description:string`, `created_at:Rfc3339`, `updated_at:Rfc3339`
- TenantRole: `id:number`, `tenant_id:number`, `role_id:number`, relasi `role:Role`
- PermissionView: `id:number`, `role:string`, `domain:string`, `object:string`, `action:string`, `permission:string`, `label:string`
- RoleUser: `id:number`, `user_id:number`, `role_id:number`, `tenant_id:number`, relasi `role:Role`

> `domain` identik dengan `tenant_type` pada konteks auth dan menentukan cakupan Casbin policy.

## Payload Utama

- CreateRoleRequest (create/update role):
  - `name` (string), `description` (string)

- PermissionRequest (kelola permission):
  - `{ obj: string, act: string }`

- AssignRoleRequest (user role):
  - `{ role_id: number, tenant_id: number }`

- AssignRoleToTenantRequest (role-tenant binding):
  - `{ role_id: number, tenant_id: number }`

- Tidak ada payload tambahan

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` dengan `meta.pagination` saat endpoint mendukung daftar (roles, permissions, user roles).
- Mutasi sederhana (add/delete permission, assign/remove role) mengembalikan payload ringkas (`{ obj, act }` atau `{ user_id, role_id }`).

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
type Role = {
  id: number;
  name: string;
  jenis_tenant: string;
  description: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type TenantRole = {
  id: number;
  tenant_id: number;
  role_id: number;
  role: Role;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type PermissionView = {
  id: number;
  role: string;
  domain: string;
  object: string;
  action: string;
  permission: string;
  label: string;
};

type RoleUser = {
  id: number;
  user_id: number;
  role_id: number;
  tenant_id: number;
  role: Role;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

// Requests
type CreateRoleRequest = {
  name: string;
  description: string;
};

type UpdateRoleRequest = CreateRoleRequest;

type PermissionRequest = {
  obj: string;
  act: string;
};

type AssignRoleRequest = {
  role_id: number;
  tenant_id: number;
};

type AssignRoleToTenantRequest = AssignRoleRequest;

// Responses
type RoleListResponse = APIResponse<Role[]>;
type RoleMutationResponse = APIResponse<Role>;
type RoleDeleteResponse = APIResponse<{ id: number }>;
type TenantRoleResponse = APIResponse<TenantRole>;
type PermissionListResponse = APIResponse<PermissionView[]>;
type PermissionMutationResponse = APIResponse<{ obj: string; act: string }>;
type PermissionDeleteResponse = APIResponse<{ id: number }>;
type UserRoleListResponse = APIResponse<RoleUser[]>;
type UserRoleMutationResponse = APIResponse<{ user_id: number; role_id: number }>;
```

> Gunakan alias `type` agar kompatibel dengan definisi d.ts atau SDK FE internal.

## Paginasi (Cursor)

- Endpoint daftar (`GET /roles`, `/roles/:id/permissions`, `/users/:id/roles`) memakai cursor numerik berdasarkan `id` dengan `limit` default 10.
- Baca `meta.pagination.next_cursor` dan kirim kembali lewat query `cursor` untuk memuat halaman berikutnya saat `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `limit` atau `cursor` tidak valid, body gagal parse, atau validasi payload gagal.
- 401/403: token invalid atau konteks tenant/tenant_type hilang (`tenant context missing`).
- 404: role tidak ditemukan saat update, permission listing, atau removal.
- 500: kegagalan internal/kesalahan Casbin saat membuat atau menghapus permission/assignment.

## Checklist Integrasi FE

- Selalu kirim header `Authorization` dan `X-Tenant-ID` pada setiap request authorization.
- Gunakan daftar permission untuk menampilkan label human readable sekaligus object:action teknis.
- Validasi duplikasi `obj:act` sebelum mengirim permintaan tambah permission.
- Sinkronkan tampilan role user setelah assign/remove agar UI mencerminkan server state terbaru.

## Tautan Teknis (Opsional)

- `internal/modules/core/authorization/handler.go` — detail handler dan mapping HTTP.
- `internal/modules/core/authorization/service_role.go` — logika role tenant & binding.
