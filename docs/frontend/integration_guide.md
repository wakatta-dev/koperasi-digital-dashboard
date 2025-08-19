# Integrasi API Koperasi Digital Backend

## Dasar Integrasi
- **Base URL:** `http://localhost:8080/api`
- **Autentikasi:**
  - Header `Authorization: Bearer <access_token>`
  - Header `X-Tenant-ID: <tenant_id>` atau domain aplikasi akan dipetakan ke tenant secara otomatis
- **Format Respons:** semua endpoint mengembalikan struktur JSON dengan kunci `success`, `message`, `data`, `meta`, dan `errors`.

## Mendapatkan Tenant Berdasarkan Domain
Langkah pertama integrasi adalah menentukan tenant yang aktif berdasarkan domain yang digunakan aplikasi.

- **Endpoint:** `GET /api/tenant/by-domain?domain=<domain>`
- **Respons Contoh:**
```json
{
  "success": true,
  "data": {
    "id": "tenant-id",
    "name": "Tenant Foo",
    "domain": "foo.example.com",
    "type": "koperasi"
  }
}
```
Nilai `id` dari respons digunakan sebagai header `X-Tenant-ID` pada permintaan berikutnya.

## Autentikasi
### Login
- **Endpoint:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```
- **Respons:** `access_token` dan `refresh_token`

### Refresh Token
- **Endpoint:** `POST /api/auth/refresh`
- **Body:** `{"refresh_token": "string"}`
- **Respons:** token akses baru

### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Body:** `{"refresh_token": "string"}`
- **Respons:** konfirmasi keluar sesi

## Manajemen Tenant
Semua endpoint berikut membutuhkan `Authorization` dan `X-Tenant-ID` kecuali disebutkan sebagai publik.

| Endpoint | Method | Body |
|----------|--------|------|
| `/api/tenants` | `POST` | `{"name","type","domain"}` |
| `/api/tenants/:id` | `GET` | – |
| `/api/tenants/:id` | `PATCH` | `{"name","type"}` |
| `/api/tenants/:id/status` | `PATCH` | `{"status"}` |
| `/api/tenants/:id/users` | `POST` | `{"email","password","full_name","role_id"}` |
| `/api/tenants/:id/users` | `GET` | – |
| `/api/tenants/:id/modules` | `GET` | – |
| `/api/tenants/:id/modules` | `PATCH` | `{"module_id","status"}` |
| **Publik:** `/api/tenant/by-domain?domain=foo` | `GET` | – |

Contoh proses menambah pengguna ke tenant dapat dilihat pada handler `AddUser`.

## Manajemen Role & Permission
| Endpoint | Method | Body |
|----------|--------|------|
| `/api/roles/` | `GET` | – |
| `/api/roles/` | `POST` | `{"name","description","tenant_id"}` |
| `/api/roles/:id` | `PUT` | `{"name","description"}` |
| `/api/roles/:id` | `DELETE` | – |
| `/api/roles/:id/permissions` | `GET` | – |
| `/api/roles/:id/permissions` | `POST` | `{"obj","act"}` |
| `/api/roles/:id/permissions/:pid` | `DELETE` | – |
| `/api/users/:id/roles` | `GET` | – |
| `/api/users/:id/roles` | `POST` | `{"role_id","tenant_id"}` |
| `/api/users/:id/roles/:rid` | `DELETE` | – |

Struktur entitas role yang dikembalikan mencakup `id`, `name`, `description`, dan `tenant_id`.

## Catatan Tambahan
- Token JWT menyimpan `user_id`, `tenant_id`, `tenant_type`, dan `role` untuk kebutuhan otorisasi.
- Middleware `TenantIsolation` memastikan tiap request hanya mengakses data tenant yang valid dan sesuai dengan identitas pengguna.
