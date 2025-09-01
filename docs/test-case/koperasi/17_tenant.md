# Test Case — Tenant (Operasional Koperasi)

Catatan rujukan: `docs/modules/tenant.md`

Fokus: operasi yang relevan untuk tenant non-vendor pada tenant-nya sendiri.

## Detail Tenant & Modules

### KOP-TEN-001 — Detail tenant sendiri
- GET `/tenants/{id}` dengan `{id}=<tenant_koperasi_id>` → 200 `data` Tenant.

### KOP-TEN-002 — List modules tenant (cursor)
- GET `/tenants/{id}/modules?limit=10` → 200 `data[]` + `meta.pagination`.

### KOP-TEN-003 — Upsert status modul tenant
- PATCH `/tenants/{id}/modules` body `{ "module_id": "<uuid>", "status": "aktif" }` → 200 `data.status`.

## Users di Tenant (oleh Admin Koperasi)

### KOP-TEN-010 — Tambah user operasional
- POST `/tenants/{id}/users` body `{ "email": "kasir@kop.id", "password": "rahasia", "full_name": "Kasir A", "tenant_role_id": <role_id> }` → 201 `data.user_id`.

### KOP-TEN-011 — List user (cursor string)
- GET `/tenants/{id}/users?limit=10` → 200 `data[]` + `meta.pagination`.

## Negative & Validasi

### KOP-TEN-020 — Akses tenant berbeda
- Mengakses `/tenants/{id}` milik tenant lain → 403/404.

### KOP-TEN-021 — Body/path invalid
- `module_id` kosonng/invalid, `status` bukan `aktif|nonaktif`, `{id}` non-angka → 400.

