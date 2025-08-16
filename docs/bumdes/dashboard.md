# Dashboard BUMDes

- **Path Route:** `/dashboard`
- **Deskripsi Halaman:** Ringkasan statistik dan aktivitas terbaru dari seluruh unit usaha BUMDes.
- **Interaksi Utama:**
  - Melihat metrik kinerja utama.
  - Menavigasi cepat ke modul lain.
  - Meninjau notifikasi penting.
- **Endpoint:** `GET /api/dashboard/summary`
  - **Request:** _tanpa body_
  - **Response:**
    - `totalUnit` - jumlah unit usaha.
    - `totalAset` - jumlah aset yang dimiliki.
    - `pendapatan` - total pendapatan.
    - `notifikasi` - daftar notifikasi terbaru.
- **Format Data:**
  ```json
  {
    "totalUnit": 5,
    "totalAset": 20,
    "pendapatan": 12000000,
    "notifikasi": []
  }
  ```
