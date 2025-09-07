# Dashboard API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>` (vendor endpoints)
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Accept`: `application/json`

## Ringkasan Endpoint

- GET `/dashboard/summary?tenant_id=..` — ringkasan metrik tenant → 200 `APIResponse<DashboardSummary>`
- GET `/dashboard/trend?tenant_id=..&start=..&end=..` — tren simpanan/pinjaman → 200 `APIResponse<TrendData[]>`
- GET `/dashboard/notifications?tenant_id=..&term=..&type=..&start=..&end=..&limit=..&cursor=..` — notifikasi tenant → 200 `APIResponse<Notification[]>`
- GET `/vendor/dashboard` — vendor dashboard → 200 `APIResponse<VendorDashboard>`
- GET `/analytics/clients` — vendor: analitik klien → 200 `APIResponse<ClientAnalytics>`

## Skema Data Ringkas

- DashboardSummary: `active_members`, `total_savings`, `total_loans`, `running_shu`
- TrendData: `date`, `savings`, `loans`
- Notification (ringkas): `id`, `tenant_id`, `type`, `category`, `title`, `body`, `status`, `created_at`
- VendorDashboard (ringkas): `packages[]`, `active_clients?`, `total_revenue?`, `monthly_revenue?`, `open_tickets?`, `top_tenant?`, `top_product?`, `recent_audits[]`, `recent_notifications[]`
- ClientAnalytics: `packages[]`, `status` (`active`, `inactive`), `growth[]`

## Payload Utama

- Summary: query `tenant_id` (number)
- Trend: query `tenant_id` (number), `start?` (RFC3339), `end?` (RFC3339)
- Notifications: query `tenant_id` (number), `term?` (string), `type?` (string), `start?` (RFC3339), `end?` (RFC3339), `limit?` (number, default 10), `cursor?` (string)
- Vendor analytics: query `start?` (`YYYY-MM-DD`), `end?` (`YYYY-MM-DD`)

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
export interface DashboardSummary {
  active_members: number;
  total_savings: number;
  total_loans: number;
  running_shu: number;
}

export interface TrendData { date: Rfc3339String; savings: number; loans: number }

export interface Notification {
  id: string;
  tenant_id: number;
  type: string;
  category?: string;
  title?: string;
  body?: string;
  status: string;
  created_at: Rfc3339String;
}

export interface VendorDashboard {
  packages: Array<{ package: string; total: number }>;
  active_clients?: number;
  total_revenue?: number;
  monthly_revenue?: number;
  open_tickets?: number;
  top_tenant?: { tenant_id: number; tenant: string; total: number } | null;
  top_product?: { product: string; total: number } | null;
  recent_audits: any[];
  recent_notifications: Array<{ id: string; category: string; title: string; body: string; created_at: Rfc3339String }>;
}

export interface ClientAnalytics {
  packages: Array<{ package: string; total: number }>;
  status: { active: number; inactive: number };
  growth: Array<{ period: string; total: number }>;
}

// Responses
export type GetDashboardSummaryResponse = APIResponse<DashboardSummary>;
export type GetTrendResponse = APIResponse<TrendData[]>;
export type ListDashboardNotificationsResponse = APIResponse<Notification[]>;
export type GetVendorDashboardResponse = APIResponse<VendorDashboard>;
export type GetClientAnalyticsResponse = APIResponse<ClientAnalytics>;
```

## Paginasi (Cursor)

- Endpoint list notifikasi dashboard menggunakan cursor string (`id`) dan `limit` opsional (default 10).
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: validasi `tenant_id`/query tidak valid.
- 401/403: token salah/tenant tidak aktif/role vendor tidak sesuai untuk endpoint vendor.

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID` untuk endpoint vendor.
- Cache ringkasan secara singkat; invalidasi saat ada perubahan di modul terkait.
- Terapkan pemilihan periode untuk tren dengan default wajar.

Tautan teknis (opsional): implementasi ada di `internal/modules/core/dashboard/*.go` dan `internal/modules/core/dashboard/analytics/*` bila diperlukan detail lebih lanjut.

