# Panduan Pengguna

## Prasyarat

- Go 1.21 atau lebih baru
- Docker dan Docker Compose
- PostgreSQL 13 atau lebih baru

### Instalasi singkat

#### Linux

```bash
sudo apt update
sudo apt install -y golang docker.io docker-compose postgresql
```

#### macOS (Homebrew)

```bash
brew install go docker postgresql
```

## Instalasi aplikasi

```bash
git clone <repo-url>
cd koperasi-digital-backend
go mod download
```

## Konfigurasi

Konfigurasi bawaan berada pada `configs/app.yaml`:

```yaml
db:
  dsn: postgres://faizal:password@localhost:5432/ksu?sslmode=disable
tenant_modules:
  default:
    - auth
    - anggota
    - simpanan
    - pinjaman
    - inventory
    - kasir
    - marketplace
    - laporan
    - dashboard
    - modules
    - landing
    - business-profile
    - price-tier
    - unit-usaha
    - shu
    - rental
    - payment
```

Nilai dalam berkas dapat diganti menggunakan variabel lingkungan:

- `DB_DSN` – DSN koneksi database
- `CASBIN_MODEL` – lokasi berkas model Casbin
- `CASBIN_POLICY` – lokasi berkas policy Casbin
- `JWT_SECRET` – secret untuk JWT

## Menjalankan server

```bash
go run ./cmd/main.go
```

Secara bawaan, modul dimuat sesuai daftar pada `tenant_modules`
atau tabel `tenant_modules` pada database. Untuk menambahkan modul
baru, tambahkan nama modul pada konfigurasi tersebut.

## Alur billing dan aktivasi

1. Tenant memilih paket modul lalu membuat subscription.
2. Sistem membuat invoice dan mengarahkan ke gateway pembayaran.
3. Setelah pembayaran berhasil, invoice ditandai lunas dan modul diaktifkan.
4. Ringkasan tagihan dapat dilihat melalui endpoint billing.

### Contoh request/response

#### Membuat Subscription

```http
POST /api/subscriptions HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": "6f71c0bf-ff0a-4a55-aa63-0e8b5bd8f8c2",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z"
}
```

```json
{
  "id": "45f0c6e4-bf7b-4e2d-b707-b1b2a2d0a5a1",
  "subscription_id": "6f71c0bf-ff0a-4a55-aa63-0e8b5bd8f8c2",
  "period_start": "2024-01-01T00:00:00Z",
  "period_end": "2024-01-31T23:59:59Z",
  "amount": 100000
}
```

#### Ringkasan Billing

```http
GET /api/billing/summary HTTP/1.1
Authorization: Bearer <token>
```

```json
{
  "total": 100000,
  "items": [
    {"module": "inventory", "price": 50000},
    {"module": "kasir", "price": 50000}
  ]
}
```

### Diagram alir

```mermaid
flowchart TD
    A[User] --> B[Create Subscription]
    B --> C[Invoice Generated]
    C --> D[Payment Gateway]
    D --> E[Payment Callback]
    E --> F[Activate Module]
    F --> G[Billing Summary Updated]
```

## Debugging umum

- Periksa log aplikasi untuk pesan kesalahan.
- Jalankan `go test ./...` untuk memastikan unit test lulus.
- Gunakan `curl -v` terhadap endpoint terkait untuk memeriksa request/response.
- Jika berjalan di Docker, cek log container dengan `docker compose logs app`.
