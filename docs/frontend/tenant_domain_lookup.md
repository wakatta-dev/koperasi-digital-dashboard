# Tenant Domain Lookup

Endpoint publik ini memetakan domain aplikasi ke tenant dan memberikan informasi tenant untuk digunakan pada permintaan berikutnya.

## GET `/api/tenant/by-domain`

- Handler ditambahkan melalui fungsi `RegisterPublicRoutes` yang mendaftarkan `GET /tenant/by-domain`
- Query `domain` digunakan untuk mencari tenant pada kolom `domain`
- Respons berisi `tenant_id`, `nama`, `type`, dan status aktif/nonaktif

Contoh permintaan:

```
GET /api/tenant/by-domain?domain=contoh.coop
```

Contoh respons:

```json
{
  "success": true,
  "message": "success",
  "data": {
    "tenant_id": 42,
    "nama": "Koperasi Contoh",
    "type": "koperasi",
    "status": "aktif"
  }
}
```

## Header `X-Tenant-ID`

Setelah mendapatkan `tenant_id` dari endpoint di atas, sertakan header berikut pada semua permintaan API berikutnya:

```
X-Tenant-ID: <tenant_id>
```

Middleware `TenantContext` membaca header ini (atau hostname) untuk men-set konteks tenant, sedangkan `TenantIsolation` memastikan pengguna hanya mengakses data milik tenant tersebut.

## Next.js bootstrap example

Contoh utilitas Next.js untuk memuat tenant berdasarkan domain:

```javascript
// pages/_app.js atau komponen yang menggunakan getServerSideProps
export async function getServerSideProps({ req }) {
  const host = req.headers.host;
  const res = await fetch(`${process.env.API_URL}/tenant/by-domain?domain=${host}`);
  const { data } = await res.json();
  const tenantId = data.tenant_id;
  return { props: { tenantId } };
}
```

Contoh middleware (Next.js 13+):

```javascript
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const host = req.headers.get('host');
  const res = await fetch(`${process.env.API_URL}/tenant/by-domain?domain=${host}`);
  if (res.ok) {
    const { data } = await res.json();
    req.headers.set('X-Tenant-ID', String(data.tenant_id));
  }
  return NextResponse.next({ request: { headers: req.headers } });
}
```

Untuk detail middleware, lihat juga [Tenant Middleware](tenant_middleware.md).
