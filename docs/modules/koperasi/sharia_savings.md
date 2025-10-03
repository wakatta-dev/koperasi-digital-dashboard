# Sharia Savings API — Panduan Integrasi Frontend (Singkat)

Modul simpanan syariah koperasi mengelola setoran berdasarkan kontrak (wadiah/mudharabah dsb.), verifikasi setoran manual, penarikan, persetujuan penarikan, distribusi bagi hasil, dan riwayat transaksi. Endpoint berada di prefix `/api/koperasi/sharia_savings`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; akses dibatasi role keuangan koperasi.

## Ringkasan Endpoint

- POST `/api/koperasi/sharia_savings/:member_id/deposit` — `petugas simpanan`: catat setoran (`contract_type`, `method`) → 201 `APIResponse<Transaction>`
- POST `/api/koperasi/sharia_savings/:transaction_id/verify` — `bendahara`: verifikasi setoran manual → 200 `APIResponse<Transaction>`
- POST `/api/koperasi/sharia_savings/:member_id/withdraw` — `anggota/petugas`: ajukan penarikan kontrak → 201 `APIResponse<Transaction>`
- POST `/api/koperasi/sharia_savings/:transaction_id/approve` — `bendahara`: setujui penarikan → 200 `APIResponse<Transaction>`
- POST `/api/koperasi/sharia_savings/:member_id/profit` — `bendahara`: distribusi bagi hasil → 201 `APIResponse<Transaction>`
- GET `/api/koperasi/sharia_savings/:member_id/transactions?term=&type=&start=&end=&limit=&cursor=` — `petugas simpanan`: riwayat transaksi → 200 `APIResponse<Transaction[]>`
- GET `/api/koperasi/sharia_savings/:transaction_id/proof` — `anggota/petugas`: bukti transaksi → 200 `APIResponse<{ proof: string }>`

> `contract_type` digunakan untuk memisahkan jenis akad (mis. `mudharabah`, `wadiah`). Distribusi bagi hasil akan membuat transaksi cash-out di modul finance jika tersedia.

## Skema Data Ringkas

- Account: `id:number`, `member_id:number`, `contract_type:string`, `balance:number`, audit timestamp.
- Transaction: `id:number`, `account_id:number`, `contract_type:string`, `type:'deposit'|'withdrawal'|'profit'`, `amount:number`, `method:string`, `status:'pending'|'verified'|'approved'`, `fee:number`, `member_share?:number`, `coop_share?:number`, `proof_url?:string`, `created_at:Rfc3339`, `updated_at:Rfc3339`.

> Setoran non-manual diverifikasi otomatis dan langsung menambah saldo; penarikan membutuhkan persetujuan manual agar saldo tidak negatif.

## Payload Utama

- DepositRequest:
  - `{ contract_type: string, amount: number, method: string, fee?: number }`

- WithdrawalRequest:
  - `{ contract_type: string, amount: number, method: string, fee?: number }`

- ProfitShareRequest:
  - `{ contract_type: string, amount: number, method: string, member_share?: number, coop_share?: number }`

- Filter transaksi: `term` (ID/metode/kontrak), `type` (`deposit|withdrawal|profit`), `start`, `end` (`YYYY-MM-DD`), `limit` (default 10), `cursor` (ID transaksi).

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dan riwayat transaksi menyertakan `meta.pagination`.
- Bukti transaksi mengembalikan objek `{ proof: string }` dengan URL/identifier slip.

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

type Transaction = {
  id: number;
  account_id: number;
  contract_type: string;
  type: 'deposit' | 'withdrawal' | 'profit';
  amount: number;
  method: string;
  status: 'pending' | 'verified' | 'approved';
  fee: number;
  member_share?: number;
  coop_share?: number;
  proof_url?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type DepositRequest = {
  contract_type: string;
  amount: number;
  method: string;
  fee?: number;
};

type WithdrawalRequest = {
  contract_type: string;
  amount: number;
  method: string;
  fee?: number;
};

type ProfitShareRequest = {
  contract_type: string;
  amount: number;
  method: string;
  member_share?: number;
  coop_share?: number;
};

type TransactionListResponse = APIResponse<Transaction[]>;
type TransactionResponse = APIResponse<Transaction>;
type ProofResponse = APIResponse<{ proof: string }>;
```

> Pastikan FE memvalidasi nominal terhadap saldo sebelum mengirim penarikan agar mengurangi error `insufficient balance`.

## Paginasi (Cursor)

- `GET /:member_id/api/transactions` memakai cursor numerik (`id`). Gunakan `meta.pagination.next_cursor` untuk halaman berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (`amount <= 0`, kontrak kosong, filter tanggal salah, cursor bukan angka).
- 401/403: user bukan bagian tenant/role keuangan.
- 404: akun atau transaksi tidak ditemukan.
- 409: saldo tidak mencukupi saat penarikan.
- 500: kegagalan update saldo atau pencatatan transaksi.

## Checklist Integrasi FE

- Tampilkan status transaksi dan aksi lanjutan (`pending` -> perlu verifikasi/approval).
- Gunakan filter kontrak dan rentang tanggal untuk memudahkan pencarian transaksi.
- Pastikan bagi hasil (`profit`) menampilkan pembagian `member_share` dan `coop_share` bila tersedia.
- Sediakan akses cepat ke bukti transaksi setelah status berubah.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/sharia_savings/handler.go` — endpoint dan validasi HTTP.
- `internal/modules/koperasi/sharia_savings/service.go` — logika setoran, penarikan, profit sharing.
- `internal/modules/koperasi/sharia_savings/repository.go` — kueri akun & transaksi simpanan syariah.
