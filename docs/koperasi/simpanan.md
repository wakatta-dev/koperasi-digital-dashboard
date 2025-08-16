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
    - **Request:** _tanpa body_
    - **Response:**
      - `total` - total simpanan.
      - `pokok` - total simpanan pokok.
      - `wajib` - total simpanan wajib.
      - `sukarela` - total simpanan sukarela.
  - `GET /api/koperasi/simpanan`
    - **Request:** _tanpa body_
    - **Response:**
      - `id` - ID transaksi.
      - `jenis` - jenis simpanan.
      - `jumlah` - jumlah transaksi.
      - `saldo` - saldo setelah transaksi.
      - `tanggal` - tanggal transaksi.
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
