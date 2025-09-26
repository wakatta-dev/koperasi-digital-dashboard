# Financial Reports API — Panduan Integrasi Frontend (Singkat)

Modul laporan keuangan koperasi menyediakan laporan neraca, laba rugi, dan arus kas dengan memanfaatkan service laporan inti. Endpoint berada di prefix `/koperasi/financial-reports` dan hanya dapat diakses role keuangan koperasi.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; role `SuperAdminKoperasi|AdminKeuangan|Bendahara` wajib.

## Ringkasan Endpoint

- GET `/koperasi/financial-reports/balance-sheet?start=&end=` — laporan neraca → 200 `APIResponse<BalanceSheetReport>`
- GET `/koperasi/financial-reports/profit-loss?start=&end=` — laporan laba rugi → 200 `APIResponse<ProfitLossReport>`
- GET `/koperasi/financial-reports/cash-flow?start=&end=` — laporan arus kas → 200 `APIResponse<CashflowReport>`

> Parameter `start` dan `end` opsional (`YYYY-MM-DD`). Jika tidak diisi, backend menggunakan rentang default (tahun berjalan).

## Skema Data Ringkas

- BalanceSheetReport: `assets:{ current:number, fixed:number, total:number }`, `liabilities:{ short_term:number, long_term:number, total:number }`, `equity:number`, `data:Record<string,number>`
- ProfitLossReport: `revenue:number`, `expense:number`, `net_income:number`, `breakdown:Array<{ account:string, amount:number }>`
- CashflowReport: `operating:number`, `investing:number`, `financing:number`, `closing_balance:number`, `lines:Array<{ account:string, amount:number }>`

> Struktur laporan mengikuti service `internal/modules/core/report`. FE dapat langsung memanfaatkan shape tersebut untuk visualisasi tabel/grafik.

## Payload Utama

- Tidak ada body request; gunakan query `start` dan `end` (`YYYY-MM-DD`).

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` tanpa `meta.pagination`.

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

type BalanceSheetReport = {
  assets: {
    current: number;
    fixed: number;
    total: number;
  };
  liabilities: {
    short_term: number;
    long_term: number;
    total: number;
  };
  equity: number;
  data: Record<string, number>;
};

type ProfitLossReport = {
  revenue: number;
  expense: number;
  net_income: number;
  breakdown: Array<{ account: string; amount: number }>;
};

type CashflowReport = {
  operating: number;
  investing: number;
  financing: number;
  closing_balance: number;
  lines: Array<{ account: string; amount: number }>;
};

type BalanceSheetResponse = APIResponse<BalanceSheetReport>;
type ProfitLossResponse = APIResponse<ProfitLossReport>;
type CashflowResponse = APIResponse<CashflowReport>;
```

> Pastikan FE menampilkan periode laporan (rentang `start`–`end`) agar pengguna memahami cakupan data.

## Paginasi (Cursor)

- Tidak ada paginasi karena laporan dikembalikan sebagai satu objek.

## Error Singkat yang Perlu Ditangani

- 400: format tanggal tidak valid (`invalid start/end`).
- 401/403: role tidak memiliki izin keuangan.
- 500: kegagalan generasi laporan (mis. data keuangan kosong atau service inti error).

## Checklist Integrasi FE

- Sediakan filter periode (tgl awal/akhir) sebelum memanggil endpoint.
- Tampilkan indikator loading karena laporan dapat memerlukan waktu agregasi.
- Gunakan hasil `data/breakdown/lines` untuk menampilkan rincian akun.
- Simpan response agar pengguna dapat mengunduh atau melihat kembali tanpa memanggil ulang API secara berlebihan.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/report/handler.go` — implementasi HTTP.
- `internal/modules/koperasi/report/service.go` — delegasi ke service laporan inti.
