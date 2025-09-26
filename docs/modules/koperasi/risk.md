# Risk Engine API — Panduan Integrasi Frontend (Singkat)

Modul risk koperasi mengatur perhitungan skor risiko anggota, penyimpanan hasil skor, statistik monitoring, serta konfigurasi aturan penilaian. Endpoint tersedia di prefix `/koperasi/risk`.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number`
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- Tidak ada header tambahan; akses dibatasi petugas pembiayaan/risk koperasi.

## Ringkasan Endpoint

- POST `/koperasi/risk/score` — `petugas pembiayaan`: hitung skor risiko anggota → 200 `RiskResult`
- GET `/koperasi/risk/result/:member_id` — `petugas pembiayaan`: ambil hasil skor terakhir → 200 `RiskResult`
- GET `/koperasi/risk/monitor` — `manajer risiko`: statistik keputusan (`approve|manual_review|auto_reject`) → 200 `map<string, number>`
- GET `/koperasi/risk/config?term=&factor=&threshold=&limit=&cursor=` — `manajer risiko`: daftar aturan → 200 `APIResponse<RiskRule[]>`
- POST `/koperasi/risk/config` — `manajer risiko`: tambah/update aturan → 201/200 `RiskRule`
- DELETE `/koperasi/risk/config/:id` — `manajer risiko`: hapus aturan → 200

> Parameter `factor`, `weight`, `threshold`, dan `risk_category` menentukan bagaimana skor risiko dihitung. `auto_action` dapat diisi `approve`, `manual_review`, atau `reject` untuk otomatisasi keputusan pinjaman.

## Skema Data Ringkas

- RiskResult: `member_id:number`, `tenant_id:number`, `score:number`, `decision:'approve'|'manual_review'|'auto-reject'`, `reasons:string[]`, `computed_at:Rfc3339`
- RiskRule: `id:number`, `tenant_id:number`, `factor:string`, `weight:number`, `threshold:number`, `risk_category:string`, `auto_action:'approve'|'manual_review'|'reject'`, `action_payload?:Record<string,any>`, `created_at:Rfc3339`

> Engine menyimpan hasil terbaru per anggota; FE sebaiknya menampilkan hasil beserta alasan (`reasons`) untuk transparansi keputusan.

## Payload Utama

- ScoreRequest:
  - `{ member_id: number }`

- RuleRequest (POST `/config`):
  - `{ id?: number, factor: string, weight: number, threshold: number, risk_category: string, auto_action: 'approve'|'manual_review'|'reject', action_payload?: Record<string, unknown> }`

- Filter daftar aturan: `term` (pencarian factor), `factor`, `threshold` (angka), `limit` (default 10), `cursor` (ID aturan).

## Bentuk Response

- `Score` dan `GetResult` mengembalikan objek `RiskResult` langsung (legacy). Endpoint configurasi memakai `APIResponse<T>` dengan `meta.pagination`.
- Statistik monitoring (`/monitor`) mengembalikan map sederhana `{ decision: total }`.

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

type RiskResult = {
  member_id: number;
  tenant_id: number;
  score: number;
  decision: 'approve' | 'manual_review' | 'auto-reject';
  reasons: string[];
  computed_at: Rfc3339String;
};

type RiskRule = {
  id: number;
  tenant_id: number;
  factor: string;
  weight: number;
  threshold: number;
  risk_category: string;
  auto_action: 'approve' | 'manual_review' | 'reject';
  action_payload?: Record<string, unknown>;
  created_at: Rfc3339String;
};

type ScoreRequest = {
  member_id: number;
};

type RuleRequest = {
  id?: number;
  factor: string;
  weight: number;
  threshold: number;
  risk_category: string;
  auto_action: 'approve' | 'manual_review' | 'reject';
  action_payload?: Record<string, unknown>;
};

type RiskRuleListResponse = APIResponse<RiskRule[]>;
```

> Saat memperbarui aturan, sertakan `id` dalam payload untuk overwrite; tanpa `id` aturan baru akan dibuat.

## Paginasi (Cursor)

- `GET /koperasi/risk/config` memakai cursor numerik (`id`) dengan `limit` default 10. Gunakan `meta.pagination.next_cursor` untuk memuat halaman berikutnya.

## Error Singkat yang Perlu Ditangani

- 400: payload tidak valid (`member_id` kosong, `threshold` bukan angka, cursor salah format).
- 401/403: role tidak berhak menggunakan modul risk.
- 404: hasil atau aturan tidak ditemukan saat `GetResult`/update.
- 409: aturan dengan faktor sama sudah ada (dilaporkan sebagai validation error).
- 500: kegagalan kalkulasi atau penyimpanan aturan.

## Checklist Integrasi FE

- Tampilkan skor dan `decision` pada dashboard kredit agar komite dapat menindaklanjuti.
- Sediakan form untuk mengelola aturan (factor, bobot, threshold) dan reload daftar setelah simpan/hapus.
- Gunakan statistik monitor untuk chart ringkasan keputusan.
- Saat memanggil `GetResult`, fallback ke `Score` jika hasil tidak ditemukan agar pengguna mendapat skor terbaru.

## Tautan Teknis (Opsional)

- `internal/modules/koperasi/risk/handler.go` — endpoint scoring & konfigurasi.
- `internal/modules/koperasi/risk/service.go` — logika perhitungan skor dan penalty.
- `internal/modules/koperasi/risk/repository.go` — penyimpanan hasil skor & aturan.
