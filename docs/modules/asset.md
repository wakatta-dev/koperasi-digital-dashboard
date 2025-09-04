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

 - `POST /assets` — menambahkan aset baru beserta informasi akuisisi dan parameter depresiasi.
 - `PUT /assets/{id}` — memperbarui detail aset yang ada seperti kategori, umur manfaat, atau lokasi.
 - `DELETE /assets/{id}` — menghapus aset dari daftar tenant.
- `GET /assets?limit={n}&cursor={c?}` — mengambil daftar aset yang dimiliki tenant beserta ringkasan data.
- `GET /assets/{id}/depreciation?limit={n}&cursor={c?}` — melihat riwayat perhitungan depresiasi untuk aset tertentu.
 - `PATCH /assets/{id}/status` — mengubah status aset menjadi aktif atau nonaktif.
 - `GET /assets/export` — mengekspor daftar aset untuk diunduh (saat ini placeholder).

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant

- `POST /assets`
  - Body AssetRequest:
    - `code`, `name`, `category`
    - `acquisition_date` (RFC3339), `acquisition_cost`
    - `depreciation_method` (mis. `straight_line`), `useful_life_months` (int)
    - `location` (opsional)
  - Response 201: `data` Asset

- `PUT /assets/{id}`
  - Path: `id` (int)
  - Body AssetRequest (field lengkap)
  - Response 200: `data` Asset

- `DELETE /assets/{id}`
  - Path: `id` (int)
  - Response 204: tanpa body

- `GET /assets`
  - Query: `limit` (wajib, int), `cursor` (opsional, string)
  - Response 200: `data` array Asset + `meta.pagination`

- `GET /assets/{id}/depreciation`
  - Path: `id` (int)
  - Query: `limit` (wajib, int), `cursor` (opsional, string)
  - Response 200: `data` array AssetDepreciation + `meta.pagination`

- `PATCH /assets/{id}/status`
  - Path: `id` (int)
  - Body StatusRequest: `{ "status": "active|inactive" }`
  - Response 204: tanpa body

- `GET /assets/export`
  - Response 200: placeholder `{ "message": "export not implemented" }`

## Contoh Payload & Response

- Create Asset
```json
POST /assets
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
PATCH /assets/5/status
{ "status": "inactive" }
```

- List Assets (paginasi)
```json
GET /assets?limit=2
{
  "data": [
    {"id": 1, "name": "Laptop Kasir"}
  ],
  "meta": {
    "pagination": {
      "next_cursor": "2",
      "prev_cursor": null
    }
  }
}
```

## Tautan Cepat

- Reporting: [reporting.md](reporting.md)
- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
