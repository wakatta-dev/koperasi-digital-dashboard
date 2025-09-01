# Test Case — Dashboard Koperasi

Catatan rujukan: `docs/modules/dashboard.md`, `internal/modules/dashboard/routes.go`

## KOP-DASH-001 — Summary sukses
- Langkah: GET `/coop/dashboard/summary?tenant_id=<tenant_koperasi_id>` dengan token admin koperasi.
- Hasil: 200 `data` DashboardSummary (aktif anggota, total simpanan, total pinjaman, running_shu).

## KOP-DASH-002 — Trend sukses dengan periode
- Langkah: GET `/coop/dashboard/trend?tenant_id=<id>&start=2025-08-01T00:00:00Z&end=2025-08-31T23:59:59Z`.
- Hasil: 200 `data[]` TrendData.

## KOP-DASH-003 — Notifications terbaru
- Langkah: GET `/coop/dashboard/notifications?tenant_id=<id>`.
- Hasil: 200 `data[]` notifikasi terbaru.

## KOP-DASH-004 — Validasi query invalid
- Hilang `tenant_id` atau format waktu salah → 400.

## KOP-DASH-005 — Rentang waktu tidak logis
- `start > end` → 400.
