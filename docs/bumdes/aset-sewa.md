# Aset Sewa

- **Path Route:** `/aset-sewa`
- **Deskripsi Halaman:** Menampilkan daftar aset milik BUMDes yang dapat disewakan berikut status ketersediaannya.
- **Interaksi Utama:**
  - Menambahkan aset baru yang dapat disewakan.
  - Mengubah informasi aset, seperti harga sewa dan periode.
  - Menghapus aset yang sudah tidak tersedia.
- **Endpoint:**
  - `GET /api/aset-sewa`
    - **Request:**
      - Tidak ada payload.
    - **Response:**
      - `id` - ID aset.
      - `nama` - Nama aset.
      - `hargaSewa` - Biaya sewa per periode.
      - `periode` - Satuan periode sewa.
      - `status` - Status ketersediaan.
  - `GET /api/aset-sewa/{id}`
    - **Request:**
      - `id` - ID aset.
    - **Response:**
      - `id` - ID aset.
      - `nama` - Nama aset.
      - `hargaSewa` - Biaya sewa per periode.
      - `periode` - Satuan periode sewa.
      - `status` - Status ketersediaan.
  - `POST /api/aset-sewa`
    - **Request:**
      - `nama` - Nama aset.
      - `hargaSewa` - Biaya sewa per periode.
      - `periode` - Satuan periode sewa.
      - `status` - Status ketersediaan awal.
    - **Response:**
      - `id` - ID aset.
      - `nama` - Nama aset.
      - `hargaSewa` - Biaya sewa per periode.
      - `periode` - Satuan periode sewa.
      - `status` - Status ketersediaan.
  - `PUT /api/aset-sewa/{id}`
    - **Request:**
      - `id` - ID aset.
      - `nama` - Nama aset.
      - `hargaSewa` - Biaya sewa per periode.
      - `periode` - Satuan periode sewa.
      - `status` - Status ketersediaan.
    - **Response:**
      - `id` - ID aset.
      - `nama` - Nama aset.
      - `hargaSewa` - Biaya sewa per periode.
      - `periode` - Satuan periode sewa.
      - `status` - Status ketersediaan.
  - `DELETE /api/aset-sewa/{id}`
    - **Request:**
      - `id` - ID aset.
    - **Response:**
      - `message` - Informasi keberhasilan penghapusan.
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
