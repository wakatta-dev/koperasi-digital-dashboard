# Modul Sharia Financing

Modul Sharia Financing setara alur pinjaman namun sesuai akad syariah: pengajuan, persetujuan, pencairan, pembayaran angsuran, dan surat lunas.

Referensi implementasi utama terdapat pada:
- `internal/modules/sharia/entity.go`
- `internal/modules/sharia/repository.go`
- `internal/modules/sharia/service.go`
- `internal/modules/sharia/handler.go`
- `internal/modules/sharia/routes.go`

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID`.

- `POST /coop/sharia-financings/apply` — ajukan pembiayaan.
- `POST /coop/sharia-financings/{id}/approve` — setujui pembiayaan.
- `POST /coop/sharia-financings/{id}/disburse` — cairkan pembiayaan.
- `GET /coop/sharia-financings/{id}/installments` — daftar angsuran.
- `POST /coop/sharia-financings/installments/{id}/pay` — bayar angsuran.
- `GET /coop/sharia-financings/{id}/release-letter` — surat lunas.

## Rincian Endpoint

- `POST /coop/sharia-financings/apply` — Body ApplyRequest → 201 `data` ShariaFinancing
- `POST /coop/sharia-financings/{id}/approve` → 200 `data` ShariaFinancing
- `POST /coop/sharia-financings/{id}/disburse` — Body `{ "method": "..." }` → 204
- `GET /coop/sharia-financings/{id}/installments` → 200 `data` array ShariaInstallment
- `POST /coop/sharia-financings/installments/{id}/pay` — Body PaymentRequest → 200 `data` ShariaInstallment
- `GET /coop/sharia-financings/{id}/release-letter` → 200 `{ "message": "..." }`

## Contoh Payload & Response

- Apply
```json
POST /coop/sharia-financings/apply
{
  "member_id": 12,
  "application": { "amount": 10000000, "tenor": 12, "rate": 10.5, "purpose": "Modal kerja" }
}
```

- Approve
```http
POST /coop/sharia-financings/9/approve
```

- Disburse
```json
POST /coop/sharia-financings/9/disburse
{ "method": "transfer" }
```

- Pay Installment
```json
POST /coop/sharia-financings/installments/81/pay
{ "amount": 900000, "date": "2025-09-30T00:00:00Z", "method": "transfer" }
```

## Tautan Cepat

- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Billing: [billing.md](billing.md)
- Membership: [membership.md](membership.md)
