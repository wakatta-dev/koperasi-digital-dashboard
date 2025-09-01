# Test Case E2E

Repositori ini berisi test case End-to-End (E2E) yang dikelompokkan per jenis tenant dan per modul.

Struktur awal:
- `docs/test-case/vendor`: test case E2E untuk tenant Vendor (fokus saat ini)
- `docs/test-case/koperasi`: test case E2E untuk tenant Koperasi (next)
- `docs/test-case/umkm`: test case E2E untuk tenant UMKM (next)
- `docs/test-case/bumdes`: test case E2E untuk tenant BUMDes (next)

## Konvensi & Prasyarat Umum
- Header standar (kecuali endpoint publik):
  - `Authorization: Bearer <access_token>`
  - `X-Tenant-ID: <tenant_id>`
- Token JWT berisi klaim: `user_id`, `tenant_id`, `tenant_type`, `role`.
- Response standar `APIResponse` dengan bidang `data`, `meta.pagination` (jika ada), dan `errors` (jika ada).
- Paginasi: kombinasi `limit` + `cursor` sesuai modul.

## Penamaan Test Case
Gunakan pola ID berikut agar mudah dilacak:
- `VND-<MOD>-NNN` untuk Vendor, contoh: `VND-AUTH-001`, `VND-BILL-012`.
- `KOP-...`, `UMKM-...`, `BMD-...` untuk tenant lain (nantinya).

## Data Uji & Lingkungan
- Base URL uji: sesuaikan (`http://localhost:8080` atau yang lain).
- Akun uji (contoh; sesuaikan di lingkungan Anda):
  - Vendor Super Admin: email `superadmin@vendor.id`
  - Vendor Admin: email `admin@vendor.id`
  - Password uji: `secret`
- Tenant uji non-vendor (hasil registrasi self-service atau seeding) untuk integrasi Billing/Reporting.

## Cara Membaca Test Case
- Setiap kasus memuat: Tujuan, Pra-syarat, Langkah (user-flow), Hasil yang Diharapkan, dan Catatan/Validasi Tambahan.
- Banyak skenario menguji happy-path dan negative-path (validasi, otorisasi, header hilang, nilai tidak valid, dsb.).

