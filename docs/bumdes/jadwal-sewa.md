# Jadwal Sewa

- **Path Route:** `/jadwal-sewa`
- **Deskripsi Halaman:** Kalender untuk melihat dan mengatur jadwal penggunaan aset sewa.
- **Interaksi Utama:**
  - Menambahkan jadwal sewa baru.
  - Mengubah atau membatalkan jadwal yang ada.
  - Melihat detail pemesanan tiap hari.
- **Endpoint:**
  - `GET /api/jadwal-sewa` - daftar jadwal
  - `POST /api/jadwal-sewa` - buat jadwal
  - `PUT /api/jadwal-sewa/{id}` - ubah jadwal
  - `DELETE /api/jadwal-sewa/{id}` - batalkan jadwal
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
