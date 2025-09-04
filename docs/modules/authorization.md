# Modul Authorization (Roles & Permissions)

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Authorization. Modul ini mengelola role (per tenant), pemetaan user-role, serta permission berbasis Casbin.

Detail autentikasi (login, JWT) dibahas pada modul [Auth](auth.md); dokumen ini berfokus pada otorisasi dan manajemen peran.

Referensi implementasi utama terdapat pada:
- `internal/modules/authorization/entity.go`
- `internal/modules/authorization/dto.go`
- `internal/modules/authorization/repository.go`
- `internal/modules/authorization/service_role.go`
- `internal/modules/authorization/service_user_role.go`
- `internal/modules/authorization/service_permission.go`
- `internal/modules/authorization/handler.go`
- `internal/modules/authorization/routes.go`

## Ringkasan Peran per Tenant

- Vendor: mengelola role global dan mengikat role ke tenant-tenant (AssignRoleToTenant).
- Koperasi/UMKM/BUMDes (client): mengelola role lokal, pemetaan user-role, dan permission (policy) terbatas pada tenantnya sendiri.

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
- RoleUser (`authorization.RoleUser`) — `id`, `user_id`, `role_id`, `tenant_id`, preload `Role`
- CasbinRule (`authorization.CasbinRule`) — `id`, `ptype`, `v0..v5` (mirror `casbin_rule`)

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

### Roles
- `GET /roles` — vendor: daftar role global; client: role terikat pada tenant saat ini.
- `POST /roles` — vendor: buat role global; client: buat role lokal.
- `PUT /roles/{id}` — perbarui role.
- `DELETE /roles/{id}` — hapus role atau unbind dari tenant.
- `POST /roles/tenants` — vendor: assign role ke tenant.

### Permissions
- `GET /roles/{id}/permissions` — client: daftar policy Casbin untuk role.
- `POST /roles/{id}/permissions` — client: tambah policy.
- `DELETE /roles/{id}/permissions/{pid}` — client: hapus policy.

### User Roles
- `GET /users/{id}/roles` — client: daftar role user pada tenant saat ini.
- `POST /users/{id}/roles` — client: tetapkan role ke user.
- `DELETE /users/{id}/roles/{rid}` — client: hapus role dari user.

Keamanan: semua endpoint dilindungi `Bearer` token + `X-Tenant-ID`; Casbin digunakan untuk otorisasi berlapis.

## Rincian Endpoint (Params, Payload, Response)

 Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `GET /roles`
   - Tujuan: mengambil daftar role yang tersedia pada tenant saat ini.
   - Parameter:
     - Query: `limit` (wajib, int>0), `cursor` (opsional)
   - Respon 200: `data` array Role yang terikat dengan tenant saat ini (melalui `TenantRole`).

- `POST /roles`
   - Tujuan: membuat role baru (global untuk vendor, lokal untuk tenant).
   - Parameter:
     - Body CreateRoleRequest: `{ "name": "...", "description": "..." }` (keduanya wajib)
   - Respon 201: `data` Role baru.

- `PUT /roles/{id}`
   - Tujuan: memperbarui informasi role.
   - Parameter:
     - Path: `id` (int, wajib)
     - Body UpdateRoleRequest: sama seperti create (wajib)
   - Respon 200: `data` Role terkini.

- `DELETE /roles/{id}`
   - Tujuan: menghapus binding role dari tenant saat ini.
   - Parameter:
     - Path: `id` (int, wajib)
   - Respon 200: `data` `{ "id": <int> }` (role global tetap ada).

- `POST /roles/tenants`
   - Tujuan: mengaitkan role global ke tenant tertentu.
   - Parameter:
     - Body AssignRoleToTenantRequest: `{ "role_id": <uint>, "tenant_id": <uint> }` (wajib)
   - Respon 201: `data` TenantRole baru.
   - Akses: hanya Vendor. Client tidak dapat meng-assign role ke tenant lain.

- `GET /roles/{id}/permissions`
   - Tujuan: menampilkan daftar policy Casbin untuk role.
   - Parameter:
     - Path: `id` (int, wajib)
     - Query: `limit` (wajib), `cursor` (opsional)
   - Respon 200: `data` array CasbinRule; domain kebijakan diambil dari `tenant_type` (klaim JWT) secara otomatis.

- `POST /roles/{id}/permissions`
   - Tujuan: menambah policy pada role tertentu.
   - Parameter:
     - Path: `id` (int, wajib)
     - Body PermissionRequest: `{ "obj": "/resource", "act": "GET|POST|..." }` (wajib)
   - Respon 201: `data` `{ "obj": "...", "act": "..." }`.

- `DELETE /roles/{id}/permissions/{pid}`
   - Tujuan: menghapus policy dari role.
   - Parameter:
     - Path: `id` (role id, int), `pid` (permission id, int) — keduanya wajib
   - Respon 200: `data` `{ "id": <int> }`.

- `GET /users/{id}/roles`
   - Tujuan: mengambil daftar role yang dimiliki user pada tenant saat ini.
   - Parameter:
     - Path: `id` (user id, int, wajib)
     - Query: `limit` (wajib), `cursor` (opsional)
   - Respon 200: `data` array RoleUser (dengan preload Role) + pagination.

- `POST /users/{id}/roles`
   - Tujuan: menetapkan role ke user pada tenant tertentu.
   - Parameter:
     - Path: `id` (user id, int, wajib)
     - Body AssignRoleRequest: `{ "role_id": <uint>, "tenant_id": <uint> }` (wajib)
   - Respon 201: `data` `{ "user_id": <int>, "role_id": <uint> }`.

- `DELETE /users/{id}/roles/{rid}`
   - Tujuan: menghapus role dari user pada tenant.
   - Parameter:
     - Path: `id` (user id), `rid` (role id) — wajib
   - Respon 200: `data` `{ "user_id": <int>, "role_id": <int> }`.

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
- Client dibatasi hanya dapat mengelola role/permission dan mapping user-role pada tenant yang sama dengan `X-Tenant-ID` pada request.

## Catatan Implementasi

- Saat menghapus binding role-user, grouping policy Casbin juga dihapus dan disimpan.
- Saat menambah permission, pastikan domain yang digunakan adalah `tenant_type` dari token.

## Peran Modul Roles per Jenis Tenant (Rangkuman)

- Vendor: mendefinisikan role global dan mengikatnya ke tenant-tenant.
- Koperasi/UMKM/BUMDes: mengatur role pengguna dan permission operasional hanya untuk tenantnya sendiri.

## Skenario Penggunaan

1. Admin vendor membuat role baru dan menambahkannya ke tenant tertentu.
2. Admin tenant menetapkan role kepada user dan menambahkan permission `GET` untuk objek yang diperlukan.
3. Saat user berpindah tugas, admin menghapus role dari user dan Casbin di-update otomatis.

## Tautan Cepat

- Auth: [auth.md](auth.md)
- Users: [user.md](user.md)
- Tenant: [tenant.md](tenant.md)
