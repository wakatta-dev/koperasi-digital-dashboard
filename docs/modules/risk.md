# Modul Risk

Modul Risk menyediakan mesin penilaian risiko anggota dan konfigurasi aturan risiko per tenant.

Referensi implementasi utama terdapat pada:
- `internal/modules/risk/entity.go`
- `internal/modules/risk/repository.go`
- `internal/modules/risk/service.go`
- `internal/modules/risk/handler.go`
- `internal/modules/risk/routes.go`

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID`.

- `POST /coop/risk/score` — hitung skor risiko anggota.
- `GET /coop/risk/result/{member_id}` — ambil hasil skor terbaru.
- `GET /coop/risk/config` — daftar aturan risiko.
- `POST /coop/risk/config` — simpan aturan risiko baru.
- `DELETE /coop/risk/config/{id}` — hapus aturan risiko.

## Rincian Endpoint

- `POST /coop/risk/score` — Body ScoreRequest → 200 `data` RiskResult
- `GET /coop/risk/result/{member_id}` → 200 `data` RiskResult (404 bila tidak ada)
- `GET /coop/risk/config` → 200 `data` array RiskRule
- `POST /coop/risk/config` — Body RuleRequest → 201 `data` RiskRule
- `DELETE /coop/risk/config/{id}` → 200 sukses

## Contoh Payload & Response

- Hitung Skor Risiko
```json
POST /coop/risk/score
{
  "member_id": 12
}
```
Contoh response:
```json
{
  "score": 72.5,
  "level": "MEDIUM",
  "factors": [
    {"name": "repayment_history", "weight": 0.4, "value": 0.8},
    {"name": "savings_balance", "weight": 0.3, "value": 0.6}
  ],
  "created_at": "2025-09-01T10:00:00Z"
}
```

- Tambah Aturan Risiko
```json
POST /coop/risk/config
{
  "factor": "repayment_history",
  "weight": 0.4,
  "threshold": 0.7
}
```
Contoh response:
```json
{
  "id": 3,
  "tenant_id": 1,
  "factor": "repayment_history",
  "weight": 0.4,
  "threshold": 0.7
}
```

## Tautan Cepat

- Loan: [loan.md](loan.md)
- Membership: [membership.md](membership.md)
