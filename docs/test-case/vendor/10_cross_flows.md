# Test Case — Cross Flows (Vendor-led E2E)

Alur menyeluruh yang menggabungkan endpoint vendor dan client untuk memvalidasi integrasi antar modul.

## VND-XF-001 — Langganan baru hingga pembayaran terverifikasi
- Tujuan: Memastikan plan→subscription→invoice→payment→verify→aktifkan modul→catat transaksi bekerja end-to-end.
- Pra-syarat:
  - Login `admin_vendor` (token A, `X-Tenant-ID` vendor)
  - Calon tenant terdaftar & terverifikasi (gunakan VND-TEN-001/002) → `tenant_client_id`
- Langkah:
  1. Vendor membuat Plan (VND-BILL-002) → `plan_id`.
  2. Vendor menerbitkan Invoice untuk `tenant_client_id` (VND-BILL-010) → `invoice_id`.
  3. Client (login sebagai admin tenant client; token B, `X-Tenant-ID`=tenant_client_id) melihat invoice (GET `/client/invoices?limit=10`).
  4. Client mengunggah bukti bayar (jika diizinkan oleh implementasi client atau gunakan vendor route yang ada):
     - Jika tersedia endpoint client: `POST /client/invoices/{invoice_id}/payments` body `{ "method":"manual", "proof_url":"..." }`.
     - Jika mengikuti implementasi saat ini: vendor route `POST /vendor/invoices/{invoice_id}/payments` dengan konteks tenant client (token B).
  5. Vendor memverifikasi pembayaran (VND-BILL-021) → invoice `paid`.
  6. Cek status subscription client: `GET /client/subscription` (token B) → `status=active`, `action=extend`.
  7. Validasi audit: `GET /client/invoices/{invoice_id}/audits` (token B) berisi perubahan `pending→paid`.
  8. Validasi pelaporan keuangan vendor (opsional): `GET /vendor/reports/financial?start_date=...&end_date=...` (token A) mencerminkan pemasukan terkait.
- Hasil Diharapkan:
  - Payment `verified`, invoice `paid`, subscription client `active`, audit tercatat, dan metrik/report terpengaruh sesuai data.

## VND-XF-002 — Jatuh tempo → suspended → bayar → aktif kembali
- Tujuan: Memastikan alur overdue menangguhkan akses modul dan pulih setelah pembayaran.
- Langkah:
  1. Vendor menerbitkan invoice dengan `due_date` singkat untuk client (VND-BILL-010).
  2. Jalankan mekanisme penandaan overdue (cron/worker; jika tidak tersedia, paksa via VND-BILL-014 set `status=overdue`).
  3. Cek client `GET /client/subscription` → `status=overdue|paused`, `action=pay`.
  4. Client/Vendor proses pembayaran seperti VND-XF-001 langkah 4–5.
  5. Cek `GET /client/subscription` lagi → `status=active`.
- Hasil Diharapkan:
  - Modul tenant dinonaktifkan saat overdue dan aktif kembali setelah payment `verified`.

## VND-XF-003 — Tenant dinonaktifkan oleh vendor
- Tujuan: Memastikan deactivation oleh admin vendor menonaktifkan langganan tenant.
- Langkah:
  1. PATCH `/vendor/tenants/{id}/status` body `{ "is_active": false }` (VND-TEN-010).
  2. GET `/vendor/subscriptions?status=paused|terminated` untuk verifikasi.
  3. Aktifkan kembali `{ "is_active": true }` (VND-TEN-011) dan pastikan akses kembali berjalan.
- Hasil Diharapkan:
  - Subscription tenant berpindah status sesuai kebijakan implementasi ketika tenant dinonaktifkan.

