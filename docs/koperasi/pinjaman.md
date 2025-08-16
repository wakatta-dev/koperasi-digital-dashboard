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
    - **Request:** _tanpa body_
    - **Response:**
      - `total` - jumlah seluruh pinjaman.
      - `menunggu` - pinjaman menunggu persetujuan.
      - `aktif` - pinjaman aktif.
      - `tunggakan` - pinjaman dengan tunggakan.
  - `GET /api/koperasi/pinjaman`
    - **Request:** _tanpa body_
    - **Response:**
      - `stats` - ringkasan statistik pinjaman.
      - `pinjaman` - daftar pinjaman berisi:
        - `id` - ID pinjaman.
        - `anggota` - nama anggota.
        - `jumlah` - jumlah pinjaman.
        - `sisa` - sisa pinjaman.
        - `angsuran` - nilai angsuran.
        - `status` - status pinjaman.
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
