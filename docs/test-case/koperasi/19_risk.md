# Test Case — Risk (Koperasi)

Catatan rujukan: `docs/modules/risk.md`, `internal/modules/risk/*`

## Skor Risiko & Konfigurasi

### KOP-RISK-001 — Hitung skor risiko anggota
- POST `/coop/risk/score` body `{ "member_id": <id> }` → 200 `data` RiskResult (`score`, `level`, `factors[]`).

### KOP-RISK-002 — Ambil hasil skor terbaru anggota
- GET `/coop/risk/result/{member_id}` → 200 `data` RiskResult (atau 404 jika belum tersedia).

### KOP-RISK-003 — List aturan risiko
- GET `/coop/risk/config` → 200 `data[]` RiskRule.

### KOP-RISK-004 — Tambah aturan risiko
- POST `/coop/risk/config` body `{ "factor": "repayment_history", "weight": 0.4, "threshold": 0.7 }` → 201 `data` RiskRule.

### KOP-RISK-005 — Hapus aturan risiko
- DELETE `/coop/risk/config/{id}` → 200.

## Negative & Validasi

### KOP-RISK-020 — Score request invalid
- `member_id` kosong/invalid → 400.

### KOP-RISK-021 — Rule invalid
- `factor` kosong atau `weight` di luar 0..1 → 400.

### KOP-RISK-022 — Akses tanpa header/cross-tenant
- 401/403/404 sesuai middleware/isolasi.

