# Savings API — Panduan Integrasi Frontend (Singkat)

Modul simpanan koperasi menangani setoran, verifikasi setoran manual, penarikan, persetujuan penarikan, riwayat transaksi, serta bukti transaksi. Endpoint berada di prefix `/api/koperasi/savings` dan semua operasi dilakukan pada konteks anggota tertentu.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; role keuangan koperasi menangani mutasi.

## Ringkasan Endpoint

- POST `/api/koperasi/savings/:member_id/deposit` — `petugas simpanan`: catat setoran (`method`) → 201 `APIResponse<SavingsTransaction>`
- POST `/api/koperasi/savings/:transaction_id/verify` — `bendahara`: verifikasi setoran manual → 200 `APIResponse<SavingsTransaction>`
- POST `/api/koperasi/savings/:member_id/withdraw` — `anggota/petugas`: ajukan penarikan sukarela → 201 `APIResponse<SavingsTransaction>`
- POST `/api/koperasi/savings/:transaction_id/approve` — `bendahara`: setujui penarikan → 200 `APIResponse<SavingsTransaction>`
- GET `/api/koperasi/savings/:member_id/transactions?term=&type=&start=&end=&limit=&cursor=` — `petugas simpanan`: riwayat transaksi → 200 `APIResponse<SavingsTransaction[]>`
- GET `/api/koperasi/savings/:transaction_id/proof` — `anggota/petugas`: bukti transaksi → 200 `APIResponse<{ proof: string }>`

> Penarikan hanya berlaku untuk `simpanan_sukarela`. Setoran selain `manual` diverifikasi otomatis dan langsung menambah saldo serta membuat transaksi keuangan.

## Skema Data Ringkas

- SavingsAccount: `id:number`, `member_id:number`, `type:'simpanan_wajib'|'simpanan_pokok'|'simpanan_sukarela'`, `balance:number`, audit timestamp.
- SavingsTransaction: `id:number`, `account_id:number`, `amount:number`, `method:'manual'|'transfer'|'virtual_account'|...`, `status:'pending'|'verified'|'approved'`, `type:'setoran'|'penarikan'`, `fee:number`, `proof_url?:string`, `created_at:Rfc3339`, `updated_at:Rfc3339`.

> Field `proof_url` diisi setelah transaksi diverifikasi/ disetujui. Notifikasi disiapkan ketika transaksi berstatus `pending` sehingga petugas dapat menindak lanjuti.

## Payload Utama

- DepositRequest:
  - `{ type: string, amount: number, method: string, fee?: number }`

- WithdrawalRequest:
  - `{ type: 'simpanan_sukarela', amount: number, method: string, fee?: number }`

- Parameter riwayat transaksi: `term` (cari ID/metode), `type` (`setoran|penarikan`), `start`, `end` (`YYYY-MM-DD`), `limit` (default 10), `cursor` (ID transaksi).

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dengan `meta.pagination` pada riwayat transaksi.
- Setoran/penarikan mengembalikan objek transaksi terbaru sehingga UI dapat memperbarui daftar tanpa fetch ulang.

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

type SavingsTransaction = {
  id: number;
  account_id: number;
  amount: number;
  method: string;
  status: 'pending' | 'verified' | 'approved';
  type: 'setoran' | 'penarikan';
  fee: number;
  proof_url?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type DepositRequest = {
  type: string;
  amount: number;
  method: string;
  fee?: number;
};

type WithdrawalRequest = {
  type: 'simpanan_sukarela';
  amount: number;
  method: string;
  fee?: number;
};

type SavingsTransactionListResponse = APIResponse<SavingsTransaction[]>;
type SavingsTransactionResponse = APIResponse<SavingsTransaction>;
type SavingsProofResponse = APIResponse<{ proof: string }>;
```

> Gunakan `method` untuk membedakan sumber dana (manual, transfer, VA). Backend akan menolak jumlah penarikan melebihi saldo dengan pesan "insufficient balance".

## Paginasi (Cursor)

- `GET /api/koperasi/savings/:member_id/transactions` memakai cursor numerik (`id`) dengan `limit` default 10. Gunakan `meta.pagination.next_cursor` untuk memuat halaman berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (`amount <= 0`, tipe simpanan salah, tanggal filter tidak valid, cursor bukan angka).
- 401/403: user tidak memiliki akses ke anggota/tenant tersebut.
- 404: transaksi atau akun tidak ditemukan.
- 409: saldo tidak mencukupi saat penarikan.
- 500: kegagalan update saldo atau pengiriman notifikasi.

## Checklist Integrasi FE

- Tampilkan status dan langkah selanjutnya: `pending` → menunggu verifikasi/approval, `verified` atau `approved` → dana sudah ditambahkan/dikurangi.
- Terapkan filter tanggal & tipe pada riwayat untuk membantu audit.
- Validasi nominal penarikan terhadap saldo sebelum mengirim agar mengurangi error 409.
- Muat bukti transaksi setelah status berubah untuk menampilkan slip/bukti pembayaran kepada anggota.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/savings/handler.go` — endpoint dan validasi HTTP.
- `internal/modules/koperasi/savings/service.go` — bisnis setoran/penarikan, integrasi finance & notifikasi.
- `internal/modules/koperasi/savings/repository.go` — penyimpanan akun & transaksi simpanan.
