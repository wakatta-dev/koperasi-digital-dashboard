# Modul Users

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Users. Modul ini menangani CRUD pengguna dalam konteks tenant yang terisolasi.

Referensi implementasi utama terdapat pada:
- `internal/modules/user/dto.go`
- `internal/modules/user/repository.go`
- `internal/modules/user/service.go`
- `internal/modules/user/handler.go`
- `internal/modules/user/routes.go`
- `internal/modules/user/vendor_service.go`
- `internal/modules/user/vendor_handler.go`
- `internal/modules/user/vendor_routes.go`

## Ringkasan Peran per Tenant

- Vendor: tidak menambah user langsung ke tenant selain untuk akun vendor; pengelolaan user tenant dilakukan oleh admin tenant.
- Koperasi/UMKM/BUMDes: mengelola akun pengguna operasional (anggota, bendahara, kasir, dsb.).

## Arsitektur & Komponen

- Repository: akses data entitas `auth.User` (CRUD, listing per-tenant dengan cursor numerik).
- Service: logika bisnis pembuatan user (bcrypt hash), pembaruan profil, pembaruan status, penghapusan, reset password.
- Handler (HTTP): validasi input, parsing query/path, respon seragam.

## Entitas & Skema Data

- User (`auth.User`)
  - `id`, `tenant_id`, `tenant_role_id`, `email` (unik), `password_hash`, `full_name`, `status`, timestamps

## Alur Bisnis Utama

1) Pembuatan User
- Input email, password, nama lengkap, dan `tenant_role_id`.
- Password di-hash dengan bcrypt; status default aktif (`true`).

2) Listing User per Tenant
- Menggunakan cursor numerik (berdasarkan `id`) dan `limit` agar efisien.

3) Pembaruan & Penghapusan
- Perbarui `tenant_role_id` dan/atau `full_name`. Ubah `status` aktif/nonaktif. Dapat melakukan delete.

4) Reset Password
- Cari user berdasarkan email, set `password_hash` baru menggunakan bcrypt.

## Endpoint API

Semua response menggunakan format `APIResponse`.

- `POST /users/`: buat user baru pada tenant saat ini.
- `GET /users/?limit={n}&cursor={cursor?}`: daftar user untuk tenant saat ini (cursor numerik id terakhir).
- `GET /users/{id}`: detail user.
- `PUT /users/{id}`: update `tenant_role_id`/`full_name`.
- `PATCH /users/{id}/status`: update `status` aktif/nonaktif.
- `DELETE /users/{id}`: hapus user.
- `POST /users/reset-password`: reset password berdasarkan email.

Vendor (admin vendor) — internal pengguna vendor:
- `POST /api/vendor/users` — undang user vendor (email, nama, role).
- `GET /api/vendor/users?limit={n}&cursor={id?}` — daftar user vendor (cursor numerik).
- `PATCH /api/vendor/users/{id}/role` — ubah role user vendor.
- `DELETE /api/vendor/users/{id}` — hapus user vendor.

Vendor Users
- POST `/api/vendor/users` — undang user vendor
- GET `/api/vendor/users` — daftar user vendor (cursor numerik)
- PATCH `/api/vendor/users/{id}/role` — ubah role user vendor
- DELETE `/api/vendor/users/{id}` — hapus user vendor

Keamanan: semua endpoint dilindungi `Bearer` token + `XTenantID`.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `POST /users/`
  - Body CreateUserRequest:
    - `tenant_role_id` (wajib, uint)
    - `email` (wajib, email valid)
    - `password` (wajib)
    - `full_name` (wajib)
  - Response 201: `data` User (termasuk id, email, full_name, tenant_id, tenant_role_id, status, timestamps).

- `GET /users/?limit={n}&cursor={c?}`
  - Query: `limit` (wajib, int>0), `cursor` (opsional, string id terakhir)
  - Response 200: `data` array User + `meta.pagination`.

- `GET /users/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` User; 404 jika tidak ditemukan.

- `PUT /users/{id}`
  - Path: `id` (int, wajib)
  - Body UpdateUserRequest (opsional): `tenant_role_id`, `full_name`
  - Response 200: `data` User terkini.

- `PATCH /users/{id}/status`
  - Path: `id` (int, wajib)
  - Body UpdateStatusRequest: `{ "status": true|false }`
  - Response 200: `data` `{ "status": <bool> }`.

- `DELETE /users/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` `{ "id": <int> }`.

- `POST /users/reset-password`
  - Body ResetPasswordRequest:
    - `email` (wajib)
    - `new_password` (wajib)
  - Response 200: `data` `{ "message": "password reset" }`.

- `POST /api/vendor/users`
  - Body:
    - `email` (wajib, email valid)
    - `full_name` (wajib)
    - `role_id` (wajib, uint)
  - Response 201: `data` User

- `GET /api/vendor/users?limit={n}&cursor={c?}`
  - Query: `limit` (wajib), `cursor` (opsional, id terakhir)
  - Response 200: `data` array User + `meta.pagination`.

- `PATCH /api/vendor/users/{id}/role`
  - Path: `id` (int, wajib)
  - Body: `{ "role_id": <uint> }`
  - Response 200: `data` `{ "id": <int> }`.

- `DELETE /api/vendor/users/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` `{ "id": <int> }`.

## Contoh Payload

- Create User
```json
{
  "tenant_role_id": 7,
  "email": "kasir@toko.id",
  "password": "rahasia",
  "full_name": "Kasir Toko"
}
```

- Update User
```json
{ "tenant_role_id": 8, "full_name": "Kasir A" }
```

- Update Status
```json
{ "status": false }
```

- Reset Password
```json
{ "email": "kasir@toko.id", "new_password": "baru123" }
```

## Status & Transisi

- User: `status` true/false untuk mengaktifkan/menonaktifkan akses.

## Paginasi & Response

- Paginasi cursor numerik (id terakhir) dan `limit` wajib pada listing.
- `meta.pagination` berisi `next_cursor`, `has_next`, `has_prev`, `limit`.

## Integrasi & Dampak ke Modul Lain

- Role: `tenant_role_id` menentukan peran akses lewat Casbin.
- Auth: kredensial user digunakan untuk login dan generasi JWT.

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
