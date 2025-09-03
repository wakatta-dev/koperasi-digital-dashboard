# Modul RAT (Rapat Anggota Tahunan)

Modul RAT mencakup penjadwalan RAT, notifikasi, unggah dokumen, pembuatan topik voting, pemungutan suara, hasil voting, dan riwayat RAT.

Referensi implementasi utama terdapat pada:
- `internal/modules/rat/entity.go`
- `internal/modules/rat/repository.go`
- `internal/modules/rat/service.go`
- `internal/modules/rat/handler.go`
- `internal/modules/rat/routes.go`

## Endpoint API

Semua endpoint dilindungi `Bearer` + `X-Tenant-ID`.

- `POST /coop/rat` — jadwalkan RAT baru.
- `POST /coop/rat/{id}/notify` — kirim notifikasi RAT.
- `POST /coop/rat/{id}/documents` — unggah dokumen RAT.
- `POST /coop/rat/{id}/voting` — buat item voting.
- `POST /coop/rat/voting/{item_id}/vote` — lakukan voting.
- `GET /coop/rat/voting/{item_id}/result` — hasil voting.
- `GET /coop/rat/history` — riwayat RAT.

## Rincian Endpoint

- `POST /coop/rat` — Body CreateRATRequest → 201 `data` RAT
- `POST /coop/rat/{id}/notify` — Body `{ "message": "..." }` → 200 sukses
- `POST /coop/rat/{id}/documents` — Body UploadDocumentRequest → 201 sukses
- `POST /coop/rat/{id}/voting` — Body CreateVotingItemRequest → 201 `data` VotingItem
- `POST /coop/rat/voting/{item_id}/vote` — Body VoteRequest → 201 sukses
- `GET /coop/rat/voting/{item_id}/result` → 200 `data` VotingResult
- `GET /coop/rat/history` → 200 `data` array RAT

## Contoh Payload & Response

- Create RAT
```json
POST /coop/rat
{ "year": 2025, "date": "2025-11-20T09:00:00Z", "agenda": "RAT Tahunan" }
```

- Notify RAT
```json
POST /coop/rat/7/notify
{ "message": "RAT dimulai 20 Nov 2025" }
```

- Upload Dokumen
```json
POST /coop/rat/7/documents
{ "type": "notulen", "file_url": "https://cdn.example.com/notulen.pdf" }
```

- Create Voting Item
```json
POST /coop/rat/7/voting
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
POST /coop/rat/voting/3/vote
{ "member_id": 12, "selected_option": "Setuju" }
```

- Voting Result (response contoh)
```json
{
  "item_id": 3,
  "total_votes": 50,
  "breakdown": { "Setuju": 40, "Tidak": 10 }
}
```

## Tautan Cepat

- Notifications: [notification.md](notification.md)
- Reporting: [reporting.md](reporting.md)
- Dashboard: [dashboard.md](dashboard.md)
