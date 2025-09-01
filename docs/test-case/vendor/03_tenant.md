# Test Case — Tenant Management (Vendor)

Catatan rujukan: `docs/modules/tenant.md`, `internal/modules/tenant/vendor_routes.go`, `internal/modules/tenant/vendor_handler.go`, `internal/modules/tenant/routes.go`

## Self-Registration (Publik)

### VND-TEN-001 — Registrasi tenant (self-service) sukses
- Tujuan: Calon tenant mendaftar dan menerima `registration_id` untuk OTP.
- Langkah:
  1. POST `/vendor/tenants` body minimal: `{ "name": "KSP Maju", "domain": "ksp-maju.id", "type": "koperasi", "full_name": "Admin Awal", "email": "admin@ksp-maju.id", "password": "rahasia", "primary_plan_id": <plan_id> }`.
- Hasil: 201 `data.registration_id` (uuid). OTP terkirim via email (simulasikan sesuai env).

### VND-TEN-002 — Verifikasi OTP sukses
- Pra-syarat: Memiliki `registration_id` + OTP valid.
- Langkah: POST `/vendor/tenants/verify` body `{ "registration_id": "<uuid>", "otp": "123456" }`.
- Hasil: 200 `tenant verified`. Efek: Tenant aktif, user awal dibuat, langganan/Invoice awal dibuat sesuai plan.

### VND-TEN-003 — Registrasi invalid (validasi)
- Langkah: POST `/vendor/tenants` dengan field wajib kosong/invalid (mis. `type=vendor`, domain duplikat).
- Hasil: 400 `validation error` detail per field.

### VND-TEN-004 — Verifikasi OTP gagal
- Langkah: POST `/vendor/tenants/verify` dengan OTP salah atau `registration_id` tidak dikenal.
- Hasil: 400 `verification failed`.

## Kontrol Status Tenant (Admin Vendor)

### VND-TEN-010 — Nonaktifkan tenant (admin_vendor)
- Tujuan: Admin vendor menonaktifkan tenant tertentu.
- Pra-syarat: Login sebagai `admin_vendor` (tenant vendor); memiliki `tenant_id` target non-vendor.
- Langkah: PATCH `/vendor/tenants/{id}/status` body `{ "is_active": false }`.
- Hasil: 200 `data.is_active`=false. Efek samping: subscription billing tenant dihentikan/ditangguhkan (cek via Billing — lihat VND-BILL-060).

### VND-TEN-011 — Aktifkan kembali tenant
- Langkah: PATCH `/vendor/tenants/{id}/status` body `{ "is_active": true }`.
- Hasil: 200 `data.is_active`=true.

### VND-TEN-012 — Ditolak bila role bukan admin_vendor
- Pra-syarat: Login non-vendor atau role lain.
- Langkah: PATCH `/vendor/tenants/{id}/status`.
- Hasil: 403 `errors.role`=`forbidden`.

## Operasi Tenant (Core, via /tenants)

### VND-TEN-020 — List tenants (paginasi) — cek cursor/limit
- Langkah: GET `/tenants?limit=10` dengan `Authorization` vendor.
- Hasil: 200 `data[]` dan `meta.pagination.next_cursor` bila ada.

### VND-TEN-021 — Create tenant (khusus vendor)
- Langkah: POST `/tenants` body `{ "name": "UMKM Jaya", "type": "umkm", "domain": "umkm-jaya.id" }`.
- Hasil: 201 `data` Tenant baru.

### VND-TEN-022 — Detail tenant
- Langkah: GET `/tenants/{id}` untuk tenant yang ada.
- Hasil: 200 `data` Tenant; 404 bila tidak ada.

### VND-TEN-023 — Update tenant (name/type)
- Langkah: PATCH `/tenants/{id}` body `{ "name": "UMKM Jaya Abadi", "type": "umkm" }`.
- Hasil: 200 `data` terbaru.

### VND-TEN-024 — Update status aktif (core)
- Langkah: PATCH `/tenants/{id}/status` body `{ "is_active": false }`.
- Hasil: 200 `data.is_active` sesuai permintaan.

### VND-TEN-025 — Get tenant by domain (publik)
- Langkah: GET `/tenant/by-domain?domain=umkm-jaya.id`.
- Hasil: 200 `data.tenant_id`, `data.type`, `data.is_active`.

## Modules & Users di Tenant (oleh Vendor untuk tenant non-vendor)

### VND-TEN-030 — List modul per tenant (cursor)
- Langkah: GET `/tenants/{id}/modules?limit=10`.
- Hasil: 200 `data[]` dengan `name`, `code`, `status` dan pagination.

### VND-TEN-031 — Upsert status modul tenant
- Langkah: PATCH `/tenants/{id}/modules` body `{ "module_id": "<uuid>", "status": "aktif" }`.
- Hasil: 200 `data.status` diperbarui (aktif/nonaktif).

### VND-TEN-032 — Tambah user ke tenant
- Langkah: POST `/tenants/{id}/users` body `{ "email": "kasir@umkm-jaya.id", "password": "rahasia", "full_name": "Kasir A", "tenant_role_id": 7 }`.
- Hasil: 201 `data.user_id`.

### VND-TEN-033 — List user per tenant (cursor string)
- Langkah: GET `/tenants/{id}/users?limit=10`.
- Hasil: 200 `data[]` dan `meta.pagination`.

## Negative & Validasi

### VND-TEN-040 — Validasi `limit`/`cursor` tidak valid
- Langkah: GET `/tenants?limit=-1` atau `cursor` tidak valid.
- Hasil: 400 `validation error`.

### VND-TEN-041 — Akses tanpa header/izin
- Langkah: Panggil endpoint non-publik tanpa `Authorization`/`X-Tenant-ID`.
- Hasil: 401/403 sesuai middleware.

