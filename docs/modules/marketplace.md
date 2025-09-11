# Marketplace API — Panduan Integrasi Frontend (Singkat)

Modul Marketplace (UMKM) menangani pembuatan pesanan, konfirmasi pembayaran, dan pengiriman untuk pesanan dari kanal marketplace.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/marketplace/orders?limit=&cursor=&status=` — daftar pesanan → 200 `APIResponse<MarketplaceOrder[]>`
- POST `/marketplace/orders` — buat pesanan → 201 `APIResponse<MarketplaceOrder>`
- GET `/marketplace/orders/:id` — detail pesanan → 200 `APIResponse<MarketplaceOrder>`
- POST `/marketplace/orders/:id/payments` — konfirmasi pembayaran → 200 `APIResponse<{ ok: true }>`
- POST `/marketplace/orders/:id/ship` — tandai terkirim → 200 `APIResponse<{ ok: true }>`

## Skema Data Ringkas

- MarketplaceOrder: `id`, `tenant_id`, `order_date`, `customer_id?`, `status` (`pending|paid|shipped`), `total_amount`, `created_by?`, `created_at`, `updated_at`, preload `items[]`, `payments[]`, `shipping_address`
- MarketplaceOrderItem: `id`, `tenant_id`, `order_id`, `product_id`, `qty`, `unit_price`, `subtotal`
- MarketplaceOrderPayment: `id`, `tenant_id`, `order_id`, `amount`, `payment_status` (`paid`), `provider`, `paid_at?`
- ShippingAddress: `id`, `tenant_id`, `order_id`, `address`, `city`, `postal_code`, `receiver_name`, `phone`

## Payload Utama

- PlaceOrderRequest:
  - `customer_id?` (number)
  - `items[]`: `{ product_id: number, qty: number, unit_price: number }` (`qty > 0`)
  - `shipping`: `{ address: string, city: string, postal_code: string, receiver_name: string, phone: string }`

- PaymentRequest:
  - `{ amount: number, provider: string }`

- ShippingRequest:
  - `{ address: string, city: string, postal_code: string, receiver_name: string, phone: string }`

Catatan: stok diverifikasi saat pembuatan order; pengurangan stok dilakukan saat pembayaran dikonfirmasi.

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>` dengan `meta.pagination` pada endpoint list.

## TypeScript Types (Request & Response)

```ts
export type Rfc3339String = string;

export interface Pagination { next_cursor?: string; prev_cursor?: string; has_next: boolean; has_prev: boolean; limit: number }
export interface Meta { request_id: string; timestamp: Rfc3339String; pagination?: Pagination }
export interface APIResponse<T> { success: boolean; message: string; data: T | null; meta: Meta; errors: Record<string, string[]> | null }

export interface MarketplaceOrderItem { id: number; tenant_id: number; order_id: number; product_id: number; qty: number; unit_price: number; subtotal: number }
export interface MarketplaceOrderPayment { id: number; tenant_id: number; order_id: number; amount: number; payment_status: 'paid'; provider: string; paid_at?: Rfc3339String }
export interface ShippingAddress { id: number; tenant_id: number; order_id: number; address: string; city: string; postal_code: string; receiver_name: string; phone: string }
export interface MarketplaceOrder {
  id: number; tenant_id: number; order_date: Rfc3339String; customer_id?: number;
  status: 'pending' | 'paid' | 'shipped'; total_amount: number; created_by?: number;
  created_at: Rfc3339String; updated_at: Rfc3339String; items: MarketplaceOrderItem[];
  payments: MarketplaceOrderPayment[]; shipping_address?: ShippingAddress;
}

export interface OrderItemRequest { product_id: number; qty: number; unit_price: number }
export interface ShippingRequest { address: string; city: string; postal_code: string; receiver_name: string; phone: string }
export interface PlaceOrderRequest { customer_id?: number; items: OrderItemRequest[]; shipping: ShippingRequest }
export interface PaymentRequest { amount: number; provider: string }

export type ListOrdersResponse = APIResponse<MarketplaceOrder[]>;
export type CreateOrderResponse = APIResponse<MarketplaceOrder>;
export type GetOrderResponse = APIResponse<MarketplaceOrder>;
export type ConfirmPaymentResponse = APIResponse<{ ok: true }>;
export type ShipOrderResponse = APIResponse<{ ok: true }>;
```

## Paginasi (Cursor)

- Endpoint list menggunakan cursor numerik (`id`) dan `limit` opsional (default `10`).
- Baca `meta.pagination.next_cursor` bila `has_next = true`.

## Error Singkat

- 400: body/query invalid (mis. `limit`, `cursor`).
- 401/403: token salah/tenant tidak aktif/role tidak sesuai.
- 404: pesanan tidak ditemukan.

## Checklist Integrasi FE

- Sertakan `Authorization` dan `X-Tenant-ID` di semua request.
- Tampilkan status order dan transisi: `pending` → `paid` → `shipped`.
- Gunakan paginasi cursor untuk listing panjang.

Tautan teknis: `internal/modules/umkm/marketplace/`.
