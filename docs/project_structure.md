# Struktur Project Backend Modular - Koperasi Serba Usaha

## 🛠️ Tech Stack

- Golang
- Fiber (Web Framework)
- Viper (Konfigurasi)
- Logrus (Logging)
- GORM (ORM)
- PostgreSQL (Database)

---

## 📁 Struktur Direktori

```bash
koperasi-backend/
├── cmd/
│   └── main.go
├── configs/
│   ├── config.yaml
│   └── config.go
├── internal/
│   ├── app/
│   ├── database/
│   ├── logger/
│   └── modules/
│       └── contoh/
│           ├── handler/
│           ├── usecase/
│           ├── store/
│           └── plugin.go
├── migrations/
├── plugin/
│   └── loader.go
├── go.mod
├── go.sum
└── README.md
```

---

## 📄 Penjelasan Folder

### `cmd/main.go`
- Entry point aplikasi.

### `configs/`
- `config.yaml`: Konfigurasi global.
- `config.go`: Load YAML ke struct dengan Viper.

### `internal/app/`
- Inisialisasi server dan routing.

### `internal/database/`
- Koneksi dan migrasi database.

### `internal/logger/`
- Setup logger menggunakan Logrus.

### `internal/modules/`
Setiap modul domain disusun sebagai plugin dengan struktur:
- `handler/`: HTTP handler.
- `usecase/`: Logika bisnis.
- `store/`: Akses data ke database.
- `plugin.go`: Registrasi modul ke aplikasi.

### `migrations/`
- File migrasi SQL.

### `plugin/`
- Loader global untuk mengaktifkan modul.

---

## 📄 Dokumen Terkait

- [Daftar Modul KSU](daftar_modul_ksu.md)
- [Ringkasan Usecase Modul](modules_usecase_overview.md)
- [Module Repositories](module_repositories.md)
