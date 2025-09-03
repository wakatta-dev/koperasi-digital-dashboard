# Modul Savings

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Savings. Modul ini mengelola rekening simpanan anggota beserta transaksi setoran dan penarikan. Terintegrasi dengan modul Finance (pencatatan kas/ledger) dan Billing (biaya administrasi).

Referensi implementasi utama terdapat pada:
- `internal/modules/savings/entity.go`
- `internal/modules/savings/dto.go`
- `internal/modules/savings/repository.go`
- `internal/modules/savings/service.go`
- `internal/modules/savings/handler.go`
- `internal/modules/savings/routes.go`

## Ringkasan Peran per Tenant

- Vendor: memantau secara agregat (tidak melakukan operasi simpanan harian).
- Koperasi/UMKM/BUMDes: mengelola simpanan anggota (pokok/wajib/sukarela), setoran dan penarikan.

## Arsitektur & Komponen

- Repository: operasi data akun simpanan dan transaksi (`GetOrCreateAccount`, `UpdateAccount`, `Create/Update/FindTransaction`, `ListTransactions`).
- Service: logika bisnis (`Deposit`, `VerifyDeposit`, `RequestWithdrawal`, `ApproveWithdrawal`, `ListTransactions`, `GetProof`) termasuk integrasi Finance (`RecordDeposit/Withdrawal`) dan Billing (`ChargeFee`).
- Handler (HTTP): parsing/validasi input, memanggil service, dan mengembalikan JSON.

## Entitas & Skema Data

- SavingsAccount
  - `id`, `member_id`, `type` (umum: `pokok|wajib|sukarela`), `balance`, `created_at`, `updated_at`
- SavingsTransaction
  - `id`, `account_id`, `amount`, `method` (`manual` atau non-manual/digital), `status` (`pending|verified|approved`), `type` (`setoran|penarikan`), `proof_url`, `created_at`

Catatan: jenis simpanan (`type`) tidak dibatasi di kode; konvensi domain biasanya `pokok|wajib|sukarela`.

## Alur Bisnis Utama

1) Setoran (Deposit)
- Membuat transaksi `setoran` berstatus `pending`.
- Jika `method != manual`, status langsung `verified`, saldo akun bertambah, bukti (`proof_url`) dihasilkan otomatis, dan transaksi kas masuk dicatat via Finance.
- Opsional: biaya administrasi dicatat via Billing (`ChargeFee`).

2) Verifikasi Setoran Manual
- Mengubah status `pending` → `verified`, menambah saldo, menghasilkan `proof_url`, dan mencatat kas masuk via Finance.

3) Penarikan (Withdrawal)
- Validasi saldo mencukupi, membuat transaksi `penarikan` berstatus `pending`.
- Opsional: biaya administrasi dicatat via Billing.

4) Persetujuan Penarikan
- Mengubah status `pending` → `approved`, mengurangi saldo, menghasilkan `proof_url`, dan mencatat kas keluar via Finance.

5) Riwayat & Bukti
- `ListTransactions(member_id)` menampilkan riwayat transaksi simpanan anggota.
- `GetProof(transaction_id)` menampilkan `proof_url` untuk transaksi terkait.

## Endpoint API

Semua endpoint membutuhkan autentikasi `Bearer` dan konteks tenant via `X-Tenant-ID`.

- `POST /coop/savings/{member_id}/deposit` — buat transaksi setoran.
- `POST /coop/savings/{transaction_id}/verify` — verifikasi setoran manual.
- `POST /coop/savings/{member_id}/withdraw` — ajukan penarikan.
- `POST /coop/savings/{transaction_id}/approve` — setujui penarikan.
- `GET /coop/savings/{member_id}/transactions` — daftar transaksi simpanan anggota.
- `GET /coop/savings/{transaction_id}/proof` — dapatkan `proof_url` transaksi.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `POST /coop/savings/{member_id}/deposit`
  - Path: `member_id` (uint, wajib)
  - Body DepositRequest:
    - `type` (wajib; contoh: `pokok|wajib|sukarela`)
    - `amount` (wajib, > 0)
    - `method` (wajib; `manual` atau non-manual/digital)
    - `fee` (opsional, number)
  - Response 201: objek `SavingsTransaction` (status awal `pending` atau `verified` jika non-manual).

- `POST /coop/savings/{transaction_id}/verify`
  - Path: `transaction_id` (uint, wajib; transaksi `setoran`)
  - Response 200: `SavingsTransaction` (status `verified`).

- `POST /coop/savings/{member_id}/withdraw`
  - Path: `member_id` (uint, wajib)
  - Body WithdrawalRequest:
    - `type` (wajib)
    - `amount` (wajib, > 0; harus <= saldo)
    - `method` (wajib)
    - `fee` (opsional)
  - Response 201: `SavingsTransaction` (status `pending`).

- `POST /coop/savings/{transaction_id}/approve`
  - Path: `transaction_id` (uint, wajib; transaksi `penarikan`)
  - Response 200: `SavingsTransaction` (status `approved`).

- `GET /coop/savings/{member_id}/transactions`
  - Path: `member_id` (uint, wajib)
  - Response 200: array `SavingsTransaction`.

- `GET /coop/savings/{transaction_id}/proof`
  - Path: `transaction_id` (uint, wajib)
  - Response 200: `{ "proof": "<proof_url>" }`.

## Contoh Payload

- Deposit
```json
{ "type": "pokok", "amount": 100000, "method": "manual", "fee": 2000 }
```

- Withdraw
```json
{ "type": "pokok", "amount": 50000, "method": "transfer", "fee": 1000 }
```

## Status & Transisi

- Setoran: `pending` → `verified` (manual via verifikasi, non-manual otomatis).
- Penarikan: `pending` → `approved`.

## Paginasi & Response

- Tidak ada paginasi; `ListTransactions` mengembalikan array sederhana (tanpa cursor).
- Response mengikuti output handler saat ini (objek JSON langsung, tidak memakai wrapper `APIResponse`).

## Integrasi & Dampak ke Modul Lain

- Finance: mencatat transaksi kas masuk/keluar dan entri ledger (`RecordDeposit`, `RecordWithdrawal`).
- Billing: mencatat biaya administrasi setoran/penarikan (`ChargeFee`).

## Keamanan

- Middleware memastikan autentikasi `Bearer` dan isolasi tenant melalui `X-Tenant-ID`.

## Catatan Implementasi

- `proof_url` dihasilkan otomatis (placeholder) saat transaksi diverifikasi/disetujui.
- Metode non-manual dianggap terverifikasi otomatis di service saat ini.
- Tipe simpanan tidak dibatasi oleh skema; gunakan konvensi yang disepakati (`pokok|wajib|sukarela`).

## Peran Modul Savings per Jenis Tenant (Rangkuman)

- Koperasi/UMKM/BUMDes: operasional simpanan anggota.
- Vendor: pengawasan agregat (opsional).

## Skenario Penggunaan

1. Teller mencatat setoran manual, lalu supervisor memverifikasi transaksi tersebut.
2. Anggota mengajukan penarikan; bendahara menyetujui dan sistem mencatat kas keluar.

## Tautan Cepat

- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Billing: [billing.md](billing.md)
- Membership: [membership.md](membership.md)
- Reporting: [reporting.md](reporting.md)
- Dashboard: [dashboard.md](dashboard.md)
