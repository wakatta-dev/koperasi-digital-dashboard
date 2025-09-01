# Test Case — Auth (Koperasi)

Catatan rujukan: `docs/modules/auth.md`

## KOP-AUTH-001 — Login sukses (Admin Koperasi)
- Tujuan: Mendapatkan `access_token` dan `refresh_token` untuk admin koperasi.
- Pra-syarat: User aktif pada `tenant_koperasi_id`.
- Langkah: POST `/auth/login` header `X-Tenant-ID: <tenant_koperasi_id>` body `{ "email": "admin@koperasi.id", "password": "secret" }`.
- Hasil: 200 `data.access_token`, `data.refresh_token`, `data.jenis_tenant`=`koperasi`.

## KOP-AUTH-002 — Login gagal (password salah)
- 401 `invalid credentials`.

## KOP-AUTH-003 — Login gagal (tenant mismatch)
- Header `X-Tenant-ID` berbeda → 401.

## KOP-AUTH-004 — Refresh token sukses
- POST `/auth/refresh` body `{ "refresh_token": "..." }` → 200 `access_token` baru.

## KOP-AUTH-005 — Logout menghapus refresh token
- POST `/auth/logout` lalu coba refresh → 200 kemudian 401.

## KOP-AUTH-006 — Validasi body/header
- Tanpa `X-Tenant-ID` atau body invalid → 400/401.

