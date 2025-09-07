# Sharia Savings API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk integrasi UI terkait simpanan syariah. Strukturnya mengikuti modul lain.

## Header Wajib
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint
- POST `/sharia_savings/:member_id/deposit` — setoran → 201 `Transaction`
- POST `/sharia_savings/:transaction_id/verify` — verifikasi setoran manual → 200 `Transaction`
- POST `/sharia_savings/:member_id/withdraw` — ajukan penarikan → 201 `Transaction`
- POST `/sharia_savings/:transaction_id/approve` — setujui penarikan → 200 `Transaction`
- POST `/sharia_savings/:member_id/profit` — distribusi bagi hasil → 201 `Transaction`
- GET `/sharia_savings/:member_id/transactions?term=..&type=..&start=..&end=..&limit=..&cursor=..` — riwayat transaksi → 200 `APIResponse<Transaction[]>`
- GET `/sharia_savings/:transaction_id/proof` — bukti transaksi → 200 `APIResponse<string>`

## Skema Data Ringkas
- Account: `id`, `member_id`, `type`, `balance`, `created_at`, `updated_at`
- Transaction: `id`, `account_id`, `amount`, `method`, `status`, `type`, `proof_url`, `created_at`

## Payload Utama
- DepositRequest: `type`, `amount`, `method`
- WithdrawalRequest: `type`, `amount`, `method`
- ProfitShareRequest: `type`, `amount`, `method`

## Bentuk Response
- Endpoint create/update mengembalikan objek `Transaction` langsung.
- Endpoint list dibungkus `APIResponse<T>` dengan metadata paginasi.

## TypeScript Types (Request & Response)
Lihat `docs/types/sharia_savings.d.ts`.

## Paginasi & Filter
- Menggunakan cursor numerik (`id`) dan `limit` opsional (default 10).
- Query opsional: `term` (pencarian), `type` (jenis transaksi), `start`/`end` (rentang tanggal `YYYY-MM-DD`).

## Error Singkat yang Perlu Ditangani
- 400: body/query tidak valid.
- 401/403: token salah atau tenant tidak aktif.
- 404: transaksi tidak ditemukan.

## Checklist Integrasi FE
- Sertakan header wajib.
- Tampilkan status transaksi dan saldo terbaru.
- Gunakan `proof_url` untuk bukti transaksi.

