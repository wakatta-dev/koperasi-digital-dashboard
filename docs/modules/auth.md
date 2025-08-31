# Modul Auth

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Auth. Modul ini menangani autentikasi JWT (login/refresh/logout), pengelolaan refresh token, serta menanamkan konteks tenant dan role untuk otorisasi.

Referensi implementasi utama terdapat pada:
- `internal/modules/auth/entity.go`
- `internal/modules/auth/dto.go`
- `internal/modules/auth/jwt.go`
- `internal/modules/auth/repository.go`
- `internal/modules/auth/service.go`
- `internal/modules/auth/handler.go`
- `internal/modules/auth/routes.go`

## Ringkasan Peran per Tenant

- Vendor: menghasilkan token akses untuk admin/support; digunakan mengelola tenant dan modul global.
- Koperasi/UMKM/BUMDes: login pengguna operasional; token memuat konteks tenant untuk pembatasan akses.

## Arsitektur & Komponen

- Repository: akses data untuk `User`, `Tenant`, `Role`, `RefreshToken` (buat/baca/hapus).
- Service: logika autentikasi (validasi kredensial, hashing bcrypt, pembuatan JWT, manajemen refresh token).
- JWTManager: pembangkit dan parser JWT, memuat klaim `user_id`, `tenant_id`, `tenant_type`, `role` dengan TTL dari konfigurasi.
- Handler (HTTP): endpoint `login`, `refresh`, dan `logout` dengan validasi input dan response terstandarisasi.

## Entitas & Skema Data

- Tenant (`auth.Tenant`)
  - `id`, `name`, `domain` (unik), `type` (`vendor|koperasi|umkm|bumdes`), `is_active`, timestamps
- Role (`auth.Role`)
  - `id`, `name` (unik), `jenis_tenant`, `description`, timestamps
- TenantRole (`auth.TenantRole`)
  - `id`, `tenant_id`, `role_id`, preload `Tenant`, `Role`
- User (`auth.User`)
  - `id`, `tenant_id`, `tenant_role_id`, `email` (unik), `password_hash`, `full_name`, `status`, `last_login?`, timestamps
- RefreshToken (`auth.RefreshToken`)
  - `token` (PK), `user_id` (unik), `expires_at`

Klaim JWT (`auth.Claims`): `user_id`, `tenant_id`, `tenant_type`, `role`, serta `exp`/`iat`.

## Alur Bisnis Utama

1) Login
- Validasi email/password dengan bcrypt.
- Verifikasi `tenant_id` dari konteks header `XTenantID` harus sama dengan `user.tenant_id`.
- Hasilkan `access_token` (JWT) dan `refresh_token` (disimpan/di-upsert per user dengan masa berlaku 24 jam default).

2) Refresh Token
- Validasi keberadaan dan kedaluwarsa `refresh_token`.
- Ambil user, buat `access_token` baru tanpa mengubah `refresh_token`.

3) Logout
- Menghapus `refresh_token` aktif milik user.

## Endpoint API

Semua response menggunakan format `APIResponse`.

- `POST /auth/login` — login dan terima token.
- `POST /auth/refresh` — minta access token baru dari refresh token.
- `POST /auth/logout` — logout dan hapus refresh token.

Keamanan: endpoint login/refresh/logout tidak memerlukan Bearer token, namun membutuhkan konteks tenant via header `X-Tenant-ID` (atau domain) untuk memvalidasi tenant pengguna saat login.

## Rincian Endpoint (Params, Payload, Response)

- `POST /auth/login`
  - Header: `X-Tenant-ID` (wajib bila tidak menggunakan domain)
  - Body LoginRequest:
    - `email` (wajib, email valid)
    - `password` (wajib)
  - Response 200: `data` LoginResponse
    - `id`, `nama`, `role`, `jenis_tenant`, `email`, `access_token`, `refresh_token`, `expires_at`
  - Error 401: `invalid credentials` atau `unauthorized` jika tenant tidak cocok.

- `POST /auth/refresh`
  - Body RefreshRequest: `{ "refresh_token": "..." }` (wajib)
  - Response 200: `data` `{ "access_token": "..." }`
  - Error 401: `invalid refresh token` atau kedaluwarsa.

- `POST /auth/logout`
  - Body RefreshRequest: `{ "refresh_token": "..." }` (wajib)
  - Response 200: `data` `{ "message": "logged out" }`

## Contoh Payload

- Login
```json
{
  "email": "user@contoh.id",
  "password": "secret"
}
```

- Refresh / Logout
```json
{
  "refresh_token": "<refresh-token-string>"
}
```

## Status & Transisi

- RefreshToken: dibuat saat login, kedaluwarsa otomatis (dibersihkan saat refresh jika kadaluarsa), dihapus saat logout.

## Paginasi & Response

- Tidak ada paginasi pada modul Auth. Response mengikuti pola seragam dengan `data`, `meta`, dan `errors` bila ada.

## Integrasi & Dampak

- Token JWT membawa `tenant_type` dan `role` yang digunakan middleware Casbin untuk otorisasi.
- Modul lain (Users, Roles, Tenants, Billing, Finance, dst.) bergantung pada token ini untuk autentikasi dan isolasi tenant.

## Keamanan

- JWT ditandatangani dengan secret dari konfigurasi; TTL ditetapkan via `JWTManager`.
- Validasi konteks tenant melalui middleware yang membaca `XTenantID` dan klaim token.

## Catatan Implementasi

- Belum ada pembaruan kolom `last_login` di alur login (opsional untuk ditambahkan jika dibutuhkan audit akses).
- Pastikan domain/tenant dipilih benar sebelum login agar tidak terjadi penolakan `unauthorized`.

## Peran Modul Auth per Jenis Tenant (Rangkuman)

- Vendor: mengelola otentikasi admin/vendor untuk operasi global.
- Koperasi/UMKM/BUMDes: autentikasi pengguna operasional per-tenant untuk akses modul terkait.

## Skenario Penggunaan

1. Pengguna membuka halaman login dan memilih tenant/domain yang tepat.
2. Mengirim email+password ke `/auth/login` dan menerima `access_token` + `refresh_token`.
3. Saat `access_token` mendekati kedaluwarsa, klien memanggil `/auth/refresh` dengan `refresh_token`.
4. Saat pengguna keluar, klien memanggil `/auth/logout` untuk menghapus `refresh_token`.
