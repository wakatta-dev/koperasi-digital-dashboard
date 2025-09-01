# Test Case — Ticketing (Koperasi)

Catatan rujukan: `docs/modules/ticketing.md`

## Alur Dasar: Buat → Tindak → Selesai

### KOP-TICK-001 — Pengguna koperasi membuat tiket
- POST `/tickets` body `{ "title": "Masalah saldo", "category": "technical", "priority": "medium", "description": "Saldo tidak terupdate" }` → 201 `status=open`.

### KOP-TICK-002 — Agen menandai in_progress & assign
- PATCH `/tickets/{id}` body `{ "status": "in_progress", "agent_id": <user_vendor_or_internal> }` → 200.

### KOP-TICK-003 — Tambah balasan
- POST `/tickets/{id}/replies` body `{ "message": "Dalam penanganan" }` → 201.

### KOP-TICK-004 — Selesaikan tiket
- PATCH `/tickets/{id}` body `{ "status": "resolved" }` → 200.

### KOP-TICK-005 — Tutup tiket
- PATCH `/tickets/{id}` body `{ "status": "closed" }` → 200.

## Listing & Detail

### KOP-TICK-010 — List dengan filter & cursor
- GET `/tickets?status=open&priority=medium&category=technical&member_id=<id>&limit=20` → 200 `data[]` + pagination.

### KOP-TICK-011 — Detail + replies
- GET `/tickets/{id}` → 200.

### KOP-TICK-012 — Riwayat aktivitas
- GET `/tickets/{id}/activities` → 200 `data[]`.

## Negative & Validasi

### KOP-TICK-020 — Validasi body create/reply/update
- Field wajib kosong → 400 `validation error`.

### KOP-TICK-021 — ID bukan UUID
- Path `{id}` invalid → 400.

### KOP-TICK-022 — Akses tanpa relasi (bukan pemilik/agen)
- GET/PATCH/POST replies oleh user yang tidak berhak → 403/404.
