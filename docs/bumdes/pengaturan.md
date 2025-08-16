# Pengaturan

- **Path Route:** `/pengaturan`
- **Deskripsi Halaman:** Halaman konfigurasi umum untuk BUMDes.
- **Interaksi Utama:**
  - Mengubah profil dan informasi BUMDes.
  - Mengelola pengguna dan peran.
  - Menyesuaikan preferensi sistem.
- **Endpoint:**
  - `GET /api/pengaturan` - daftar pengaturan
    - Request: `-`
    - Response:
      ```json
      [
        {
          "id": 1,
          "nama": "tema",
          "nilai": "gelap"
        }
      ]
      ```
  - `PUT /api/pengaturan/{id}` - ubah pengaturan
    - Request:
      ```json
      {
        "nama": "tema",
        "nilai": "gelap"
      }
      ```
    - Response:
      ```json
      {
        "id": 1,
        "nama": "tema",
        "nilai": "gelap"
      }
      ```
- **Format Data:**
  ```json
  {
    "id": 1,
    "nama": "tema",
    "nilai": "gelap"
  }
  ```
