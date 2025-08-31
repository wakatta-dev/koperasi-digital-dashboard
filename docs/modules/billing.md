# Modul Billing

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Billing. Modul ini bertanggung jawab atas pengelolaan produk/plan berlangganan, langganan tenant, tagihan (invoice), pembayaran manual, serta audit status. Modul juga mengontrol aktivasi/nonaktif modul-tenant berdasarkan status langganan/tagihan.

Referensi implementasi utama terdapat pada:
- `internal/modules/billing/entity.go`
- `internal/modules/billing/repository.go`
- `internal/modules/billing/service.go`
- `internal/modules/billing/handler.go`
- `internal/modules/billing/routes.go`

## Ringkasan Peran per Tenant

- Vendor: mengelola plan, menerbitkan dan memantau invoice, memverifikasi pembayaran, melihat ringkasan status langganan dan audit.
- Koperasi: melihat daftar/detil tagihan, mengunggah bukti pembayaran manual, memantau status langganan untuk akses modul koperasi (simpanan, pinjaman, dsb.).
- UMKM: melihat tagihan, unggah bukti pembayaran, memantau status langganan untuk akses modul operasional (POS, marketplace, dsb.).
- BUMDes: melihat tagihan, unggah bukti pembayaran, memantau status langganan untuk akses modul per unit usaha/penyewaan.

Catatan: Aktivasi/nonaktif modul tenant dilakukan via entitas `tenant.TenantModule` oleh Billing ketika status langganan berubah (lihat Integrasi & Dampak ke Modul Tenant).

## Arsitektur & Komponen

- Repository: akses data untuk Plan, Subscription, Invoice, Payment, dan operasi pembantu (pencarian, list, update status, aktivasi modul tenant).
- Service: logika bisnis billing (hitung total invoice, penomoran, validasi, perubahan status, audit, re-aktivasi modul ketika pembayaran diverifikasi, penandaan overdue, dsb.).
- Handler (HTTP): validasi input, parsing query/path, memanggil service, dan menuliskan response yang terstandarisasi.
- AuditService: mencatat histori perubahan status untuk invoice dan subscription.
- Finance: integrasi sederhana untuk pencatatan kas masuk saat pembayaran terverifikasi melalui `CreateTransaction`.

## Entitas & Skema Data

Ringkasannya (lihat tag GORM pada file entitas untuk detail kolom):

- Plan
  - `id`, `name`, `price`, `duration_months`, `created_at`, `updated_at`
- TenantSubscription
  - `id`, `tenant_id`, `plan_id`, `start_date`, `end_date?`, `status` (default: `active`), timestamp, preload `Plan`
- Invoice
  - `id`, `tenant_id`, `number` (unik), `issued_at`, `due_date`, `subscription_id?`, `total`, `status` (`pending|paid|overdue`), `items[]`
- InvoiceItem
  - `id`, `invoice_id`, `description`, `quantity`, `price`
- Payment
  - `id`, `invoice_id`, `method` (saat ini `manual`), `proof_url`, `amount?`, `status` (`pending|verified|rejected`), `gateway?`, `external_id?`, `paid_at`, `created_at`
- StatusAudit
  - `id`, `entity_type` (`invoice|subscription`), `entity_id`, `old_status`, `new_status`, `changed_by`, `changed_at`

Enum dan konstanta penting:
- InvoiceStatus: `pending`, `paid`, `overdue`.
- PaymentGateway: saat ini `midtrans` (placeholder integrasi gateway; webhook belum diimplementasikan).

## Alur Bisnis Utama

1) Plan (produk paket langganan)
- Vendor dapat membuat, membaca, memperbarui, dan menghapus plan.
- `duration_months` harus > 0.

2) Subscription (langganan tenant)
- Pembuatan subscription akan mengisi `start_date` dan `status` default `active`.
- Pembatalan (cancel) mengisi `end_date` dan mencatat audit ke `cancelled`.
- Suspend (mis. karena overdue) mengubah status ke `suspended` dan menonaktifkan semua modul tenant.
- Ringkasan subscription (jumlah `active`, `suspended`, `overdue`) tersedia untuk Vendor.

3) Invoice
- Nomor invoice otomatis dibuat jika kosong dan dijamin unik.
- `total` dihitung dari agregasi `items.quantity * items.price`.
- Mark as overdue akan mengubah status invoice ke `overdue` dan melakukan suspend subscription terkait.
- Listing mendukung filter `status` dan `periode` (format `YYYY-MM`).

4) Payment Manual
- Tenant mengunggah `proof_url` pembayaran manual pada invoice miliknya.
- Vendor melakukan verifikasi (`verified` atau `rejected`).
- Jika `verified`: invoice menjadi `paid`, subscription (jika ada) aktif kembali, modul tenant diaktifkan, dan transaksi kas masuk dicatat di modul keuangan.

5) Audit Status
- Setiap perubahan status pada `invoice` atau `subscription` dicatat di `StatusAudit` untuk pelacakan historis.

## Endpoint API

Semua response menggunakan format `APIResponse` dengan metadata dan dukungan pagination (cursor based). Contoh response ada pada dokumen frontend `docs/frontend/api_response.md`.

Keamanan: semua endpoint membutuhkan `Bearer` token, dan konteks tenant (mis. header `XTenantID`/middleware) untuk endpoint Client.

### Vendor

- Plans
  - `GET /vendor/plans/?limit={n}&cursor={cursor?}`: daftar plan (paginasi cursor).
  - `POST /vendor/plans/`: buat plan baru.
  - `GET /vendor/plans/{id}`: detail plan.
  - `PUT /vendor/plans/{id}`: update plan (name/price/duration).
  - `DELETE /vendor/plans/{id}`: hapus plan.

- Invoices
  - `GET /vendor/invoices/?limit={n}&cursor={cursor?}&status={s?}&periode={YYYY-MM?}`: daftar invoice.
  - `POST /vendor/invoices/`: buat invoice (items, due_date, subscription_id?).
  - `PATCH /vendor/invoices/{id}`: update invoice (number, due_date, items, subscription_id).
  - `DELETE /vendor/invoices/{id}`: hapus invoice.

- Payments
  - `PATCH /vendor/payments/{id}/verify`: verifikasi pembayaran manual (`status=verified|rejected`, opsional `gateway`, `external_id`).

- Subscriptions
  - `GET /vendor/subscriptions/summary`: ringkasan status subscription (`active`, `suspended`, `overdue`).

- Audit
  - `GET /vendor/audits/?limit={n}&cursor={cursor?}`: daftar audit status (global).

### Client (Tenant)

- Invoices
  - `GET /client/invoices/?limit={n}&cursor={cursor?}`: daftar invoice milik tenant.
  - `GET /client/invoices/{id}`: detail invoice milik tenant.
  - `POST /client/invoices/{id}/payments`: unggah bukti pembayaran manual.
  - `GET /client/invoices/{id}/audits`: histori audit invoice tersebut.

- Subscription
  - `GET /client/subscription`: status langganan saat ini dan saran aksi (`extend` atau `pay`).

## Rincian Endpoint (Params, Payload, Response)

Header umum (kecuali disebut sebaliknya):
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (opsional jika penentuan berdasarkan domain host sudah aktif)

### Vendor / Plans

- `GET /vendor/plans/?limit={n}&cursor={cursor?}`
  - Query: `limit` (wajib, int > 0), `cursor` (opsional, string id terakhir)
  - Response 200: `data` berupa array Plan, `meta.pagination` berisi `next_cursor`, `has_next`, `has_prev`, `limit`.

- `POST /vendor/plans/`
  - Body Plan:
    - `name` (string, wajib)
    - `price` (number, wajib)
    - `duration_months` (int, wajib, > 0)
  - Response 201: `data` Plan yang dibuat.

- `GET /vendor/plans/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` Plan; 404 bila tidak ditemukan.

- `PUT /vendor/plans/{id}`
  - Path: `id` (int, wajib)
  - Body Plan (field yang diubah): `name`, `price`, `duration_months`
  - Response 200: `data` Plan setelah diperbarui.

- `DELETE /vendor/plans/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` `{ "id": <int> }`.

### Vendor / Invoices

- `GET /vendor/invoices/?limit={n}&cursor={cursor?}&status={s?}&periode={YYYY-MM?}`
  - Query:
    - `limit` (wajib, int > 0)
    - `cursor` (opsional, string id terakhir)
    - `status` (opsional, `pending|paid|overdue`)
    - `periode` (opsional, `YYYY-MM`)
  - Response 200: `data` array Invoice, dengan pagination.

- `POST /vendor/invoices/`
  - Body Invoice:
    - `tenant_id` (uint, wajib)
    - `due_date` (RFC3339, wajib)
    - `subscription_id` (uint, opsional)
    - `number` (string, opsional; jika kosong dibuat otomatis unik)
    - `items[]` (wajib, minimal 1): elemen `description` (string), `quantity` (int>0), `price` (number>=0)
  - Response 201: `data` Invoice (dengan `total` dihitung dari items).

- `PATCH /vendor/invoices/{id}`
  - Path: `id` (int, wajib)
  - Body Invoice (field yang diubah): `number`, `due_date`, `items[]`, `subscription_id`
  - Response 200: `data` Invoice setelah diperbarui.

- `DELETE /vendor/invoices/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` `{ "id": <int> }`.

### Vendor / Payments

- `PATCH /vendor/payments/{id}/verify`
  - Path: `id` (int, wajib)
  - Body VerifyPaymentRequest:
    - `status` (wajib, `verified|rejected`)
    - `gateway` (opsional, mis. `midtrans`)
    - `external_id` (opsional, referensi eksternal)
  - Response 200: `data` Payment (status terbaru). Jika `verified` maka efek samping: Invoice→`paid`, aktivasi modul tenant, pencatatan transaksi Finance.

### Vendor / Subscriptions

- `GET /vendor/subscriptions/summary`
  - Response 200: `data` `{ "active": <int64>, "suspended": <int64>, "overdue": <int64> }`.

### Vendor / Audit

- `GET /vendor/audits/?limit={n}&cursor={cursor?}`
  - Query: `limit` (wajib, int>0), `cursor` (opsional)
  - Response 200: `data` array StatusAudit, pagination tersedia.

### Client (Tenant)

- `GET /client/invoices/?limit={n}&cursor={cursor?}`
  - Query: `limit` (wajib, int>0), `cursor` (opsional)
  - Response 200: `data` array Invoice milik tenant pemanggil.

- `GET /client/invoices/{id}`
  - Path: `id` (int, wajib; harus milik tenant)
  - Response 200: `data` Invoice; 404 jika tidak ditemukan atau bukan milik tenant.

- `POST /client/invoices/{id}/payments`
  - Path: `id` (int, wajib; invoice milik tenant)
  - Body PaymentRequest:
    - `method` (wajib, saat ini hanya `manual`)
    - `proof_url` (wajib untuk `manual`)
    - `gateway` (opsional)
    - `external_id` (opsional)
  - Response 201: `data` Payment dengan status awal `pending`.

- `GET /client/invoices/{id}/audits`
  - Path: `id` (int, wajib)
  - Response 200: `data` array StatusAudit milik invoice tersebut.

- `GET /client/subscription`
  - Response 200: `data` `{ "status": "active|suspended|overdue|pending|cancelled", "action": "extend|pay" }`.

## Contoh Payload

- Invoice (POST/PUT)
```json
{
  "tenant_id": 123,
  "due_date": "2025-09-30T00:00:00Z",
  "subscription_id": 45,
  "items": [
    {"description": "Langganan Paket Pro", "quantity": 1, "price": 250000},
    {"description": "Add-on Laporan", "quantity": 1, "price": 50000}
  ]
}
```

- Payment Manual (Client -> POST)
```json
{
  "method": "manual",
  "proof_url": "https://cdn.example.com/bukti/transfer-INV-001.jpg",
  "gateway": "midtrans",
  "external_id": "trx-123456"
}
```

- Verifikasi Pembayaran (Vendor -> PATCH)
```json
{
  "status": "verified",
  "gateway": "midtrans",
  "external_id": "trx-123456"
}
```

## Status & Transisi

- Invoice
  - `pending` → `paid` (ketika payment `verified`)
  - `pending` → `overdue` (melewati `due_date` dan ditandai overdue)

- Subscription
  - `active` → `suspended` (ketika invoice terkait jadi `overdue`)
  - `suspended` → `active` (ketika payment terverifikasi)
  - `cancelled` (pembatalan): status diubah ke `cancelled`, `end_date` diisi, dan dicatat di audit.

Semua perubahan status dicatat ke `StatusAudit` untuk audit trail.

## Paginasi & Response

- Paginasi menggunakan cursor (string/ID terakhir) dan `limit`.
- Bidang `meta.pagination` memiliki `next_cursor`, `has_next`, `has_prev`, dan `limit`.
- Kesalahan (error) khusus akan berada di objek `errors` pada response seragam.

## Integrasi & Dampak ke Modul Tenant

- Aktivasi/Nonaktif Modul
  - Saat subscription `suspended` atau invoice `overdue`, Billing memanggil `DeactivateTenantModules(tenantID)` untuk menonaktifkan seluruh modul tenant.
  - Saat payment `verified`, Billing memanggil `ActivateTenantModules(tenantID)` dan, jika invoice terkait subscription, status subscription dikembalikan ke `active`.
- Integrasi Keuangan
  - Setelah payment `verified`, Billing mencatat transaksi kas masuk via modul Finance menggunakan `CreateTransaction`.

Dampak per jenis tenant:
- Vendor: tidak dinonaktifkan oleh mekanisme ini; Vendor adalah pengelola, bukan tenant yang terbatas modulnya.
- Koperasi: modul koperasi (mis. simpanan, pinjaman, SHU, RAT) akan dinonaktifkan saat `suspended/overdue`, aktif kembali saat bayar terverifikasi.
- UMKM: modul operasi (POS, marketplace, inventaris, dsb.) mengikuti status langganan.
- BUMDes: modul/unit usaha dan penyewaan mengikuti status langganan.

## Keamanan

- Semua endpoint diasumsikan berada di balik autentikasi `Bearer` dan konteks tenant (mis. header `XTenantID` → disiapkan oleh middleware).
- Endpoint Client hanya menampilkan/menyentuh resource yang terkait dengan tenant dari token/konteks.

## Catatan Implementasi

- Webhook Gateway: `HandleGatewayWebhook` masih placeholder; integrasi spesifik gateway pembayaran perlu ditambahkan.
- Cron/Worker Overdue: `ListPendingInvoicesBefore(t)` tersedia untuk membantu job yang menandai invoice `overdue` secara terjadwal.
- Validasi: Handler melakukan validasi dasar (limit/cursor, body parser, nilai enum sederhana). Validasi bisnis tambahan dapat ditambahkan sesuai kebutuhan.

## Peran Modul Billing per Jenis Tenant (Rangkuman)

- Vendor
  - Mengatur katalog plan (paket/add-on), menerbitkan dan memonitor invoice, memverifikasi pembayaran, melihat audit & ringkasan langganan.
- Koperasi
  - Mengakses daftar/detil tagihan; mengirim bukti bayar; status langganan mengontrol akses ke modul koperasi.
- UMKM
  - Mengakses tagihan dan pembayaran; status langganan mengontrol akses ke modul operasional (POS, marketplace, dsb.).
- BUMDes
  - Mengakses tagihan dan pembayaran; status langganan mengontrol akses modul unit usaha/penyewaan.

## Skenario Penggunaan

Berikut contoh alur yang umum ditemui ketika menggunakan modul Billing.

### 1. Langganan Baru sampai Pembayaran Terverifikasi

1. **Vendor** membuat Plan baru dan menawarkannya ke tenant.
2. **Vendor** membuat Subscription untuk tenant tersebut.
3. **Vendor** menerbitkan Invoice yang terhubung ke subscription.
4. **Tenant** (Koperasi/UMKM/BUMDes) melihat invoice pada halaman tagihan.
5. **Tenant** mengunggah bukti pembayaran manual pada invoice.
6. **Vendor** memverifikasi pembayaran menjadi `verified`.
7. Status invoice berubah menjadi `paid`, subscription kembali `active`, dan modul tenant otomatis diaktifkan.

### 2. Invoice Melewati Jatuh Tempo

1. Invoice dibuat dan menunggu pembayaran hingga `due_date`.
2. Tenant tidak melakukan pembayaran sampai tenggat.
3. Job terjadwal menandai invoice sebagai `overdue`.
4. Subscription yang terkait berubah menjadi `suspended` dan modul tenant dinonaktifkan.
5. Tenant kemudian membayar dan mengunggah bukti.
6. Vendor memverifikasi pembayaran sehingga invoice menjadi `paid` dan subscription kembali `active`.
7. Sistem mengaktifkan kembali modul tenant serta mencatat transaksi kas masuk.

### 3. Pembatalan Langganan oleh Vendor

1. Vendor memutuskan untuk menghentikan subscription tenant sebelum masa berlaku berakhir.
2. Endpoint pembatalan mengisi `end_date`, mengubah status menjadi `cancelled`, dan mencatatnya di `StatusAudit`.
3. Modul tenant dinonaktifkan permanen hingga dibuat subscription baru.

### 4. Audit dan Pelacakan Status

1. Setiap perubahan status pada invoice atau subscription memanggil `AuditService`.
2. Vendor dapat melihat riwayat perubahan tersebut melalui endpoint audit untuk kebutuhan penelusuran.

Contoh skenario di atas dapat dikombinasikan sesuai kebutuhan bisnis dan dijalankan menggunakan koleksi Postman atau alat serupa.
