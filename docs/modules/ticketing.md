# Modul Ticketing

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Ticketing. Modul ini digunakan untuk pengelolaan tiket dukungan (support) antara pengguna dan agen.

Referensi implementasi utama terdapat pada:
- `internal/modules/ticket/entity.go`
- `internal/modules/ticket/repository.go`
- `internal/modules/ticket/service.go`
- `internal/modules/ticket/handler.go`
- `internal/modules/ticket/routes.go`

## Ringkasan Peran per Tenant

- Pengguna tenant: membuat tiket, melihat detail, dan menambahkan balasan.
- Agen/vendor: meninjau, membalas, memperbarui status, dan mengelola penugasan agen.

## Arsitektur & Komponen

- **Entity**: mendefinisikan struktur `Ticket` dan `TicketReply` serta filter pencarian.
- **Repository**: operasi CRUD dasar untuk tiket dan balasan termasuk paginasi dan filter.
- **Service**: logika bisnis pembuatan tiket, balasan, pembaruan status, penugasan agen, serta integrasi notifikasi dan audit.
- **Handler (HTTP)**: memaparkan endpoint untuk membuat tiket, menambah balasan, listing, mengambil detail, mengubah status/agen.
- **Routes**: mendaftarkan rute `/tickets` dan turunannya.

## Skema Tabel

### `tickets`
- `id` (uuid, pk)
- `tenant_id` (uint, index)
- `user_id` (uint, index)
- `agent_id` (uint?, index)
- `title` (string)
- `category` (string: billing|technical|access|other)
- `priority` (string: low|medium|high)
- `status` (string: open|in_progress|resolved|closed)
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

## Endpoint API

Semua respons menggunakan format `APIResponse` dan membutuhkan header `Authorization: Bearer <token>` serta `X-Tenant-ID`.

- `POST /tickets` — buat tiket baru.
- `GET /tickets?status=&priority=&category=&limit={n}&cursor={id?}` — daftar tiket milik pengguna.
- `GET /tickets/{id}` — detail tiket termasuk balasan.
- `POST /tickets/{id}/replies` — tambah balasan pada tiket.
- `PATCH /tickets/{id}` — ubah `status` atau tetapkan `agent_id`.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `POST /tickets`
  - Body createTicketRequest:
    - `title` (wajib)
    - `category` (wajib; `billing|technical|access|other`)
    - `priority` (wajib; `low|medium|high`)
    - `description` (wajib)
    - `attachment_url` (opsional)
  - Response 201: `data` `Ticket` (status awal `open`).

- `GET /tickets?status=&priority=&category=&limit={n}&cursor={id?}`
  - Query:
    - `status` (opsional; `open|in_progress|resolved|closed`)
    - `priority` (opsional)
    - `category` (opsional)
    - `limit` (wajib, int>0)
    - `cursor` (opsional, string id terakhir)
  - Response 200: `data` array `Ticket` + `meta.pagination` (cursor string berbasis `id`).

- `GET /tickets/{id}`
  - Path: `id` (uuid, wajib)
  - Response 200: `data` `Ticket` berikut `replies` yang terurut.

- `POST /tickets/{id}/replies`
  - Path: `id` (uuid, wajib)
  - Body addReplyRequest:
    - `message` (wajib)
    - `attachment_url` (opsional)
  - Response 201: `data` `TicketReply`.

- `PATCH /tickets/{id}`
  - Path: `id` (uuid, wajib)
  - Body updateTicketRequest:
    - `status` (opsional; `open|in_progress|resolved|closed`)
    - `agent_id` (opsional; uint)
  - Response 200: `data` berisi field yang diperbarui (`status` dan/atau `agent_id`).

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

## Status & Transisi

- Tiket: `open` → `in_progress` → `resolved` → `closed` (dapat berubah sesuai kebutuhan layanan).
- Balasan: dapat ditambahkan oleh pengguna atau agen; notifikasi dikirim ke pihak lain.

## Paginasi & Response

- Listing menggunakan `limit` dan `cursor` string (id terakhir). `meta.pagination` menyertakan `next_cursor`, `has_next`, `has_prev`, `limit`.

## Integrasi & Dampak ke Modul Lain

- Notifications: notifikasi in-app dibuat saat tiket dibuat, dibalas, atau status diubah (ditujukan ke pihak lain: agen atau pengguna).
- Audit: perubahan status dicatat oleh `AuditService` (internal).

## Keamanan

- Middleware memastikan autentikasi `Bearer` dan isolasi tenant (`X-Tenant-ID`). Detail tiket dibatasi pada pemilik tiket (user) dan agen yang ditugaskan.

## Catatan Implementasi

- Cursor menggunakan perbandingan `id > cursor` (uuid) dan pengurutan `id`; urutan tidak merepresentasikan kronologi waktu secara ketat.
- Kanal notifikasi aktif adalah `IN_APP`; kanal lain dapat ditambahkan kemudian.

## Peran Modul Ticketing per Jenis Tenant (Rangkuman)

- Pengguna Tenant: membuat tiket, menambah balasan, memantau status.
- Agen/Vendor: menangani tiket, memperbarui status, dan komunikasi.

## Skenario Penggunaan

1. Pengguna membuat tiket `technical` prioritas `high` dan melampirkan tangkapan layar.
2. Agen menandai tiket menjadi `in_progress` dan menambahkan balasan.
3. Setelah solusi diberikan, agen menandai `resolved`; pengguna memastikan perbaikan dan menutup tiket (`closed`).
