# Harga Bertingkat

**Path:** `/umkm/harga-bertingkat`

**Deskripsi:** Halaman untuk mengelola harga produk berdasarkan tingkat pelanggan.

**Komponen Utama:**
- Daftar tingkat pelanggan lengkap dengan diskon dan anggota.
- Pencarian produk.
- Tabel harga produk untuk setiap tingkat pelanggan.

**Endpoint:** `GET /api/umkm/pricing-tiers`

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
