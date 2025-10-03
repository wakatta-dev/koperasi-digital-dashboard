# POS API — Panduan Integrasi Frontend (Singkat)

Modul POS memungkinkan pencatatan transaksi kasir, pencarian produk, manajemen pembayaran, pembatalan, serta pengelolaan shift kasir. Semua response menggunakan `APIResponse<T>` dengan paginasi cursor untuk daftar penjualan.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan (tenant BUMDes menyertakan `business_unit_id` pada payload/query sesuai kebutuhan)

## Ringkasan Endpoint

Prefix utama `/api/pos` dengan guard yang memblokir tenant vendor.

- POST `/api/pos/sales` — `cashier`: buat transaksi POS → 201 `APIResponse<POSale>`
- GET `/api/pos/sales?status=&cashier_id=&shift_code=&shift_id=&start_date=&end_date=&limit=&cursor=` — `cashier manager`: daftar transaksi → 200 `APIResponse<POSale[]>`
- GET `/api/pos/sales/:id` — `cashier`: detail transaksi → 200 `APIResponse<POSale>`
- POST `/api/pos/sales/:id/payments` — `cashier`: tambah pembayaran → 201 `APIResponse<POSPayment>`
- POST `/api/pos/sales/:id/cancel` — `cashier manager`: batalkan transaksi → 200 `APIResponse<POSale>`
- GET `/api/pos/products?q=&limit=&business_unit_id=` — `cashier`: pencarian cepat produk → 200 `APIResponse<ProductSearchResponse>`
- POST `/api/pos/shifts` — `cashier`: buka shift kasir → 201 `APIResponse<POSShift>`
- POST `/api/pos/shifts/:id/close` — `cashier`: tutup shift kasir → 200 `APIResponse<POSShift>`

> Tenant BUMDes wajib menyertakan `business_unit_id` saat mencatat penjualan/pencarian stok bila multi-unit. Guard peran di service memastikan hanya kasir/administrator yang dapat mengakses aksi tertentu.

## Skema Data Ringkas

- POSale: `id:number`, `sale_date:Rfc3339`, `customer_id?:number`, `business_unit_id?:number`, `cashier_id?:number`, `shift_id?:number`, `shift_code?:string`, `total_amount:number`, `payment_method:string`, `status:'draft'|'paid'|'cancelled'`, `items:POSaleItem[]`, `payments:POSPayment[]`, `shift?:POSShift`, audit metadata
- POSaleItem: `id:number`, `sale_id:number`, `product_id:number` (variant), `qty:number`, `unit_price:number`, `discount:number`, `subtotal:number`
- POSPayment: `id:number`, `sale_id:number`, `amount:number`, `method:string`, `reference?:string`
- POSShift: `id:number`, `business_unit_id?:number`, `cashier_id:number`, `shift_code:string`, `opened_at:Rfc3339`, `closed_at?:Rfc3339`
- ProductSearchResponse: `{ items: ProductSearchResult[] }`
- ProductSearchResult: `variant_id:number`, `product_id:number`, `name:string`, `sku:string`, `stock_qty:number`, `unit_price?:number`

> Status penjualan mengikuti logika service (`draft/pending` saat dibuat, `paid` setelah lunas, `cancelled` bila dibatalkan). `payment_method` pada entitas sale merepresentasikan metode utama (dari payment pertama) dan bisa berbeda jika ada multi-payment.

## Payload Utama

- CreateSaleRequest:
  - `sale_date` (RFC3339), `customer_id?`, `business_unit_id?`, `cashier_id?`, `shift_id?`, `shift_code?`, `discount` (number ≥0), `items` (`{ product_id, qty, unit_price, discount }[]`), `payments` (`{ amount, method, reference? }[]`), `receipt?` (`{ print?: boolean, email?: string, whatsapp?: string }`)
  - Jika `cashier_id` kosong, backend mengisi dengan user aktif.

- AddPaymentRequest:
  - `{ amount: number, method: string, reference?: string }`

- OpenShiftRequest:
  - `{ business_unit_id?: number, cashier_id?: number, shift_code: string }`

- CloseShiftRequest:
  - `{ closed_at?: Rfc3339 }`

- Pencarian produk menerima query `q`, `limit`, dan `business_unit_id` (opsional) untuk memfilter stok pada unit tertentu.

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dengan `meta.pagination` tersedia pada daftar penjualan.
- Penambahan pembayaran mengembalikan pembayaran baru (`POSPayment`) agar UI dapat menambahkannya ke daftar secara real-time.

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

type SaleItemRequest = {
  product_id: number;
  qty: number;
  unit_price: number;
  discount: number;
};

type PaymentRequest = {
  amount: number;
  method: string;
  reference?: string;
};

type ReceiptRequest = {
  print?: boolean;
  email?: string;
  whatsapp?: string;
};

type CreateSaleRequest = {
  sale_date: Rfc3339String;
  customer_id?: number;
  business_unit_id?: number;
  cashier_id?: number;
  shift_id?: number;
  shift_code?: string;
  discount: number;
  items: SaleItemRequest[];
  payments: PaymentRequest[];
  receipt?: ReceiptRequest;
};

type AddPaymentRequest = PaymentRequest;

type POSaleItem = {
  id: number;
  sale_id: number;
  product_id: number;
  qty: number;
  unit_price: number;
  discount: number;
  subtotal: number;
};

type POSPayment = {
  id: number;
  sale_id: number;
  amount: number;
  method: string;
  reference?: string;
};

type POSShift = {
  id: number;
  business_unit_id?: number;
  cashier_id: number;
  shift_code: string;
  opened_at: Rfc3339String;
  closed_at?: Rfc3339String;
};

type POSale = {
  id: number;
  tenant_id: number;
  sale_date: Rfc3339String;
  customer_id?: number;
  business_unit_id?: number;
  cashier_id?: number;
  shift_id?: number;
  shift_code?: string;
  total_amount: number;
  payment_method: string;
  status: string;
  items: POSaleItem[];
  payments: POSPayment[];
  shift?: POSShift;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type ListSalesFilter = {
  status?: string;
  cashier_id?: number;
  shift_code?: string;
  shift_id?: number;
  start_date?: Rfc3339String;
  end_date?: Rfc3339String;
  limit?: number;
  cursor?: string;
};

type ProductSearchResult = {
  variant_id: number;
  product_id: number;
  name: string;
  sku: string;
  stock_qty: number;
  unit_price?: number;
};

type ProductSearchResponse = {
  items: ProductSearchResult[];
};

// Responses
type POSaleListResponse = APIResponse<POSale[]>;
type POSaleDetailResponse = APIResponse<POSale>;
type POSaleMutationResponse = APIResponse<POSale>;
type POSPaymentResponse = APIResponse<POSPayment>;
type POSShiftResponse = APIResponse<POSShift>;
type ProductSearchAPIResponse = APIResponse<ProductSearchResponse>;
```

> FE dapat menggunakan reuse type `PaymentRequest` baik saat create sale maupun menambah pembayaran tambahan untuk menjaga konsistensi form.

## Paginasi (Cursor)

- `GET /pos/sales` menggunakan cursor numerik (`id`) dengan `limit` default 10.
- `meta.pagination.next_cursor` tersedia ketika masih ada data; kirim kembali sebagai query `cursor` pada request berikut.

## Error Singkat yang Perlu Ditangani

- 400: payload atau query tidak valid (`start_date` bukan RFC3339, `limit` negatif, `items` kosong, dsb).
- 401/403: tenant vendor, pengguna tidak di-set, atau akses unit kasir tidak diizinkan (`authorization`).
- 404: sale tidak ditemukan saat detail/cancel.
- 500: kegagalan internal (sinkron stok, repo) — tampilkan notifikasi umum dan minta pengguna ulang.

## Checklist Integrasi FE

- Otomatis isi `cashier_id` dengan user aktif; tetap sediakan opsi manual bila supervisor mencatat untuk kasir lain.
- Pastikan penjumlahan `items` + `discount` = total saat menampilkan ringkasan sebelum submit.
- Validasi waktu shift (`shift_code`) unik per hari untuk memudahkan pencarian laporan.
- Gunakan endpoint pencarian produk untuk memilih varian & stok terkini pada kasir.
- Setelah menutup shift, arahkan kasir ke laporan ringkas/mengunci aksi penjualan baru.

## Tautan Teknis (Opsional)

- `internal/modules/core/pos/handler.go` — implementasi endpoint POS.
- `internal/modules/core/pos/service.go` — logika bisnis penjualan, pembayaran, dan shift.
- `internal/modules/core/pos/dto.go` — struktur request/respons quick search.
