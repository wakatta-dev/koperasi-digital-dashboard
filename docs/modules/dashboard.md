# Modul Dashboard

Modul Dashboard menyediakan ringkasan metrik operasional (savings/loans trend, notifikasi, dsb.) untuk tenant, dan ringkasan level vendor.

## Fungsi Modul

Modul dashboard berfungsi untuk:

- Menampilkan ringkasan metrik utama seperti jumlah anggota aktif, total simpanan, dan total pinjaman.
- Menyajikan tren simpanan dan pinjaman dalam rentang waktu tertentu.
- Mengumpulkan notifikasi terbaru terkait aktivitas tenant.
- Menyediakan analitik agregat bagi admin vendor mengenai penggunaan aplikasi oleh tenant.

## Daftar Endpoint

| Method | Endpoint | Deskripsi |
| ------ | -------- | --------- |
| `GET` | `/dashboard/summary` | Ringkasan metrik utama per tenant. |
| `GET` | `/dashboard/trend` | Tren simpanan dan pinjaman pada periode tertentu. |
| `GET` | `/dashboard/notifications` | Daftar notifikasi terbaru tenant. |
| `GET` | `/dashboard` | Ringkasan global dashboard untuk admin vendor. |
| `GET` | `/analytics/clients` | Statistik klien vendor: paket, status, dan pertumbuhan bulanan. |

Referensi implementasi utama terdapat pada:
- `internal/modules/dashboard/entity.go`
- `internal/modules/dashboard/repository.go`
- `internal/modules/dashboard/service.go`
- `internal/modules/dashboard/handler.go`
- `internal/modules/dashboard/routes.go`
- `internal/modules/dashboard/vendor_*`

## Ringkasan Peran per Tenant

- Vendor: akses `GET /dashboard` untuk ringkasan global (khusus admin vendor).
- Koperasi/UMKM/BUMDes: akses ringkasan dan tren modul koperasi.

## Arsitektur & Komponen

- Repository & Service: menghimpun data dari modul terkait (savings, loans, notifications).
- Handler: endpoint dashboard tenant dan vendor.

## Endpoint API

Semua endpoint menggunakan response standar `APIResponse`.

- Tenant
  - `GET /dashboard/summary?tenant_id={id}` — ringkasan metrik.
  - `GET /dashboard/trend?tenant_id={id}&start={RFC3339?}&end={RFC3339?}` — tren simpanan/pinjaman.
  - `GET /dashboard/notifications?tenant_id={id}&limit={n}&cursor={c?}` — daftar notifikasi terkini.

- Vendor
  - `GET /dashboard` — ringkasan untuk admin vendor (perlu `Bearer` + `X-Tenant-ID` dari tenant vendor dengan role admin/super admin).
  - `GET /analytics/clients` — statistik klien per paket/status dan pertumbuhan bulanan.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>` (khusus vendor), endpoint tenant dapat mengikuti kebijakan gateway aplikasi.
- `X-Tenant-ID`: ID tenant (khusus vendor: tenant vendor).

- `GET /dashboard/summary`
  - Query: `tenant_id` (wajib, int)
  - Response 200: `data` DashboardSummary

- `GET /dashboard/trend`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, RFC3339)
    - `end` (opsional, RFC3339)
  - Response 200: `data` array TrendData

- `GET /dashboard/notifications`
  - Query: `tenant_id` (wajib, int), `limit` (wajib, int), `cursor` (opsional, string)
  - Response 200: `data` array Notification + `meta.pagination`

- `GET /dashboard`
  - Response 200: `data` VendorDashboard

## Keamanan

- Endpoint `dashboard/*` mengikuti pola umum autentikasi (Bearer + X-Tenant-ID jika disyaratkan di gateway aplikasi).
- Endpoint vendor mewajibkan role admin vendor (`schema.RoleAdminVendor` atau `schema.RoleSuperAdminVendor`).

## Vendor Analytics & Usage

Modul Analytics menyediakan statistik klien untuk vendor, mencakup distribusi paket, status aktif, dan pertumbuhan bulanan.

### Referensi Implementasi

- `internal/modules/dashboard/analytics/entity.go`
- `internal/modules/dashboard/analytics/repository.go`
- `internal/modules/dashboard/analytics/service.go`
- `internal/modules/dashboard/analytics/vendor_handler.go`
- `internal/modules/dashboard/analytics/routes.go`

### Ringkasan Peran per Tenant (Analytics)

- **Vendor**: melihat analitik agregat klien.
- **Koperasi/UMKM/BUMDes**: tidak ada endpoint langsung.

### Entitas & Skema Data

- **PackageStat**: `package`, `total`
- **StatusCount**: `active`, `inactive`
- **MonthlyGrowth**: `period`, `total`
- **ClientAnalytics**: `packages` (array PackageStat), `status` (StatusCount), `growth` (array MonthlyGrowth)

### Endpoint API (Analytics)

Semua endpoint dilindungi `Bearer` token dan `X-Tenant-ID`.

#### `GET /analytics/clients`

- Query:
  - `start` (opsional, format `YYYY-MM-DD`)
  - `end` (opsional, format `YYYY-MM-DD`)
- Response 200: `data` `ClientAnalytics` (packages, status, growth)
- Error 403: role bukan vendor
- Error 500: kegagalan server/internal

### Contoh Request & Response

```http
GET /analytics/clients?start=2025-01-01&end=2025-03-31
```

Contoh response:

```json
{
  "packages": [
    {"package": "basic", "total": 10},
    {"package": "premium", "total": 5}
  ],
  "status": {"active": 12, "inactive": 3},
  "growth": [
    {"period": "2025-01", "total": 2},
    {"period": "2025-02", "total": 3}
  ]
}
```

## Tautan Cepat

- Reporting: [reporting.md](reporting.md)
- Vendor Analytics & Usage: [#vendor-analytics--usage](#vendor-analytics--usage)
- Notifications: [notification.md](notification.md)
- Savings: [savings.md](savings.md)
- Loan: [loan.md](loan.md)

## Contoh Response

- Summary
```json
GET /dashboard/summary?tenant_id=1
{
  "active_members": 120,
  "total_savings": 54000000,
  "total_loans": 32000000,
  "running_shu": 2500000
}
```

- Trend
```json
GET /dashboard/trend?tenant_id=1&start=2025-08-01T00:00:00Z&end=2025-08-31T23:59:59Z
[
  {"date": "2025-08-01T00:00:00Z", "savings": 1000000, "loans": 500000},
  {"date": "2025-08-02T00:00:00Z", "savings": 900000,  "loans": 700000}
]
```

- Notifications
```json
GET /dashboard/notifications?tenant_id=1&limit=10
{
  "data": [
    {"id": "...", "tenant_id": 1, "type": "SYSTEM", "message": "RAT dijadwalkan", "status": "PUBLISHED", "created_at": "2025-08-25T10:00:00Z"}
  ],
  "meta": {
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null
    }
  }
}
```
