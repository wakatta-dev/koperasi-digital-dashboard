# Test Case — Auth (Vendor)

Catatan rujukan: `docs/modules/auth.md`

## VND-AUTH-001 — Login sukses (Vendor Admin)
- Tujuan: Mendapatkan `access_token` dan `refresh_token` untuk admin vendor.
- Pra-syarat:
  - User `admin@vendor.id` aktif pada `tenant_vendor_id`.
  - Header `X-Tenant-ID: <tenant_vendor_id>`.
- Langkah:
  1. POST `/auth/login` body `{ "email": "admin@vendor.id", "password": "secret" }`.
- Hasil Diharapkan:
  - 200 dengan `data.access_token`, `data.refresh_token`, `data.role`=`admin_vendor`, `data.jenis_tenant`=`vendor`.
  - Token dapat digunakan pada endpoint vendor.

## VND-AUTH-002 — Login gagal (password salah)
- Langkah: POST `/auth/login` dengan password salah.
- Hasil: 401 `errors.credentials` = `invalid credentials`.

## VND-AUTH-003 — Login gagal (tenant salah)
- Pra-syarat: User valid, namun `X-Tenant-ID` dikirim dengan ID tenant berbeda.
- Hasil: 401 `invalid credentials` (mismatch tenant context).

## VND-AUTH-004 — Refresh token sukses
- Pra-syarat: Memiliki `refresh_token` dari VND-AUTH-001.
- Langkah: POST `/auth/refresh` body `{ "refresh_token": "<token>" }`.
- Hasil: 200 dengan `data.access_token` baru.

## VND-AUTH-005 — Refresh token gagal (invalid/kadaluarsa)
- Langkah: POST `/auth/refresh` dengan token invalid/expired.
- Hasil: 401 `errors.refresh_token` berisi alasan.

## VND-AUTH-006 — Logout menghapus refresh token
- Langkah:
  1. POST `/auth/logout` body `{ "refresh_token": "<token>" }`.
  2. Coba `/auth/refresh` dengan token tersebut.
- Hasil: 200 logout; refresh berikutnya 401.

## VND-AUTH-007 — Header `X-Tenant-ID` hilang saat login
- Langkah: POST `/auth/login` tanpa header `X-Tenant-ID`.
- Hasil: 400/401 sesuai middleware (ditolak; tenant context wajib).

## VND-AUTH-008 — Validasi body login
- Langkah: POST `/auth/login` body kosong atau email invalid.
- Hasil: 400 `validation error` dengan detail field.

