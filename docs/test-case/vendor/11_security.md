# Test Case — Security & Error Handling (Vendor Endpoints)

Kumpulan kasus uji umum terkait keamanan, header, dan otorisasi untuk endpoint vendor.

## Header & Token
- VND-SEC-001 — Missing `Authorization`: panggil endpoint vendor (mis. GET `/vendor/dashboard`) tanpa Bearer → 401.
- VND-SEC-002 — Missing `X-Tenant-ID`: panggil endpoint vendor dengan token valid namun tanpa tenant header → 403/401 (sesuai middleware) → akses ditolak.
- VND-SEC-003 — Token invalid/expired: gunakan token rusak/kedaluwarsa → 401.

## Isolasi Tenant & Role
- VND-SEC-010 — Cross-tenant access: gunakan `X-Tenant-ID` tenant lain untuk mengakses resource vendor → 403/404.
- VND-SEC-011 — Role tidak memadai: akses endpoint vendor dengan role bukan `admin_vendor/super_admin_vendor` (mis. user koperasi) → 403.

## Validasi Umum
- VND-SEC-020 — Path param invalid: ID non-angka untuk endpoint `/{id}` numerik → 400 `invalid id`.
- VND-SEC-021 — Body invalid: payload kosong/tipe salah → 400 `invalid/validation error`.
- VND-SEC-022 — Query invalid: `limit<=0`, `cursor` non-angka, `date` format salah → 400.

## Rate/Abuse (Opsional, jika middleware tersedia)
- VND-SEC-030 — Rate limiting: lakukan banyak request beruntun (cek 429 jika diaktifkan).
- VND-SEC-031 — Size limit: kirim payload terlalu besar (cek 413 jika diaktifkan).

