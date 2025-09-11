# POS API — Panduan Integrasi Frontend (Singkat)

Modul Point of Sale (UMKM) untuk mencatat transaksi kasir, pembayaran, dan pembatalan dengan audit dan penyesuaian stok.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/pos/sales?status=&start_date=&end_date=&limit=&cursor=` — daftar penjualan → 200 `APIResponse<POSale[]>`
- POST `/pos/sales` — buat penjualan → 201 `APIResponse<POSale>`
- GET `/pos/sales/:id` — detail penjualan → 200 `APIResponse<POSale>`
- POST `/pos/sales/:id/payments` — tambah pembayaran → 201 `APIResponse<POSPayment>`
- POST `/pos/sales/:id/cancel` — batalkan penjualan → 200 `APIResponse<POSale>`

## Skema Data Ringkas

- POSale: `id`, `tenant_id`, `sale_date`, `customer_id?`, `total_amount`, `payment_method`, `status` (`completed|cancelled`), `created_by?`, `updated_by?`, `created_at`, `updated_at`, preload `items[]`, `payments[]`
- POSaleItem: `id`, `tenant_id`, `sale_id`, `product_id`, `qty`, `unit_price`, `subtotal`
- POSPayment: `id`, `tenant_id`, `sale_id`, `amount`, `method`, `reference`

## Payload Utama

- CreateSaleRequest:
  - `sale_date` (RFC3339), `customer_id?` (number)
  - `items[]`: `{ product_id: number, qty: number, unit_price: number }` (`qty > 0`)
  - `payments[]`: `{ amount: number, method: string, reference?: string }` (`amount > 0`)

- AddPaymentRequest:
  - `{ amount: number, method: string, reference?: string }`

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` dengan `meta.pagination` pada endpoint list.

## TypeScript Types (Request & Response)

```ts
export type Rfc3339String = string;
export interface Pagination { next_cursor?: string; prev_cursor?: string; has_next: boolean; has_prev: boolean; limit: number }
export interface Meta { request_id: string; timestamp: Rfc3339String; pagination?: Pagination }
export interface APIResponse<T> { success: boolean; message: string; data: T | null; meta: Meta; errors: Record<string, string[]> | null }

export interface POSaleItem { id: number; tenant_id: number; sale_id: number; product_id: number; qty: number; unit_price: number; subtotal: number }
export interface POSPayment { id: number; tenant_id: number; sale_id: number; amount: number; method: string; reference: string }
export interface POSale {
  id: number; tenant_id: number; sale_date: Rfc3339String; customer_id?: number;
  total_amount: number; payment_method: string; status: 'completed' | 'cancelled';
  created_by?: number; updated_by?: number; created_at: Rfc3339String; updated_at: Rfc3339String;
  items: POSaleItem[]; payments: POSPayment[];
}

export interface SaleItemRequest { product_id: number; qty: number; unit_price: number }
export interface PaymentRequest { amount: number; method: string; reference?: string }
export interface CreateSaleRequest { sale_date: Rfc3339String; customer_id?: number; items: SaleItemRequest[]; payments: PaymentRequest[] }
export interface AddPaymentRequest { amount: number; method: string; reference?: string }

export type ListSalesResponse = APIResponse<POSale[]>;
export type CreateSaleResponse = APIResponse<POSale>;
export type GetSaleResponse = APIResponse<POSale>;
export type AddPaymentResponse = APIResponse<POSPayment>;
export type CancelSaleResponse = APIResponse<POSale>;
```

## Paginasi (Cursor)

- Endpoint list menggunakan cursor numerik (`id`) dan `limit` opsional (default `10`).
- Baca `meta.pagination.next_cursor` bila `has_next = true`.

## Error Singkat

- 400: body/query invalid (mis. format tanggal, `limit`, `cursor`).
- 401/403: token salah/tenant tidak aktif.
- 404: penjualan tidak ditemukan.

## Checklist Integrasi FE

- Validasi tanggal `sale_date` RFC3339 dan format filter tanggal.
- Tampilkan status `completed` dan `cancelled`; tampilkan efek pembatalan terhadap stok.
- Gunakan paginasi cursor pada daftar besar; tampilkan ringkasan `total_amount` dan rincian item.

Tautan teknis: `internal/modules/umkm/pos/`.
