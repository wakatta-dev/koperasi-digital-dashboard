# Sisa Hasil Usaha (SHU)

- **Path**: `/koperasi/shu`
- **Tujuan Halaman**: Mengelola perhitungan dan pembagian SHU kepada anggota.
- **Elemen Fungsional Utama**:
  - Tombol untuk menghitung SHU dan mengekspor data.
  - Kartu ringkasan total SHU, bagian anggota, dan bagian modal.
  - Riwayat SHU per tahun.
  - Pembagian SHU per anggota beserta status pembayaran.
- **Endpoint**:
  - `GET /api/koperasi/shu/stats`
    - **Request:** _tanpa body_
    - **Response:**
      - `total` - total SHU.
      - `bagianAnggota` - bagian untuk anggota.
      - `bagianModal` - bagian untuk modal.
  - `GET /api/koperasi/shu/history`
    - **Request:** _tanpa body_
    - **Response:**
      - `tahun` - tahun perhitungan.
      - `total` - total SHU per tahun.
  - `GET /api/koperasi/shu/distribusi`
    - **Request:** _tanpa body_
    - **Response:**
      - `anggota` - nama anggota.
      - `jumlah` - jumlah SHU yang diterima.
      - `status` - status pembayaran.
- **Format Data**:

  ```json
  {
    "stats": {
      "total": 0,
      "bagianAnggota": 0,
      "bagianModal": 0
    },
    "history": [
      {
        "tahun": 0,
        "total": 0
      }
    ],
    "distribusi": [
      {
        "anggota": "string",
        "jumlah": 0,
        "status": "string"
      }
    ]
  }
  ```
