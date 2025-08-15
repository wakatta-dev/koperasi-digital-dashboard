# Unit Usaha

- **Path Route:** `/unit-usaha`
- **Deskripsi Halaman:** Mengelola daftar unit usaha yang dimiliki BUMDes.
- **Interaksi Utama:**
  - Menambahkan unit usaha baru.
  - Mengedit informasi unit usaha yang ada.
  - Menonaktifkan atau menghapus unit usaha.
- **Endpoint:**
  - `GET /api/unit-usaha` - daftar unit
  - `POST /api/unit-usaha` - tambah unit
  - `PUT /api/unit-usaha/{id}` - ubah unit
  - `DELETE /api/unit-usaha/{id}` - hapus unit
- **Format Data:**
  ```json
  {
    "id": 2,
    "nama": "Unit Pertanian",
    "jenis": "Agrikultur",
    "status": "aktif"
  }
  ```
