# Keanggotaan Koperasi

- **Path**: `/koperasi/keanggotaan`
- **Tujuan Halaman**: Mengelola data dan aktivitas anggota koperasi.
- **Elemen Fungsional Utama**:
  - Tombol untuk menambah anggota baru.
  - Kartu statistik total anggota, anggota aktif, dan anggota baru.
  - Pencarian anggota.
  - Tabel anggota dengan informasi simpanan, status, serta aksi lihat dan edit.
- **Endpoint**:
  - `GET /api/koperasi/anggota/stats`
    - **Request:** _tanpa body_
    - **Response:**
      - `total` - total anggota.
      - `aktif` - jumlah anggota aktif.
      - `baru` - jumlah anggota baru.
  - `GET /api/koperasi/anggota`
    - **Request:**
      - `search` - kata kunci pencarian anggota (opsional).
    - **Response:**
      - `id` - ID anggota.
      - `nama` - nama anggota.
      - `simpanan` - total simpanan.
      - `status` - status keanggotaan.
- **Format Data**:

  ```json
  {
    "stats": {
      "total": 0,
      "aktif": 0,
      "baru": 0
    },
    "anggota": [
      {
        "id": 0,
        "nama": "string",
        "simpanan": 0,
        "status": "string"
      }
    ]
  }
  ```
