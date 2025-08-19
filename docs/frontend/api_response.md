# Standar Response API

Semua endpoint harus mengembalikan struktur JSON berikut untuk menjaga konsistensi respons:

```json
{
  "success": true,
  "message": "string",
  "data": [],
  "meta": {
    "pagination": {
      "next_cursor": "string|null",
      "prev_cursor": "string|null",
      "has_next": true,
      "has_prev": true,
      "limit": 10
    },
    "request_id": "uuid",
    "timestamp": "ISO8601"
  },
  "errors": null
}
```

## Contoh Response Sukses

```json
{
  "success": true,
  "message": "list of products",
  "data": [
    {"id": 1, "name": "Product A"},
    {"id": 2, "name": "Product B"}
  ],
  "meta": {
    "pagination": {
      "next_cursor": "cursor2",
      "prev_cursor": null,
      "has_next": true,
      "has_prev": false,
      "limit": 2
    },
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-08-26T12:34:56Z"
  },
  "errors": null
}
```

## Contoh Response Error

```json
{
  "success": false,
  "message": "validation error",
  "data": null,
  "meta": {
    "pagination": null,
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-08-26T12:34:56Z"
  },
  "errors": {
    "email": ["Email is required", "Email format is invalid"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

## Parsing di Frontend

Contoh penggunaan `fetch` di TypeScript untuk membaca `data`, `meta.pagination`, dan `errors`:

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: {
    pagination?: {
      next_cursor: string | null;
      prev_cursor: string | null;
      has_next: boolean;
      has_prev: boolean;
      limit: number;
    } | null;
    request_id: string;
    timestamp: string;
  };
  errors?: Record<string, string[]> | null;
}

async function getProducts() {
  const res = await fetch('/api/products');
  const json: ApiResponse<Product[]> = await res.json();

  if (json.success) {
    const items = json.data;
    const pageInfo = json.meta.pagination;
    console.log('Next cursor:', pageInfo?.next_cursor);
  } else {
    console.error('Errors:', json.errors);
  }
}
```

## Utilitas TypeScript

```ts
export function ensureSuccess<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    const msg =
      Object.entries(res.errors ?? {})
        .map(([field, errs]) => `${field}: ${errs.join(', ')}`)
        .join('; ') || res.message;
    throw new Error(msg);
  }
  return res.data as T;
}
```

## Timestamp & Request ID

- `timestamp` menggunakan format ISO8601 UTC, contoh `2024-08-26T12:34:56Z`.
- `request_id` adalah UUID v4 yang unik per permintaan.

Gunakan kedua nilai tersebut untuk logging client-side: simpan `request_id` pada log setiap request dan bandingkan `timestamp` dengan waktu lokal untuk mendeteksi latency atau sinkronisasi jam.

