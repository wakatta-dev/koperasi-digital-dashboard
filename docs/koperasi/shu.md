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
  - `GET /api/koperasi/shu/history`
  - `GET /api/koperasi/shu/distribusi`
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
