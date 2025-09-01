# Test Case — Dashboard Vendor

Catatan rujukan: `docs/modules/dashboard_vendor.md`, `internal/modules/dashboard/vendor_handler.go`

## VND-DASH-001 — Akses dashboard sukses (admin_vendor)
- Tujuan: Mendapatkan ringkasan dashboard vendor.
- Pra-syarat: Login sebagai `admin_vendor`, header `X-Tenant-ID` vendor.
- Langkah: GET `/vendor/dashboard`.
- Hasil: 200 `data` tipe `VendorDashboard` berisi metrik (contoh: `tenants_total`, `active_subscriptions`, `overdue_invoices`).

## VND-DASH-002 — Akses dashboard sukses (super_admin_vendor)
- Sama seperti VND-DASH-001 dengan role `super_admin_vendor`.

## VND-DASH-003 — Ditolak jika role bukan vendor admin
- Pra-syarat: Login sebagai role non-vendor (mis. user koperasi) namun menggunakan `X-Tenant-ID` vendor.
- Langkah: GET `/vendor/dashboard`.
- Hasil: 403 `errors.role`=`forbidden`.

## VND-DASH-004 — Header hilang
- Langkah: GET `/vendor/dashboard` tanpa `Authorization` atau tanpa `X-Tenant-ID`.
- Hasil: 401/403 sesuai middleware (akses ditolak).

