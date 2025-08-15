# Aset Sewa

- **Path Route:** `/aset-sewa`
- **Deskripsi Halaman:** Menampilkan daftar aset milik BUMDes yang dapat disewakan berikut status ketersediaannya.
- **Interaksi Utama:**
  - Menambahkan aset baru yang dapat disewakan.
  - Mengubah informasi aset, seperti harga sewa dan periode.
  - Menghapus aset yang sudah tidak tersedia.
- **Endpoint:**
  - `GET /api/aset-sewa` - daftar aset
  - `POST /api/aset-sewa` - tambah aset
  - `PUT /api/aset-sewa/{id}` - ubah aset
  - `DELETE /api/aset-sewa/{id}` - hapus aset
- **Format Data:**
  ```json
  {
    "id": 1,
    "nama": "Traktor",
    "hargaSewa": 500000,
    "periode": "hari",
    "status": "tersedia"
  }
  ```
