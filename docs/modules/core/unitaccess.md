# Unit Access Module — Panduan Integrasi Frontend (Singkat)

Modul unit access tidak mengekspos endpoint HTTP; ia berupa service internal yang memvalidasi akses business unit untuk modul lain (finance, marketplace, inventory, POS). Dokumentasi ini menjelaskan implikasi terhadap header atau payload yang dikirim FE.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Tidak ada header langsung; modul bekerja di balik layar saat endpoint lain membaca `X-Business-Unit-ID` atau field `business_unit_id`.

## Ringkasan Endpoint

- Tidak ada endpoint HTTP publik. Validasi dipanggil oleh service backend ketika modul lain membutuhkan verifikasi unit.

> Jika unit tidak valid atau user tidak memiliki akses, service melempar `ErrForbidden` atau `ErrNotFound` yang diterjemahkan menjadi HTTP 403/400 pada modul pemanggil.

## Skema Data Ringkas

- `ErrForbidden`: error untuk akses unit yang tidak diizinkan.
- `ErrNotFound`: error ketika unit tidak ditemukan dalam tenant.
- Service interface:
  - `ValidateTenantUnit(ctx, tenantID, unitID)` — memastikan unit valid untuk tenant.
  - `AccessibleUnitIDs(ctx, tenantID, userID, role)` — mengembalikan daftar unit yang boleh diakses user sesuai peran.

> Modul seperti finance dan marketplace menggunakan daftar unit tersebut untuk memfilter data dan menentukan apakah `business_unit_id` wajib.

## Payload Utama

- Tidak ada payload langsung. Ikuti dokumentasi modul terkait untuk pengiriman `X-Business-Unit-ID` atau field `business_unit_id` pada request.

## Bentuk Response

- Tidak berlaku. Modul lain akan mengembalikan `APIResponse<T>` dengan error map (`authorization`, `business_unit`) saat menerima error dari unit access.

## TypeScript Types (Request & Response)

```ts
// Contoh tipe utilitas di FE untuk menyelaraskan error unit access
export type UnitAccessError = 'business unit access forbidden' | 'business unit not found';

export type UnitAccessService = {
  validateTenantUnit: (tenantId: number, unitId: number) => Promise<void>;
  accessibleUnitIDs: (tenantId: number, userId: number, role: string) => Promise<number[]>;
};
```

> FE tidak memanggil service ini secara langsung, tetapi tipe di atas membantu menyelaraskan pesan error pada lapisan UI.

## Paginasi (Cursor)

- Tidak berlaku.

## Error Singkat yang Perlu Ditangani

- `ErrForbidden` → modul pemanggil biasanya mengembalikan 403 (`authorization`).
- `ErrNotFound` → modul pemanggil mengembalikan 400 (`business_unit_id` invalid).

## Checklist Integrasi FE

- Selalu kirim header `X-Business-Unit-ID` atau field `business_unit_id` saat modul menandainya wajib (contoh BUMDes, POS, marketplace, finance).
- Batasi pilihan unit di UI sesuai role agar user tidak memilih unit yang tidak boleh diakses.
- Tangani error `authorization`/`business_unit` dengan menyarankan user memilih unit lain atau meminta akses.

## Tautan Teknis (Opsional)

- `internal/modules/core/unitaccess/unitaccess.go` — definisi interface dan error unit access.
