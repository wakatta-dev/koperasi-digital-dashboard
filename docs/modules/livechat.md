# Modul Livechat

Modul Livechat memungkinkan komunikasi real-time antara tenant dan agen dukungan. Bila agen tidak tersedia, modul membuat tiket dan mengirim notifikasi saat ada balasan agen.

Referensi implementasi utama:
- `internal/modules/livechat/entity.go`
- `internal/modules/livechat/repository.go`
- `internal/modules/livechat/service.go`
- `internal/modules/livechat/handler.go`
- `internal/modules/livechat/routes.go`

## Ringkasan Peran per Tenant

- **Agen Dukungan**: memulai sesi, mengirim dan membaca pesan.
- **Pengguna Tenant**: berinteraksi melalui klien (tidak diekspos langsung oleh handler ini).

## Entitas & Skema Data

- **ChatSession**: `id`, `tenant_id`, `agent_id`, `status`, `created_at`, `updated_at`
- **ChatMessage**: `id`, `session_id`, `sender_id`, `message`, `created_at`
- Status sesi: `OPEN`, `CLOSED`

## Endpoint API

Semua endpoint memerlukan `Bearer` token, `X-Tenant-ID`, dan role `SUPPORT_AGENT`.

- `POST /livechat/sessions` — mulai sesi chat dengan tenant; gagal jika agen offline atau masih ada sesi aktif.
- `POST /livechat/sessions/{id}/messages` — kirim pesan pada sesi `id`.
- `GET /livechat/sessions/{id}/messages` — daftar pesan pada sesi `id`.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant
- Role: `SUPPORT_AGENT`

- `POST /livechat/sessions`
  - Body:
    - `agent_id` (opsional, uint; jika kosong akan menggunakan agen yang sedang login)
  - Response 201: `data` `ChatSession` (id, tenant_id, agent_id, status, timestamps)
  - Error 400: body tidak valid, agen offline, atau sesi aktif sudah ada
  - Error 403: role tidak diizinkan

- `POST /livechat/sessions/{id}/messages`
  - Path: `id` (string, id sesi)
  - Body:
    - `message` (wajib, string)
  - Response 201: `data` `ChatMessage` (id, session_id, sender_id, message, created_at; `id` dihasilkan otomatis)
  - Error 400: `message` kosong
  - Error 403: role tidak diizinkan
  - Error 500: kegagalan server/internal

- `GET /livechat/sessions/{id}/messages`
  - Path: `id` (string, id sesi)
  - Response 200: `data` array `ChatMessage` terurut naik berdasarkan `created_at`
  - Error 403: role tidak diizinkan
  - Error 500: kegagalan server/internal


## Contoh Request & Response

- Mulai Sesi
```json
POST /livechat/sessions
{ "agent_id": 1 }
```
Contoh response:
```json
{
  "id": "SESSION-ID",
  "tenant_id": 1,
  "agent_id": 1,
  "status": "OPEN",
  "created_at": "2025-09-01T10:00:00Z",
  "updated_at": "2025-09-01T10:00:00Z"
}
```

- Kirim Pesan
```json
POST /livechat/sessions/SESSION-ID/messages
{ "message": "Halo, ada yang bisa dibantu?" }
```
Contoh response:
```json
{
  "id": "MSG-ID",
  "session_id": "SESSION-ID",
  "sender_id": 1,
  "message": "Halo, ada yang bisa dibantu?",
  "created_at": "2025-09-01T10:05:00Z"
}
```

- Daftar Pesan
```http
GET /livechat/sessions/SESSION-ID/messages
```
Contoh response:
```json
[
  {
    "id": "MSG-ID",
    "session_id": "SESSION-ID",
    "sender_id": 1,
    "message": "Halo, ada yang bisa dibantu?",
    "created_at": "2025-09-01T10:05:00Z"
  }
]
```

## Integrasi & Dampak ke Modul Lain

- Ticket: membuat tiket otomatis saat agen offline.
- Notifications: notifikasi in-app dikirim saat agen membalas.

## Tautan Cepat

- Ticket: [ticket.md](ticket.md)
- Notifications: [notification.md](notification.md)
