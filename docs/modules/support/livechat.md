# Livechat API — Panduan Integrasi Frontend (Singkat)

Modul livechat menyediakan kanal percakapan real-time antara tenant dan agen support. Endpoint mengatur pembukaan sesi, pengiriman pesan, serta riwayat pesan dengan dukungan cursor pagination.

Seluruh rute berada di bawah prefix `/api/livechat` sesuai registrasi di `internal/modules/registry.go` dan `internal/modules/support/livechat/routes.go`. Router juga membuat alias vendor melalui `RegisterRoutes(r.Group("/vendor"), ...)` sehingga tersedia jalur ekuivalen `/api/vendor/livechat/...` untuk integrasi portal vendor.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; akses dibatasi untuk role tenant tertentu (`support_agent`, admin/member koperasi/UMKM/BUMDes).

## Ringkasan Endpoint

- POST `/api/livechat/sessions` — `tenant user / support agent`: buka sesi baru → 201 `APIResponse<ChatSession>`
- POST `/api/livechat/sessions/:id/messages` — `tenant user / support agent`: kirim pesan → 201 `APIResponse<ChatMessage>`
- GET `/api/livechat/sessions/:id/messages?term=&sender_id=&start_date=&end_date=&limit=&cursor=` — `tenant user / support agent`: daftar pesan → 200 `APIResponse<ChatMessage[]>`

> Alias vendor menyediakan jalur identik di `/api/vendor/livechat/...` dengan payload dan respons yang sama, cukup mengganti prefiks URL.

> Support agent dapat membuka sesi untuk tenant lain dengan mengirim `agent_id`; user biasa cukup memanggil endpoint tanpa payload tambahan.

## Skema Data Ringkas

- ChatSession: `id:string (UUID)`, `tenant_id:number`, `agent_id?:number`, `status:'OPEN'|'CLOSED'`, `created_at:Rfc3339`, `updated_at:Rfc3339`.
- ChatMessage: `id:string (UUID)`, `session_id:string`, `sender_id:number`, `message:string`, `created_at:Rfc3339`.

> Status default sesi adalah `OPEN`; service akan menutup otomatis ketika agen menyelesaikan percakapan.

## Payload Utama

- StartSessionRequest (POST `/api/livechat/sessions`):
  - `{ agent_id?: number }` — hanya digunakan oleh role `support_agent` untuk menetapkan agen lain.

- SendMessageRequest (POST `/api/livechat/sessions/:id/messages`):
  - `{ message: string }`

- ListMessages filter (GET `/api/livechat/sessions/:id/messages` query): `term` (string, cari di pesan), `sender_id` (number), `start_date`/`end_date` (RFC3339), `limit` (default 10), `cursor` (string UUID pesan terakhir).

## Bentuk Response

- Semua endpoint menggunakan `APIResponse<T>` dengan `meta.pagination` hadir pada `GET /api/livechat/sessions/:id/messages` (`next_cursor`, `has_next`).
- Pesan baru dikembalikan lengkap sehingga FE dapat menambahkannya langsung ke timeline tanpa melakukan fetch ulang.

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

type ChatSession = {
  id: string;
  tenant_id: number;
  agent_id?: number;
  status: 'OPEN' | 'CLOSED';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type ChatMessage = {
  id: string;
  session_id: string;
  sender_id: number;
  message: string;
  created_at: Rfc3339String;
};

type StartSessionRequest = {
  agent_id?: number;
};

type SendMessageRequest = {
  message: string;
};

type ChatSessionResponse = APIResponse<ChatSession>;
type ChatMessageResponse = APIResponse<ChatMessage>;
type ChatMessageListResponse = APIResponse<ChatMessage[]>;
```

> FE dapat menyimpan `next_cursor` untuk infinite scroll ke atas; gunakan `term` / `sender_id` untuk filter transkrip.

## Paginasi (Cursor)

- `GET /api/livechat/sessions/:id/messages` memakai cursor string (`id` pesan terakhir). Kirim kembali `meta.pagination.next_cursor` untuk memuat pesan sebelumnya.

## Error Singkat yang Perlu Ditangani

- 400: payload kosong (`message` wajib), format tanggal salah, limit negatif, atau sesi sudah aktif/agen offline saat membuka sesi baru.
- 403: role tidak diperbolehkan mengakses livechat (`forbidden`).
- 404: sesi tidak ditemukan atau sudah ditutup (diterjemahkan dari service).
- 500: kegagalan internal (repo, penyimpanan pesan) — tampilkan pesan umum dan sarankan pengguna mencoba ulang.

## Checklist Integrasi FE

- Gunakan guard role di UI; sembunyikan entry point livechat untuk role yang tidak termasuk allowlist.
- Lakukan polling atau WebSocket (bila tersedia) untuk memuat pesan baru; fallback ke refresh manual dengan `cursor`.
- Tampilkan indikator saat pesan dikirim (optimistic update) dan sesuaikan bila API gagal.
- Beri opsi agen untuk menutup sesi; pantau status `OPEN/CLOSED` untuk mengunci input pesan.

## Catatan QA

- Payload dan respons sudah ditinjau ulang menyesuaikan jalur `/api/livechat` serta alias `/api/vendor/livechat`. Mohon QA memverifikasi dokumentasi terbaru.

## Tautan Teknis (Opsional)

- `internal/modules/support/livechat/handler.go` — implementasi endpoint & validasi.
- `internal/modules/support/livechat/service.go` — logika sesi/pesan dan paginasi.
- `internal/modules/support/livechat/entity.go` — struktur `ChatSession` dan `ChatMessage`.
