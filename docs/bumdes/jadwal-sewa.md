# Jadwal Sewa

- **Path Route:** `/jadwal-sewa`
- **Deskripsi Halaman:** Kalender untuk melihat dan mengatur jadwal penggunaan aset sewa.
- **Interaksi Utama:**
  - Menambahkan jadwal sewa baru.
  - Mengubah atau membatalkan jadwal yang ada.
  - Melihat detail pemesanan tiap hari.
- **Endpoint:**
  - `GET /api/jadwal-sewa`
    - **Parameter:**
      - `page` *(opsional)* – nomor halaman.
      - `limit` *(opsional)* – jumlah data per halaman.
      - `asetId` *(opsional)* – filter berdasarkan ID aset.
    - **Respons 200:**
      - `data` – array jadwal sewa.
      - `total` – jumlah total jadwal.
      - `page` – halaman saat ini.
      - `limit` – jumlah data per halaman.
  - `GET /api/jadwal-sewa/{id}`
    - **Parameter:**
      - `id` – ID jadwal.
    - **Respons 200:**
      - Objek jadwal sewa.
  - `POST /api/jadwal-sewa`
    - **Parameter (body JSON):**
      - `asetId` – ID aset yang disewa.
      - `tanggalMulai` – tanggal mulai sewa.
      - `tanggalSelesai` – tanggal selesai sewa.
      - `penyewa` – nama penyewa.
    - **Respons 201:**
      - `message` – status pembuatan jadwal.
      - `data` – jadwal sewa yang baru dibuat.
  - `PUT /api/jadwal-sewa/{id}`
    - **Parameter:**
      - `id` – ID jadwal.
      - `asetId`, `tanggalMulai`, `tanggalSelesai`, `penyewa` *(body JSON)* – field yang diubah.
    - **Respons 200:**
      - `message` – status pembaruan jadwal.
      - `data` – jadwal sewa setelah diperbarui.
  - `DELETE /api/jadwal-sewa/{id}`
    - **Parameter:**
      - `id` – ID jadwal.
    - **Respons 200:**
      - `message` – status penghapusan jadwal.
- **Format Data:**
  ```json
  {
    "id": 1,
    "asetId": 3,
    "tanggalMulai": "2025-05-01",
    "tanggalSelesai": "2025-05-03",
    "penyewa": "Budi"
  }
  ```
