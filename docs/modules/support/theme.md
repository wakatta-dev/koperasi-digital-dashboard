# Theme Templates API — Panduan Integrasi Frontend (Singkat)

Modul theme menyediakan katalog template landing/branding yang dapat dipakai tenant dan memungkinkan vendor untuk membuat serta mengunggah aset template. Endpoint berada di prefix `/api/theme-templates` sebagaimana registrasi router di `internal/modules/registry.go` dan `internal/modules/support/theme/routes.go`, dengan guard vendor untuk operasi mutasi.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json` (untuk POST/PUT) atau `multipart/form-data` (upload logo/banner)
- `Accept`: `application/json`
- Tidak ada header tambahan; middleware `TenantType(vendor)` membatasi mutasi untuk vendor saja.

## Ringkasan Endpoint

- GET `/api/theme-templates` — `tenant/vendor`: daftar template → 200 `APIResponse<Template[]>`
- GET `/api/theme-templates/:id` — `tenant/Vendor`: detail template → 200 `APIResponse<Template>`
- POST `/api/theme-templates` — `vendor admin`: buat template → 201 `APIResponse<Template>`
- PUT `/api/theme-templates/:id` — `vendor admin`: perbarui template → 200 `APIResponse<Template>`
- DELETE `/api/theme-templates/:id` — `vendor admin`: hapus template → 200 `APIResponse<{ id: number }>`
- POST `/api/theme-templates/:id/logo` — `vendor admin`: upload logo (≤2 MB, JPG/JPEG/PNG/SVG/WEBP) → 200 `APIResponse<Template>`
- POST `/api/theme-templates/:id/banner` — `vendor admin`: upload banner (≤2 MB, JPG/JPEG/PNG/SVG/WEBP) → 200 `APIResponse<Template>`

> Endpoint daftar tidak menggunakan paginasi; seluruh template dikembalikan sekaligus. Mutasi module menyertakan field `modules` agar FE bisa memperbarui tampilan tanpa fetch ulang.

## Skema Data Ringkas

- Template: `id:number`, `name:string`, `code:string`, `description?:string`, `primary_color?:string`, `secondary_color?:string`, `layout?:string`, `landing_content?:string`, `logo_url?:string`, `banner_url?:string`, `modules:TemplateModule[]`, audit timestamp.
- TemplateModule: `id:number`, `template_id:number`, `module:string`, `allowed_fields:string[]`, audit timestamp.

> Field `allowed_fields` berupa array string yang menentukan atribut modul yang bisa dioverride oleh tenant.

## Payload Utama

- TemplateRequest (POST/PUT `/api/theme-templates`):
  - `{ name: string, code: string, description?: string, primary_color?: string, secondary_color?: string, layout?: string, landing_content?: string, logo_url?: string, banner_url?: string, modules?: { module: string, allowed_fields?: string[] }[] }`

- UploadLogo / UploadBanner (POST `/api/theme-templates/:id/logo` dan `/api/theme-templates/:id/banner`, multipart): field form `file` yang berisi gambar ≤2 MB dengan MIME `image/png` | `image/jpeg` | `image/jpg` | `image/svg+xml` | `image/webp`.

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<Template>` kecuali DELETE yang mengirim payload ringkas (`{ id }`).
- Upload aset mengembalikan template terbaru dengan URL logo/banner yang telah diperbarui.

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

type TemplateModule = {
  id: number;
  template_id: number;
  module: string;
  allowed_fields: string[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type Template = {
  id: number;
  name: string;
  code: string;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  layout?: string;
  landing_content?: string;
  logo_url?: string;
  banner_url?: string;
  modules: TemplateModule[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type TemplateRequest = {
  name: string;
  code: string;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  layout?: string;
  landing_content?: string;
  logo_url?: string;
  banner_url?: string;
  modules?: Array<{ module: string; allowed_fields?: string[] }>;
};

type TemplateListResponse = APIResponse<Template[]>;
type TemplateDetailResponse = APIResponse<Template>;
```

> Saat mengunggah aset, gunakan API upload langsung (multipart) dan tampilkan progres agar sesuai dengan batas ukuran tipe file yang diterapkan backend.

## Paginasi (Cursor)

- Tidak ada paginasi; daftar template dikembalikan penuh.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (kode duplikat, warna salah, file terlalu besar atau format tidak didukung).
- 403: role bukan vendor admin ketika melakukan mutasi.
- 404: template tidak ditemukan saat update/delete/upload.
- 500: kegagalan penyimpanan atau upload storage.

## Checklist Integrasi FE

- Validasi unik `code` sebelum submit untuk menghindari konflik.
- Pastikan file upload tidak melebihi 2 MB dan tipe MIME sesuai sebelum mengirim.
- Tampilkan peringatan bahwa menghapus template akan menghapus modul terkait (OnDelete cascade).
- Setelah membuat template, redirect ke halaman detail dan izinkan upload logo/banner secara terpisah.

## Catatan QA

- Payload dan respons telah diselaraskan dengan jalur `/api/theme-templates`. Mohon QA memverifikasi dokumentasi ini.

## Tautan Teknis (Opsional)

- `internal/modules/support/theme/handler.go` — implementasi endpoint dan validasi upload.
- `internal/modules/support/theme/service.go` — logika penyimpanan template & integrasi storage.
- `internal/modules/support/theme/entity.go` — struktur `Template` dan `TemplateModule`.
