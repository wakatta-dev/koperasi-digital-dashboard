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

## `GET /api/koperasi/dashboard/stats`

### Request

```
GET /api/koperasi/dashboard/stats
```

### Response

Objek `stats` dengan ringkasan angka penting koperasi.

```json
{
  "anggota": 0,
  "simpanan": 0,
  "pinjaman": 0,
  "shu": 0
}
```

## `GET /api/koperasi/activities`

### Request

```
GET /api/koperasi/activities
```

### Response

Daftar aktivitas terbaru yang terjadi di koperasi.

```json
[
  {
    "id": 0,
    "deskripsi": "string",
    "tanggal": "YYYY-MM-DD"
  }
]
```

## `GET /api/koperasi/agendas`

### Request

```
GET /api/koperasi/agendas
```

### Response

Agenda mendatang seperti RAT dan pembagian SHU.

```json
[
  {
    "id": 0,
    "judul": "string",
    "tanggal": "YYYY-MM-DD"
  }
]
```
