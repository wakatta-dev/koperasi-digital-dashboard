# Overview Aplikasi Koperasi Digital Backend

## Deskripsi Singkat
Platform **Koperasi Digital** menyediakan layanan backend modular untuk mendukung operasional Koperasi, BUMDes, dan UMKM. Aplikasi dibangun dengan bahasa **Go** dan memanfaatkan arsitektur plugin sehingga setiap fitur dapat diaktifkan sesuai kebutuhan bisnis.

## Fitur Utama
- Arsitektur modular dengan alur `handler → usecase → store`.
- Autentikasi JWT dan otorisasi berbasis Casbin.
- Pengelolaan data anggota, simpanan, pinjaman, kasir, dan modul lain.
- Logging terstruktur menggunakan Logrus dan konfigurasi fleksibel melalui Viper.

## Teknologi Inti
- Go & Fiber (web framework)
- GORM dan PostgreSQL (ORM & database)
- Viper (konfigurasi), Logrus (logging)
- Swaggo untuk dokumentasi API

## Struktur Direktori
```text
cmd/        -> entry point aplikasi
docs/       -> dokumentasi proyek
configs/    -> berkas konfigurasi dan loader Viper
internal/   -> kode aplikasi (database, logger, modules, dll)
plugin/     -> loader untuk mengaktifkan modul
migrations/ -> berkas migrasi database
```

## Modul Tersedia
Beberapa modul yang telah tersedia di bawah `internal/modules` antara lain:
- anggota
- auth
- businessprofile
- dashboard
- hargabertingkat
- inventaris
- kasir
- landing
- laporan
- marketplace
- modulesub
- payment
- pinjaman
- rental
- shu
- simpanan
- unitusaha

## Menjalankan Aplikasi
1. Clone repositori dan unduh dependensi:
   ```bash
   git clone <repo-url>
   cd koperasi-digital-backend
   go mod download
   ```
2. Sesuaikan konfigurasi di `configs/` atau gunakan variabel lingkungan seperti `DB_DSN` dan `JWT_SECRET`.
3. Jalankan aplikasi:
   ```bash
   go run ./cmd/main.go
   ```
   atau menggunakan Docker:
   ```bash
   docker compose up --build
   ```

## Pengujian
Jalankan seluruh unit test dengan:
```bash
make test
```

## Dokumentasi Lanjutan
Dokumen lain yang memberikan rincian lebih spesifik dapat ditemukan di direktori [`docs/`](.).
