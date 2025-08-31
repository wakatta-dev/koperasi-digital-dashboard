# Modul SHU (Sisa Hasil Usaha)

Dokumentasi ini menjelaskan peran, arsitektur, dan alur bisnis dari modul SHU. Modul ini menyediakan layanan internal untuk pencatatan distribusi SHU dengan integrasi ke modul Finance.

Referensi implementasi utama terdapat pada:
- `internal/modules/shu/service.go`

## Ringkasan Peran per Tenant

- Vendor: tidak langsung menggunakan layanan ini.
- Koperasi/UMKM/BUMDes: sistem memanggil service ini saat terjadi distribusi SHU agar tercatat di transaksi kas dan ledger.

## Arsitektur & Komponen

- Service: `DistributeSHU(tenantID, userID, amount, method, description)` memanggil `finance.CreateTransaction` bertipe `CashOut` kategori `operasional` dengan pasangan debit/kredit akunnya.

## Entitas & Skema Data

- Tidak menambah entitas baru; menggunakan entitas transaksi dari modul Finance.

## Alur Bisnis Utama

1) Distribusi SHU
- Mencatat transaksi kas keluar (`CashOut`) kategori `operasional`.
- Entri ledger via Finance: Debit `SHU Distribution`, Kredit `Cash`.

## Endpoint API

- Tidak ada endpoint HTTP publik untuk modul ini saat ini; dipanggil secara internal oleh modul/fitur lain.

## Contoh Pemanggilan (Service)

```go
_ = shuSvc.DistributeSHU(tenantID, userID, 2_500_000, "transfer", "Pembagian SHU 2025")
```

## Status & Transisi

- Tidak ada status khusus; fokus pada pencatatan transaksi.

## Paginasi & Response

- Tidak relevan.

## Integrasi & Dampak ke Modul Lain

- Finance: membuat `cash_transactions` dan `ledger_entries` melalui `CreateTransaction`.

## Keamanan

- Keamanan mengikuti konteks pemanggil service (tenant/user) yang disuplai saat pemanggilan.

## Catatan Implementasi

- Service akan mengembalikan `nil` jika port Finance belum di-wire (opsional pada pengujian/lingkungan tertentu).

## Peran Modul SHU per Jenis Tenant (Rangkuman)

- Koperasi/UMKM/BUMDes: pencatatan akuntansi saat distribusi SHU.

## Skenario Penggunaan

1. Rapat memutuskan pembagian SHU; sistem mencatat kas keluar dan ledger terkait.

