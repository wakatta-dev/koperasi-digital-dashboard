# Authorization API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur dan poin mengikuti template Asset.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/roles?limit=..&cursor=..` — daftar role pada tenant saat ini → 200 `APIResponse<Role[]>`
- POST `/roles` — buat role → 201 `APIResponse<Role>`
- PUT `/roles/:id` — ubah role → 200 `APIResponse<Role>`
- DELETE `/roles/:id` — hapus/lepaskan role dari tenant → 200 `APIResponse<{ id: number }>`
- POST `/roles/tenants` — vendor: kaitkan role ke tenant → 201 `APIResponse<TenantRole>`
- GET `/roles/:id/permissions?limit=..&cursor=..` — daftar policy → 200 `APIResponse<CasbinRule[]>`
- POST `/roles/:id/permissions` — tambah policy → 201 `APIResponse<{ obj: string; act: string }>`
- DELETE `/roles/:id/permissions/:pid` — hapus policy → 200 `APIResponse<{ id: number }>`
- GET `/users/:id/roles?limit=..&cursor=..` — daftar role user → 200 `APIResponse<RoleUser[]>`
- POST `/users/:id/roles` — assign role ke user → 201 `APIResponse<{ user_id: number; role_id: number }>`
- DELETE `/users/:id/roles/:rid` — hapus role user → 200 `APIResponse<{ user_id: number; role_id: number }>`

## Skema Data Ringkas

- Role: `id`, `name`, `jenis_tenant`, `description`, `created_at`, `updated_at`
- TenantRole: `id`, `tenant_id`, `role_id`, preload `role`
- RoleUser: `id`, `user_id`, `role_id`, `tenant_id`, preload `role`
- CasbinRule: `id`, `p_type`, `v0..v5`

## Payload Utama

- CreateRoleRequest / UpdateRoleRequest:
  - `name` (string, wajib)
  - `description` (string, wajib)

- AssignRoleToTenantRequest:
  - `role_id` (number, wajib)
  - `tenant_id` (number, wajib)

- AssignRoleRequest (user role mapping):
  - `role_id` (number, wajib)
  - `tenant_id` (number, wajib)

- PermissionRequest:
  - `obj` (string, wajib)
  - `act` (string, wajib)

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` untuk konsistensi.
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
export interface Role {
  id: number;
  name: string;
  jenis_tenant: string;
  description: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TenantRole {
  id: number;
  tenant_id: number;
  role_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  role?: Role;
}

export interface RoleUser {
  id: number;
  user_id: number;
  role_id: number;
  tenant_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  role?: Role;
}

export interface CasbinRule {
  id: number;
  p_type: string;
  v0?: string;
  v1?: string;
  v2?: string;
  v3?: string;
  v4?: string;
  v5?: string;
}

// Requests
export interface CreateRoleRequest { name: string; description: string; }
export interface UpdateRoleRequest { name: string; description: string; }
export interface AssignRoleToTenantRequest { role_id: number; tenant_id: number; }
export interface AssignRoleRequest { role_id: number; tenant_id: number; }
export interface PermissionRequest { obj: string; act: string; }

// Responses
export type ListRolesResponse = APIResponse<Role[]>;
export type CreateRoleResponse = APIResponse<Role>;
export type UpdateRoleResponse = APIResponse<Role>;
export type DeleteRoleResponse = APIResponse<{ id: number }>;
export type AssignRoleToTenantResponse = APIResponse<TenantRole>;
export type ListPermissionsResponse = APIResponse<CasbinRule[]>;
export type AddPermissionResponse = APIResponse<{ obj: string; act: string }>;
export type DeletePermissionResponse = APIResponse<{ id: number }>;
export type ListUserRolesResponse = APIResponse<RoleUser[]>;
export type AssignUserRoleResponse = APIResponse<{ user_id: number; role_id: number }>;
export type DeleteUserRoleResponse = APIResponse<{ user_id: number; role_id: number }>;
```

## Paginasi (Cursor)

- Endpoint list menggunakan cursor numerik (berbasis `id`) dengan `limit` wajib.
- Gunakan `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field (misal `limit` atau body invalid).
- 401/403: token salah/tenant tidak aktif/tidak berhak.
- 404: resource tidak ditemukan (role/policy/user-role).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Untuk list, siapkan handler `limit` dan `cursor` serta konsumsi `meta.pagination`.
- Pastikan domain policy Casbin mengacu ke `jenis_tenant` (di-backend diambil dari klaim JWT).
- Sinkronkan UI setelah tambah/hapus permission atau user-role.

Tautan teknis (opsional): implementasi ada di `internal/modules/authorization/*.go` bila diperlukan detail lebih lanjut.
