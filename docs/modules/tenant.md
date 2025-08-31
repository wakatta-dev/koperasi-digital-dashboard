# Modul Tenant

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Tenant. Modul ini mengelola data tenant, keanggotaan pengguna dalam tenant, serta aktivasi/nonaktif modul per-tenant.

Referensi implementasi utama terdapat pada:
- `internal/modules/tenant/entity.go`
- `internal/modules/tenant/dto.go`
- `internal/modules/tenant/repository.go`
- `internal/modules/tenant/service.go`
- `internal/modules/tenant/handler.go`
- `internal/modules/tenant/routes.go`

## Ringkasan Peran per Tenant

- Vendor: membuat tenant baru non-vendor, melihat/mengelola tenant, melihat modul-tenant.
- Koperasi/UMKM/BUMDes: melihat tenant miliknya, mengelola pengguna di dalam tenant (non-vendor), melihat dan memperbarui status modul tenant.

## Arsitektur & Komponen

- Repository: akses data untuk `auth.Tenant`, `UserTenantAccess`, `Module`, dan `TenantModule` (CRUD dan listing dengan cursor).
- Service: logika bisnis (buat tenant, tambah user, ubah status aktif tenant, daftar user, daftar modul, dan upsert status modul).
- Handler (HTTP): validasi input, parsing query/path, respon terstandarisasi, endpoint publik by-domain.

## Entitas & Skema Data

- auth.Tenant
  - `id`, `name`, `domain` (unik), `type` (`vendor|koperasi|umkm|bumdes`), `is_active`, timestamps
- UserTenantAccess (`tenant.UserTenantAccess`)
  - `id` (uuid), `user_id`, `tenant_id`, `tenant_role_id`, timestamps; kolom denormalisasi `user_email`, `user_full_name`
- Module (`tenant.Module`)
  - `id` (uuid), `name`, `code` (unik), `description`, timestamps
- TenantModule (`tenant.TenantModule`)
  - `id` (uuid), `tenant_id`, `module_id`, `status` (`aktif|nonaktif`), `start_date?`, `end_date?`, timestamps; denormalisasi `name`, `code`

Status penting:
- `schema.TenantModuleStatusAktif = "aktif"`, `schema.TenantModuleStatusNonaktif = "nonaktif"`.

## Alur Bisnis Utama

1) Pembuatan Tenant (oleh Vendor)
- Input `name`, `type` (bukan `vendor`), `domain` unik.
- Sistem membuat `auth.Tenant` dan otomatis menambahkan akses pembuat sebagai role super admin (via `superRoleID`).

2) Pengelolaan Pengguna Tenant (non-Vendor)
- Menambahkan user baru ke tenant (membuat `auth.User` dan menulis `UserTenantAccess`).
- Listing user dengan cursor string (berdasarkan kolom `id` uuid pada tabel akses).

3) Aktivasi/Nonaktif Modul Tenant
- Update atau upsert `TenantModule` per `module_id` untuk menandai `aktif/nonaktif`.
- Digunakan juga oleh modul Billing untuk suspend/aktifkan semua modul saat status langganan berubah.

4) Status Tenant
- Ubah `is_active` untuk menonaktifkan/aktifkan tenant secara global.

## Endpoint API

Semua response menggunakan format `APIResponse`. Paginasi menggunakan cursor pada beberapa endpoint.

- Tenants
  - `GET /tenants/?limit={n}&cursor={cursor?}`: daftar tenant (cursor numerik berdasarkan `id`).
  - `POST /tenants/`: buat tenant baru (khusus `vendor`; `type` tidak boleh `vendor`).
  - `GET /tenants/{id}`: detail tenant.
  - `PATCH /tenants/{id}`: perbarui `name`/`type`.
  - `PATCH /tenants/{id}/status`: ubah `is_active`.

- Users di Tenant
  - `POST /tenants/{id}/users`: tambah user ke tenant.
  - `GET /tenants/{id}/users?limit={n}&cursor={cursor?}`: daftar user (cursor string dari `user_tenant_access.id`).

- Modules di Tenant
  - `GET /tenants/{id}/modules?limit={n}&cursor={cursor?}`: daftar modul tenant (cursor string berdasarkan `tenant_modules.id`).
  - `PATCH /tenants/{id}/modules`: upsert status modul (`aktif|nonaktif`).

- Publik
  - `GET /tenant/by-domain?domain={domain}`: dapatkan `tenant_id`, `nama`, `type`, `is_active` berdasarkan domain.

Keamanan: seluruh endpoint selain by-domain dilindungi `Bearer` token + `XTenantID`; pembuatan tenant dibatasi untuk tenant `vendor`.

## Rincian Endpoint (Params, Payload, Response)

Header umum (non-publik):
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `GET /tenants/?limit={n}&cursor={cursor?}`
  - Query: `limit` (wajib, int>0), `cursor` (opsional, string id terakhir)
  - Response 200: `data` array Tenant + `meta.pagination`.

- `POST /tenants/`
  - Body CreateTenantRequest:
    - `name` (wajib)
    - `type` (wajib; tidak boleh `vendor`)
    - `domain` (wajib, unik)
  - Syarat: hanya tenant bertipe `vendor` yang boleh memanggil.
  - Response 201: `data` Tenant baru.

- `GET /tenants/{id}`
  - Path: `id` (int, wajib; harus sama dengan `X-Tenant-ID` karena isolasi akses)
  - Response 200: `data` Tenant; 404 jika tidak ditemukan.

- `PATCH /tenants/{id}`
  - Path: `id` (int, wajib)
  - Body UpdateTenantRequest: `name` (wajib), `type` (wajib)
  - Response 200: `data` Tenant terkini.

- `PATCH /tenants/{id}/status`
  - Path: `id` (int, wajib)
  - Body UpdateStatusRequest: `{ "is_active": true|false }`
  - Response 200: `data` `{ "is_active": <bool> }`.

- `POST /tenants/{id}/users`
  - Path: `id` (int, wajib)
  - Body AddUserRequest:
    - `email` (wajib, email valid)
    - `password` (wajib)
    - `full_name` (wajib)
    - `tenant_role_id` (wajib, uint)
  - Catatan: untuk tenant non-`vendor`.
  - Response 201: `data` `{ "user_id": <uint> }`.

- `GET /tenants/{id}/users?limit={n}&cursor={c?}`
  - Path: `id` (int, wajib)
  - Query: `limit` (wajib, int>0), `cursor` (opsional, string uuid baris terakhir)
  - Response 200: `data` array `UserTenantAccess` + pagination.

- `GET /tenants/{id}/modules?limit={n}&cursor={c?}`
  - Path: `id` (int, wajib)
  - Query: `limit` (wajib, int>0), `cursor` (opsional, string uuid baris terakhir)
  - Response 200: `data` array `TenantModule` (termasuk denormalisasi `name`, `code`).

- `PATCH /tenants/{id}/modules`
  - Path: `id` (int, wajib)
  - Body UpdateModuleRequest: `{ "module_id": "<uuid>", "status": "aktif|nonaktif" }`
  - Response 200: `data` `{ "module_id": "...", "status": "..." }`.

- `GET /tenant/by-domain?domain={domain}` (publik)
  - Query: `domain` (wajib)
  - Response 200: `data` `{ "tenant_id": <uint>, "nama": "...", "type": "...", "is_active": <bool> }`.

## Contoh Payload

- Create Tenant
```json
{
  "name": "Koperasi Makmur",
  "type": "koperasi",
  "domain": "makmur.id"
}
```

- Update Status Tenant
```json
{ "is_active": true }
```

- Add User ke Tenant
```json
{
  "email": "anggota@makmur.id",
  "password": "rahasia",
  "full_name": "Anggota Baru",
  "tenant_role_id": 5
}
```

- Update Status Modul Tenant
```json
{ "module_id": "<uuid-module>", "status": "aktif" }
```

## Status & Transisi

- Tenant: `is_active` true/false mengontrol akses global tenant.
- TenantModule: `aktif` ↔ `nonaktif` (oleh admin tenant atau otomatis oleh Billing saat suspend/restore langganan).

## Paginasi & Response

- ListTenants: cursor numerik (id terakhir), `limit` wajib.
- ListUsers/ListModules: cursor string (uuid id baris terakhir), `limit` wajib.
- Bidang `meta.pagination` berisi `next_cursor`, `has_next`, `has_prev`, dan `limit`.

## Integrasi & Dampak ke Modul Lain

- Billing: menonaktifkan (`nonaktif`) atau mengaktifkan (`aktif`) semua `TenantModule` saat invoice menjadi `overdue` atau payment diverifikasi.
- Auth/Role: keanggotaan user ke tenant dicatat di `user_tenant_access` dan peran via `tenant_role_id`.

## Keamanan

- Middleware memastikan isolasi tenant (`XTenantID`) dan otorisasi via Casbin.
- Pembuatan tenant hanya oleh tenant `vendor` dan `type` tidak boleh `vendor`.

## Catatan Implementasi

- Cursor `ListUsers`/`ListModules` berupa string (uuid) untuk kompatibilitas driver DB.
- Endpoint by-domain bersifat publik untuk membantu proses pemilihan tenant saat login.

## Peran Modul Tenant per Jenis Tenant (Rangkuman)

- Vendor: membuat dan mengelola tenant; memantau modul tenant.
- Koperasi/UMKM/BUMDes: mengelola user internal dan status modul per-tenant.

## Skenario Penggunaan

1. Admin Vendor membuat tenant Koperasi baru melalui `POST /tenants/`.
2. Admin Tenant menambahkan user internal ke tenant (`POST /tenants/{id}/users`).
3. Admin Tenant mengaktifkan modul yang diperlukan (`PATCH /tenants/{id}/modules`).
4. Sistem Billing otomatis menonaktifkan modul saat langganan `suspended` dan mengaktifkan kembali saat `paid`.
