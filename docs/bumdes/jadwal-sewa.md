# Jadwal Sewa

- **Path Route:** `/jadwal-sewa`
- **Deskripsi Halaman:** Kalender untuk melihat dan mengatur jadwal penggunaan aset sewa.
- **Interaksi Utama:**
  - Menambahkan jadwal sewa baru.
  - Mengubah atau membatalkan jadwal yang ada.
  - Melihat detail pemesanan tiap hari.
- **Endpoint:**
  - `GET /api/jadwal-sewa` - daftar jadwal
    - Parameter: tidak ada
    - Respons: array Jadwal Sewa
  - `POST /api/jadwal-sewa` - buat jadwal
    - Parameter:
      - `asetId` (number) - ID aset yang disewa
      - `tanggalMulai` (string) - tanggal mulai sewa (YYYY-MM-DD)
      - `tanggalSelesai` (string) - tanggal selesai sewa (YYYY-MM-DD)
      - `penyewa` (string) - nama penyewa
    - Respons: objek Jadwal Sewa baru
  - `PUT /api/jadwal-sewa/{id}` - ubah jadwal
    - Parameter Path: `id` (number) - ID jadwal
    - Parameter Body:
      - `asetId` (number)
      - `tanggalMulai` (string)
      - `tanggalSelesai` (string)
      - `penyewa` (string)
    - Respons: objek Jadwal Sewa yang diperbarui
  - `DELETE /api/jadwal-sewa/{id}` - batalkan jadwal
    - Parameter Path: `id` (number) - ID jadwal
    - Respons: konfirmasi penghapusan (misal `{ "message": "deleted" }`)
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
