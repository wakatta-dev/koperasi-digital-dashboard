# Modul Ticket

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Ticket. Modul ini digunakan untuk pengelolaan tiket dukungan (support) antara pengguna dan agen.

Referensi implementasi utama terdapat pada:
- `internal/modules/ticket/entity.go`
- `internal/modules/ticket/repository.go`
- `internal/modules/ticket/service.go`
- `internal/modules/ticket/handler.go`
- `internal/modules/ticket/routes.go`

## Ringkasan Peran per Tenant

- Agen/vendor: meninjau, membalas, memperbarui status, dan mengelola penugasan agen.

## Arsitektur & Komponen

- **Entity**: mendefinisikan struktur `Ticket`, `TicketReply`, `TicketActivityLog`, `TicketCategorySLA` serta filter pencarian.
- **Repository**: operasi CRUD dasar untuk tiket dan balasan termasuk paginasi dan filter.
- **Service**: logika bisnis pembuatan tiket, balasan, pembaruan status, penugasan agen, pemeriksaan SLA/eskalasi, serta integrasi notifikasi dan audit.
- **Handler (HTTP)**: memaparkan endpoint untuk membuat tiket, menambah balasan, listing, mengambil detail, mengubah status/agen.
- **Routes**: mendaftarkan rute `/tickets` dan turunannya.

## Skema Tabel

### `tickets`
- `id` (uuid, pk)
- `tenant_id` (uint, index)
- `user_id` (uint, index)
- `member_id` (uint?, index) — relasi opsional ke anggota koperasi
- `agent_id` (uint?, index)
- `title` (string)
- `category` (string: billing|technical|account|service)
- `priority` (string: low|medium|high)
- `status` (string: open|in_progress|resolved|closed)
- `escalation_level` (int, default 0, tingkat eskalasi SLA)
- `description` (text)
- `attachment_url` (string?)
- `created_at`, `updated_at`

### `ticket_replies`
- `id` (uuid, pk)
- `ticket_id` (uuid, fk -> tickets.id)
- `user_id` (uint, index)
- `message` (text)
- `attachment_url` (string?)
- `created_at`

### `ticket_categories` (SLA per kategori)
Menyimpan konfigurasi Service Level Agreement untuk setiap kategori tiket. Nilai ini digunakan layanan untuk mengevaluasi dan menaikkan `escalation_level` ketika batas waktu dilampaui.
- `category` (string, pk)
- `sla_response_minutes` (int)
- `sla_resolution_minutes` (int)

### `ticket_activity_logs`
Mencatat perubahan status atau penugasan tiket sebagai jejak audit.
- `id` (uuid, pk)
- `ticket_id` (uuid, fk -> tickets.id)
- `actor_id` (uint, index)
- `action` (string)
- `message` (text?)
- `created_at`

## Endpoint API

Semua respons menggunakan format `APIResponse` dan membutuhkan header `Authorization: Bearer <token>` serta `X-Tenant-ID`.

### Tenant
- `POST /tickets` — buat tiket baru.
- `GET /tickets` — daftar tiket milik pengguna/tenant.
- `GET /tickets/{id}` — detail tiket.
- `POST /tickets/{id}/replies` — balas tiket.
- `PATCH /tickets/{id}` — perbarui status atau penugasan.
- `GET /tickets/{id}/activities` — riwayat aktivitas.

### Vendor
- `GET /tickets` — daftar semua tiket untuk agen.
- `GET /tickets/{id}/replies` — lihat balasan tiket tertentu.
- `POST /tickets/{id}/replies` — balas tiket.
- `POST /tickets/sla` — atur SLA kategori tiket.
- `GET /tickets/sla` — daftar konfigurasi SLA.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)
 
- `POST /tickets`
  - Body:
    - `title` (wajib)
    - `category` (wajib, `billing|technical|account|service`)
    - `priority` (wajib, `low|medium|high`)
    - `description` (wajib)
    - `attachment_url` (opsional)
  - Response 201: `Ticket` baru.

- `GET /tickets`
  - Query: `status?`, `priority?`, `category?`, `member_id?`, `limit` (wajib, int>0), `cursor?`
  - Response 200: daftar `Ticket` + `meta.pagination`.

- `GET /tickets/{id}`
  - Path: `id` (uuid, wajib)
  - Response 200: detail `Ticket`.

- `POST /tickets/{id}/replies`
  - Path: `id` (uuid, wajib)
  - Body: `message` (wajib), `attachment_url` (opsional)
  - Response 201: `TicketReply`.

- `PATCH /tickets/{id}`
  - Path: `id` (uuid, wajib)
  - Body: `status` (opsional, `open|in_progress|resolved|closed`), `agent_id` (opsional, uint)
  - Response 200: `Ticket` terkini.

- `GET /tickets/{id}/activities`
  - Path: `id` (uuid, wajib)
  - Response 200: array `TicketActivityLog`.

- `GET /tickets` (vendor)
  - Query: `tenant?`, `status?`, `category?`, `limit` (wajib, int>0), `cursor?`
  - Response 200: daftar `Ticket` lintas tenant + `meta.pagination`.

- `GET /tickets/{id}/replies` (vendor)
  - Path: `id` (uuid, wajib)
  - Query: `limit` (wajib, int>0), `cursor?`
  - Response 200: daftar `TicketReply` + `meta.pagination`.

- `POST /tickets/{id}/replies` (vendor)
  - Path: `id` (uuid, wajib)
  - Body: `message` (wajib), `attachment_url` (opsional)
  - Response 201: `TicketReply`.

- `POST /tickets/sla` (vendor)
  - Body:
    - `category` (wajib)
    - `sla_response_minutes` (wajib, int)
    - `sla_resolution_minutes` (wajib, int)
  - Response 200: sukses tanpa data.

- `GET /tickets/sla` (vendor)
  - Response 200: daftar `TicketCategorySLA`.

### SLA Management (TicketCategorySLA)

`TicketCategorySLA` menyimpan batas waktu respons dan resolusi per kategori tiket. Service mengecek nilai ini dan menaikkan `escalation_level` ketika SLA terlewati sehingga tiket dapat dieskalasi.

## Contoh Payload

### Create Ticket
```json
{
  "title": "Aplikasi error",
  "category": "technical",
  "priority": "high",
  "description": "Tidak bisa login",
  "attachment_url": "https://example.com/screenshot.png"
}
```

### Add Reply
```json
{
  "message": "Tiket sedang kami proses"
}
```

### Update Status
```json
{
  "status": "resolved"
}
```

### Ticket Response
```json
{
  "id": "8d5d...",
  "tenant_id": 1,
  "user_id": 1,
  "member_id": 42,
  "agent_id": 7,
  "title": "Aplikasi error",
  "category": "technical",
  "priority": "high",
  "status": "open",
  "escalation_level": 0,
  "description": "Tidak bisa login",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Ticket Activity Log
```json
{
  "id": "log-uuid",
  "ticket_id": "8d5d...",
  "actor_id": 7,
  "action": "status_change",
  "message": "status changed to in_progress",
  "created_at": "2024-01-02T00:00:00Z"
}
```

### Ticket Category SLA
```json
{
  "category": "billing",
  "sla_response_minutes": 60,
  "sla_resolution_minutes": 1440
}
```

## Status & Transisi

- Tiket: `open` → `in_progress` → `resolved` → `closed` (dapat berubah sesuai kebutuhan layanan).
- Balasan: dapat ditambahkan oleh pengguna atau agen; notifikasi dikirim ke pihak lain.

## Paginasi & Response

- Listing menggunakan `limit` dan `cursor` string (id terakhir). `meta.pagination` menyertakan `next_cursor`, `has_next`, `has_prev`, `limit`.

## Integrasi & Dampak ke Modul Lain

- Notifications: notifikasi in-app dibuat saat tiket dibuat, dibalas, atau status diubah (ditujukan ke pihak lain: agen atau pengguna).
- Audit: perubahan status dicatat oleh `AuditService` (internal).
- Livechat: tiket dibuat otomatis ketika agen offline saat memulai sesi chat.

## Keamanan

- Middleware memastikan autentikasi `Bearer` dan isolasi tenant (`X-Tenant-ID`). Detail tiket dibatasi pada pemilik tiket (user) dan agen yang ditugaskan.

## Catatan Implementasi

- Cursor menggunakan perbandingan `id > cursor` (uuid) dan pengurutan `id`; urutan tidak merepresentasikan kronologi waktu secara ketat.
- Kanal notifikasi aktif adalah `IN_APP`; kanal lain dapat ditambahkan kemudian.

## Peran Modul Ticket per Jenis Tenant (Rangkuman)

- Pengguna Tenant: membuat tiket, menambah balasan, memantau status.
- Agen/Vendor: menangani tiket, memperbarui status, dan komunikasi.

## Skenario Penggunaan

1. Pengguna membuat tiket `technical` prioritas `high` dan melampirkan tangkapan layar.
2. Agen menandai tiket menjadi `in_progress` dan menambahkan balasan.
3. Setelah solusi diberikan, agen menandai `resolved`; pengguna memastikan perbaikan dan menutup tiket (`closed`).

## Tautan Cepat

- Notifications: [notification.md](notification.md)
- Dashboard: [dashboard.md](dashboard.md)
