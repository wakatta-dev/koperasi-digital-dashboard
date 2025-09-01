# Test Case — Roles & Permissions (Vendor)

Catatan rujukan: `docs/modules/role.md`

## Roles (CRUD & Assign ke Tenant)

### VND-ROLE-001 — List roles (cursor)
- Langkah: GET `/roles?limit=10`.
- Hasil: 200 `data[]` role yang terikat ke tenant saat ini (via TenantRole) + pagination.

### VND-ROLE-002 — Create role baru
- Langkah: POST `/roles` body `{ "name": "admin_keuangan", "description": "Akses modul keuangan" }`.
- Hasil: 201 `data` Role baru.

### VND-ROLE-003 — Update role
- Langkah: PUT `/roles/{id}` body `{ "name": "admin_keuangan", "description": "Akses keuangan & reporting" }`.
- Hasil: 200 `data` terbaru.

### VND-ROLE-004 — Hapus role dari tenant saat ini (unbind)
- Langkah: DELETE `/roles/{id}`.
- Hasil: 200 `data.id` terhapus dari binding tenant.

### VND-ROLE-005 — Assign role ke tenant lain
- Langkah: POST `/roles/tenants` body `{ "role_id": <id_role>, "tenant_id": <tenant_client_id> }`.
- Hasil: 201 `data` TenantRole.

### VND-ROLE-006 — Assign role ke tenant tidak valid
- Langkah: POST `/roles/tenants` body `{ "role_id": <id_role>, "tenant_id": 999999 }` (tenant tidak ada).
- Hasil: 400/404 sesuai implementasi repository; pastikan error terlapor di `errors`.

### VND-ROLE-007 — Create role duplikat (name unik)
- Langkah: POST `/roles` dua kali dengan `name` yang sama.
- Hasil: request kedua gagal (409/400) dengan pesan unik/duplikat pada `errors`.

## Permissions (Casbin Policy)

### VND-ROLE-010 — List permission per role (cursor)
- Langkah: GET `/roles/{id}/permissions?limit=20`.
- Hasil: 200 `data[]` CasbinRule untuk domain `tenant_type` (diambil dari token).

### VND-ROLE-011 — Tambah permission `obj/act`
- Langkah: POST `/roles/{id}/permissions` body `{ "obj": "/transactions", "act": "GET" }`.
- Hasil: 201 `data.obj` dan `data.act`.

### VND-ROLE-012 — Hapus permission
- Langkah: DELETE `/roles/{id}/permissions/{pid}`.
- Hasil: 200 `data.id`.

### VND-ROLE-013 — Validasi permission invalid
- Langkah: POST `/roles/{id}/permissions` body `{ "obj": "", "act": "" }`.
- Hasil: 400 `validation error` (obj/act wajib diisi).

## User Roles (Mapping per User)

### VND-ROLE-020 — List role milik user (cursor)
- Langkah: GET `/users/{user_id}/roles?limit=10`.
- Hasil: 200 `data[]` role user + pagination.

### VND-ROLE-021 — Assign role ke user pada tenant tertentu
- Langkah: POST `/users/{user_id}/roles` body `{ "role_id": <role_id>, "tenant_id": <tenant_id> }`.
- Hasil: 201 `data` mapping baru; grouping policy Casbin tersinkron.

### VND-ROLE-022 — Hapus role dari user
- Langkah: DELETE `/users/{user_id}/roles/{role_id}`.
- Hasil: 200 `data` konfirmasi penghapusan.

### VND-ROLE-023 — Assign role ke user dengan tenant mismatch
- Langkah: POST `/users/{user_id}/roles` dengan `tenant_id` berbeda dari konteks/isolasi tenant.
- Hasil: 403/400 sesuai kebijakan otorisasi; mapping ditolak.

### VND-ROLE-024 — Hapus role yang tidak terpasang pada user
- Langkah: DELETE `/users/{user_id}/roles/{role_id}` saat mapping tidak ada.
- Hasil: 404/200 no-op (sesuai implementasi); validasi perilaku yang diharapkan.

## Negative & Validasi

### VND-ROLE-030 — Validasi body kosong/invalid
- Langkah: POST/PUT roles atau POST permissions tanpa field wajib.
- Hasil: 400 `validation error`.

### VND-ROLE-031 — ID/path tidak valid
- Langkah: Akses `/roles/abc` atau `permissions/{pid}` non-angka.
- Hasil: 400 `invalid id`.

### VND-ROLE-032 — Akses tanpa otorisasi
- Langkah: Hapus header `Authorization` atau `X-Tenant-ID`.
- Hasil: 401/403.

### VND-ROLE-033 — Limit/cursor tidak valid saat listing
- Langkah: GET `/roles?limit=0` atau `cursor` bukan angka.
- Hasil: 400 `validation error`.
