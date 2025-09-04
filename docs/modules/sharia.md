# Modul Sharia Financing

Modul Sharia Financing setara alur pinjaman namun mengikuti akad syariah: pengajuan, persetujuan, pencairan, pembayaran angsuran, dan surat lunas.

Referensi implementasi utama terdapat pada:
- `internal/modules/sharia/entity.go`
- `internal/modules/sharia/repository.go`
- `internal/modules/sharia/service.go`
- `internal/modules/sharia/handler.go`
- `internal/modules/sharia/routes.go`

## Endpoint API

Semua endpoint membutuhkan autentikasi `Bearer` dan konteks tenant melalui header `X-Tenant-ID`.

- `POST /sharia-financings/apply` — ajukan pembiayaan syariah.
- `POST /sharia-financings/{id}/approve` — setujui pembiayaan.
- `POST /sharia-financings/{id}/disburse` — cairkan pembiayaan.
- `GET /sharia-financings/{id}/installments?limit={n}&cursor={c?}` — daftar angsuran.
- `POST /sharia-financings/installments/{id}/pay` — bayar angsuran.
- `GET /sharia-financings/{id}/release-letter` — surat lunas.

## Rincian Endpoint

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant

### `POST /sharia-financings/apply`
Body `ApplyRequest`:
- `member_id` (uint, wajib)
- `akad_type` (string, wajib) — jenis akad, misal *murabahah*
- `amount` (float64, wajib) — nilai pokok
- `margin` (float64, wajib) — margin keuntungan
- `tenor` (int, wajib) — jumlah bulan angsuran

Response 201: objek `ShariaFinancing` berstatus `pending`.

### `POST /sharia-financings/{id}/approve`
Path:
- `id` (int, wajib) — ID pembiayaan

Response 200: objek `ShariaFinancing` berstatus `approved`.

### `POST /sharia-financings/{id}/disburse`
Path:
- `id` (int, wajib) — ID pembiayaan
Body:
- `{ "method": "transfer|cash|..." }`

Response 204: tanpa body (pembiayaan tercatat cair).

### `GET /sharia-financings/{id}/installments`
Path:
- `id` (int, wajib) — ID pembiayaan

Query:
- `limit` (wajib, int), `cursor` (opsional, string)

Response 200: `data` array `ShariaInstallment` + `meta.pagination`.

### `POST /sharia-financings/installments/{id}/pay`
Path:
- `id` (int, wajib) — ID angsuran
Body `PaymentRequest`:
- `amount` (float64, wajib)
- `date` (RFC3339, wajib)
- `method` (string, wajib)

Response 200: `ShariaInstallment` terbaru (status dapat `paid`).

### `GET /sharia-financings/{id}/release-letter`
Path:
- `id` (int, wajib) — ID pembiayaan

Response 200: `{ "message": "Financing {id} settled" }` bila seluruh angsuran lunas.

## Contoh Payload

- Apply
```json
POST /sharia-financings/apply
{
  "member_id": 12,
  "akad_type": "murabahah",
  "amount": 10000000,
  "margin": 10.5,
  "tenor": 12
}
```

- Disburse
```json
POST /sharia-financings/9/disburse
{ "method": "transfer" }
```

- Pay Installment
```json
POST /sharia-financings/installments/81/pay
{ "amount": 900000, "date": "2025-09-30T00:00:00Z", "method": "transfer" }
```

- List Installments (paginasi)
```json
GET /sharia-financings/1/installments?limit=2
{
  "data": [
    {"id": 1, "amount": 900000}
  ],
  "meta": {
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null
    }
  }
}
```

## Tautan Cepat

- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Billing: [billing.md](billing.md)
- Membership: [membership.md](membership.md)
