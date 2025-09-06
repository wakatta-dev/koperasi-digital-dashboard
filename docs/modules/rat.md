# RAT API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/rat` — jadwalkan RAT → 201 `APIResponse<RAT>`
- POST `/rat/:id/notify` — kirim notifikasi → 200 `APIResponse<null>`
- POST `/rat/:id/documents` — unggah dokumen → 201 `APIResponse<null>`
- POST `/rat/:id/voting` — buat item voting → 201 `APIResponse<VotingItem>`
- POST `/rat/voting/:item_id/vote` — pemungutan suara → 201 `APIResponse<{ status: string }>`
- GET `/rat/voting/:item_id/result` — hasil voting → 200 `APIResponse<VotingResult>`
- GET `/rat/history?limit=..&cursor=..` — riwayat RAT → 200 `APIResponse<RAT[]>`

## Skema Data Ringkas

- RAT: `id`, `tenant_id`, `year`, `date`, `agenda`, `created_at`
- RATDocument: `id`, `rat_id`, `type`, `file_url`
- VotingItem: `id`, `rat_id`, `question`, `type`, `options`, `open_at`, `close_at`
- VoteRecord: `id`, `voting_item_id`, `member_id`, `selected_option`
- VotingResult: `item_id`, `counts` (map), `total`

## Payload Utama

- CreateRATRequest:
  - `year` (number), `date` (RFC3339), `agenda?` (string)

- Notify body:
  - `{ message: string }`

- UploadDocumentRequest:
  - `type` (string), `data` (base64)

- CreateVotingItemRequest:
  - `question` (string), `type` (string), `options?` (array), `open_at` (RFC3339), `close_at` (RFC3339)

- VoteRequest:
  - `member_id` (number), `selected_option` (string)

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
export interface RAT { id: number; tenant_id: number; year: number; date: Rfc3339String; agenda?: string; created_at: Rfc3339String }
export interface RATDocument { id: number; rat_id: number; type: string; file_url: string }
export interface VotingItem { id: number; rat_id: number; question: string; type: string; options?: string[]; open_at: Rfc3339String; close_at: Rfc3339String }
export interface VotingResult { item_id: number; counts: Record<string, number>; total: number }

// Requests
export interface CreateRATRequest { year: number; date: Rfc3339String; agenda?: string }
export interface NotifyRequest { message: string }
export interface UploadDocumentRequest { type: string; data: string }
export interface CreateVotingItemRequest { question: string; type: string; options?: string[]; open_at: Rfc3339String; close_at: Rfc3339String }
export interface VoteRequest { member_id: number; selected_option: string }

// Responses
export type CreateRATResponse = APIResponse<RAT>;
export type NotifyRATResponse = APIResponse<null>;
export type UploadRATDocumentResponse = APIResponse<null>;
export type CreateVotingItemResponse = APIResponse<VotingItem>;
export type VoteResponse = APIResponse<{ status: string }>;
export type GetVotingResultResponse = APIResponse<VotingResult>;
export type RATHistoryResponse = APIResponse<RAT[]>;
```

## Paginasi (Cursor)

- Endpoint `GET /rat/history` menggunakan cursor numerik (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: body/query tidak valid (tahun, tanggal, dll.).
- 401/403: token salah/tenant tidak aktif.
- 404: RAT/item/vote tidak ditemukan.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Validasi periode voting (`open_at` ≤ now ≤ `close_at`) di UI untuk UX yang baik.
- Tampilkan hasil voting secara periodik atau polling bila perlu.

Tautan teknis (opsional): implementasi ada di `internal/modules/koperasi/rat/*.go` bila diperlukan detail lebih lanjut.
