# Modul RAT (Rapat Anggota Tahunan)

Modul RAT mencakup penjadwalan RAT, notifikasi, unggah dokumen, pembuatan item voting, pemungutan suara, penayangan hasil, serta riwayat RAT.

Referensi implementasi utama terdapat pada:
- `internal/modules/rat/entity.go`
- `internal/modules/rat/dto.go`
- `internal/modules/rat/repository.go`
- `internal/modules/rat/service.go`
- `internal/modules/rat/handler.go`
- `internal/modules/rat/routes.go`

## Endpoint API

Semua endpoint membutuhkan autentikasi `Bearer` dan identitas tenant lewat header `X-Tenant-ID`.

- `POST /rat` — jadwalkan RAT baru.
- `POST /rat/{id}/notify` — kirim notifikasi RAT.
- `POST /rat/{id}/documents` — unggah dokumen RAT.
- `POST /rat/{id}/voting` — buat item voting.
- `POST /rat/voting/{item_id}/vote` — pemungutan suara anggota.
- `GET /rat/voting/{item_id}/result` — perolehan suara untuk suatu item.
- `GET /rat/history` — daftar riwayat RAT milik tenant.

## Rincian Endpoint (Params, Payload, Response)

Header umum:
- Authorization: `Bearer <token>`
- `X-Tenant-ID`: ID tenant

- `POST /rat`
  - Body CreateRATRequest:
    - `year` (int, wajib)
    - `date` (RFC3339, wajib)
    - `agenda` (opsional)
  - Response 201: objek `RAT` yang dibuat.

- `POST /rat/{id}/notify`
  - Path: `id` (int, wajib)
  - Body: `{ "message": "<isi undangan>" }`
  - Response 200: `{ "status": "sent" }`

- `POST /rat/{id}/documents`
  - Path: `id` (int, wajib)
  - Body UploadDocumentRequest:
    - `type` (string, wajib)
    - `data` (bytes base64, wajib)
  - Response 201: `{ "status": "uploaded" }`

- `POST /rat/{id}/voting`
  - Path: `id` (int, wajib)
  - Body CreateVotingItemRequest:
    - `question` (string, wajib)
    - `type` (string, contoh: `single_choice`)
    - `options` (array/JSON, opsional)
    - `open_at` (RFC3339, wajib)
    - `close_at` (RFC3339, wajib)
  - Response 201: `VotingItem`

- `POST /rat/voting/{item_id}/vote`
  - Path: `item_id` (int, wajib)
  - Body VoteRequest:
    - `member_id` (uint, wajib; harus aktif)
    - `selected_option` (string, wajib)
  - Response 201: `{ "status": "voted" }`

- `GET /rat/voting/{item_id}/result`
  - Path: `item_id` (int, wajib)
  - Response 200: `VotingResult` berisi `item_id`, `counts` (pemetaan pilihan→jumlah), dan `total`.

- `GET /rat/history`
  - Response 200: array `RAT` milik tenant.

## Contoh Payload & Response

- Create RAT
```json
POST /rat
{ "year": 2025, "date": "2025-11-20T09:00:00Z", "agenda": "RAT Tahunan" }
```

- Notify RAT
```json
POST /rat/7/notify
{ "message": "RAT dimulai 20 Nov 2025" }
```

- Upload Dokumen
```json
POST /rat/7/documents
{ "type": "notulen", "data": "<base64-encoded-bytes>" }
```

- Create Voting Item
```json
POST /rat/7/voting
{
  "question": "Setuju laporan keuangan?",
  "type": "single_choice",
  "options": ["Setuju", "Tidak"],
  "open_at": "2025-11-20T09:00:00Z",
  "close_at": "2025-11-20T12:00:00Z"
}
```

- Vote
```json
POST /rat/voting/3/vote
{ "member_id": 12, "selected_option": "Setuju" }
```

- Voting Result (response contoh)
```json
{
  "item_id": 3,
  "counts": { "Setuju": 40, "Tidak": 10 },
  "total": 50
}
```

## Tautan Cepat

- Notifications: [notification.md](notification.md)
- Reporting: [reporting.md](reporting.md)
- Dashboard: [dashboard.md](dashboard.md)
