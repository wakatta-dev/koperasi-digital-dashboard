# Marketplace API — Panduan Integrasi Frontend (Singkat)

Modul marketplace mendukung pemesanan internal tenant (UMKM/BUMDes/koperasi), konfirmasi pembayaran, pengiriman, serta katalog publik untuk pelanggan. Sebagian endpoint memerlukan aktivasi fitur marketplace di konfigurasi tenant.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Private order endpoints:
  - Authorization: `Bearer <token>`
  - `X-Tenant-ID`: `number`
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`
- Public katalog/order status:
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`
- `X-Business-Unit-ID`: `number` (opsional; tenant BUMDes wajib mengirim via payload/query sesuai konteks)

## Ringkasan Endpoint

**Private (tenant internal)**

- POST `/api/marketplace/orders` — `tenant sales`: buat order marketplace → 201 `MarketplaceOrder`
- GET `/api/marketplace/orders?status=&business_unit_id=&limit=&cursor=` — `tenant sales`: daftar order → 200 `APIResponse<MarketplaceOrder[]>`
- GET `/api/marketplace/orders/:id` — `tenant sales`: detail order → 200 `MarketplaceOrder`
- POST `/api/marketplace/orders/:id/payments` — `tenant finance`: konfirmasi pembayaran → 200 `APIResponse<MarketplaceOrder>`
- POST `/api/marketplace/orders/:id/ship` — `tenant sales`: tandai terkirim + data pengiriman → 200 `APIResponse<MarketplaceOrder>`
- PATCH `/api/marketplace/orders/:id/status` — `tenant sales`: ubah status (`shipped`|`completed`) → 200 `APIResponse<MarketplaceOrder>`

**Publik (tanpa auth)**

- GET `/api/marketplace/catalog?q=&limit=&cursor=&domain=` — pelanggan: daftar produk publik → 200 `APIResponse<CatalogListResponse>`
- GET `/api/marketplace/catalog/:id?domain=` — pelanggan: detail produk → 200 `APIResponse<CatalogProduct>`
- GET `/api/marketplace/cart/items?domain=&customer_id=` — pelanggan: lihat isi keranjang → 200 `APIResponse<CartItem[]>`
- POST `/api/marketplace/cart/items?domain=` — pelanggan: tambah item ke keranjang → 201 `APIResponse<CartItem>`
- DELETE `/api/marketplace/cart/items/:variant_id?domain=&customer_id=` — pelanggan: hapus item keranjang → 200 `APIResponse<{ removed: boolean }>`
- POST `/api/marketplace/cart/checkout?domain=` — pelanggan: checkout keranjang → 201 `MarketplaceOrder`
- GET `/api/marketplace/orders/:id/status?domain=&customer_id=` — pelanggan: lacak status order → 200 `APIResponse<OrderStatusResponse>`

> Tenant vendor tidak boleh mengakses marketplace (403). Tenant koperasi perlu diaktifkan via konfigurasi (`IsMarketplaceEnabled`). Tenant BUMDes wajib menyertakan `business_unit_id` saat membuat/melihat order.

## Skema Data Ringkas

- MarketplaceOrder: `id:number`, `tenant_id:number`, `business_unit_id?:number`, `order_date:Rfc3339`, `customer_id?:number`, `status:'pending'|'processing'|'paid'|'shipped'|'completed'|'cancelled'`, `total_amount:number`, `processed_at?:Rfc3339`, `shipped_at?:Rfc3339`, `completed_at?:Rfc3339`, `items:MarketplaceOrderItem[]`, `payments:MarketplaceOrderPayment[]`, `shipping_address:ShippingAddress`
- MarketplaceOrderItem: `id:number`, `order_id:number`, `product_id:number`, `qty:number`, `unit_price:number`, `subtotal:number`
- MarketplaceOrderPayment: `id:number`, `order_id:number`, `amount:number`, `payment_status:string`, `provider?:string`, `method:'cash'|'transfer'|'qris'|'cod'`, `reference?:string`, `proof_url?:string`, `paid_at?:Rfc3339`
- ShippingAddress: `address:string`, `city:string`, `postal_code:string`, `receiver_name:string`, `phone:string`
- CatalogProduct: `id:number`, `sku:string`, `name:string`, `description:string`, `base_unit:string`, `attributes?:Record<string,unknown>`, `media:CatalogMedia[]`, `variants:CatalogVariant[]`, `branding?:CatalogBranding`
- CatalogVariant: `id:number`, `sku:string`, `name:string`, `attributes?:Record<string,unknown>`, `prices:{ level_id:number, price:number }[]`, `stock:number`
- CatalogListResponse: `{ items: CatalogProduct[], branding?: CatalogBranding }`
- OrderStatusResponse: `id:number`, `status:string`, `processed_at?:Rfc3339`, `shipped_at?:Rfc3339`, `completed_at?:Rfc3339`

> Status order mengikuti lifecycle di service (`pending → processed → shipped/completed`). FE publik hanya mendapatkan data yang boleh diekspos (tidak ada detail pembayaran).

## Payload Utama

- PlaceOrderRequest:
  - `business_unit_id?` (number), `customer_id?` (number), `items` (`{ product_id: number, qty: number, unit_price: number }[]`), `shipping` (`{ address, city, postal_code, receiver_name, phone }`), `booking?` (`{ start_date?: Rfc3339, end_date?: Rfc3339, status?: string }`), `payment_method?` (`'cash'|'transfer'|'qris'|'cod'`)

- CartItemRequest (public cart):
  - `{ customer_id: number, product_variant_id: number, qty: number, unit_price: number, business_unit_id?: number }` dengan query `domain=<tenant_domain>`.

- CartCheckoutRequest:
  - `{ customer_id: number, business_unit_id?: number, payment_method?: 'cash'|'transfer'|'qris'|'cod', shipping: ShippingRequest }` dengan query `domain=<tenant_domain>`.

- PaymentRequest:
  - `{ amount: number, method: 'cash'|'transfer'|'qris'|'cod', provider?: string, reference?: string, proof_url?: string }`

- ShippingRequest (private):
  - `{ address: string, city: string, postal_code: string, receiver_name: string, phone: string }`

- UpdateOrderStatusRequest:
  - `{ status: 'shipped'|'completed', shipping?: ShippingRequest }`

- Katalog publik memerlukan query `domain` untuk menentukan tenant; gunakan domain custom (mis. `warungku.id`).

## Bentuk Response

- Private endpoints mengirim `APIResponse<T>` kecuali `Create`, `Detail`, dan `Public catalog` yang mengembalikan objek langsung untuk kompatibilitas lama (perlu periksa; handler `Create` return raw). *Catatan*: `Create` & `Detail` saat ini menulis response langsung tanpa wrapper; FE harus siap menerima objek order murni (`MarketplaceOrder`).
- Endpoint list menggunakan `meta.pagination` (`next_cursor`, `has_next`).
- Order public status hanya menyertakan data timeline tanpa detail sensitif.

## TypeScript Types (Request & Response)

```ts
// Common
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

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  qty: number;
  unit_price: number;
  subtotal: number;
};

type OrderPayment = {
  id: number;
  order_id: number;
  amount: number;
  payment_status: string;
  provider?: string;
  method: 'cash' | 'transfer' | 'qris' | 'cod';
  reference?: string;
  proof_url?: string;
  paid_at?: Rfc3339String;
};

type ShippingAddress = {
  address: string;
  city: string;
  postal_code: string;
  receiver_name: string;
  phone: string;
};

type MarketplaceOrder = {
  id: number;
  tenant_id: number;
  business_unit_id?: number;
  order_date: Rfc3339String;
  customer_id?: number;
  status: string;
  total_amount: number;
  processed_at?: Rfc3339String;
  shipped_at?: Rfc3339String;
  completed_at?: Rfc3339String;
  items: OrderItem[];
  payments: OrderPayment[];
  shipping_address?: ShippingAddress;
};

type PlaceOrderRequest = {
  business_unit_id?: number;
  customer_id?: number;
  items: Array<{ product_id: number; qty: number; unit_price: number }>;
  shipping: ShippingAddress;
  booking?: {
    start_date?: Rfc3339String;
    end_date?: Rfc3339String;
    status?: string;
  };
  payment_method?: 'cash' | 'transfer' | 'qris' | 'cod';
};

type CartItemRequest = {
  customer_id: number;
  product_variant_id: number;
  qty: number;
  unit_price: number;
  business_unit_id?: number;
};

type CartCheckoutRequest = {
  customer_id: number;
  business_unit_id?: number;
  payment_method?: 'cash' | 'transfer' | 'qris' | 'cod';
  shipping: ShippingAddress;
};

type PaymentRequest = {
  amount: number;
  method: 'cash' | 'transfer' | 'qris' | 'cod';
  provider?: string;
  reference?: string;
  proof_url?: string;
};

type ShippingRequest = ShippingAddress;

type UpdateOrderStatusRequest = {
  status: 'shipped' | 'completed';
  shipping?: ShippingRequest;
};

type CartItem = {
  id: number;
  tenant_id: number;
  customer_id: number;
  business_unit_id?: number;
  product_id: number;
  product_variant_id: number;
  qty: number;
  unit_price: number;
  subtotal: number;
  product_name?: string;
  variant_name?: string;
  media_url?: string;
  stock: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type CatalogMedia = {
  id: number;
  url: string;
  type?: string;
  metadata?: Record<string, unknown>;
};

type CatalogVariant = {
  id: number;
  sku: string;
  name: string;
  attributes?: Record<string, unknown>;
  prices?: Array<{ level_id: number; price: number }>;
  stock: number;
};

type CatalogBranding = {
  logo_url?: string;
  banner_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  store_tagline?: string;
  layout?: string;
  tenant_name?: string;
  domain?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
};

type CatalogProduct = {
  id: number;
  sku: string;
  name: string;
  description: string;
  base_unit: string;
  attributes?: Record<string, unknown>;
  media?: CatalogMedia[];
  variants: CatalogVariant[];
  branding?: CatalogBranding;
};

type CatalogListResponse = {
  items: CatalogProduct[];
  branding?: CatalogBranding;
};

type OrderStatusResponse = {
  id: number;
  status: string;
  processed_at?: Rfc3339String;
  shipped_at?: Rfc3339String;
  completed_at?: Rfc3339String;
};

// Responses
type OrderListResponse = APIResponse<MarketplaceOrder[]>;
type OrderDetailResponse = MarketplaceOrder;
type OrderMutationResponse = APIResponse<MarketplaceOrder>;
type CatalogListAPIResponse = APIResponse<CatalogListResponse>;
type CatalogProductResponse = APIResponse<CatalogProduct>;
type PublicOrderStatusResponse = APIResponse<OrderStatusResponse>;
```

> Perhatikan bahwa handler `Create` dan `Detail` saat ini tidak membungkus hasil dengan `APIResponse`. FE harus menangani response objek langsung; konsistenkan di versi API selanjutnya bila dibutuhkan.

## Paginasi (Cursor)

- `GET /marketplace/orders` dan katalog publik menggunakan cursor numerik (`id`) dengan `limit` default 10.
- Gunakan `meta.pagination.next_cursor` (bila tersedia) sebagai query `cursor` berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload/order invalid (`business_unit_id` wajib untuk BUMDes, payload shipping, status tidak dikenal, domain/kustomer ID invalid).
- 401/403: tenant vendor, tenant tanpa fitur marketplace, atau akses unit ditolak (`authorization`).
- 404: order tidak ditemukan (`order not found`), katalog produk tidak tersedia.
- 500: kegagalan internal (sinkron stok, repo) — tampilkan pesan umum dan sarankan pengguna mencoba ulang.

## Checklist Integrasi FE

- Validasi `business_unit_id` sebelum submit untuk tenant multi-unit.
- Pastikan perhitungan total di UI selaras dengan `items[].subtotal` untuk menghindari perbedaan saat konfirmasi pembayaran.
- Setelah perubahan status/pengiriman, refresh daftar order agar timeline sinkron.
- Katalog publik harus menyertakan query `domain` saat memanggil API dari storefront.
- Simpan reference pembayaran & proof untuk audit; tampilkan status `payment_status` pada UI.

## Tautan Teknis (Opsional)

- `internal/modules/core/marketplace/handler.go` — endpoint order & katalog.
- `internal/modules/core/marketplace/service.go` — logika order, pembayaran, shipping.
- `internal/modules/core/marketplace/dto.go` — struktur payload & katalog publik.
