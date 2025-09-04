# Modul SHU (Sisa Hasil Usaha)

Dokumentasi ini menjelaskan peran, arsitektur, entitas data, endpoint API, dan alur bisnis dari modul SHU. Modul ini menangani input total SHU tahunan, simulasi distribusi, eksekusi distribusi, serta riwayat distribusi per tenant dan per anggota.

Referensi implementasi utama terdapat pada:
- `internal/modules/shu/entity.go`
- `internal/modules/shu/repository.go`
- `internal/modules/shu/service.go`
- `internal/modules/shu/handler.go`
- `internal/modules/shu/routes.go`

## Ringkasan Peran per Tenant

- Koperasi/UMKM/BUMDes: input nilai SHU tahunan, simulasi distribusi, dan distribusi aktual ke anggota.
- Vendor: tidak menggunakan endpoint ini secara langsung.

## Arsitektur & Komponen

- Repository: simpan nilai SHU tahunan dan riwayat distribusi.
- Service: simulasi dan eksekusi distribusi (integrasi ke Finance untuk pencatatan kas keluar, dan ke Membership untuk dasar perhitungan bila diperlukan).
- Handler (HTTP): endpoint input, simulasi, distribusi, dan riwayat.

## Entitas & Skema Data (ringkas)

- YearlySHU — `year`, `total_shu`, `tenant_id`, timestamps
- SHUDistribution — `member_id`, `year`, `amount`, timestamps

## Alur Bisnis Utama

1) Input Total SHU Tahunan — menyimpan total SHU tahun berjalan.
2) Simulasi Distribusi — menghitung alokasi ke anggota (tanpa mencatat transaksi).
3) Distribusi — mengeksekusi pembagian, mencatat kas keluar (Finance) dan jejak distribusi.
4) Riwayat — melihat riwayat per tahun dan per anggota.

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID` dan menggunakan response standar `APIResponse`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST   | `/shu/yearly` | Input total SHU tahunan |
| POST   | `/shu/yearly/{year}/simulate` | Simulasi distribusi untuk tahun tertentu |
| POST   | `/shu/yearly/{year}/distribute` | Distribusi aktual SHU tahun tertentu |
| GET    | `/shu/history` | Daftar nilai SHU tahunan yang pernah dicatat |
| GET    | `/shu/member/{member_id}` | Riwayat SHU per anggota |
| GET    | `/shu/export/{year}` | Ekspor laporan SHU untuk tahun tertentu |

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant

- `POST /shu/yearly`
  - Body YearlySHURequest:
    - `year` (wajib, int)
    - `total_shu` (wajib, number)
  - Response 201: `data` YearlySHU

- `POST /shu/yearly/{year}/simulate`
  - Path: `year` (int, wajib)
  - Response 200: `data` array `SHUDistribution`

- `POST /shu/yearly/{year}/distribute`
  - Path: `year` (int, wajib)
  - Body DistributionRequest: `{ "method": "transfer|cash|...", "description": "..." }`
  - Response 200: `data` `{ "status": "ok" }`

- `GET /shu/history`
  - Response 200: `data` array YearlySHU

- `GET /shu/member/{member_id}`
  - Path: `member_id` (int, wajib)
  - Response 200: `data` array SHUDistribution

- `GET /shu/export/{year}`
  - Path: `year` (int, wajib)
  - Response 200: `data` `{ "status": "exported", "year": "..." }`

## Status & Transisi

- Tidak ada status kompleks; fokus pada jejak input/simulasi/distribusi dan pencatatan transaksi kas.

## Paginasi & Response

- Tidak ada paginasi, seluruh response berbentuk array atau objek sesuai endpoint.

## Integrasi & Dampak ke Modul Lain

- Finance: mencatat kas keluar saat distribusi melalui `CreateTransaction`.
- Membership: sumber data anggota untuk distribusi (implisit di service).

## Keamanan

- Middleware memastikan autentikasi `Bearer` dan isolasi tenant (`X-Tenant-ID`).

## Skenario Penggunaan

1. Input total SHU tahun berjalan, lalu jalankan simulasi untuk memeriksa alokasi.
2. Lakukan distribusi; sistem mencatat kas keluar dan menyimpan detail alokasi per anggota.

## Tautan Cepat

- Finance/Transactions: [finance_transactions.md](finance_transactions.md)
- Reporting: [reporting.md](reporting.md)
- Membership: [membership.md](membership.md)
