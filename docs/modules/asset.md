# Modul Asset

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Asset. Modul ini mengelola daftar aset, depresiasi, status, dan ekspor data aset per tenant.

Referensi implementasi utama terdapat pada:
- `internal/modules/asset/entity.go`
- `internal/modules/asset/dto.go`
- `internal/modules/asset/repository.go`
- `internal/modules/asset/service.go`
- `internal/modules/asset/handler.go`
- `internal/modules/asset/routes.go`

## Ringkasan Peran per Tenant

- Vendor: pemantauan agregat (opsional).
- Koperasi/UMKM/BUMDes: input aset, update data, pantau depresiasi, nonaktifkan aset, ekspor.

## Arsitektur & Komponen

- Repository: CRUD aset dan pembacaan riwayat depresiasi.
- Service: validasi bisnis, perhitungan depresiasi (level service), perubahan status.
- Handler (HTTP): endpoint CRUD, depresiasi, update status, ekspor.

## Entitas & Skema Data

- Asset
  - `id`, `tenant_id`, `code`, `name`, `category`, `acquisition_date`, `acquisition_cost`, `depreciation_method`, `useful_life_months`, `location`, `status`, `created_at`
- AssetDepreciation
  - `id`, `asset_id`, `period` (timestamp), `depreciation_amount`, `accumulated_depreciation`, `book_value`, `created_at`

Catatan: struktur di atas mengikuti tag dan nama field pada `entity.go`/`dto.go`.

## Alur Bisnis Utama

1) Pencatatan dan pembaruan aset (detail akuisisi, umur manfaat, metode depresiasi, lokasi).
2) Melihat riwayat depresiasi per aset.
3) Menonaktifkan/mengaktifkan aset (status control).
4) Ekspor daftar aset (placeholder integrasi report di handler).

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID` dan menggunakan JSON standar.

- `POST /coop/assets` — tambah aset.
- `PUT /coop/assets/{id}` — perbarui aset.
- `DELETE /coop/assets/{id}` — hapus aset.
- `GET /coop/assets` — daftar aset.
- `GET /coop/assets/{id}/depreciation` — riwayat depresiasi aset.
- `PATCH /coop/assets/{id}/status` — ubah status aset.
- `GET /coop/assets/export` — ekspor aset (placeholder).

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant

- `POST /coop/assets`
  - Body AssetRequest:
    - `code`, `name`, `category`
    - `acquisition_date` (RFC3339), `acquisition_cost`
    - `depreciation_method` (mis. `straight_line`), `useful_life_months` (int)
    - `location` (opsional)
  - Response 201: `data` Asset

- `PUT /coop/assets/{id}`
  - Path: `id` (int)
  - Body AssetRequest (field lengkap)
  - Response 200: `data` Asset

- `DELETE /coop/assets/{id}`
  - Path: `id` (int)
  - Response 204: tanpa body

- `GET /coop/assets`
  - Response 200: `data` array Asset

- `GET /coop/assets/{id}/depreciation`
  - Path: `id` (int)
  - Response 200: `data` array AssetDepreciation

- `PATCH /coop/assets/{id}/status`
  - Path: `id` (int)
  - Body StatusRequest: `{ "status": "active|inactive" }`
  - Response 204: tanpa body

- `GET /coop/assets/export`
  - Response 200: placeholder `{ "message": "export not implemented" }`

## Contoh Payload & Response

- Create Asset
```json
POST /coop/assets
{
  "code": "AST-001",
  "name": "Laptop Kasir",
  "category": "Elektronik",
  "acquisition_date": "2025-08-01T00:00:00Z",
  "acquisition_cost": 12000000,
  "depreciation_method": "straight_line",
  "useful_life_months": 36,
  "location": "Toko Pusat"
}
```

- Update Status
```json
PATCH /coop/assets/5/status
{ "status": "inactive" }
```

## Tautan Cepat

- Reporting: [reporting.md](reporting.md)
- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
