# Cashbook API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/cash/manual` — buat entri kas manual → 201 `CashEntry`
- GET `/cash/summary?start=..&end=..` — ringkasan kas → 200 `CashSummary`
- POST `/cash/export` — ekspor ringkasan → 200 file (octet-stream)

## Skema Data Ringkas

- CashEntry: `id`, `tenant_id`, `source`, `amount`, `type` (`in|out`), `description`, `created_at`
- CashSummary: `total_in`, `total_out`

## Payload Utama

- ManualEntryRequest:
  - `source` (string), `amount` (number), `type` (`in|out`), `description?` (string)

- Export payload:
  - `{ report_type: string }`

## Bentuk Response

- `POST /cash/manual` dan `GET /cash/summary` mengembalikan objek langsung (tanpa wrapper `APIResponse`).
- `POST /cash/export` mengembalikan file biner; periksa header `Content-Type` dan `Content-Disposition` bila perlu.

## TypeScript Types (Request & Response)

```ts
export type Rfc3339String = string;

export interface CashEntry {
  id: number;
  tenant_id: number;
  source: string;
  amount: number;
  type: 'in' | 'out';
  description: string;
  created_at: Rfc3339String;
}

export interface CashSummary { total_in: number; total_out: number }

export interface ManualEntryRequest {
  source: string;
  amount: number;
  type: 'in' | 'out';
  description?: string;
}

export interface CashExportRequest { report_type: string }

export type CreateManualCashResponse = CashEntry;
export type GetCashSummaryResponse = CashSummary;
// Export returns a file (octet-stream) — handle as Blob/ArrayBuffer on FE
```

## Paginasi (Cursor)

- Tidak ada paginasi pada endpoint cashbook.

## Error Singkat yang Perlu Ditangani

- 400: body/query tidak valid.
- 401/403: token salah/tenant tidak aktif.
- 500: kegagalan integrasi ledger/reporting.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Tangani response file pada export (Blob/ArrayBuffer + unduhan).
- Saat create manual entry, refresh ringkasan agar nilai up-to-date.

Tautan teknis (opsional): implementasi ada di `internal/modules/core/finance/cashbook_*.go` bila diperlukan detail lebih lanjut.
