# Loan API — Panduan Integrasi Frontend (Singkat)

Modul pinjaman koperasi menyediakan alur pengajuan, persetujuan, pencairan, penjadwalan cicilan, pembayaran cicilan, hingga penerbitan surat pelunasan. Seluruh endpoint berada di bawah prefix `/api/koperasi/loans` dan mensyaratkan tenant bertipe `koperasi`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; role keuangan/pinjaman tenant menangani mutasi.

## Ringkasan Endpoint

- POST `/api/koperasi/loans/apply` — `petugas pinjaman`: ajukan pinjaman anggota → 201 `LoanApplication`
- POST `/api/koperasi/loans/:id/approve` — `komite pinjaman`: setujui pengajuan → 200 `LoanApplication`
- POST `/api/koperasi/loans/:id/disburse` — `bendahara`: cairkan pinjaman (`method`) → 204
- GET `/api/koperasi/loans/:id/installments?term=&status=&due_date=&limit=&cursor=` — `petugas pinjaman`: daftar angsuran → 200 `APIResponse<LoanInstallment[]>`
- POST `/api/koperasi/loans/installments/:id/pay` — `bendahara`: catat pembayaran angsuran → 201 `APIResponse<LoanInstallment>`
- GET `/api/koperasi/loans/:id/release-letter` — `petugas pinjaman`: unduh surat pelunasan terbaru → 200 `APIResponse<LoanReleaseLetter>`
- GET `/api/koperasi/loans/:id/release-letter/history` — `petugas pinjaman`: riwayat surat pelunasan → 200 `APIResponse<LoanReleaseLetter[]>`

> Endpoint memakai ID numerik. Pencairan akan otomatis membuat transaksi keuangan dan memperbarui status menjadi `disbursed` bila modul finance aktif.

## Skema Data Ringkas

- LoanApplication: `id:number`, `tenant_id:number`, `member_id:number`, `amount:number`, `tenor:number`, `rate:number`, `purpose:string`, `status:'pending'|'approved'|'rejected'|'disbursed'`, `created_at:Rfc3339`, `installments:LoanInstallment[]`
- LoanInstallment: `id:number`, `loan_id:number`, `due_date:Rfc3339`, `amount:number`, `paid_amount:number`, `status:'unpaid'|'paid'|'overdue'`, `penalty:number`, `paid_at?:Rfc3339`
- LoanReleaseLetter: `id:number`, `loan_id:number`, `content:string`, `generated_at:Rfc3339`

> Service otomatis memperbarui status `overdue` dan menghitung penalti berdasarkan `penaltyRate` (1% per hari) sebelum daftar angsuran ditampilkan.

## Payload Utama

- ApplyRequest:
  - `{ member_id: number, amount: number, tenor: number, rate: number, purpose?: string }`

- Disbursement payload:
  - `{ method: string }` (contoh `cash`, `transfer`).

- PaymentRequest:
  - `{ amount: number, date: Rfc3339String, method: string }`

- Filter angsuran (`GET /api/koperasi/loans/:id/installments`): `term` (ID/status), `status`, `due_date` (`YYYY-MM-DD`), `limit` (default 10), `cursor` (ID angsuran).

## Bentuk Response

- `Apply/Approve` mengembalikan objek `LoanApplication` langsung (bukan `APIResponse`) mengikuti handler legacy.
- Endpoint list (`installments`, `release-letter/history`) mengembalikan `APIResponse` dengan `meta.pagination` (`next_cursor`, `has_next`).
- Pencairan tanpa error hanya mengembalikan HTTP 204 tanpa body.

## TypeScript Types (Request & Response)

```ts
type Rfc3339String = string;

type Pagination = {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
};

type Meta = {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
};

type LoanApplication = {
  id: number;
  tenant_id: number;
  member_id: number;
  amount: number;
  tenor: number;
  rate: number;
  purpose?: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  created_at: Rfc3339String;
  installments: LoanInstallment[];
};

type LoanInstallment = {
  id: number;
  loan_id: number;
  due_date: Rfc3339String;
  amount: number;
  paid_amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  penalty: number;
  paid_at?: Rfc3339String;
};

type LoanReleaseLetter = {
  id: number;
  loan_id: number;
  content: string;
  generated_at: Rfc3339String;
};

type ApplyRequest = {
  member_id: number;
  amount: number;
  tenor: number;
  rate: number;
  purpose?: string;
};

type DisbursementRequest = {
  method: string;
};

type PaymentRequest = {
  amount: number;
  date: Rfc3339String;
  method: string;
};

type InstallmentListResponse = APIResponse<LoanInstallment[]>;
type ReleaseLetterResponse = APIResponse<LoanReleaseLetter>;
type ReleaseLetterHistoryResponse = APIResponse<LoanReleaseLetter[]>;
```

> Hasil `Approve` memuat array angsuran yang baru dibuat; FE dapat langsung menampilkan jadwal cicilan tanpa memanggil endpoint lain.

## Paginasi (Cursor)

- `GET /api/koperasi/loans/:id/installments` dan `/api/koperasi/loans/:id/release-letter/history` memakai cursor numerik (`id`). Simpan `meta.pagination.next_cursor` untuk permintaan berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (amount/tenor <= 0, `due_date` salah format, cursor bukan angka).
- 401/403: role/operator tidak memiliki akses pinjaman.
- 404: pinjaman/angsuran tidak ditemukan.
- 409: penilaian risiko menolak pinjaman (`loan rejected by risk engine`).
- 500: kegagalan pencairan (integrasi finance) atau penyimpanan data.

## Checklist Integrasi FE

- Validasi sisi klien untuk amount & tenor sebelum kirim agar mengurangi error 400.
- Tampilkan status pinjaman (`pending`, `approved`, `disbursed`) dan tampilkan aksi lanjutan sesuai status.
- Saat membayar angsuran, update daftar angsuran secara optimistik dan refresh jika backend menambahkan penalti.
- Sertakan opsi unduh surat pelunasan ketika status `disbursed` dan saldo angsuran nol.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/loan/handler.go` — definisi endpoint HTTP.
- `internal/modules/koperasi/loan/service.go` — logika persetujuan, pencairan, dan penalti.
- `internal/modules/koperasi/loan/repository.go` — kueri angsuran & surat pelunasan.
