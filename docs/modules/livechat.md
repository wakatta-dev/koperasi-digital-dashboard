# Livechat API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Role: `SUPPORT_AGENT`

## Ringkasan Endpoint

- POST `/livechat/sessions` — mulai sesi → 201 `APIResponse<ChatSession>`
- POST `/livechat/sessions/:id/messages` — kirim pesan → 201 `APIResponse<ChatMessage>`
- GET `/livechat/sessions/:id/messages?limit=..&cursor=..` — list pesan → 200 `APIResponse<ChatMessage[]>`

## Skema Data Ringkas

- ChatSession: `id` (uuid), `tenant_id`, `agent_id?`, `status` (`OPEN|CLOSED`), `created_at`, `updated_at`
- ChatMessage: `id` (uuid), `session_id`, `sender_id`, `message`, `created_at`

## Payload Utama

- StartSessionRequest:
  - `agent_id?` (number; default user saat ini bila kosong)

- SendMessageRequest:
  - `message` (string)

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>`.
- Endpoint list menyediakan `meta.pagination` bila mendukung cursor.

## TypeScript Types (Request & Response)

```ts
// Common
export type Rfc3339String = string;

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}

// Entities
export type SessionStatus = 'OPEN' | 'CLOSED';

export interface ChatSession {
  id: string;
  tenant_id: number;
  agent_id?: number;
  status: SessionStatus;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: number;
  message: string;
  created_at: Rfc3339String;
}

// Requests
export interface StartSessionRequest { agent_id?: number }
export interface SendMessageRequest { message: string }

// Responses
export type StartSessionResponse = APIResponse<ChatSession>;
export type SendMessageResponse = APIResponse<ChatMessage>;
export type ListMessagesResponse = APIResponse<ChatMessage[]>;
```

## Paginasi (Cursor)

- Endpoint list pesan menggunakan cursor string (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `message` kosong atau body tidak valid.
- 401/403: token salah/tenant tidak aktif/role bukan `SUPPORT_AGENT`.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Pastikan UI menangani status sesi (`OPEN|CLOSED`).
- Sinkronkan notifikasi in-app saat agen mengirim balasan.

Tautan teknis (opsional): implementasi ada di `internal/modules/livechat/*.go` bila diperlukan detail lebih lanjut.
