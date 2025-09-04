# Modul Notifications

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Notifications. Modul ini mengelola pembuatan, listing, dan pembaruan status notifikasi lintas kanal (IN_APP/EMAIL/PUSH) per tenant.

Referensi implementasi utama terdapat pada:
- `internal/modules/notification/entity.go`
- `internal/modules/notification/repository.go`
- `internal/modules/notification/service.go`
- `internal/modules/notification/handler.go`
- `internal/modules/notification/routes.go`
- `internal/modules/notification/device_token.go`

## Ringkasan Peran per Tenant

- Vendor: dapat mengirim dan meninjau notifikasi sistem global.
- Koperasi/UMKM/BUMDes: membuat notifikasi internal (mis. billing, RAT, pinjaman, simpanan) kepada user tertentu atau broadcast per tenant.

## Arsitektur & Komponen

- Repository: akses data `Notification` (create/list/read/update status) dengan filter dan cursor.
- Service: normalisasi kanal/tipe/status, generate id (uuid), dan placeholder trigger pengiriman channel non in-app.
- Handler (HTTP): endpoint pembuatan, listing dengan filter, dan update status.

## Entitas & Skema Data

- Notification
  - `id` (uuid), `tenant_id`, `user_id?`, `segment?` (`VENDOR|KOPERASI|UMKM|BUMDES`), `channel` (`IN_APP|EMAIL|PUSH`), `type` (`SYSTEM|BILLING|RAT|LOAN|SAVINGS|CUSTOM`), `category`, `target_type` (`SINGLE|ALL|GROUP`), `title`, `body`, `status` (`DRAFT|PUBLISHED|SENT|READ|ARCHIVED`), `send_status` (`PENDING|SENT|FAILED`), `created_at`, `sent_at?`, `read_at?`
- NotificationFilter
  - `tenant_id`, `user_id?`, `type?`, `status?`, `category?`, `send_status?`, `from?`, `to?`
- NotificationReminder
  - `event_type`, `schedule_offset`, `active`

## Alur Bisnis Utama

1) Pembuatan Notifikasi
- Simpan notifikasi dengan status default `DRAFT` bila kosong. Kanal/tipe dikonversi ke uppercase.
- Placeholder untuk integrasi kanal `EMAIL`/`PUSH` (belum diimplementasi; dapat ditambahkan).

2) Listing Notifikasi
- Filter berdasarkan tenant, user, tipe/status, dan rentang tanggal (`created_at`).
- Paginasi menggunakan cursor string (`id` uuid).

3) Pembaruan Status
- Ubah status notifikasi; otomatis menyetel `sent_at` bila `SENT` dan `read_at` bila `READ`.

4) Token Perangkat
- Pengguna mendaftarkan token perangkat untuk menerima push notification dan dapat menghapusnya saat logout.

## Endpoint API

Semua response menggunakan format `APIResponse`.

### Tenant Routes

- `POST /notifications` — buat notifikasi.
- `GET /notifications?tenant_id={id?}&user_id={id?}&type={t?}&status={s?}&category={c?}&send_status={s?}&from={RFC3339?}&to={RFC3339?}&limit={n}&cursor={c?}` — daftar notifikasi (cursor id uuid). Jika `tenant_id` tidak dikirim, sistem mengambil dari context (header `X-Tenant-ID`/domain).
- `PATCH /notifications/{id}` — update `status` (`DRAFT|PUBLISHED|SENT|READ|ARCHIVED`).
- `GET /notifications/reminders` — daftar reminder penjadwalan notifikasi untuk tenant saat ini.
- `PUT /notifications/reminders` — upsert reminder penjadwalan notifikasi (batch).
- `POST /notifications/device-tokens` — simpan token perangkat untuk push notification.
- `DELETE /notifications/device-tokens` — hapus token perangkat.

### Vendor Routes

- `POST /notifications/broadcast` — broadcast notifikasi ke tenant tertentu.
- `POST /notifications/bulk` — antre notifikasi bulk berdasarkan segmen tenant.
- `GET /notifications?tenant={id?}&category={c?}&date={YYYY-MM-DD?}&limit={n}&cursor={c?}` — daftar notifikasi vendor.

Keamanan: semua endpoint dilindungi `Bearer` token + `X-Tenant-ID`.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `POST /notifications`
  - Body:
    - `tenant_id` (wajib, > 0)
    - `user_id` (opsional, > 0 untuk per-user; kosong untuk broadcast tenant)
    - `segment` (opsional, `VENDOR|KOPERASI|UMKM|BUMDES`)
    - `channel` (wajib, `IN_APP|EMAIL|PUSH`)
    - `type` (wajib, `SYSTEM|BILLING|RAT|LOAN|SAVINGS|CUSTOM`)
    - `category` (wajib)
    - `target_type` (wajib, `SINGLE|ALL|GROUP`)
    - `title` (wajib, maks 100)
    - `body` (wajib)
    - `status` (opsional, `DRAFT|PUBLISHED|SENT|READ|ARCHIVED`; default `DRAFT`)
    - `send_status` (opsional, `PENDING|SENT|FAILED`; default `PENDING`)
  - Response 201: `data` Notification (dengan `id` uuid, timestamps). Untuk `EMAIL/PUSH` pengiriman belum diimplementasi (placeholder).

- `GET /notifications`
  - Query:
    - `tenant_id` (opsional; default dari context/`X-Tenant-ID`)
    - `user_id` (opsional)
    - `type` (opsional)
    - `status` (opsional)
    - `category` (opsional)
    - `send_status` (opsional)
    - `from` (opsional, RFC3339), `to` (opsional, RFC3339)
    - `limit` (wajib, int>0), `cursor` (opsional, string id uuid terakhir)
  - Response 200: `data` array Notification + `meta.pagination`.

- `PATCH /notifications/{id}`
  - Path: `id` (string uuid, wajib)
  - Body: `{ "status": "DRAFT|PUBLISHED|SENT|READ|ARCHIVED" }` (wajib)
  - Response 200: `data` `{ "id": "...", "status": "..." }`. Timestamp `sent_at` diisi saat `SENT`, `read_at` saat `READ`.

- `GET /notifications/reminders`
  - Response 200: `data` array `NotificationReminder` untuk tenant saat ini.

- `PUT /notifications/reminders`

  - Body: array `reminderRequest`:
    - `event_type` (wajib)
    - `schedule_offset` (wajib, int; offset jadwal dalam satuan domain yang ditetapkan)
    - `active` (opsional, bool)
  - Response 200: tanpa data (`data: null`) — seluruh entri di-upsert.

- `POST /notifications/device-tokens`
  - Body: `{ "token": "<string>" }` (wajib; token perangkat FCM/APNS untuk user saat ini)
  - Response 201: `data` `{ "token": "..." }`.

- `DELETE /notifications/device-tokens`
  - Body: `{ "token": "<string>" }` (wajib)
  - Response 200: `data` `{ "token": "..." }`.

## Tautan Cepat

- Billing: [billing.md](billing.md)
- Ticket: [ticket.md](ticket.md)
- RAT: [rat.md](rat.md)
- Livechat: [livechat.md](livechat.md)

## Contoh Payload

- Create Notification
```json
{
  "tenant_id": 12,
  "user_id": 99,
  "segment": "KOPERASI",
  "channel": "IN_APP",
  "type": "BILLING",
  "category": "BILLING",
  "target_type": "SINGLE",
  "title": "Tagihan Jatuh Tempo",
  "body": "Segera lakukan pembayaran.",
  "status": "PUBLISHED",
  "send_status": "PENDING"
}
```

- Update Status
```json
{ "status": "READ" }
```

- Register Device Token
```json
{ "token": "abcdef123" }
```

- Unregister Device Token
```json
{ "token": "abcdef123" }
```

## Status & Transisi

- `DRAFT` → `PUBLISHED` → `SENT` (untuk kanal pengiriman) → `READ` → `ARCHIVED` (sesuai kebutuhan).
- Otomasi timestamp: `sent_at` saat `SENT`, `read_at` saat `READ`.

## Paginasi & Response

- Cursor string (uuid `id`) dan `limit` wajib untuk listing. `meta.pagination` disertakan.

## Integrasi & Dampak ke Modul Lain

- Billing/Finance/RAT/Loan/Savings: dapat menggunakan notifikasi tipe terkait untuk informasi status/tagihan/transaksi.
- Livechat: mengirim notifikasi in-app saat agen membalas chat.
- Kanal `EMAIL`/`PUSH` akan membutuhkan integrasi eksternal (placeholder).

## Keamanan

- Isolasi tenant diberlakukan oleh middleware; filter selalu membutuhkan `tenant_id`.

## Catatan Implementasi

- Pengiriman `EMAIL`/`PUSH` belum diimplementasikan; tambahkan service pengirim sesuai penyedia.
- Validasi format waktu filter menggunakan RFC3339.

## Peran Modul Notifications per Jenis Tenant (Rangkuman)

- Vendor: notifikasi sistem dan pengumuman.
- Koperasi/UMKM/BUMDes: komunikasi operasional antar pengguna/anggota.

## Skenario Penggunaan

1. Sistem Billing menerbitkan notifikasi `BILLING` saat invoice mendekati jatuh tempo.
2. Admin tenant menandai notifikasi sebagai `READ` setelah dibuka.
3. Di masa depan, sistem mengirim `EMAIL` untuk broadcast pemberitahuan RAT.
