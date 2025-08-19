# Dokumentasi Frontend Next.js

Dokumen ini menjadi indeks untuk seluruh panduan integrasi aplikasi Next.js dengan Koperasi Digital Backend.

## Tujuan
Memberikan arahan dasar agar frontend dapat terhubung ke backend, meliputi konfigurasi lingkungan, penggunaan API, dan pemahaman format respons.

## Struktur Dokumentasi
- [Panduan Integrasi API](integration_guide.md) – langkah autentikasi, pencarian tenant, dan contoh endpoint.
- [Standar Response API](api_response.md) – format JSON yang konsisten di seluruh endpoint.
- [Refresh Token](refresh_token.md) – mekanisme pembaruan token akses.
- [Middleware Tenant](tenant_middleware.md) – cara backend membedakan tenant melalui header atau domain.

## Dasar Penggunaan API
- **Base URL:** `/api`
- **Header Wajib:**
  - `Authorization: Bearer <access_token>`
  - `X-Tenant-ID: <tenant_id>`
- **Format Respons:** JSON sesuai [Standar Response API](api_response.md).

## Prasyarat Lingkungan
- Node.js 18+
- Next.js 13+
- npm atau yarn

### Konfigurasi `.env`
Buat file `.env.local` pada proyek Next.js Anda dan isi alamat backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

Gunakan variabel tersebut saat melakukan request:

```ts
fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenant/by-domain?domain=foo`)
```

