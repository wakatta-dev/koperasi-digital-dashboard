# Test Case — Ticketing (Vendor)

Catatan rujukan: `docs/modules/ticketing.md`

Fokus: alur interaksi antara pengguna tenant (client) dan agen/vendor.

## Alur Dasar: Buat → Tindak → Selesai

### VND-TICK-001 — Client membuat tiket (open)
- Aktor: Pengguna di tenant client.
- Langkah: POST `/tickets` body `{ "title": "Tidak bisa login", "category": "technical", "priority": "high", "description": "Error 500" }` dengan token & `X-Tenant-ID` client.
- Hasil: 201 `data.status`=`open`.

### VND-TICK-002 — Vendor menandai in_progress & assign agent
- Aktor: `admin_vendor` atau agen.
- Langkah: PATCH `/tickets/{id}` body `{ "status": "in_progress", "agent_id": <user_vendor_id> }`.
- Hasil: 200 `data.status`=`in_progress`, `agent_id` terisi.

### VND-TICK-003 — Vendor menambahkan balasan
- Langkah: POST `/tickets/{id}/replies` body `{ "message": "Sedang kami investigasi" }`.
- Hasil: 201 `data` reply; notifikasi terkirim ke pengguna (in-app).

### VND-TICK-004 — Vendor menandai resolved
- Langkah: PATCH `/tickets/{id}` body `{ "status": "resolved" }`.
- Hasil: 200 `data.status`=`resolved`.

### VND-TICK-005 — Client menutup tiket (closed)
- Aktor: Pengguna client.
- Langkah: PATCH `/tickets/{id}` body `{ "status": "closed" }`.
- Hasil: 200 `data.status`=`closed`.

## Listing & Detail

### VND-TICK-010 — List tiket dengan filter & cursor
- Langkah: GET `/tickets?status=open&priority=high&category=technical&limit=20` (opsional `cursor`, opsional `member_id`).
- Hasil: 200 `data[]` + `meta.pagination`.

### VND-TICK-011 — Detail tiket termasuk replies
- Langkah: GET `/tickets/{id}`.
- Hasil: 200 `data` tiket + `replies` terurut.

### VND-TICK-012 — Riwayat aktivitas
- Langkah: GET `/tickets/{id}/activities`.
- Hasil: 200 `data[]` `TicketActivityLog`.

## Negative & Validasi

### VND-TICK-020 — Validasi body create/reply/update
- Field wajib kosong/format salah → 400 `validation error`.

### VND-TICK-021 — Akses lintas tenant
- Coba akses tiket tenant lain → 403/404 sesuai pembatasan isolasi tenant.

### VND-TICK-022 — ID tiket bukan UUID
- Path `{id}` tidak valid → 400 `invalid id`.

### VND-TICK-023 — Akses tiket tanpa relasi (bukan pemilik/agen)
- Aktor: user lain di tenant berbeda.
- Langkah: GET `/tickets/{id}` atau PATCH/POST replies.
- Hasil: 403/404 sesuai isolasi & otorisasi.
