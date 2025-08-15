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
  - `GET /api/koperasi/anggota`
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
