# RAT API — Panduan Integrasi Frontend (Singkat)

Modul RAT (Rapat Anggota Tahunan) koperasi mengatur penjadwalan RAT, pengiriman notifikasi, unggah dokumen, pemungutan suara, laporan, serta histori RAT. Seluruh endpoint berada di bawah prefix `/api/koperasi/rat`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; modul hanya aktif untuk tenant koperasi.

## Ringkasan Endpoint

- POST `/api/koperasi/rat` — `panitia RAT`: jadwalkan RAT → 201 `APIResponse<RAT>`
- POST `/api/koperasi/rat/:id/notify` — `panitia RAT`: kirim notifikasi RAT → 200 `APIResponse<{ status: string }>`
- POST `/api/koperasi/rat/:id/documents` — `panitia RAT`: unggah dokumen RAT → 201 `APIResponse<{ status: string }>`
- POST `/api/koperasi/rat/:id/voting` — `panitia RAT`: buat item voting → 201 `APIResponse<VotingItem>`
- POST `/api/koperasi/rat/voting/:item_id/vote` — `anggota`: kirim suara → 201 `APIResponse<{ status: string }>`
- GET `/api/koperasi/rat/voting/:item_id/result` — `panitia/anggota`: hasil voting → 200 `APIResponse<VotingResult>`
- GET `/api/koperasi/rat/:id/report` — `panitia RAT`: laporan RAT → 200 `APIResponse<RATReport>`
- GET `/api/koperasi/rat/history?term=&start_date=&end_date=&limit=&cursor=` — `panitia RAT`: histori RAT → 200 `APIResponse<RAT[]>`

> Endpoint voting membutuhkan item yang valid dan periode `open_at`/`close_at`; backend menolak suara di luar rentang tersebut.

## Skema Data Ringkas

- RAT: `id:number`, `tenant_id:number`, `year:number`, `date:Rfc3339`, `agenda:string`, `status:'scheduled'|'completed'`, `created_at:Rfc3339`, `updated_at:Rfc3339`
- VotingItem: `id:number`, `rat_id:number`, `question:string`, `type:'single_choice'|'multiple_choice'`, `options:Record<string,string>`, `open_at:Rfc3339`, `close_at:Rfc3339`
- VotingResult: `item_id:number`, `total_votes:number`, `summary:Array<{ option:string, count:number, percentage:number }>`
- RATReport: `rat:RAT`, `attendance:{ total_invited:number, attended:number }`, `votes:VotingResult[]`, `documents:string[]`

> Dokumen RAT disimpan dengan metadata (tipe & URL) dan diikutsertakan dalam laporan.

## Payload Utama

- CreateRATRequest:
  - `{ year: number, date: Rfc3339String, agenda?: string }`

- NotifyRATRequest:
  - `{ message: string, channels?: string[], email_recipients?: string[] }`

- UploadDocumentRequest:
  - `{ type: string, data: base64string }`

- CreateVotingItemRequest:
  - `{ question: string, type: string, options?: Record<string, unknown>, open_at: Rfc3339String, close_at: Rfc3339String }`

- VoteRequest:
  - `{ member_id: number, selected_option: string }`

- History query: `term` (agenda/tahun), `start_date`, `end_date`, `limit` (default 10), `cursor` (ID RAT).

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` dengan `meta.pagination` pada histori RAT.
- Voting hasil menampilkan rekap jumlah suara per opsi.
- Upload dokumen dan notifikasi mengembalikan payload ringkas `{ status: '...' }` sebagai konfirmasi.

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

type RAT = {
  id: number;
  tenant_id: number;
  year: number;
  date: Rfc3339String;
  agenda: string;
  status: 'scheduled' | 'completed';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type VotingItem = {
  id: number;
  rat_id: number;
  question: string;
  type: string;
  options?: Record<string, unknown>;
  open_at: Rfc3339String;
  close_at: Rfc3339String;
};

type VotingResult = {
  item_id: number;
  total_votes: number;
  summary: Array<{ option: string; count: number; percentage: number }>;
};

type RATReport = {
  rat: RAT;
  attendance: {
    total_invited: number;
    attended: number;
  };
  votes: VotingResult[];
  documents: string[];
};

type CreateRATRequest = {
  year: number;
  date: Rfc3339String;
  agenda?: string;
};

type NotifyRATRequest = {
  message: string;
  channels?: string[];
  email_recipients?: string[];
};

type UploadDocumentRequest = {
  type: string;
  data: string; // base64
};

type CreateVotingItemRequest = {
  question: string;
  type: string;
  options?: Record<string, unknown>;
  open_at: Rfc3339String;
  close_at: Rfc3339String;
};

type VoteRequest = {
  member_id: number;
  selected_option: string;
};

type RATHistoryResponse = APIResponse<RAT[]>;
type VotingItemResponse = APIResponse<VotingItem>;
type VotingResultResponse = APIResponse<VotingResult>;
type RATReportResponse = APIResponse<RATReport>;
```

> Gunakan `options` sesuai tipe voting: untuk pilihan tunggal, kirim map `{"A":"Setuju", "B":"Tidak"}` yang kemudian dipakai frontend menampilkan pilihan.

## Paginasi (Cursor)

- `GET /api/koperasi/rat/history` memakai cursor numerik (`id`) dengan `limit` default 10.
- Simpan `meta.pagination.next_cursor` dan kirimkan pada permintaan berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (tanggal, waktu voting, data base64 dokumen), cursor bukan angka.
- 401/403: role bukan panitia/anggota yang diizinkan.
- 404: RAT, item voting, atau dokumentasi tidak ditemukan.
- 409: voting di luar periode (`vote closed`).
- 500: kegagalan pengiriman notifikasi atau penyimpanan dokumen.

## Checklist Integrasi FE

- Validasi `open_at/close_at` di UI agar berada dalam rentang yang benar sebelum membuat item voting.
- Sertakan indikator hitung mundur pada halaman voting berdasarkan `open_at` dan `close_at`.
- Tampilkan progres unggah dokumen yang besar (field `data` base64) untuk pengalaman pengguna yang baik.
- Gunakan histori RAT untuk menampilkan daftar rapat sebelumnya beserta statusnya.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/rat/handler.go` — implementasi endpoint RAT & voting.
- `internal/modules/koperasi/rat/service.go` — logika penjadwalan, notifikasi, laporan, dan voting.
- `internal/modules/koperasi/rat/repository.go` — akses data RAT, voting, dan dokumen.
