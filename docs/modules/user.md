# Users API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/users` — buat user → 201 `APIResponse<User>`
- GET `/users?term=&status=&role_id=&limit=&cursor=` — daftar user → 200 `APIResponse<User[]>`
- GET `/users/:id` — detail user → 200 `APIResponse<User>`
- PUT `/users/:id` — ubah user → 200 `APIResponse<User>`
- PATCH `/users/:id/status` — ubah status → 200 `APIResponse<{ status: boolean }>`
- DELETE `/users/:id` — hapus user → 200 `APIResponse<{ id: number }>`
- POST `/users/reset-password` — reset password → 200 `APIResponse<{ message: string }>`

## Skema Data Ringkas

- User: `id`, `tenant_id`, `tenant_role_id`, `email`, `full_name`, `status`, `created_at`, `updated_at`

## Payload Utama

- CreateUserRequest:
  - `tenant_role_id` (number, wajib)
  - `email` (string, wajib, email valid)
  - `password` (string, wajib)
  - `full_name` (string, wajib)

- UpdateUserRequest:
  - `tenant_role_id` (number, opsional)
  - `full_name` (string, opsional)

- UpdateStatusRequest:
  - `status` (boolean, wajib)

- ResetPasswordRequest:
  - `email` (string, wajib)
  - `new_password` (string, wajib)

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
export interface User {
  id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  status: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

// Requests
export interface CreateUserRequest {
  tenant_role_id: number;
  email: string;
  password: string;
  full_name: string;
}

export interface UpdateUserRequest {
  tenant_role_id?: number;
  full_name?: string;
}

export interface UpdateStatusRequest { status: boolean; }
export interface ResetPasswordRequest { email: string; new_password: string; }

// Responses
export type CreateUserResponse = APIResponse<User>;
export type ListUsersResponse = APIResponse<User[]>;
export type GetUserResponse = APIResponse<User>;
export type UpdateUserResponse = APIResponse<User>;
export type UpdateStatusResponse = APIResponse<{ status: boolean }>;
export type DeleteUserResponse = APIResponse<{ id: number }>;
export type ResetPasswordResponse = APIResponse<{ message: string }>;
```

## Paginasi & Filter

- Endpoint list menggunakan cursor numerik (`id`) dengan `limit` opsional (default `10`).
- Dukung pencarian `term` (nama/email) serta filter `status` dan `role_id`.
- Baca `meta.pagination.next_cursor` untuk memuat halaman berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field (`limit`, body invalid, dsb.).
- 401/403: token salah/tenant tidak aktif.
- 404: resource tidak ditemukan (misal user di detail/update).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Siapkan handler paginasi (limit, cursor) untuk daftar user.
- Setelah ubah status/hapus, sinkronkan state list/detail di UI.

Tautan teknis (opsional): implementasi ada di `internal/modules/core/user/*.go` bila diperlukan detail lebih lanjut.

## Keamanan

- Isolasi tenant diberlakukan oleh middleware; semua operasi terbatas pada `tenant_id` dari token.

## Catatan Implementasi

- Email unik secara global.
- Reset password tidak mengirim email; hanya mengubah hash (dapat ditambah notifikasi).

## Peran Modul Users per Jenis Tenant (Rangkuman)

- Vendor: tidak umum menambah user tenant operasional di sini; fokus di admin vendor.
- Koperasi/UMKM/BUMDes: mengelola user operasional harian.

## Skenario Penggunaan

1. Admin tenant menambahkan user kasir melalui `POST /users/`.
2. Saat rotasi peran, admin memperbarui `tenant_role_id` user.
3. Ketika user resign, admin menonaktifkan status atau menghapus user sesuai kebijakan.

## Tautan Cepat

- Auth: [auth.md](auth.md)
- Roles & Permissions: [authorization.md](authorization.md)
- Tenant: [tenant.md](tenant.md)
