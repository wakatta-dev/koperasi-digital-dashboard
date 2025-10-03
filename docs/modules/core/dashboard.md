# Dashboard API — Panduan Integrasi Frontend (Singkat)

Modul dashboard menyediakan ringkasan metrik tenant (vendor, koperasi, BUMDes, UMKM) berdasarkan tipe tenant pada JWT. Response berupa salah satu summary khusus tanpa perlu payload tambahan.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan

## Ringkasan Endpoint

Semua tenant mengakses jalur dinamis `/api/:tenantType/dashboard` berdasarkan tipe mereka.

- GET `/api/:tenantType/dashboard` — `tenant user`: ringkasan metrik dashboard → 200 `APIResponse<DashboardSummary>`

> Parameter path `tenantType` harus sama dengan klaim `tenant_type` pada token (`vendor`, `koperasi`, `bumdes`, `umkm`). Backend menolak (403) bila terjadi mismatch untuk mencegah akses silang.

## Skema Data Ringkas

- DashboardSummary (vendor): `client_totals_by_tier:VendorProductTierSummary[]`, `open_tickets:number`, `most_active_client?:VendorClientInsight`, `product_with_most_tickets?:VendorProductInsight`
- VendorProductTierSummary: `tier:string`, `active_clients:number`
- VendorClientInsight: `client_id:number`, `name:string`, `ticket_count:number`
- VendorProductInsight: `product_id:number`, `name:string`, `ticket_count:number`
- DashboardSummary (koperasi): `active_members:number`, `total_savings:number`, `total_loans:number`, `running_shu:number`, `graph_data:number[]`, `shortcuts:ShortcutItem[]`, `installment_notifications:Notification[]`, `application_notifications:Notification[]`
- ShortcutItem: `id:string`, `label:string`, `path:string`, `icon?:string`
- DashboardSummary (bumdes): `revenue_per_unit:number[]`, `consolidated_revenue:number`, `booking_notifications:Notification[]`, `rental_notifications:Notification[]`
- DashboardSummary (umkm): `daily_sales:number`, `daily_orders:number`, `top_products:string[]`, `low_stock_notifications:Notification[]`
- Notification: `id:string`, `title:string`, `type:string`, `created_at:Rfc3339`

> FE perlu melakukan narrowing berdasarkan klaim `tenant_type` untuk memetakan struktur summary yang diterima dan menampilkan komponen yang sesuai. Untuk vendor, gunakan `client_totals_by_tier` untuk mengisi kartu Total Clients per produk (Standard/Bronze/Silver/Gold) dan tampilkan insight `most_active_client` & `product_with_most_tickets` bila tersedia. Backend selalu mengembalikan empat entri tier tersebut dengan jumlah klien aktif (0 jika tidak ada) hasil agregasi tenant aktif/non-suspend.

## Payload Utama

- Endpoint tidak menerima body atau query; hanya path parameter `tenantType`.

## Bentuk Response

- Response memakai `APIResponse<T>` tanpa `meta.pagination`.
- Field `data` berisi salah satu dari ringkasan di atas sesuai konteks tenant.

## TypeScript Types (Request & Response)

```ts
// Common
type Rfc3339String = string;

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type Notification = {
  id: string;
  title: string;
  type: string;
  created_at: Rfc3339String;
};

type ShortcutItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
};

type VendorDashboardSummary = {
  client_totals_by_tier: VendorProductTierSummary[];
  open_tickets: number;
  most_active_client?: VendorClientInsight;
  product_with_most_tickets?: VendorProductInsight;
};

type VendorProductTierSummary = {
  tier: string;
  active_clients: number;
};

type VendorClientInsight = {
  client_id: number;
  name: string;
  ticket_count: number;
};

type VendorProductInsight = {
  product_id: number;
  name: string;
  ticket_count: number;
};

type KoperasiDashboardSummary = {
  active_members: number;
  total_savings: number;
  total_loans: number;
  running_shu: number;
  graph_data: number[];
  shortcuts: ShortcutItem[];
  installment_notifications: Notification[];
  application_notifications: Notification[];
};

type BumdesDashboardSummary = {
  revenue_per_unit: number[];
  consolidated_revenue: number;
  booking_notifications: Notification[];
  rental_notifications: Notification[];
};

type UmkmDashboardSummary = {
  daily_sales: number;
  daily_orders: number;
  top_products: string[];
  low_stock_notifications: Notification[];
};

type DashboardSummary =
  | VendorDashboardSummary
  | KoperasiDashboardSummary
  | BumdesDashboardSummary
  | UmkmDashboardSummary;

// Responses
type DashboardResponse = APIResponse<DashboardSummary>;
```

> Gunakan union type `DashboardSummary` untuk menjaga autocompletion sekaligus memaksa branching berdasarkan tenant type di sisi FE.

## Paginasi (Cursor)

- Tidak ada paginasi; `meta.pagination` selalu `undefined`.

## Error Singkat yang Perlu Ditangani

- 403: path `tenantType` tidak sesuai dengan klaim `tenant_type` (`mismatched tenant type`).
- 500: kegagalan agregasi data dashboard.

## Checklist Integrasi FE

- Pastikan path sesuai tipe tenant yang sedang login (`/api/vendor/dashboard`, `/api/koperasi/dashboard`, dll).
- Tampilkan fallback UI ketika response `data = null` atau terjadi error agregasi.
- Lakukan formatting currency, persentase, dan jumlah sesuai locale masing-masing tenant.
- Gunakan data aktivitas/notifikasi untuk shortcut ke modul terkait (billing, ticketing, dsb).

## Tautan Teknis (Opsional)

- `internal/modules/core/dashboard/handler.go` — logika endpoint utama.
- `internal/modules/core/dashboard/service.go` — agregasi data per tenant type.
- `internal/modules/core/dashboard/entity.go` — struktur summary & activity.
