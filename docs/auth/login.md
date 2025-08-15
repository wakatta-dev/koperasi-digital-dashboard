# Login

## Route
`/login`

Halaman ini menampilkan form masuk untuk seluruh tenant.

### Form Field
| Nama | Tipe | Deskripsi |
| --- | --- | --- |
| email | string | Alamat email terdaftar |
| password | string | Password akun |
| role | enum | Pilih salah satu: `vendor`, `koperasi`, `umkm`, `bumdes` |

### Endpoint & Format Data
**Endpoint**: `POST /auth/login`

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password",
  "role": "vendor"
}
```

**Response**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "1",
    "email": "vendor@test.com",
    "name": "Vendor User",
    "role": "vendor",
    "organizationId": "org1"
  }
}
```

### Alur Autentikasi
1. Pengguna mengisi ketiga field di atas lalu mengirimkan form.
2. Aplikasi memanggil fungsi `signIn` yang memverifikasi email, password, dan role.
3. Jika valid, sesi (`auth-session`) dibuat dan disimpan di `localStorage` serta cookie.
4. Pengguna diarahkan ke dashboard sesuai role (`/vendor/dashboard`, `/koperasi/dashboard`, `/umkm/dashboard`, atau `/bumdes/dashboard`).
5. Jika gagal, tampil pesan kesalahan.
