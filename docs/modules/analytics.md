# Modul Analytics

Modul Analytics menyediakan statistik klien untuk vendor, mencakup distribusi paket, status aktif, dan pertumbuhan bulanan.

Referensi implementasi utama:
- `internal/modules/analytics/entity.go`
- `internal/modules/analytics/repository.go`
- `internal/modules/analytics/service.go`
- `internal/modules/analytics/vendor_handler.go`
- `internal/modules/analytics/vendor_routes.go`

## Ringkasan Peran per Tenant

- **Vendor**: melihat analitik agregat klien.
- **Koperasi/UMKM/BUMDes**: tidak ada endpoint langsung.

## Entitas & Skema Data

- **PackageStat**: `package`, `total`
- **StatusCount**: `active`, `inactive`
- **MonthlyGrowth**: `period`, `total`
- **ClientAnalytics**: `packages` (array PackageStat), `status` (StatusCount), `growth` (array MonthlyGrowth)

## Endpoint API

Semua endpoint dilindungi `Bearer` token dan `X-Tenant-ID`.

- `GET /api/vendor/analytics/clients?start={YYYY-MM-DD}&end={YYYY-MM-DD}` — statistik klien per paket/status dan pertumbuhan bulanan.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant vendor

- `GET /api/vendor/analytics/clients`
  - Query:
    - `start` (opsional, format `YYYY-MM-DD`)
    - `end` (opsional, format `YYYY-MM-DD`)
  - Response 200: `data` `ClientAnalytics` (packages, status, growth)
  - Error 403: role bukan vendor
  - Error 500: kegagalan server/internal

## Contoh Request & Response

- Client Analytics
```http
GET /api/vendor/analytics/clients?start=2025-01-01&end=2025-03-31
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

- Dashboard: [dashboard.md](dashboard.md)
