# Dashboard Koperasi

- **Path**: `/koperasi/dashboard`
- **Tujuan Halaman**: Menampilkan ringkasan statistik dan aktivitas koperasi.
- **Elemen Fungsional Utama**:
  - Kartu statistik untuk anggota, simpanan, pinjaman, dan SHU.
  - Daftar aktivitas terbaru.
  - Aksi cepat: tambah anggota, setoran simpanan, proses pinjaman, lihat laporan.
  - Agenda mendatang seperti RAT dan pembagian SHU.
- **Endpoint**:
  - `GET /api/koperasi/dashboard/stats`
  - `GET /api/koperasi/activities`
  - `GET /api/koperasi/agendas`
- **Format Data**:

  ```json
  {
    "stats": {
      "anggota": 0,
      "simpanan": 0,
      "pinjaman": 0,
      "shu": 0
    },
    "activities": [
      {
        "id": 0,
        "deskripsi": "string",
        "tanggal": "YYYY-MM-DD"
      }
    ],
    "agendas": [
      {
        "id": 0,
        "judul": "string",
        "tanggal": "YYYY-MM-DD"
      }
    ]
  }
  ```
