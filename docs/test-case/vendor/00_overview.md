# E2E Test Overview — Vendor

Modul yang dicakup (Vendor + Core):
- Auth & User Management (login/refresh/logout)
- Vendor Dashboard (`/vendor/dashboard`)
- Tenant Management (registrasi self-service + status)
- Roles & Permissions
- Billing & Subscription (Plans, Invoices, Payments, Subscriptions, Audits)
- Reporting (vendor financial, usage, export)
- Notifications (in-app + reminders)
- Ticket (dukungan)

## Prasyarat Umum
- Header: `Authorization: Bearer <token>` dan `X-Tenant-ID: <tenant_vendor_id>` untuk endpoint non-publik.
- Akun uji:
  - `vendor_super_admin` (role: `super_admin_vendor`)
  - `vendor_admin` (role: `admin_vendor`)
- Data contoh (disesuaikan saat uji):
  - `tenant_vendor_id`: ID tenant vendor
  - `tenant_client_id`: ID tenant non-vendor (dibuat via self-registration) untuk integrasi Billing/Reporting
  - `plan_id`, `invoice_id`, `payment_id` akan dihasilkan saat uji

## Urutan Disarankan (Happy-path)
1) Auth (login vendor_admin) → dapatkan token.
2) Tenant self-registration (publik) → verify OTP → mendapatkan `tenant_client_id`.
3) Roles/Permissions (opsional) → persiapan role/permission.
4) Billing:
   - Plans CRUD → terbitkan Invoice ke `tenant_client_id` → (opsional) client unggah bukti pembayaran → vendor verifikasi pembayaran → cek audit & efek modul/finance.
5) Dashboard Vendor → verifikasi metrik ringkas.
6) Reporting (financial/usage/export) → verifikasi agregasi & validasi parameter.
7) Notifications → buat/list/ubah status + reminders.
8) Ticket → buat tiket (client) → tindak oleh vendor (agent) → tutup.

Setiap modul juga menyertakan negative-path (header hilang, role salah, body invalid, pagination/filter invalid, dsb.).

