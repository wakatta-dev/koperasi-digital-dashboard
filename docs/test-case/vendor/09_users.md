# Test Case — Users (Vendor)

Catatan rujukan: `docs/modules/user.md`

Catatan: Modul ini mengelola user pada tenant saat ini. Untuk vendor, umumnya dipakai untuk akun internal vendor.

## CRUD Pengguna

### VND-USER-001 — Create user vendor
- Langkah: POST `/users` body `{ "tenant_role_id": <role_id>, "email": "support@vendor.id", "password": "rahasia", "full_name": "Support Agent" }` dengan token vendor.
- Hasil: 201 `data.id`, `data.email`, `data.tenant_id`=vendor.

### VND-USER-002 — List user (cursor numerik)
- Langkah: GET `/users?limit=20` (opsional `cursor`).
- Hasil: 200 `data[]` + `meta.pagination`.

### VND-USER-003 — Detail user
- Langkah: GET `/users/{id}`.
- Hasil: 200 `data`.

### VND-USER-004 — Update user (role/nama)
- Langkah: PUT `/users/{id}` body `{ "tenant_role_id": <role_id_baru>, "full_name": "Support A" }`.
- Hasil: 200 `data` terbaru.

### VND-USER-005 — Update status aktif/nonaktif
- Langkah: PATCH `/users/{id}/status` body `{ "status": false }`.
- Hasil: 200 `data.status`=false.

### VND-USER-006 — Delete user
- Langkah: DELETE `/users/{id}`.
- Hasil: 200 `data.id` terhapus.

## Reset Password

### VND-USER-010 — Reset password by email
- Langkah: POST `/users/reset-password` body `{ "email": "support@vendor.id", "new_password": "baru123" }`.
- Hasil: 200 `data.message`=`password reset`.

## Negative & Validasi

### VND-USER-020 — Validasi body create/update
- Field wajib kosong/format salah → 400 `validation error`.

### VND-USER-021 — Akses tanpa header/tenant salah
- Hilang `Authorization`/`X-Tenant-ID` → 401/403.

### VND-USER-022 — Email duplikat (unik global)
- Langkah: POST `/users` dengan email yang sudah ada (di tenant manapun).
- Hasil: 409/400 sesuai kebijakan unik; error pada bidang `email`.
