# Branding API — Panduan Integrasi Frontend (Singkat)

Modul branding mengelola konfigurasi tampilan tenant (warna, logo, layout landing page) sekaligus daftar unit bisnis yang ditampilkan di landing page. Semua operasi berjalan di bawah prefix `/branding` dan berlaku untuk tenant non-vendor yang memiliki fitur branding aktif.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json` (untuk PUT/POST)
- `Accept`: `application/json`
- Tidak ada header tambahan; role admin/marketing tenant diwajibkan untuk mutasi.

## Ringkasan Endpoint

- GET `/branding` — `tenant admin`: ambil konfigurasi branding → 200 `APIResponse<Branding>`
- PUT `/branding` — `tenant admin`: buat/perbarui branding → 200 `APIResponse<Branding>`
- DELETE `/branding` — `tenant admin`: hapus branding → 200 `APIResponse<{ tenant_id: number }>`
- GET `/branding/units` — `tenant admin`: daftar landing unit → 200 `APIResponse<LandingUnit[]>`
- POST `/branding/units` — `tenant admin`: tambah landing unit → 201 `APIResponse<LandingUnit>`
- PUT `/branding/units/:id` — `tenant admin`: perbarui landing unit → 200 `APIResponse<LandingUnit>`
- DELETE `/branding/units/:id` — `tenant admin`: hapus landing unit → 200 `APIResponse<{ id: number }>`

> Endpoint landing unit tidak memakai paginasi; respons selalu mengembalikan seluruh unit milik tenant. Operasi landing section pada payload branding mendukung `add`, `update`, `reorder`, dan `delete` dalam satu request.

## Skema Data Ringkas

- Branding: `id:number`, `tenant_id:number`, `template_id?:number`, `primary_color?:string`, `secondary_color?:string`, `accent_color?:string`, `logo_url?:string`, `banner_url?:string`, `store_tagline?:string`, `layout?:string`, `landing_sections?:LandingSection[]`, audit timestamp.
- LandingSection: `id:string`, `title:string`, `type:string`, `content:string`, `media?:LandingMedia`, `cta?:LandingCTA`, `order:number`.
- LandingMedia: `type?:string`, `url:string`.
- LandingCTA: `label:string`, `url:string`.
- LandingUnit: `id:number`, `business_unit_id:number`, `description?:string`, `media?:LandingMedia`, `link_url?:string`, `business_unit_name?:string`, `business_unit_type?:string`, audit timestamp.

> Field branding tambahan seperti `tenant_name`, `domain`, `contact_email`, `contact_phone`, `address` dikembalikan hanya ketika service memerlukan data publik tambahan.

## Payload Utama

- BrandingRequest (PUT `/branding`):
  - `template_id?: number`, `primary_color?: string`, `secondary_color?: string`, `accent_color?: string`, `logo_url?: string`, `banner_url?: string`, `store_tagline?: string`, `layout?: string`, `landing_sections?: { add?: LandingSectionAdd[], update?: LandingSectionUpdate[], reorder?: LandingSectionReorder[], delete?: string[] }`
  - LandingSectionAdd: `{ title: string, type: string, content: string, media?: LandingMedia, cta?: LandingCTA, position?: number }`
  - LandingSectionUpdate: `{ id: string, title?: string, type?: string, content?: string, media?: LandingMedia, cta?: LandingCTA }`
  - LandingSectionReorder: `{ id: string, position: number }`

- LandingUnitRequest (POST/PUT `/branding/units`):
  - `{ business_unit_id: number, description?: string, media?: LandingMedia, link_url?: string }`

## Bentuk Response

- Seluruh endpoint mengembalikan `APIResponse<T>`; GET `/branding` mengirim `data = {}` jika tenant belum memiliki konfigurasi.
- Operasi hapus/mutasi menampilkan payload ringkas (`{ tenant_id }` atau `{ id }`) sebagai konfirmasi.

## TypeScript Types (Request & Response)

```ts
type Rfc3339String = string;

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type LandingMedia = {
  type?: string;
  url: string;
};

type LandingCTA = {
  label: string;
  url: string;
};

type LandingSection = {
  id: string;
  title: string;
  type: string;
  content: string;
  media?: LandingMedia;
  cta?: LandingCTA;
  order: number;
};

type LandingUnit = {
  id: number;
  tenant_id: number;
  business_unit_id: number;
  description?: string;
  media?: LandingMedia;
  link_url?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type Branding = {
  id: number;
  tenant_id: number;
  template_id?: number;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  logo_url?: string;
  banner_url?: string;
  store_tagline?: string;
  layout?: string;
  landing_sections?: LandingSection[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type LandingSectionAdd = {
  title: string;
  type: string;
  content: string;
  media?: LandingMedia;
  cta?: LandingCTA;
  position?: number;
};

type LandingSectionUpdate = {
  id: string;
  title?: string;
  type?: string;
  content?: string;
  media?: LandingMedia;
  cta?: LandingCTA;
};

type BrandingRequest = {
  template_id?: number;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  logo_url?: string;
  banner_url?: string;
  store_tagline?: string;
  layout?: string;
  landing_sections?: {
    add?: LandingSectionAdd[];
    update?: LandingSectionUpdate[];
    reorder?: Array<{ id: string; position: number }>;
    delete?: string[];
  };
};

type LandingUnitRequest = {
  business_unit_id: number;
  description?: string;
  media?: LandingMedia;
  link_url?: string;
};

type BrandingResponse = APIResponse<Branding>;
type LandingUnitListResponse = APIResponse<LandingUnit[]>;
```

> Gunakan union/partial agar FE dapat mengirim field opsional tanpa harus menyertakan seluruh struktur.

## Paginasi (Cursor)

- Tidak ada endpoint daftar yang menggunakan cursor/paginasi pada modul branding.

## Error Singkat yang Perlu Ditangani

- 400: body tidak valid (warna/URL salah format, `landing_sections` tidak mengikuti pola), atau unit bisnis tidak ditemukan.
- 401/403: konteks tenant hilang (`tenant missing`) atau role tidak diizinkan melakukan mutasi.
- 404: landing unit yang akan diubah/dihapus tidak ditemukan.
- 500: kegagalan internal (repositori, validasi template) — tampilkan pesan umum dan sarankan coba ulang.

## Checklist Integrasi FE

- Pastikan form branding memvalidasi URL/logo sebelum mengirim, terutama ukuran dan tipe file jika di-upload terpisah.
- Saat mengatur `landing_sections`, refleksikan hasil reorder secara lokal agar urutan UI konsisten dengan payload `reorder`.
- Filter pilihan `business_unit_id` sesuai akses user agar validasi backend tidak gagal.
- Setelah update branding berhasil, refresh cache front-end/landing agar perubahan langsung terlihat.

## Tautan Teknis (Opsional)

- `internal/modules/support/branding/handler.go` — implementasi endpoint & validasi request.
- `internal/modules/support/branding/service.go` — logika upsert branding dan landing sections.
- `internal/modules/support/branding/entity.go` — definisi entitas branding & landing unit.
