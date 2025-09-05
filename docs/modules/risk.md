# Risk API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/risk/score` — hitung skor → 200 `RiskResult`
- GET `/risk/result/:member_id` — hasil skor terbaru → 200 `RiskResult`
- GET `/risk/config?limit=..&cursor=..` — list rules → 200 `APIResponse<RiskRule[]>`
- POST `/risk/config` — simpan rule → 201 `APIResponse<RiskRule>`
- DELETE `/risk/config/:id` — hapus rule → 200 `APIResponse<null>`

## Skema Data Ringkas

- RiskRule: `id`, `tenant_id`, `factor`, `weight`, `threshold`, `created_at`
- RiskResult: `id`, `tenant_id`, `member_id`, `score`, `decision` (`auto-approve|auto-reject|manual-review`), `details` (JSON string), `created_at`

## Payload Utama

- ScoreRequest: `{ member_id: number }`
- RuleRequest: `{ factor: string, weight: number, threshold: number }`

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` untuk list/manajemen rules; skor/hasil mengembalikan objek langsung pada handler saat ini (konsumsikan sesuai implementasi backend).

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
export interface RiskRule { id: number; tenant_id: number; factor: string; weight: number; threshold: number; created_at: Rfc3339String }
export interface RiskResult { id: number; tenant_id: number; member_id: number; score: number; decision: string; details: string; created_at: Rfc3339String }

// Requests
export interface ScoreRequest { member_id: number }
export interface RuleRequest { factor: string; weight: number; threshold: number }

// Responses
export type ListRiskRulesResponse = APIResponse<RiskRule[]>;
export type CreateRiskRuleResponse = APIResponse<RiskRule>;
export type DeleteRiskRuleResponse = APIResponse<null>;
```

## Paginasi (Cursor)

- Endpoint list rules menggunakan cursor numerik (`id`) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: body/query tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 404: hasil atau rule tidak ditemukan.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tampilkan detail faktor pada UI untuk transparansi keputusan.
- Pastikan hanya anggota aktif yang boleh di-score.

Tautan teknis (opsional): implementasi ada di `internal/modules/risk/*.go` bila diperlukan detail lebih lanjut.
