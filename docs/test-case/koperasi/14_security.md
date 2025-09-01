# Test Case — Security & Error Handling (Koperasi Endpoints)

## Header & Token
- KOP-SEC-001 — Missing `Authorization`: coba endpoint `/coop/*` tanpa token → 401.
- KOP-SEC-002 — Missing `X-Tenant-ID`: token valid tanpa tenant header → 403/401.

## Isolasi Tenant & Role
- KOP-SEC-010 — Cross-tenant access: gunakan `X-Tenant-ID` tenant lain → 403/404.

## Validasi Umum
- KOP-SEC-020 — Path param invalid: ID non-angka untuk `/{id}` numerik → 400.
- KOP-SEC-021 — Body invalid: payload kosong/tipe salah → 400 `validation error`.
- KOP-SEC-022 — Query invalid: tanggal/format salah → 400.

