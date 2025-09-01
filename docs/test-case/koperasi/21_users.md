# Test Case — Users (Koperasi)

Catatan rujukan: `docs/modules/user.md`

## CRUD Pengguna Tenant Koperasi

### KOP-USER-001 — Create user
- POST `/users` body `{ "tenant_role_id": <role_id>, "email": "kasir@kop.id", "password": "rahasia", "full_name": "Kasir A" }` → 201 `data` User.

### KOP-USER-002 — List user (cursor numerik)
- GET `/users?limit=20` (opsional `cursor`) → 200 `data[]` + `meta.pagination`.

### KOP-USER-003 — Detail user
- GET `/users/{id}` → 200 `data` atau 404.

### KOP-USER-004 — Update user
- PUT `/users/{id}` body `{ "tenant_role_id": <role_id_baru>, "full_name": "Kasir A-1" }` → 200.

### KOP-USER-005 — Update status aktif/nonaktif
- PATCH `/users/{id}/status` body `{ "status": false }` → 200 `{ "status": false }`.

### KOP-USER-006 — Delete user
- DELETE `/users/{id}` → 200 `{ "id": <id> }`.

## Reset Password

### KOP-USER-010 — Reset password by email
- POST `/users/reset-password` body `{ "email": "kasir@kop.id", "new_password": "baru123" }` → 200.

## Negative & Validasi

### KOP-USER-020 — Validasi body create/update
- Field wajib kosong/format salah → 400.

### KOP-USER-021 — Akses tanpa header/tenant salah
- Hilang Authorization/tenant header → 401/403.

### KOP-USER-022 — Email duplikat
- POST `/users` dengan `email` yang sudah ada → 409/400.

