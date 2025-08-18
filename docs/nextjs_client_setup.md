# Persiapan Client Next.js untuk Mengakses API

Dokumen ini menjelaskan hal-hal yang perlu dipersiapkan oleh aplikasi Next.js agar dapat berkomunikasi dengan API pada proyek ini.

## Prasyarat

- Node.js 18 atau lebih baru
- Next.js 14 atau lebih baru
- Browser modern yang mendukung `fetch`

## Konfigurasi Lingkungan

Atur variabel lingkungan berikut di proyek Next.js:

- `NEXT_PUBLIC_API_URL` &ndash; URL dasar API, misalnya `http://localhost:8080`
- `NEXT_PUBLIC_TENANT_ID` &ndash; ID tenant yang digunakan ketika tidak memakai domain khusus

Contoh `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_TENANT_ID=tenant-id-contoh
```

## Autentikasi

1. Lakukan request `POST /auth/login` dengan email dan password untuk mendapatkan token JWT.
2. Simpan token pada cookie atau `localStorage`.
3. Sertakan token pada setiap request menggunakan header:
   - `Authorization: Bearer <token>`
   - `X-Tenant-ID: <tenant-id>`

## Contoh Pemanggilan API

```ts
const api = process.env.NEXT_PUBLIC_API_URL;
const tenant = process.env.NEXT_PUBLIC_TENANT_ID;

export async function fetchUsers() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${api}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Tenant-ID": tenant,
    },
  });
  if (!res.ok) throw new Error("Request gagal");
  return res.json();
}
```

## Referensi

- [API Reference](api-references.md)
- [Panduan Pengguna](user_guide.md)
