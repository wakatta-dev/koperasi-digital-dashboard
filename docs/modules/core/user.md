# Users API — Panduan Integrasi Frontend (Singkat)

Modul users menyediakan CRUD pengguna tenant, undangan vendor, pengelolaan role, status, dan reset password. Response memakai `APIResponse<T>` dengan dukungan paginasi cursor untuk daftar user.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

- POST `/api/users` — `tenant admin`: buat user baru → 201 `APIResponse<User>`
- POST `/api/users/invite` — `vendor admin`: kirim undangan user vendor → 201 `APIResponse<User>`
- GET `/api/users?term=&status=&role_id=&limit=&cursor=` — `tenant admin`: daftar user → 200 `APIResponse<User[]>`
- GET `/api/users/:id` — `tenant admin`: detail user → 200 `APIResponse<User>`
- PUT `/api/users/:id` — `tenant admin`: perbarui nama/role → 200 `APIResponse<User>`
- PATCH `/api/users/:id/role` — `vendor admin`: ubah role user → 200 `APIResponse<{ id: number }>`
- PATCH `/api/users/:id/status` — `tenant admin`: aktif/nonaktif user → 200 `APIResponse<{ status: boolean }>`
- DELETE `/api/users/:id` — `tenant admin`: hapus user → 200 `APIResponse<{ id: number }>`
- POST `/api/users/reset-password` — `tenant admin`: reset password user → 200 `APIResponse<{ message: string }>`

> Pembuatan user baru membutuhkan `tenant_role_id`. Endpoint undangan (`/api/users/invite`) mengirim OTP/email sesuai flow vendor agar user menyetel password sendiri.

## Skema Data Ringkas

- User (`auth.User`): `id:number`, `tenant_id:number`, `tenant_role_id:number`, `email:string`, `full_name:string`, `status:boolean`, `last_login?:Rfc3339`, `created_at:Rfc3339`, `updated_at:Rfc3339`, `tenant_role:{ id:number, role_id:number, tenant_id:number, role:Role }`
- Role (`auth.Role`): `id:number`, `name:string`, `jenis_tenant:string`, `description?:string`
- Invite payload/respons mengikuti user standar dengan role awal.

> `status` bernilai `true` untuk user aktif; FE perlu menampilkan toggle/indikator sesuai data.

## Payload Utama

- CreateUserRequest:
  - `{ tenant_role_id: number, email: string, password: string, full_name: string }`

- UpdateUserRequest:
  - `{ tenant_role_id?: number, full_name?: string }`

- UpdateStatusRequest:
  - `{ status: boolean }`

- UpdateRoleRequest (`PATCH /users/:id/role`):
  - `{ role_id: number }`

- InviteVendorUser:
  - `{ email: string, full_name: string, role_id: number }`

- ResetPasswordRequest:
  - `{ email: string, new_password: string }`

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dengan error map terisi saat validasi gagal (`email`, `role_id`, dll).
- `ListUsers` menyertakan `meta.pagination` (`next_cursor`, `has_next`).

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

type Role = {
  id: number;
  name: string;
  jenis_tenant: string;
  description?: string;
};

type TenantRole = {
  id: number;
  tenant_id: number;
  role_id: number;
  role: Role;
};

type User = {
  id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  status: boolean;
  last_login?: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  tenant_role: TenantRole;
};

// Requests
type CreateUserRequest = {
  tenant_role_id: number;
  email: string;
  password: string;
  full_name: string;
};

type UpdateUserRequest = Partial<Omit<CreateUserRequest, 'email' | 'password'>> & {
  tenant_role_id?: number;
};

type UpdateStatusRequest = {
  status: boolean;
};

type UpdateRoleRequest = {
  role_id: number;
};

type InviteVendorUserRequest = {
  email: string;
  full_name: string;
  role_id: number;
};

type ResetPasswordRequest = {
  email: string;
  new_password: string;
};

// Responses
type UserListResponse = APIResponse<User[]>;
type UserDetailResponse = APIResponse<User>;
type UserMutationResponse = APIResponse<User>;
type UserStatusResponse = APIResponse<{ status: boolean }>;
type UserDeleteResponse = APIResponse<{ id: number }>;
type UserRoleUpdateResponse = APIResponse<{ id: number }>;
type ResetPasswordResponse = APIResponse<{ message: string }>;
```

> Gunakan `Partial` untuk `UpdateUserRequest` di FE sehingga form edit dapat mengirim hanya field yang berubah.

## Paginasi (Cursor)

- `GET /users` memakai cursor numerik (`id`) dengan `limit` default 10.
- `meta.pagination.next_cursor` dipakai untuk memuat halaman selanjutnya selama `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: validasi input (`email` invalid, `role_id` kosong, status bukan boolean).
- 401/403: konteks tenant hilang atau role tidak mempunyai akses pembuatan user.
- 404: user tidak ditemukan saat GET/PUT/DELETE.
- 500: kegagalan internal (repo, email invitation) — tampilkan pesan umum dan sarankan pengguna mencoba lagi.

## Checklist Integrasi FE

- Pastikan daftar role (`tenant_role_id`) terisi sebelum membuka form create/edit user.
- Tampilkan status user dalam bentuk toggle; konfirmasi sebelum menonaktifkan agar tidak memutus akses kritis.
- Pada flow vendor invite, perlihatkan bahwa user akan menerima email/OTP untuk aktivasi.
- Setelah reset password, informasikan user bahwa password telah diset ulang dan verifikasi login ulang.

## Tautan Teknis (Opsional)

- `internal/modules/core/user/handler.go` — implementasi endpoint user management.
- `internal/modules/core/user/service.go` — logika bisnis create/update/invite.
- `internal/modules/core/user/dto.go` — payload definisi request.
