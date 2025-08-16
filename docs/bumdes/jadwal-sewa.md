# Jadwal Sewa

- **Path Route:** `/jadwal-sewa`
- **Deskripsi Halaman:** Kalender untuk melihat dan mengatur jadwal penggunaan aset sewa.
- **Interaksi Utama:**
  - Menambahkan jadwal sewa baru.
  - Mengubah atau membatalkan jadwal yang ada.
  - Melihat detail pemesanan tiap hari.
- **Endpoint:**
  - `GET /api/jadwal-sewa`
    - **Parameter:** tidak ada
    - **Respons:**
      - `200 OK` berisi array daftar jadwal
  - `POST /api/jadwal-sewa`
    - **Parameter (body):**
      - `asetId` (number) - ID aset yang disewa
      - `tanggalMulai` (string, YYYY-MM-DD) - tanggal mulai sewa
      - `tanggalSelesai` (string, YYYY-MM-DD) - tanggal selesai sewa
      - `penyewa` (string) - nama penyewa
    - **Respons:**
      - `201 Created` berisi objek jadwal baru dengan `id`
  - `PUT /api/jadwal-sewa/{id}`
    - **Parameter:**
      - `id` (path) - ID jadwal yang akan diubah
      - Body seperti pada `POST` (opsional)
    - **Respons:**
      - `200 OK` berisi objek jadwal yang telah diperbarui
  - `DELETE /api/jadwal-sewa/{id}`
    - **Parameter:** `id` (path) - ID jadwal yang dibatalkan
    - **Respons:**
      - `200 OK` berisi pesan status pembatalan
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
