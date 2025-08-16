# Harga Bertingkat

**Path:** `/umkm/harga-bertingkat`

**Deskripsi:** Halaman untuk mengelola harga produk berdasarkan tingkat pelanggan.

**Komponen Utama:**
- Daftar tingkat pelanggan lengkap dengan diskon dan anggota.
- Pencarian produk.
- Tabel harga produk untuk setiap tingkat pelanggan.

**Endpoint:** `GET /api/umkm/pricing-tiers`

- **Request:** _tanpa parameter_
- **Response:**
  - `tier`: Nama tingkat pelanggan.
  - `diskon`: Persentase diskon.
  - `anggota`: Jumlah anggota pada tingkat tersebut.
  - `produk`: Daftar produk dengan harga khusus per tingkat.

**Format Data:**
```json
[
  {
    "tier": "Gold",
    "diskon": 10,
    "anggota": 25,
    "produk": [
      { "id": 1, "nama": "Produk A", "harga": 9000 }
    ]
  }
]
```
