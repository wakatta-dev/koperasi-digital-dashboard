# Test Case — Billing & Subscription (Vendor)

Catatan rujukan: `docs/modules/billing.md`, `internal/modules/billing/routes.go`, `internal/modules/billing/handler.go`

## Plans (Produk Paket/Add-on)

### VND-BILL-001 — List plans (cursor numerik)
- Langkah: GET `/vendor/plans?limit=10` (opsional `cursor` id terakhir).
- Hasil: 200 `data[]` dan `meta.pagination`.

### VND-BILL-002 — Create plan sukses
- Langkah: POST `/vendor/plans` body `{ "name": "Paket Pro", "type": "package", "price": 250000, "status": "active", "module_code": "core" }`.
- Hasil: 201 `data` Plan baru.

### VND-BILL-003 — Get plan by id
- Langkah: GET `/vendor/plans/{id}`.
- Hasil: 200 `data` Plan; 404 jika tidak ada.

### VND-BILL-004 — Update plan
- Langkah: PUT `/vendor/plans/{id}` body lengkap (name/type/price/status/module_code).
- Hasil: 200 `data` Plan terkini.

### VND-BILL-005 — Update status plan
- Langkah: PATCH `/vendor/plans/{id}/status` body `{ "status": "inactive" }`.
- Hasil: 200 `data.status`=`inactive`.

### VND-BILL-006 — Delete plan
- Langkah: DELETE `/vendor/plans/{id}`.
- Hasil: 200 `data.id` sesuai request.

### VND-BILL-007 — Validasi plan (negative)
- Body tidak lengkap (`name` kosong, `type` bukan `package|addon`, `price<=0`).
- Hasil: 400 `validation error` detail field.

## Invoices

### VND-BILL-010 — Create invoice (otomatis hitung total & nomor unik bila kosong)
- Body contoh:
  ```json
  {
    "tenant_id": <tenant_client_id>,
    "due_date": "2025-09-30T00:00:00Z",
    "subscription_id": null,
    "items": [
      {"description": "Langganan Pro", "quantity": 1, "price": 250000},
      {"description": "Add-on Laporan", "quantity": 1, "price": 50000}
    ]
  }
  ```
- Langkah: POST `/vendor/invoices`.
- Hasil: 201 `data.total`=300000; `data.number` unik.

### VND-BILL-011 — List invoices (filter vendor)
- Langkah: GET `/vendor/invoices?tenant=<tenant_client_id>&year=2025&status=pending`.
- Hasil: 200 `data[]` sesuai filter.

### VND-BILL-012 — Get invoice by id
- Langkah: GET `/vendor/invoices/{id}`.
- Hasil: 200 `data`; 404 bila tidak ada.

### VND-BILL-013 — Update invoice (ubah due_date/items)
- Langkah: PUT `/vendor/invoices/{id}` body berisi perubahan.
- Hasil: 200 `data` terbaru (total terhitung ulang jika items berubah).

### VND-BILL-014 — Update status invoice
- Langkah: PATCH `/vendor/invoices/{id}/status` body `{ "status": "overdue", "note": "melewati jatuh tempo" }`.
- Hasil: 200 `data.status`=`overdue` dan audit tercatat.

### VND-BILL-015 — Delete invoice
- Langkah: DELETE `/vendor/invoices/{id}`.
- Hasil: 200 `data.id` terhapus.

### VND-BILL-016 — Validasi invoice (negative)
- Body tanpa `tenant_id`/`items` kosong/`quantity<=0`/`price<0` → 400.
- `year`/`tenant` non-angka pada list → 400.

### VND-BILL-017 — Nomor invoice unik (duplikat)
- Langkah: Buat invoice dengan `number` tertentu, lalu buat lagi dengan `number` sama.
- Hasil: request kedua gagal (409/400) sesuai kebijakan unik nomor.

## Payments

### VND-BILL-020 — Submit manual payment proof (oleh vendor)
- Catatan: Implementasi saat ini menggunakan rute vendor `POST /vendor/invoices/{id}/payments`.
- Langkah: POST body `{ "method": "manual", "proof_url": "https://cdn.example.com/bukti/INV1.jpg", "gateway": "midtrans", "external_id": "trx-123" }`.
- Hasil: 201 `data` Payment status awal `pending`.

### VND-BILL-021 — Verify payment = `verified` (efek samping aktifkan modul & invoice paid)
- Langkah: POST `/vendor/payments/{payment_id}/verify` body `{ "status": "verified", "gateway": "midtrans", "external_id": "trx-123" }`.
- Hasil: 200 `data.status`=`verified`; efek: invoice→`paid`, subscription terkait→`active`, transaksi kas masuk tercatat (lihat VND-BILL-070).

### VND-BILL-022 — Verify payment = `rejected`
- Langkah: POST `/vendor/payments/{payment_id}/verify` body `{ "status": "rejected" }`.
- Hasil: 200 `data.status`=`rejected`; invoice tetap `pending`.

### VND-BILL-023 — Verify payment invalid
- Body `status` bukan `verified|rejected` → 400; `id` invalid → 400.

### VND-BILL-024 — Webhook gateway (placeholder)
- Langkah: POST `/vendor/payment-gateways/midtrans/webhook` body bebas (simulasi).
- Hasil: 200 `processed` bila service menerima; 400 bila gagal parse/validasi.

### VND-BILL-025 — Webhook gateway tanpa `{gateway}`
- Langkah: POST `/vendor/payment-gateways//webhook` atau `{gateway}` kosong.
- Hasil: 400 `errors.gateway`=`missing`.

## Subscriptions

### VND-BILL-030 — Subscription summary
- Langkah: GET `/vendor/subscriptions/summary`.
- Hasil: 200 `data` `{ "active": <n>, "paused": <n>, "overdue": <n> }`.

### VND-BILL-031 — List subscriptions (filter optional status)
- Langkah: GET `/vendor/subscriptions?status=active`.
- Hasil: 200 `data[]` sesuai filter.

### VND-BILL-032 — Update subscription status
- Langkah: PATCH `/vendor/subscriptions/{id}/status` body `{ "status": "paused" }`.
- Hasil: 200 `data.status`=`paused` (valid: `active|paused|terminated`).

### VND-BILL-033 — Update subscription status invalid
- Body status di luar enum → 400 `validation error`.

## Audits

### VND-BILL-040 — List audits (cursor numerik) dengan filter entity/user/date
- Langkah: GET `/vendor/audits?limit=20&entity=invoice&user=1&date=2025-09-01`.
- Hasil: 200 `data[]` + `meta.pagination`.

### VND-BILL-041 — Validasi audits (limit/cursor/user/date invalid)
- Langkah: `limit<=0`, `cursor` non-angka, `user` non-angka, `date` format salah.
- Hasil: 400 `validation error` detail.

## Integrasi & Efek Samping

### VND-BILL-060 — Tenant dinonaktifkan → subscription berhenti
- Pranala: VND-TEN-010 (PATCH `/vendor/tenants/{id}/status` is_active=false).
- Hasil: Subscription tenant target berpindah ke `paused/terminated` (cek dengan `GET /vendor/subscriptions?status=paused` atau status lain sesuai kebijakan implementasi).

### VND-BILL-070 — Payment terverifikasi → transaksi kas masuk tercatat
- Setelah VND-BILL-021, verifikasi keberadaan transaksi kas untuk tenant terkait via modul Reporting (lihat VND-REPT-010) atau endpoint Finance (jika diuji terpisah dengan konteks tenant client).
