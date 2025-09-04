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

### `POST /risk/score`
Hitung skor risiko anggota.

- Body: `ScoreRequest` (`member_id`)
- Response 200: `RiskResult`

Contoh request:
```json
{
  "member_id": 12
}
```

Contoh response:
```json
{
  "id": 1,
  "tenant_id": 1,
  "member_id": 12,
  "score": 85,
  "decision": "auto-approve",
  "details": "{\"loan_count\":1,\"membership_years\":2}",
  "created_at": "2025-09-01T10:00:00Z"
}
```

### `GET /risk/result/{member_id}`
Ambil hasil skor risiko terbaru.

- Path: `member_id` (uint)
- Response 200: `RiskResult` (`404` bila tidak ada)

Contoh response:
```json
{
  "id": 1,
  "tenant_id": 1,
  "member_id": 12,
  "score": 85,
  "decision": "auto-approve",
  "details": "{\"loan_count\":1,\"membership_years\":2}",
  "created_at": "2025-09-01T10:00:00Z"
}
```

### `GET /risk/config`
Daftar aturan risiko pada tenant.

- Response 200: array `RiskRule`

Contoh response:
```json
[
  {
    "id": 3,
    "tenant_id": 1,
    "factor": "loan_count",
    "weight": 10,
    "threshold": 1,
    "created_at": "2025-09-01T10:00:00Z"
  }
]
```

### `POST /risk/config`
Simpan aturan risiko baru.

- Body: `RuleRequest` (`factor`, `weight`, `threshold`)
- Response 201: `RiskRule`

Contoh request:
```json
{
  "factor": "loan_count",
  "weight": 10,
  "threshold": 1
}
```

Contoh response:
```json
{
  "id": 3,
  "tenant_id": 1,
  "factor": "loan_count",
  "weight": 10,
  "threshold": 1,
  "created_at": "2025-09-01T10:00:00Z"
}
```

### `DELETE /risk/config/{id}`
Hapus aturan risiko.

- Path: `id` (uint)
- Response 200: sukses tanpa body

## Struktur Data

- `ScoreRequest`
  - `member_id` (uint)
- `RuleRequest`
  - `factor` (string)
  - `weight` (int)
  - `threshold` (float)
- `RiskRule`
  - `id`, `tenant_id`, `factor`, `weight`, `threshold`, `created_at`
- `RiskResult`
  - `id`, `tenant_id`, `member_id`, `score`, `decision`, `details` (JSON string), `created_at`

## Tautan Cepat

- Loan: [loan.md](loan.md)
- Membership: [membership.md](membership.md)
