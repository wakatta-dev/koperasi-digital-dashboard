# Simpanan Koperasi

- **Path**: `/koperasi/simpanan`
- **Tujuan Halaman**: Mencatat setoran dan penarikan simpanan anggota.
- **Elemen Fungsional Utama**:
  - Tombol setoran dan penarikan simpanan.
  - Kartu statistik total simpanan, simpanan pokok, simpanan wajib, dan simpanan sukarela.
  - Pencarian transaksi.
  - Tabel riwayat transaksi dengan jenis, jumlah, saldo, dan aksi detail.
- **Endpoint**:
  - `GET /api/koperasi/simpanan/stats`
  - `GET /api/koperasi/simpanan`
- **Format Data**:

  ```json
  {
    "stats": {
      "total": 0,
      "pokok": 0,
      "wajib": 0,
      "sukarela": 0
    },
    "transaksi": [
      {
        "id": 0,
        "jenis": "string",
        "jumlah": 0,
        "saldo": 0,
        "tanggal": "YYYY-MM-DD"
      }
    ]
  }
  ```
