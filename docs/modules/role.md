# Modul Roles & Permissions

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Roles. Modul ini mengelola role (per tenant), pemetaan user-role, serta permission berbasis Casbin.

Referensi implementasi utama terdapat pada:
- `internal/modules/role/entity.go`
- `internal/modules/role/dto.go`
- `internal/modules/role/repository.go`
- `internal/modules/role/service_role.go`
- `internal/modules/role/service_user_role.go`
- `internal/modules/role/service_permission.go`
- `internal/modules/role/handler.go`
- `internal/modules/role/routes.go`

## Ringkasan Peran per Tenant

- Vendor: mengelola role global dan mengikat role ke tenant-tenant (AssignRoleToTenant).
- Koperasi/UMKM/BUMDes: mengelola pemetaan user-role pada tenantnya dan permission (policy) sesuai domain tenant.

## Arsitektur & Komponen

- Repository: akses data untuk `auth.Role`, `auth.TenantRole`, `RoleUser`, dan tabel `casbin_rule`.
- Services:
  - RoleService: CRUD role + assign role ke tenant (`TenantRole`).
  - UserRoleService: assign/hapus role pada user per tenant + sinkronisasi Casbin grouping policy.
  - PermissionService: list/tambah/hapus Casbin policy (objek/aksi) per role dan domain (`tenant_type`).
- Handler (HTTP): endpoint listing/pembuatan role, binding ke tenant, manajemen permission dan user-role.

## Entitas & Skema Data

- Role (`auth.Role`) — `id`, `name` (unik), `jenis_tenant`, `description`, timestamps
- TenantRole (`auth.TenantRole`) — `id`, `tenant_id`, `role_id`, preload `Role`
- RoleUser (`role.RoleUser`) — `id`, `user_id`, `role_id`, `tenant_id`, preload `Role`
- CasbinRule (`role.CasbinRule`) — `id`, `ptype`, `v0..v5` (mirror `casbin_rule`)

Kamus Casbin (konvensi):
- Grouping policy: subject=`user_id` (string), role=`role_name`, domain=`tenant_type`.
- Policy: `p, role_name, tenant_type, obj, act`.

## Alur Bisnis Utama

1) Manajemen Role
- Buat role baru, perbarui, hapus. Kaitkan role ke tenant (TenantRole) agar tersedia pada tenant tersebut.

2) Penetapan Role ke User
- Tetapkan/hapus role untuk user pada tenant tertentu, dan sinkronkan grouping policy Casbin.

3) Permission (Casbin Policy)
- Tambah/list/hapus permission (`obj`, `act`) untuk `role_name` pada domain `tenant_type`.

## Endpoint API

Semua response menggunakan format `APIResponse`. Beberapa endpoint menggunakan paginasi cursor.

- Roles
  - `GET /roles/?limit={n}&cursor={cursor?}`: daftar role (berdasarkan `TenantRole` milik tenant saat ini).
  - `POST /roles/`: buat role baru.
  - `PUT /roles/{id}`: update role.
  - `DELETE /roles/{id}`: hapus role dari tenant saat ini (menghapus binding TenantRole).
  - `POST /roles/tenants`: assign role ke tenant (membuat `TenantRole`).

- Permissions
  - `GET /roles/{id}/permissions?limit={n}&cursor={cursor?}`: daftar policy Casbin untuk role tersebut pada domain `tenant_type`.
  - `POST /roles/{id}/permissions`: tambah policy (`obj`, `act`).
  - `DELETE /roles/{id}/permissions/{pid}`: hapus policy berdasarkan id rule.

- User Roles
  - `GET /users/{id}/roles?limit={n}&cursor={cursor?}`: daftar role user (paginasi cursor numerik).
  - `POST /users/{id}/roles`: tetapkan role ke user pada tenant tertentu.
  - `DELETE /users/{id}/roles/{rid}`: hapus role dari user pada tenant saat ini.

Keamanan: semua endpoint dilindungi `Bearer` token + `XTenantID`; Casbin digunakan untuk otorisasi berlapis.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `GET /roles/?limit={n}&cursor={c?}`
  - Query: `limit` (wajib, int>0), `cursor` (opsional)
  - Response 200: `data` array Role yang terikat dengan tenant saat ini (melalui `TenantRole`).

- `POST /roles/`
  - Body CreateRoleRequest: `{ "name": "...", "description": "..." }` (keduanya wajib)
  - Response 201: `data` Role baru.

- `PUT /roles/{id}`
  - Path: `id` (int, wajib)
  - Body UpdateRoleRequest: sama seperti create (wajib)
  - Response 200: `data` Role terkini.

- `DELETE /roles/{id}`
  - Path: `id` (int, wajib)
  - Efek: menghapus binding role dari tenant saat ini (TenantRole), bukan menghapus definisi role global.
  - Response 200: `data` `{ "id": <int> }`.

- `POST /roles/tenants`
  - Body AssignRoleToTenantRequest: `{ "role_id": <uint>, "tenant_id": <uint> }` (wajib)
  - Response 201: `data` TenantRole baru.

- `GET /roles/{id}/permissions?limit={n}&cursor={c?}`
  - Path: `id` (int, wajib)
  - Query: `limit` (wajib), `cursor` (opsional)
  - Domain kebijakan diambil dari `tenant_type` (klaim JWT) secara otomatis.
  - Response 200: `data` array CasbinRule.

- `POST /roles/{id}/permissions`
  - Path: `id` (int, wajib)
  - Body PermissionRequest: `{ "obj": "/resource", "act": "GET|POST|..." }` (wajib)
  - Response 201: `data` `{ "obj": "...", "act": "..." }`.

- `DELETE /roles/{id}/permissions/{pid}`
  - Path: `id` (role id, int), `pid` (permission id, int) — keduanya wajib
  - Response 200: `data` `{ "id": <int> }`.

- `GET /users/{id}/roles?limit={n}&cursor={c?}`
  - Path: `id` (user id, int, wajib)
  - Query: `limit` (wajib), `cursor` (opsional)
  - Response 200: `data` array RoleUser (dengan preload Role) + pagination.

- `POST /users/{id}/roles`
  - Path: `id` (user id, int, wajib)
  - Body AssignRoleRequest: `{ "role_id": <uint>, "tenant_id": <uint> }` (wajib)
  - Response 201: `data` `{ "user_id": <int>, "role_id": <uint> }`.

- `DELETE /users/{id}/roles/{rid}`
  - Path: `id` (user id), `rid` (role id) — wajib
  - Response 200: `data` `{ "user_id": <int>, "role_id": <int> }`.

## Contoh Payload

- Create/Update Role
```json
{ "name": "admin_keuangan", "description": "Akses modul keuangan" }
```

- Assign Role ke Tenant
```json
{ "role_id": 7, "tenant_id": 23 }
```

- Add Permission ke Role
```json
{ "obj": "/transactions", "act": "GET" }
```

- Assign Role ke User
```json
{ "role_id": 7, "tenant_id": 23 }
```

## Status & Transisi

- Tidak ada status eksplisit; manajemen relasi (create/update/delete) dan policy (add/remove) menjadi fokus.

## Paginasi & Response

- Endpoint list mendukung `limit` dan `cursor` (numerik untuk id autoincrement). `meta.pagination` tersedia.

## Integrasi & Dampak ke Modul Lain

- Auth: klaim JWT memuat `role`, digunakan oleh Casbin bersama `tenant_type` sebagai domain.
- Tenants/Users: penyelarasan peran dilakukan per-tenant melalui `TenantRole` dan pemetaan `RoleUser`.

## Keamanan

- Casbin menegakkan kebijakan akses berdasarkan kombinasi subject (`user_id`), role, dan domain (`tenant_type`).

## Catatan Implementasi

- Saat menghapus binding role-user, grouping policy Casbin juga dihapus dan disimpan.
- Saat menambah permission, pastikan domain yang digunakan adalah `tenant_type` dari token.

## Peran Modul Roles per Jenis Tenant (Rangkuman)

- Vendor: mendefinisikan role, mengikatnya ke tenant-tenant.
- Koperasi/UMKM/BUMDes: mengatur role pengguna dan permission operasional per tenant.

## Skenario Penggunaan

1. Admin vendor membuat role baru dan menambahkannya ke tenant tertentu.
2. Admin tenant menetapkan role kepada user dan menambahkan permission `GET` untuk objek yang diperlukan.
3. Saat user berpindah tugas, admin menghapus role dari user dan Casbin di-update otomatis.
