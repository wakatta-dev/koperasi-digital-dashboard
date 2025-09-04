# Modul Finance / Transactions

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, dan alur bisnis dari modul Finance/Transactions. Modul ini bertanggung jawab untuk pencatatan pergerakan kas sederhana per tenant dan menyediakan data yang dapat dirangkum oleh modul lain seperti Billing dan Reporting.

Referensi implementasi utama terdapat pada:
- `internal/modules/finance/entity.go`
- `internal/modules/finance/repository.go`
- `internal/modules/finance/service.go`
- `internal/modules/finance/ledger.go`
- `internal/modules/finance/ledger_repository.go`
- `internal/modules/finance/ledger_service.go`
- `internal/modules/finance/ports.go`
- `internal/modules/finance/handler.go`
- `internal/modules/finance/routes.go`

## Ringkasan Peran per Tenant

- Vendor: memonitor arus kas masuk/keluar yang terekam untuk setiap tenant, bahan pelaporan.
- Koperasi/UMKM/BUMDes: transaksi kas dicatat otomatis ketika ada pembayaran atau aktivitas keuangan lain; endpoint REST tersedia untuk kebutuhan internal.

## Arsitektur & Komponen

- Repository: akses data untuk `Transaction` (buat transaksi).
- Service: menyediakan operasi `CreateTransaction`, `GetTransaction`, `ListTransactions`, `UpdateTransaction`, dan `DeleteTransaction` yang otomatis menulis entri `LedgerEntry` dan audit status.
- Handler/HTTP: menyediakan endpoint `POST /transactions`, `GET /transactions`, `GET /transactions/:id/history`, `PATCH /transactions/:id`, `DELETE /transactions/:id`, dan `GET /transactions/export`.

## Entitas & Skema Data

Ringkasan struktur `Transaction`:

- `id` (uint, primary key)
- `tenant_id` (uint, indeks)
- `transaction_date` (timestamp)
- `type` (string, enum: `CashIn`, `CashOut`, `Transfer`)
- `category` (string)
- `amount` (float64)
- `payment_method` (string)
- `description` (string)
- `created_by` (uint)
- `updated_by` (uint)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Ringkasan struktur `LedgerEntry`:

- `id` (uint, primary key)
- `transaction_id` (uint, FK ke `cash_transactions`)
- `account_code` (string)
- `account_name` (string)
- `debit` (float64)
- `credit` (float64)

Enum dan konstanta penting:
- `TransactionTypeCashIn` = `CashIn`
- `TransactionTypeCashOut` = `CashOut`
- `TransactionTypeTransfer` = `Transfer`
- `TransactionCategories` = ["simpanan", "pinjaman", "operasional", "penjualan", "pembelian_aset"]

## Alur Bisnis Utama

1) **Pencatatan Transaksi Umum**
   - Menggunakan `CreateTransaction` yang menerima akun debit/kredit dan menulis dua entri `LedgerEntry` secara otomatis.
   - Setiap operasi dicatat dalam `StatusAudit` untuk pelacakan perubahan.

2) **Pencatatan Kas Masuk Otomatis**
   - Dipanggil oleh modul Billing saat pembayaran invoice diverifikasi menggunakan `CreateTransaction`.
   - Menyimpan transaksi dengan tipe `CashIn`, amount sesuai nilai pembayaran, dan deskripsi misalnya `payment {id}`.

3) **Pelaporan**
   - Modul Reporting mengagregasi `Transaction` untuk menghitung total pemasukan, pengeluaran, dan ringkasan per periode.

## Endpoint API

Modul ini menyediakan endpoint dasar untuk mengelola transaksi serta ekspor data.

- `POST /transactions` — tambah transaksi.
- `GET /transactions?limit={n}&cursor={c?}` — daftar transaksi.
- `GET /transactions/{id}/history?limit={n}&cursor={c?}` — riwayat perubahan.
- `PATCH /transactions/{id}` — perbarui transaksi.
- `DELETE /transactions/{id}` — hapus transaksi.
- `GET /transactions/export` — ekspor data transaksi (format `csv|xlsx`).

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant (atau gunakan domain)

- `POST /transactions`
  - Body CreateTransactionRequest:
    - `transaction_date` (RFC3339, opsional; default now)
    - `type` (wajib, `CashIn|CashOut|Transfer`)
    - `category` (wajib, salah satu dari `simpanan|pinjaman|operasional|penjualan|pembelian_aset`)
    - `amount` (wajib, number)
    - `payment_method` (wajib, string)
    - `description` (opsional)
    - `debit_account_code`, `debit_account_name` (wajib)
    - `credit_account_code`, `credit_account_name` (wajib)
  - Response 201: `data` Transaction lengkap beserta `ledger_entries` debit/kredit.

- `GET /transactions`
  - Query filter (opsional):
    - `start` (YYYY-MM-DD), `end` (YYYY-MM-DD)
    - `type` (`CashIn|CashOut|Transfer`)
    - `category` (lihat kategori di atas)
    - `min_amount` (number), `max_amount` (number)
  - `limit` (wajib, int), `cursor` (opsional, string)
  - Response 200: `data` array Transaction + `meta.pagination`.

- `GET /transactions/{id}/history`
  - Path: `id` (int, wajib)
  - Query: `limit` (wajib, int), `cursor` (opsional, string)
  - Response 200: `data` array TransactionHistory + `meta.pagination`; 404 jika transaksi tidak ditemukan pada tenant yang sama.

- `PATCH /transactions/{id}`
  - Path: `id` (int, wajib)
  - Body UpdateTransactionRequest (seluruh field opsional; yang diisi akan diperbarui):
    - `transaction_date`, `type`, `category`, `amount`, `payment_method`, `description`, `debit_*`, `credit_*`
  - Response 200: `data` Transaction terbaru + riwayat audit dicatat.

- `DELETE /transactions/{id}`
  - Path: `id` (int, wajib)
  - Response 200: `data` `{ "id": <int> }` dan audit penghapusan dicatat.

- `GET /transactions/export`
  - Query filter sama dengan `GET /transactions` + `format` (`csv`|`xlsx`, opsional, default `csv`)
  - Response 200: file CSV/XLSX untuk diunduh.

## Paginasi & Response

- Listing transaksi dan riwayat menggunakan `limit` dan `cursor` string.
- Response dibungkus `APIResponse` dengan `meta.pagination`.

Contoh response `GET /transactions`:
```json
{
  "data": [
    {"id": 1, "amount": 1000}
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

- `type` menentukan arah transaksi: `CashIn` (kas masuk), `CashOut` (kas keluar), atau `Transfer`.
- Kategori transaksi ditentukan oleh `category`.
- Tidak ada status lain yang dilacak.

## Integrasi & Dampak ke Modul Lain

 - **Billing**: Setelah payment diverifikasi, Billing menggunakan `CreateTransaction` untuk mencatat kas masuk.
 - **Reporting**: Menggunakan tabel `cash_transactions` untuk menyusun ringkasan keuangan (total pemasukan/pengeluaran dan tren bulanan).

## Keamanan

- Semua endpoint dilindungi middleware; konteks tenant diverifikasi sebelum transaksi dicatat.

## Catatan Implementasi

- Modul ini minimalis dan dapat diperluas dengan pencatatan kas keluar, pencatatan saldo, atau integrasi dengan sistem akuntansi lain.
- Handler/API dapat diperluas jika dibutuhkan akses langsung oleh pengguna atau layanan lain.

## Peran Modul Finance/Transactions per Jenis Tenant (Rangkuman)

- Vendor: melihat akumulasi transaksi kas untuk kepentingan audit dan pelaporan.
- Koperasi/UMKM/BUMDes: transaksi mereka tercatat secara otomatis; dapat digunakan untuk melihat histori keuangan di masa depan.

## Skenario Penggunaan

### 1. Pencatatan Pembayaran Langganan

1. Tenant melakukan pembayaran dan diverifikasi oleh Vendor melalui modul Billing.
2. Billing memanggil `CreateTransaction` dengan `tenant_id`, `amount`, dan deskripsi pembayaran.
3. Transaksi kas tersimpan dan dapat diringkas oleh modul Reporting.

### 2. Ekstensi Pencatatan Kas Keluar

1. Sistem atau pengguna menambahkan kemampuan `RecordCashOut`.
2. Setiap pengeluaran (misal refund) dicatat dengan tipe `CashOut`.
3. Laporan keuangan mencerminkan saldo kas yang lebih akurat.

## Tautan Cepat

- Billing: [billing.md](billing.md)
- Reporting: [reporting.md](reporting.md)
- Cashbook: [cashbook.md](cashbook.md)
- Dashboard: [dashboard.md](dashboard.md)
