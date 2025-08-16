# Rapat Anggota Tahunan (RAT)

- **Path**: `/koperasi/rat`
- **Tujuan Halaman**: Mengatur jadwal dan memantau pelaksanaan RAT.
- **Elemen Fungsional Utama**:
  - Tombol untuk menjadwalkan RAT.
  - Detail RAT mendatang: tanggal, waktu, lokasi, dan konfirmasi kehadiran.
  - Statistik RAT: total anggota, konfirmasi kehadiran, kuorum, dan hari tersisa.
  - Riwayat RAT sebelumnya beserta persentase kehadiran dan status.
- **Endpoint**:
  - `GET /api/koperasi/rat/upcoming`
    - **Request:** _tanpa body_
    - **Response:**
      - `upcoming` - detail RAT mendatang:
        - `tanggal` - tanggal pelaksanaan.
        - `waktu` - waktu pelaksanaan.
        - `lokasi` - lokasi RAT.
      - `stats` - statistik kehadiran:
        - `totalAnggota` - jumlah anggota.
        - `konfirmasi` - anggota yang telah konfirmasi.
        - `kuorum` - batas minimum kehadiran.
        - `hariTersisa` - sisa hari menuju RAT.
  - `GET /api/koperasi/rat/history`
    - **Request:** _tanpa body_
    - **Response:**
      - `history` - daftar RAT sebelumnya:
        - `tahun` - tahun pelaksanaan.
        - `hadir` - jumlah anggota hadir.
        - `status` - status RAT.
- **Format Data**:

  ```json
  {
    "upcoming": {
      "tanggal": "YYYY-MM-DD",
      "waktu": "HH:MM",
      "lokasi": "string"
    },
    "stats": {
      "totalAnggota": 0,
      "konfirmasi": 0,
      "kuorum": 0,
      "hariTersisa": 0
    },
    "history": [
      {
        "tahun": 0,
        "hadir": 0,
        "status": "string"
      }
    ]
  }
  ```
