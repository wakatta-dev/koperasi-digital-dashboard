# Test Case — Notifications (Koperasi)

Catatan rujukan: `docs/modules/notification.md`

## Create & List

### KOP-NOTF-001 — Buat notifikasi IN_APP ke anggota
- POST `/notifications` body `{ "tenant_id": <tenant_id>, "user_id": <uid>, "channel": "IN_APP", "type": "SYSTEM", "title": "Info RAT", "body": "RAT 20/11", "status": "PUBLISHED" }` → 201.

### KOP-NOTF-002 — Broadcast tenant
- POST tanpa `user_id` → 201.

### KOP-NOTF-003 — List notifikasi (filter + cursor)
- GET `/notifications?tenant_id=<id>&type=SYSTEM&status=PUBLISHED&limit=20` → 200 `data[]` + pagination.

## Update Status

### KOP-NOTF-010 — Ubah status READ
- PATCH `/notifications/{id}` body `{ "status": "READ" }` → 200; `read_at` terisi.

### KOP-NOTF-011 — Kirim notifikasi ke anggota
- POST `/notifications` body `{ "tenant_id":1, "channel":"IN_APP", "type":"SYSTEM", "category":"GENERAL", "title":"Hi", "body":"Hello" }` dengan header `X-Tenant-ID` → 201 `success`.

## Reminders

### KOP-NOTF-020 — List reminders
- GET `/notifications/reminders` → 200 `data[]`.

### KOP-NOTF-021 — Upsert reminders
- PUT `/notifications/reminders` body `[ { "event_type": "RAT_REMINDER", "schedule_offset": 7, "active": true } ]` → 200.

## Negative & Validasi

### KOP-NOTF-030 — Channel/type invalid
- POST dengan nilai di luar enum → 400.

### KOP-NOTF-031 — Title > 100 chars
- → 400 `validation error`.

