# Laporan

- **Path Route:** `/laporan`
- **Deskripsi Halaman:** Menyajikan laporan keuangan dan operasional per unit usaha.
- **Interaksi Utama:**
  - Memilih periode laporan.
  - Mengekspor laporan ke format PDF atau Excel.
  - Membandingkan performa antar unit.
- **Endpoint:** `GET /api/laporan?periode=YYYY-MM`
- **Format Data:**
  ```json
  {
    "unitUsahaId": 2,
    "pendapatan": 5000000,
    "pengeluaran": 2000000,
    "periode": "2025-05"
  }
  ```
