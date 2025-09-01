# Test Case — Notifications (Vendor)

Catatan rujukan: `docs/modules/notification.md`

## Create & List

### VND-NOTF-001 — Buat notifikasi IN_APP ke user tertentu
- Langkah: POST `/notifications` body:
  ```json
  {
    "tenant_id": <tenant_client_id>,
    "user_id": <user_id>,
    "channel": "IN_APP",
    "type": "BILLING",
    "title": "Tagihan Jatuh Tempo",
    "body": "Segera lakukan pembayaran.",
    "status": "PUBLISHED"
  }
  ```
- Hasil: 201 `data.id` (uuid), `status`=`PUBLISHED`.

### VND-NOTF-002 — Broadcast notifikasi tenant (tanpa user_id)
- Langkah: POST tanpa `user_id` (broadcast).
- Hasil: 201.

### VND-NOTF-003 — List notifikasi dengan filter & cursor
- Langkah: GET `/notifications?tenant_id=<tenant_client_id>&type=BILLING&status=PUBLISHED&limit=20` (+ opsional `cursor`).
- Hasil: 200 `data[]` + `meta.pagination`.

## Update Status

### VND-NOTF-010 — Ubah status menjadi SENT/READ/ARCHIVED
- Langkah: PATCH `/notifications/{id}` body `{ "status": "READ" }`.
- Hasil: 200 `data.status`=`READ`; `read_at` terisi otomatis.

### VND-NOTF-011 — Validasi status di luar enum
- Hasil: 400 `validation error`.

### VND-NOTF-012 — Validasi channel/type invalid
- Langkah: POST `/notifications` dengan `channel` selain `IN_APP|EMAIL|PUSH` atau `type` di luar daftar.
- Hasil: 400 `validation error` (normalisasi ke uppercase, tolak nilai di luar enum).

## Reminders

### VND-NOTF-020 — List reminder notifikasi
- Langkah: GET `/notifications/reminders` (tenant saat ini dari konteks).
- Hasil: 200 `data[]` `NotificationReminder`.

### VND-NOTF-021 — Upsert reminders (batch)
- Langkah: PUT `/notifications/reminders` body array contoh:
  ```json
  [
    { "event_type": "BILLING_DUE", "schedule_offset": 3, "active": true },
    { "event_type": "RAT_REMINDER", "schedule_offset": 7, "active": false }
  ]
  ```
- Hasil: 200 (tanpa data) — semua entri di-upsert.

## Negative & Validasi

### VND-NOTF-030 — Header hilang/tenant tidak sesuai
- Hasil: 401/403 sesuai middleware.

### VND-NOTF-031 — Body tidak valid
- Create/Update dengan field kosong/format salah → 400 `validation error`.

### VND-NOTF-032 — Judul terlalu panjang
- Langkah: POST `/notifications` dengan `title` > 100 karakter.
- Hasil: 400 `validation error` untuk `title`.
