# Dokumentasi Modul — Template Standar FE

Dokumen ini merangkum seluruh modul dan menautkan ke detail masing-masing, semuanya distandarkan untuk memudahkan integrasi frontend.

- Header Wajib konsisten (Authorization, X-Tenant-ID, Content-Type/Accept).
- Struktur dokumen per modul identik: Header Wajib, Ringkasan Endpoint, Skema Data Ringkas, Payload Utama, Bentuk Response, TypeScript Types, Paginasi (Cursor), Error Singkat, Checklist Integrasi FE, Tautan teknis.
- Response memakai `APIResponse<T>` untuk list/histori/umumnya; beberapa endpoint create/update tertentu mengembalikan objek langsung sesuai implementasi handler.

## Daftar Modul

- Core
  - [Auth](auth.md) - autentikasi dan manajemen token.
  - [Tenant](tenant.md) - pengelolaan data tenant.
  - [Roles & Permissions](authorization.md) - konfigurasi peran serta hak akses.
  - [Users](user.md) - manajemen pengguna dalam tenant.

- Finance & Billing
  - [Billing](billing.md) - penagihan paket dan pembayaran.
  - [Finance/Transactions](finance_transactions.md) - pencatatan transaksi keuangan.
  - [Cashbook](cashbook.md) - pencatatan kas manual.
  - [Reporting](reporting.md) - ringkasan laporan keuangan dan billing.
  - [Asset](asset.md) - manajemen aset tetap.
  - [SHU](shu.md) - perhitungan sisa hasil usaha.

- Operasional Anggota
  - [Membership](membership.md) - registrasi dan status anggota.
  - [Savings](savings.md) - transaksi simpanan anggota.
  - [Loan](loan.md) - pengajuan dan angsuran pinjaman.
  - [Sharia Financing](sharia.md) - pembiayaan syariah.
  - [Risk](risk.md) - penilaian risiko anggota.

- Governance & Support
  - [RAT](rat.md) - rapat anggota tahunan.
  - [Notifications](notification.md) - pengiriman notifikasi in-app.
  - [Ticket](ticket.md) - sistem tiket dukungan.
  - [Livechat](livechat.md) - komunikasi real-time dengan agen.
  - [Dashboard](dashboard.md) - ringkasan metrik operasional.
  - [Vendor Analytics & Usage](dashboard.md#vendor-analytics--usage) - statistik klien untuk vendor.

## Konvensi Umum

- Keamanan
  - Authorization: `Bearer <token>`
  - `X-Tenant-ID`: ID tenant (atau resolusi domain, bila diaktifkan)
- Paginasi
  - Semua endpoint list menggunakan query `cursor` & `limit`
  - Numerik: `cursor` berbasis integer (umumnya untuk entitas dengan PK auto-increment)
  - String: `cursor` berbasis UUID/string (umumnya untuk ID bertipe UUID)
- Response
  - `APIResponse` dengan bidang `data`, `meta.pagination` (bila ada), dan `errors` (bila ada)

## TypeScript Types Umum

Fragmen di bawah ini digunakan berulang pada semua modul.

```ts
export type Rfc3339String = string;

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}
```

File siap pakai: `docs/types/index.ts` berisi definisi yang sama untuk diimpor langsung pada proyek FE.

## Format Response Standar (APIResponse)

Semua endpoint mengembalikan struktur seragam berikut. Bidang `meta.pagination` hanya hadir pada endpoint listing.

```json
{
  "success": true,
  "message": "success",
  "data": {},
  "meta": {
    "request_id": "<uuid>",
    "timestamp": "2025-08-25T10:00:00Z",
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null,
      "has_next": false,
      "has_prev": false,
      "limit": 10
    }
  },
  "errors": null
}
```

Keterangan singkat:
- success: penanda keberhasilan.
- message: ringkas, umumnya "success" untuk 2xx.
- data: payload sesuai endpoint (objek/array/null saat gagal).
- meta.request_id: UUID untuk pelacakan request.
- meta.timestamp: waktu UTC RFC3339 saat response dibuat.
- meta.pagination: info paginasi cursor (`next_cursor`, `prev_cursor`, `has_next`, `has_prev`, `limit`).
- errors: detail kesalahan terstruktur (non-null saat gagal).
