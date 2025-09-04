# Modul Loan

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul Loan. Modul ini mengelola pengajuan, persetujuan, pencairan, pembayaran angsuran (termasuk denda), serta surat lunas.

Referensi implementasi utama terdapat pada:
- `internal/modules/loan/entity.go`
- `internal/modules/loan/dto.go`
- `internal/modules/loan/repository.go`
- `internal/modules/loan/service.go`
- `internal/modules/loan/handler.go`
- `internal/modules/loan/routes.go`

## Ringkasan Peran per Tenant

- Koperasi/UMKM/BUMDes: operasional pinjaman (apply/approve/disburse/pay/release-letter).
- Vendor: pengawasan agregat (opsional, jika dibuka aksesnya).

## Arsitektur & Komponen

- Repository: CRUD aplikasi pinjaman dan angsuran.
- Service: alur apply→approve (generate jadwal), pencairan (Finance), pembayaran angsuran (Finance), biaya administrasi (Billing), dan kalkulasi denda keterlambatan.
- Handler & Routes: endpoint HTTP untuk aplikasi, persetujuan, pencairan, daftar angsuran, pembayaran angsuran, dan surat lunas.

## Entitas & Skema Data

- LoanApplication
  - `id`, `tenant_id`, `member_id`, `amount`, `tenor`, `rate`, `purpose?`, `status` (`pending|approved|disbursed`), `created_at`, preload `Installments`, `Documents`
- LoanInstallment
  - `id`, `loan_id`, `due_date`, `amount`, `paid_amount`, `status` (`unpaid|paid`), `penalty`, `paid_at?`
- LoanDocument
  - `id`, `loan_id`, `file_url`, `type`

Konstanta/aturan penting:
- `penaltyRate = 0.01` (1% per hari keterlambatan; dihitung terhadap `amount` saat `req.Date > due_date`).
- Perhitungan cicilan: `(amount + amount*rate/100) / tenor`.

## Alur Bisnis Utama

1) Pengajuan (Apply)
- Menerima `amount`, `tenor`, `rate`, `purpose`; membuat `LoanApplication` berstatus `pending`.
- Opsional biaya administrasi: `billing.ChargeFee(…, 1000, "loan application {id}")` jika Billing terpasang.

2) Persetujuan (Approve)
- Mengubah status ke `approved`, membuat `loan_installments` sebanyak `tenor` dengan `due_date` bulanan dari sekarang, status `unpaid`.

3) Pencairan (Disburse)
- Mencatat transaksi Finance tipe `CashOut` kategori `pinjaman` (Debit: Loan Receivable, Credit: Cash), lalu mengubah status aplikasi ke `disbursed`.

4) Pembayaran Angsuran (PayInstallment)
- Jika pembayaran melewati `due_date`, tambahkan `penalty = amount * 0.01 * daysLate`.
- Tambah `paid_amount`; bila `>= amount` ubah status angsuran ke `paid` dan set `paid_at`.
- Catat transaksi Finance tipe `CashIn` kategori `pinjaman` (Debit: Cash, Credit: Loan Receivable).

5) Surat Lunas (ReleaseLetter)
- Jika seluruh `loan_installments` berstatus `paid`, hasilkan pesan surat lunas; jika tidak, kembalikan error.

## Endpoint API

Semua endpoint membutuhkan autentikasi `Bearer` dan konteks tenant via `X-Tenant-ID`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST   | `/loans/apply`                     | Ajukan pinjaman baru |
| POST   | `/loans/{id}/approve`              | Setujui pengajuan pinjaman |
| POST   | `/loans/{id}/disburse`             | Cairkan pinjaman yang disetujui |
| GET    | `/loans/{id}/installments`         | Daftar angsuran pinjaman |
| POST   | `/loans/installments/{id}/pay`     | Bayar angsuran pinjaman |
| GET    | `/loans/{id}/release-letter`       | Dapatkan surat lunas bila semua angsuran lunas |

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau domain)

- `POST /loans/apply`
  - Body ApplyRequest:
    - `member_id` (wajib, uint)
    - `amount` (wajib, > 0)
    - `tenor` (wajib, > 0; bulan)
    - `rate` (wajib, persen per tenor)
    - `purpose` (opsional)
  - Response 201: `LoanApplication` (status `pending`).

- `POST /loans/{id}/approve`
  - Path: `id` (int, wajib)
  - Response 200: `LoanApplication` (status `approved` + angsuran terbentuk).

- `POST /loans/{id}/disburse`
  - Path: `id` (int, wajib)
  - Body: `{ "method": "transfer|cash|..." }`
  - Response 204: tanpa body (pencairan tercatat di Finance, status `disbursed`).

- `GET /loans/{id}/installments`
  - Path: `id` (int, wajib)
  - Query: `limit` (wajib, int), `cursor` (opsional, string)
  - Response 200: `data` array `LoanInstallment` + `meta.pagination`.

- `POST /loans/installments/{id}/pay`
  - Path: `id` (int, wajib; id angsuran)
  - Body PaymentRequest:
    - `amount` (wajib, > 0)
    - `date` (wajib, RFC3339; dipakai hitung denda)
    - `method` (wajib)
  - Response 200: `LoanInstallment` terkini (status bisa `paid` jika terbayar penuh).

- `GET /loans/{id}/release-letter`
  - Path: `id` (int, wajib)
  - Response 200: `{ "message": "Loan {id} settled" }` jika lunas; selain itu error.

## Contoh Payload

- Apply
```json
{ "member_id": 12, "amount": 10000000, "tenor": 12, "rate": 12.5, "purpose": "Modal kerja" }
```

- Pay Installment
```json
{ "amount": 900000, "date": "2025-09-30T00:00:00Z", "method": "transfer" }
```

- List Installments (paginasi)
```json
GET /loans/1/installments?limit=2
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

## Status & Transisi

- Aplikasi: `pending` → `approved` → `disbursed`.
- Angsuran: `unpaid` → `paid` (dengan akumulasi `penalty` bila terlambat).

## Paginasi & Response

- `GET /loans/{id}/installments` menggunakan `limit` dan `cursor` string.
- Response dibungkus `APIResponse` dengan `meta.pagination`.

## Integrasi & Dampak ke Modul Lain

- Finance: pencairan (`CashOut`) dan pembayaran angsuran (`CashIn`).
- Billing: biaya administrasi saat apply (`ChargeFee`).

## Keamanan

- Middleware memastikan autentikasi `Bearer` dan isolasi tenant (`X-Tenant-ID`).

## Catatan Implementasi

- `penaltyRate` tetap 1%/hari berdasarkan selisih hari dari `due_date` ke `date` pembayaran.
- Jadwal angsuran dibuat bulanan dari tanggal persetujuan (AddDate(0, i, 0)).
- Belum ada endpoint pembatalan/penolakan; alur minimalis sesuai kode saat ini.

## Peran Modul Loan per Jenis Tenant (Rangkuman)

- Koperasi/UMKM/BUMDes: pengajuan, persetujuan, pencairan, pembayaran, dan pelunasan pinjaman.
- Vendor: pengawasan agregat (opsional).

## Skenario Penggunaan

1. Anggota mengajukan pinjaman; sistem membuat aplikasi `pending` dan menagihkan biaya administrasi.
2. Petugas menyetujui; sistem membuat jadwal angsuran bulanan dan status `approved`.
3. Bendahara mencairkan pinjaman; sistem mencatat `CashOut` dan status `disbursed`.
4. Anggota membayar angsuran; sistem menghitung denda jika terlambat, menandai angsuran `paid` bila lunas, dan mencatat `CashIn`.
5. Setelah semua angsuran `paid`, surat lunas tersedia.

## Tautan Cepat

- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Billing: [billing.md](billing.md)
- Membership: [membership.md](membership.md)
- Risk: [risk.md](risk.md)
- Dashboard: [dashboard.md](dashboard.md)
