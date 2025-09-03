# Modul Dashboard

Modul Dashboard menyediakan ringkasan metrik operasional (savings/loans trend, notifikasi, dsb.) untuk tenant, dan ringkasan level vendor.

Referensi implementasi utama terdapat pada:
- `internal/modules/dashboard/entity.go`
- `internal/modules/dashboard/repository.go`
- `internal/modules/dashboard/service.go`
- `internal/modules/dashboard/handler.go`
- `internal/modules/dashboard/routes.go`
- `internal/modules/dashboard/vendor_*`

## Ringkasan Peran per Tenant

- Vendor: akses `GET /api/vendor/dashboard` untuk ringkasan global (khusus admin vendor).
- Koperasi/UMKM/BUMDes: akses ringkasan dan tren modul koperasi.

## Arsitektur & Komponen

- Repository & Service: menghimpun data dari modul terkait (savings, loans, notifications).
- Handler: endpoint dashboard tenant dan vendor.

## Endpoint API

Semua endpoint menggunakan response standar `APIResponse`.

- Tenant
  - `GET /coop/dashboard/summary?tenant_id={id}` — ringkasan metrik.
  - `GET /coop/dashboard/trend?tenant_id={id}&start={RFC3339?}&end={RFC3339?}` — tren simpanan/pinjaman.
  - `GET /coop/dashboard/notifications?tenant_id={id}` — daftar notifikasi terkini.

- Vendor
- `GET /api/vendor/dashboard` — ringkasan untuk admin vendor (perlu `Bearer` + `X-Tenant-ID` dari tenant vendor dengan role admin/super admin).

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>` (khusus vendor), endpoint tenant dapat mengikuti kebijakan gateway aplikasi.
- `X-Tenant-ID`: ID tenant (khusus vendor: tenant vendor).

- `GET /coop/dashboard/summary`
  - Query: `tenant_id` (wajib, int)
  - Response 200: `data` DashboardSummary

- `GET /coop/dashboard/trend`
  - Query:
    - `tenant_id` (wajib, int)
    - `start` (opsional, RFC3339)
    - `end` (opsional, RFC3339)
  - Response 200: `data` array TrendData

- `GET /coop/dashboard/notifications`
  - Query: `tenant_id` (wajib, int)
  - Response 200: `data` array Notification

- `GET /api/vendor/dashboard`
  - Response 200: `data` VendorDashboard

## Keamanan

- Endpoint `coop/dashboard/*` mengikuti pola umum autentikasi (Bearer + X-Tenant-ID jika disyaratkan di gateway aplikasi).
- Endpoint vendor mewajibkan role admin vendor (`schema.RoleAdminVendor` atau `schema.RoleSuperAdminVendor`).

## Tautan Cepat

- Reporting: [reporting.md](reporting.md)
- Analytics: [analytics.md](analytics.md)
- Notifications: [notification.md](notification.md)
- Savings: [savings.md](savings.md)
- Loan: [loan.md](loan.md)

## Contoh Response

- Summary
```json
GET /coop/dashboard/summary?tenant_id=1
{
  "active_members": 120,
  "total_savings": 54000000,
  "total_loans": 32000000,
  "running_shu": 2500000
}
```

- Trend
```json
GET /coop/dashboard/trend?tenant_id=1&start=2025-08-01T00:00:00Z&end=2025-08-31T23:59:59Z
[
  {"date": "2025-08-01T00:00:00Z", "savings": 1000000, "loans": 500000},
  {"date": "2025-08-02T00:00:00Z", "savings": 900000,  "loans": 700000}
]
```

- Notifications
```json
GET /coop/dashboard/notifications?tenant_id=1
[
  {"id": "...", "tenant_id": 1, "type": "SYSTEM", "message": "RAT dijadwalkan", "status": "PUBLISHED", "created_at": "2025-08-25T10:00:00Z"}
]
```
