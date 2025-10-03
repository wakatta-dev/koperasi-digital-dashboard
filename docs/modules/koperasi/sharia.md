# Sharia Financing API — Panduan Integrasi Frontend (Singkat)

Modul pembiayaan syariah koperasi mengatur pengajuan, persetujuan, pencairan, pencatatan akad, cicilan, pembayaran cicilan, dan surat pelunasan untuk akad murabahah/ijarah/mudharabah/musyarakah/qardhul hasan. Endpoint berada di prefix `/api/koperasi/sharia-financings`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; role pembiayaan menangani mutasi.

## Ringkasan Endpoint

- POST `/api/koperasi/sharia-financings/apply` — `petugas pembiayaan`: ajukan pembiayaan syariah → 201 `ShariaFinancing`
- POST `/api/koperasi/sharia-financings/:id/approve` — `komite syariah`: setujui pengajuan → 200 `ShariaFinancing`
- POST `/api/koperasi/sharia-financings/:id/disburse` — `bendahara`: cairkan pembiayaan (`method`) → 204
- POST `/api/koperasi/sharia-financings/:id/akad` — `petugas pembiayaan`: simpan metadata akad (URL & tanggal tanda tangan) → 200 `ShariaDocument`
- GET `/api/koperasi/sharia-financings/:id/installments?term=&status=&due_date=&limit=&cursor=` — `petugas pembiayaan`: daftar angsuran → 200 `APIResponse<ShariaInstallment[]>`
- POST `/api/koperasi/sharia-financings/installments/:id/pay` — `bendahara`: catat pembayaran angsuran → 200 `ShariaInstallment`
- GET `/api/koperasi/sharia-financings/:id/release-letter` — `petugas pembiayaan`: surat pelunasan terakhir → 200 `map`
- GET `/api/koperasi/sharia-financings/:id/release-letter/history` — `petugas pembiayaan`: riwayat surat pelunasan → 200 `APIResponse<ShariaReleaseLetter[]>`

> Pencairan hanya dapat dilakukan setelah dokumen akad bertipe `akad` memiliki `file_url` dan `signed_at`. Status berubah menjadi `disbursed` setelah pencairan sukses.

## Skema Data Ringkas

- ShariaFinancing: `id:number`, `tenant_id:number`, `member_id:number`, `akad_type:'murabahah'|'ijarah'|'mudharabah'|'musyarakah'|'qardhul_hasan'`, `amount:number`, `margin:number`, `tenor:number`, `status:'pending'|'approved'|'rejected'|'disbursed'`, `installments:ShariaInstallment[]`
- ShariaInstallment: `id:number`, `financing_id:number`, `due_date:Rfc3339`, `amount:number`, `paid_amount:number`, `status:'unpaid'|'paid'|'overdue'`, `penalty:number`, `paid_at?:Rfc3339`
- ShariaDocument: `id:number`, `financing_id:number`, `type:string`, `file_url:string`, `signed_at?:Rfc3339`
- ShariaReleaseLetter: `id:number`, `financing_id:number`, `content:string`, `generated_at:Rfc3339`

> Penalti keterlambatan mengikuti konfigurasi `penaltyRates` per jenis akad (mis. murabahah 1% per hari).

## Payload Utama

- ApplyRequest:
  - `{ member_id: number, akad_type: string, amount: number, margin: number, tenor: number }`

- Disbursement payload:
  - `{ method: string }`

- AkadDocumentRequest (POST `/api/koperasi/sharia-financings/:id/akad`):
  - `{ file_url: string, signed_at?: Rfc3339String }`

- PaymentRequest:
  - `{ amount: number, date: Rfc3339String, method: string }`

- Filter angsuran: `term` (ID/status), `status`, `due_date` (`YYYY-MM-DD`), `limit` (default 10), `cursor` (ID angsuran).

## Bentuk Response

- `Apply/Approve` mengembalikan objek `ShariaFinancing` langsung (legacy). Daftar angsuran & surat pelunasan memakai `APIResponse<T>` dengan `meta.pagination`.
- Upload akad mengembalikan objek `ShariaDocument` hasil simpan.
- Endpoint release-letter memulangkan peta `{ message: string }` untuk konten surat terakhir.

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

type ShariaFinancing = {
  id: number;
  tenant_id: number;
  member_id: number;
  akad_type: string;
  amount: number;
  margin: number;
  tenor: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  created_at: Rfc3339String;
  installments: ShariaInstallment[];
};

type ShariaInstallment = {
  id: number;
  financing_id: number;
  due_date: Rfc3339String;
  amount: number;
  paid_amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  penalty: number;
  paid_at?: Rfc3339String;
};

type ShariaDocument = {
  id: number;
  financing_id: number;
  type: string;
  file_url: string;
  signed_at?: Rfc3339String;
};

type ShariaReleaseLetter = {
  id: number;
  financing_id: number;
  content: string;
  generated_at: Rfc3339String;
};

type ApplyRequest = {
  member_id: number;
  akad_type: string;
  amount: number;
  margin: number;
  tenor: number;
};

type AkadDocumentRequest = {
  file_url: string;
  signed_at?: Rfc3339String;
};

type PaymentRequest = {
  amount: number;
  date: Rfc3339String;
  method: string;
};

type InstallmentListResponse = APIResponse<ShariaInstallment[]>;
type ReleaseLetterHistoryResponse = APIResponse<ShariaReleaseLetter[]>;
```

> Pastikan FE menolak pencairan jika dokumen akad belum diunggah; backend memberikan error `akad document not signed`.

## Paginasi (Cursor)

- `GET /api/koperasi/sharia-financings/:id/installments` dan `/api/koperasi/sharia-financings/:id/release-letter/history` memakai cursor numerik (`id`). Gunakan `meta.pagination.next_cursor` untuk memuat halaman berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (`amount <= 0`, tanggal cicilan salah, cursor bukan angka) atau dokumen akad kosong.
- 401/403: user tidak memiliki akses pembiayaan syariah.
- 404: pembiayaan/angsuran/surat tidak ditemukan.
- 409: pengajuan ditolak risk engine (`financing rejected by risk engine`) atau pembiayaan aktif sudah ada.
- 500: kegagalan pencairan atau penyimpanan (integrasi finance/storage).

## Checklist Integrasi FE

- Validasi input pengajuan (akad, tenor, margin) sebelum submit.
- Tampilkan status pembiayaan (`pending`, `approved`, `disbursed`) beserta aksi selanjutnya.
- Pastikan langkah upload & tanda tangan akad selesai sebelum tombol pencairan diaktifkan.
- Saat menampilkan angsuran, sorot status `overdue` dan tampilkan penalti.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/sharia/handler.go` — definisi endpoint HTTP.
- `internal/modules/koperasi/sharia/service.go` — logika persetujuan, pencairan, penalti, dan akad.
- `internal/modules/koperasi/sharia/repository.go` — akses data pembiayaan, angsuran, dokumen, surat.
