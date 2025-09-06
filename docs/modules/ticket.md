# Tickets API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/tickets` — buat tiket → 201 `APIResponse<Ticket>`
- GET `/tickets?limit=..&cursor=..` — daftar tiket → 200 `APIResponse<Ticket[]>`
- GET `/tickets/:id` — detail tiket → 200 `APIResponse<Ticket>`
- POST `/tickets/:id/replies` — tambah balasan → 201 `APIResponse<TicketReply>`
- PATCH `/tickets/:id` — ubah status/penugasan → 200 `APIResponse<Ticket>`
- GET `/tickets/:id/activities` — aktivitas tiket → 200 `APIResponse<TicketActivityLog[]>`
- GET `/vendor/tickets/:id/replies?limit=..&cursor=..` — vendor: list balasan → 200 `APIResponse<TicketReply[]>`
- POST `/vendor/tickets/sla` — vendor: set SLA → 200 `APIResponse<null>`
- GET `/vendor/tickets/sla` — vendor: list SLA → 200 `APIResponse<TicketCategorySLA[]>`

## Skema Data Ringkas

- Ticket: `id` (uuid), `tenant_id`, `user_id`, `member_id?`, `agent_id?`, `title`, `category` (`billing|technical|account|service`), `priority` (`low|medium|high`), `status` (`open|in_progress|resolved|closed`), `escalation_level`, `description`, `attachment_url?`, timestamps
- TicketReply: `id` (uuid), `ticket_id`, `user_id`, `message`, `attachment_url?`, `created_at`
- TicketActivityLog: `id` (uuid), `ticket_id`, `actor_id`, `action`, `message?`, `created_at`
- TicketCategorySLA: `category`, `sla_response_minutes`, `sla_resolution_minutes`

## Payload Utama

- CreateTicketRequest:
  - `title`, `category` (`billing|technical|account|service`), `priority` (`low|medium|high`), `description`, `attachment_url?`

- AddReplyRequest:
  - `message`, `attachment_url?`

- UpdateTicketRequest:
  - `status?` (`open|in_progress|resolved|closed`), `agent_id?`

- SLARequest (vendor):
  - `category`, `sla_response_minutes`, `sla_resolution_minutes`

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
export interface Ticket {
  id: string; // uuid
  tenant_id: number;
  user_id: number;
  member_id?: number;
  agent_id?: number;
  title: string;
  category: 'billing' | 'technical' | 'account' | 'service';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  escalation_level: number;
  description: string;
  attachment_url?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TicketReply {
  id: string; // uuid
  ticket_id: string;
  user_id: number;
  message: string;
  attachment_url?: string;
  created_at: Rfc3339String;
}

export interface TicketActivityLog {
  id: string; // uuid
  ticket_id: string;
  actor_id: number;
  action: string;
  message?: string;
  created_at: Rfc3339String;
}

export interface TicketCategorySLA {
  category: string;
  sla_response_minutes: number;
  sla_resolution_minutes: number;
}

// Requests
export interface CreateTicketRequest {
  title: string;
  category: 'billing' | 'technical' | 'account' | 'service';
  priority: 'low' | 'medium' | 'high';
  description: string;
  attachment_url?: string;
}

export interface AddReplyRequest { message: string; attachment_url?: string }
export interface UpdateTicketRequest { status?: 'open' | 'in_progress' | 'resolved' | 'closed'; agent_id?: number }
export interface SLARequest { category: string; sla_response_minutes: number; sla_resolution_minutes: number }

// Responses
export type CreateTicketResponse = APIResponse<Ticket>;
export type ListTicketsResponse = APIResponse<Ticket[]>;
export type GetTicketResponse = APIResponse<Ticket>;
export type AddReplyResponse = APIResponse<TicketReply>;
export type UpdateTicketResponse = APIResponse<Ticket>;
export type ListActivitiesResponse = APIResponse<TicketActivityLog[]>;
export type ListRepliesResponse = APIResponse<TicketReply[]>;
export type SetSLAResponse = APIResponse<null>;
export type ListSLAResponse = APIResponse<TicketCategorySLA[]>;
```

## Paginasi (Cursor)

- Endpoint list (`GET /tickets`, `GET /vendor/tickets/:id/replies`) menggunakan cursor dengan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field (validasi body/query).
- 401/403: token salah/tenant tidak aktif/role tidak sesuai (mis. akses SLA vendor).
- 404: resource tidak ditemukan (ticket/reply/activity).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Implementasikan filter (status/priority/category/member_id) saat listing.
- Tampilkan progres SLA (escalation_level) bila relevan.

Tautan teknis (opsional): implementasi ada di `internal/modules/support/ticket/*.go` bila diperlukan detail lebih lanjut.

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
