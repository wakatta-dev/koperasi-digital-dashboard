# Pinjaman Koperasi

- **Path**: `/koperasi/pinjaman`
- **Tujuan Halaman**: Mengelola pengajuan dan status pinjaman anggota.
- **Elemen Fungsional Utama**:
  - Tombol pengajuan pinjaman baru.
  - Kartu statistik total pinjaman, menunggu persetujuan, pinjaman aktif, dan tunggakan.
  - Pencarian dan filter pinjaman.
  - Tabel pinjaman dengan detail anggota, jumlah, sisa, angsuran, status, serta aksi lihat, setujui, atau tolak.
- **Endpoint**:
  - `GET /api/koperasi/pinjaman/stats`
  - `GET /api/koperasi/pinjaman`
- **Format Data**:

  ```json
  {
    "stats": {
      "total": 0,
      "menunggu": 0,
      "aktif": 0,
      "tunggakan": 0
    },
    "pinjaman": [
      {
        "id": 0,
        "anggota": "string",
        "jumlah": 0,
        "sisa": 0,
        "angsuran": 0,
        "status": "string"
      }
    ]
  }
  ```
