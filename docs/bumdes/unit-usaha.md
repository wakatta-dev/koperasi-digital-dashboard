# Unit Usaha

- **Path Route:** `/unit-usaha`
- **Deskripsi Halaman:** Mengelola daftar unit usaha yang dimiliki BUMDes.
- **Interaksi Utama:**
  - Menambahkan unit usaha baru.
  - Mengedit informasi unit usaha yang ada.
  - Menonaktifkan atau menghapus unit usaha.
- **Endpoint:**
  - `GET /api/unit-usaha`
    - **Request:** -
    - **Response:**
      ```json
      [
        {
          "id": 2,
          "nama": "Unit Pertanian",
          "jenis": "Agrikultur",
          "status": "aktif"
        }
      ]
      ```
  - `POST /api/unit-usaha`
    - **Request:**
      ```json
      {
        "nama": "Unit Pertanian",
        "jenis": "Agrikultur",
        "status": "aktif"
      }
      ```
    - **Response:**
      ```json
      {
        "id": 2,
        "nama": "Unit Pertanian",
        "jenis": "Agrikultur",
        "status": "aktif"
      }
      ```
  - `PUT /api/unit-usaha/{id}`
    - **Request:**
      ```json
      {
        "nama": "Unit Pertanian",
        "jenis": "Agrikultur",
        "status": "aktif"
      }
      ```
    - **Response:**
      ```json
      {
        "id": 2,
        "nama": "Unit Pertanian",
        "jenis": "Agrikultur",
        "status": "aktif"
      }
      ```
  - `DELETE /api/unit-usaha/{id}`
    - **Request:** -
    - **Response:**
      ```json
      {
        "message": "Unit dihapus"
      }
      ```
- **Format Data:**
  ```json
  {
    "id": 2,
    "nama": "Unit Pertanian",
    "jenis": "Agrikultur",
    "status": "aktif"
  }
  ```
