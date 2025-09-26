# Support Tickets API — Panduan Integrasi Frontend (Singkat)

Modul ticket menyediakan manajemen tiket bantuan tenant: pembuatan, daftar tiket, percakapan (reply), unggah lampiran, serta aktivitas. Vendor memiliki endpoint tambahan untuk melihat tiket tenant, mengelola SLA, dan mengunggah lampiran dari sisi agen.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json` (untuk JSON) atau `multipart/form-data` (unggah lampiran)
- `Accept`: `application/json`
- Tidak ada header tambahan; middleware role membatasi akses vendor/agen support.

## Ringkasan Endpoint

**Tenant / Client (`/tickets`)**

- POST `/tickets` — `tenant user`: buat tiket → 201 `APIResponse<Ticket>`
- GET `/tickets?tenant=&status=&priority=&category=&term=&business_unit_id=&plan_id=&member_id=&limit=&cursor=` — `tenant user`: daftar tiket → 200 `APIResponse<Ticket[]>`
- GET `/tickets/:id` — `tenant user`: detail tiket + reply terbaru → 200 `APIResponse<Ticket>`
- POST `/tickets/:id/replies` — `tenant user`: tambah balasan → 201 `APIResponse<TicketReply>`
- POST `/tickets/:id/attachments` — `tenant user`: unggah lampiran (≤5 MB, validasi service) → 200 `APIResponse<TicketActivityLog>`
- PATCH `/tickets/:id` — `tenant user/support agent`: ubah status (`open|in_progress|pending|closed`) atau assign agent → 200 `APIResponse<Ticket>`
- GET `/tickets/:id/activities?limit=&cursor=` — `tenant user`: histori aktivitas → 200 `APIResponse<TicketActivityLog[]>`

**Vendor / Support Agent (require vendor roles)**

- GET `/tickets/:id/vendor-view` — lihat tiket beserta SLA & info tambahan → 200 `APIResponse<Ticket>`
- GET `/tickets/:id/vendor-replies?term=&sender_id=&limit=&cursor=` — daftar reply (vendor view) → 200 `APIResponse<TicketReply[]>`
- POST `/tickets/:id/vendor-attachments` — unggah lampiran dari vendor → 200 `APIResponse<TicketActivityLog>`
- POST `/tickets/sla` — `vendor admin (AdminVendor)`: atur SLA kategori → 200 `APIResponse<null>`
- GET `/tickets/sla` — `vendor admin & super admin tenant`: daftar SLA kategori → 200 `APIResponse<TicketCategorySLA[]>`

> Beberapa operasi membutuhkan akses unit bisnis; modul `unitaccess` memvalidasi `business_unit_id` dan akan mengembalikan 403 jika user tidak berhak.

## Skema Data Ringkas

- Ticket: `id:string`, `tenant_id:number`, `user_id:number`, `member_id?:number`, `agent_id?:number`, `business_unit_id?:number`, `title:string`, `category:'billing'|'technical'|'other'`, `priority:'low'|'medium'|'high'`, `status:'open'|'in_progress'|'pending'|'closed'`, SLA metric fields (`first_response_at`, `pending_at`, `resolved_at`, `first_response_minutes`, `first_response_sla_delta_minutes`, `resolution_minutes`, `resolution_sla_delta_minutes`), `escalation_level:number`, `description:string`, `attachment_url?:string`, `attachment?:FileMetadata`, `product_plan_id?:number`, `plan_name?:string`, audit timestamp.
- TicketReply: `id:string`, `ticket_id:string`, `user_id:number`, `business_unit_id?:number`, `message:string`, `attachment_url?:string`, `attachment?:FileMetadata`, `created_at:Rfc3339`.
- TicketActivityLog: `id:string`, `ticket_id:string`, `actor_id:number`, `business_unit_id?:number`, `action:string`, `message:string`, `attachment?:FileMetadata`, `created_at:Rfc3339`.
- FileMetadata: `{ name:string, url:string, type:string, size:number }`.
- TicketCategorySLA: `category:string`, `sla_response_minutes:number`, `sla_resolution_minutes:number`.

> Field SLA delta (`*_sla_delta_minutes`) menunjukkan deviasi terhadap konfigurasi SLA; nilai negatif menandakan melewati SLA.

## Payload Utama

- CreateTicketRequest:
  - `{ title: string, category: 'billing'|'technical'|'other', priority: 'low'|'medium'|'high', description: string, business_unit_id?: number, attachment_url?: string, attachment?: FileMetadata }`
  - Dapat dikirim sebagai JSON atau multipart (`attachment` file) — backend akan mengunggah ke storage jika `attachment` file disertakan.

- AddReplyRequest:
  - `{ message: string, attachment_url?: string, attachment?: FileMetadata }`

- UpdateTicketRequest (PATCH `/tickets/:id`):
  - `{ status?: 'open'|'in_progress'|'pending'|'closed', agent_id?: number }`

- VendorUploadAttachment (multipart): field `file`; ukuran maksimal mengikuti konfigurasi storage (lihat handler).

- TicketList query: `tenant` (hanya untuk peran vendor/support; isi dengan ID tenant target), `status`, `priority`, `category`, `term`, `business_unit_id`, `plan_id`, `member_id`, `limit` (default 10), `cursor` (UUID tiket/reply).
- VendorReply query (`GET /tickets/:id/vendor-replies`): `term`, `sender_id`, `limit` (default 10), `cursor`.
- Activity list query (`GET /tickets/:id/activities`): `term`, `limit` (default 10), `cursor`.

- SLARequest (POST `/tickets/sla`): `{ category: string, sla_response_minutes: number, sla_resolution_minutes: number }`

- SLA list query (`GET /tickets/sla`): `term`, `category`, `limit` (default 10), `cursor`.

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dengan `meta.pagination` pada daftar (`/tickets`, `/tickets/:id/activities`, `/vendor-replies`).
- Unggah lampiran mengembalikan log aktivitas terbaru berisi metadata file yang bisa langsung ditambahkan ke timeline percakapan.

## TypeScript Types (Request & Response)

```ts
type Rfc3339String = string;

type Pagination = {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
};

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type FileMetadata = {
  name: string;
  url: string;
  type: string;
  size: number;
};

type Ticket = {
  id: string;
  tenant_id: number;
  user_id: number;
  member_id?: number;
  agent_id?: number;
  business_unit_id?: number;
  title: string;
  category: 'billing' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'pending' | 'closed';
  description: string;
  attachment_url?: string;
  attachment?: FileMetadata;
  first_response_at?: Rfc3339String;
  pending_at?: Rfc3339String;
  resolved_at?: Rfc3339String;
  first_response_minutes?: number;
  first_response_sla_delta_minutes?: number;
  resolution_minutes?: number;
  resolution_sla_delta_minutes?: number;
  escalation_level: number;
  product_plan_id?: number;
  plan_name?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type TicketReply = {
  id: string;
  ticket_id: string;
  user_id: number;
  business_unit_id?: number;
  message: string;
  attachment_url?: string;
  attachment?: FileMetadata;
  created_at: Rfc3339String;
};

type TicketActivityLog = {
  id: string;
  ticket_id: string;
  actor_id: number;
  business_unit_id?: number;
  action: string;
  message: string;
  attachment_url?: string;
  attachment?: FileMetadata;
  created_at: Rfc3339String;
};

type TicketCategorySLA = {
  category: string;
  sla_response_minutes: number;
  sla_resolution_minutes: number;
};

type CreateTicketRequest = {
  title: string;
  category: 'billing' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high';
  description: string;
  business_unit_id?: number;
  attachment_url?: string;
  attachment?: FileMetadata;
};

type AddReplyRequest = {
  message: string;
  attachment_url?: string;
  attachment?: FileMetadata;
};

type UpdateTicketRequest = {
  status?: 'open' | 'in_progress' | 'pending' | 'closed';
  agent_id?: number;
};

type SLARequest = {
  category: string;
  sla_response_minutes: number;
  sla_resolution_minutes: number;
};

type TicketListResponse = APIResponse<Ticket[]>;
type TicketDetailResponse = APIResponse<Ticket>;
type TicketReplyResponse = APIResponse<TicketReply>;
type TicketActivityResponse = APIResponse<TicketActivityLog[]>;
type TicketSLAResponse = APIResponse<TicketCategorySLA[]>;
```

> FE dapat menggunakan tipe `FileMetadata` yang sama untuk lampiran tenant maupun vendor agar pemeriksaan ukuran/tipe file seragam di seluruh modul.

## Paginasi (Cursor)

- `GET /tickets`, `/tickets/:id/activities`, `/tickets/:id/vendor-replies`, dan `/tickets/sla` memakai cursor string (UUID). Gunakan `meta.pagination.next_cursor` untuk request berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload atau query tidak valid (kategori/prioritas tidak sesuai enum, file terlalu besar atau tipe tidak didukung, `tenant`/`plan_id`/`member_id` bukan angka, `business_unit_id` kosong untuk role unit).
- 401/403: user tidak memiliki akses unit (`authorization`) atau vendor role tidak memenuhi syarat (contoh: kategori keuangan butuh `AdminKeuangan`, pengaturan SLA hanya `AdminVendor`).
- 404: tiket tidak ditemukan saat detail/update/upload.
- 409: transisi status tidak sah terhadap SLA (diterjemahkan sebagai 400 dengan pesan spesifik).
- 500: kegagalan internal (upload storage, repository) — tampilkan pesan umum.

## Checklist Integrasi FE

- Validasi kombinasi kategori/prioritas sebelum submit; tampilan form harus menyediakan enum yang sama dengan backend.
- Saat unggah lampiran, tampilkan progress dan batasi tipe/ukuran file sesuai aturan handler.
- Tampilkan SLA countdown di UI dengan memanfaatkan field `first_response_sla_delta_minutes` dan `resolution_sla_delta_minutes`.
- Gunakan cursor pagination untuk infinite scroll percakapan serta histori aktivitas.
- Vendor UI harus menyediakan alat untuk mengatur SLA kategori dan memperbarui lampiran dari sisi agen.
- Pastikan hanya peran `AdminVendor` yang dapat mengubah konfigurasi SLA atau mengakses lampiran finansial.

## Tautan Teknis (Opsional)

- `internal/modules/support/ticket/handler.go` — implementasi endpoint tiket & vendor view.
- `internal/modules/support/ticket/service.go` — logika status, SLA, dan integrasi storage.
- `internal/modules/support/ticket/entity.go` — struktur `Ticket`, `TicketReply`, `TicketActivityLog`.
