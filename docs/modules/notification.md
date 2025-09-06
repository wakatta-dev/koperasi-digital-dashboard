# Notifications API — Panduan Integrasi Frontend (Singkat)

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data. Struktur mengikuti template Asset dan tanpa contoh cepat.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (atau otomatis via domain)
- `Content-Type`: `application/json`
- `Accept`: `application/json`

## Ringkasan Endpoint

- POST `/notifications` — buat notifikasi → 201 `APIResponse<Notification>`
- GET `/notifications?tenant_id=..&user_id=..&type=..&status=..&category=..&send_status=..&from=..&to=..&limit=..&cursor=..` — daftar → 200 `APIResponse<Notification[]>`
- PATCH `/notifications/:id` — ubah status → 200 `APIResponse<{ id: string; status: string }>`
- GET `/notifications/reminders` — daftar reminder tenant → 200 `APIResponse<NotificationReminder[]>`
- PUT `/notifications/reminders` — upsert reminder (batch) → 200 `APIResponse<null>`
- POST `/notifications/device-tokens` — daftar token perangkat → 201 `APIResponse<{ token: string }>`
- DELETE `/notifications/device-tokens` — hapus token perangkat → 200 `APIResponse<{ token: string }>`
- POST `/vendor/notifications/broadcast` — vendor: broadcast ke tenant → 200 `APIResponse<null>`
- POST `/vendor/notifications/bulk` — vendor: antrian bulk by segment → 200 `APIResponse<null>`
- GET `/vendor/notifications?tenant=..&category=..&date=..&limit=..&cursor=..` — vendor: daftar → 200 `APIResponse<Notification[]>`

## Skema Data Ringkas

- Notification: `id` (uuid), `tenant_id?`, `user_id?`, `segment?` (`VENDOR|KOPERASI|UMKM|BUMDES`), `channel` (`IN_APP|EMAIL|PUSH`), `type` (`SYSTEM|BILLING|RAT|LOAN|SAVINGS|CUSTOM`), `category`, `target_type` (`SINGLE|ALL|GROUP`), `title`, `body`, `status` (`DRAFT|PUBLISHED|SENT|READ|ARCHIVED`), `send_status` (`PENDING|SENT|FAILED`), `created_at`, `sent_at?`, `read_at?`
- NotificationReminder: `id` (uuid), `tenant_id`, `event_type`, `schedule_offset`, `active`, `created_at`, `updated_at`
- DeviceToken: `id` (uuid), `user_id`, `token`, `created_at`

## Payload Utama

- CreateNotificationRequest:
  - `tenant_id` (number, wajib), `user_id?` (number), `channel` (`IN_APP|EMAIL|PUSH`), `type` (`SYSTEM|BILLING|RAT|LOAN|SAVINGS|CUSTOM`), `category` (string), `title` (string), `body` (string), `status?` (`DRAFT|PUBLISHED|SENT|READ|ARCHIVED`)

- UpdateNotificationStatusRequest:
  - `status` (`DRAFT|PUBLISHED|SENT|READ|ARCHIVED`)

- ReminderRequest[] (PUT reminders):
  - Elemen: `id?`, `event_type`, `schedule_offset` (number), `active?` (boolean)

- DeviceTokenRequest:
  - `{ token: string }`

- Vendor Broadcast Request:
  - `{ message: string, targetType: 'SINGLE'|'ALL'|'GROUP', tenantIDs?: number[], category: string }`

- Vendor Bulk Request:
  - `{ message: string, targetType: 'SINGLE'|'ALL'|'GROUP', segment: 'VENDOR'|'KOPERASI'|'UMKM'|'BUMDES' }`

## Bentuk Response

- Semua endpoint memakai `APIResponse<T>`.
- Endpoint list menyediakan `meta.pagination` bila mendukung cursor.

## TypeScript Types (Request & Response)

```ts
// Common
export type Rfc3339String = string;

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}

// Entities
export type Segment = 'VENDOR' | 'KOPERASI' | 'UMKM' | 'BUMDES';
export type Channel = 'IN_APP' | 'EMAIL' | 'PUSH';
export type NotificationType = 'SYSTEM' | 'BILLING' | 'RAT' | 'LOAN' | 'SAVINGS' | 'CUSTOM';
export type TargetType = 'SINGLE' | 'ALL' | 'GROUP';
export type NotificationStatus = 'DRAFT' | 'PUBLISHED' | 'SENT' | 'READ' | 'ARCHIVED';
export type SendStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface Notification {
  id: string;
  tenant_id?: number;
  user_id?: number;
  segment?: Segment;
  channel: Channel;
  type: NotificationType;
  category: string;
  target_type: TargetType;
  title: string;
  body: string;
  status: NotificationStatus;
  send_status: SendStatus;
  created_at: Rfc3339String;
  sent_at?: Rfc3339String;
  read_at?: Rfc3339String;
}

export interface NotificationReminder {
  id: string;
  tenant_id: number;
  event_type: string;
  schedule_offset: number;
  active: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface DeviceToken { id: string; user_id: number; token: string; created_at: Rfc3339String }

// Requests
export interface CreateNotificationRequest {
  tenant_id: number;
  user_id?: number;
  channel: Channel;
  type: NotificationType;
  category: string;
  title: string;
  body: string;
  status?: NotificationStatus;
}
export interface UpdateNotificationStatusRequest { status: NotificationStatus }
export interface ReminderRequest { id?: string; event_type: string; schedule_offset: number; active?: boolean }
export interface DeviceTokenRequest { token: string }
export interface VendorBroadcastRequest { message: string; targetType: TargetType; tenantIDs?: number[]; category: string }
export interface VendorBulkRequest { message: string; targetType: TargetType; segment: Segment }

// Responses
export type CreateNotificationResponse = APIResponse<Notification>;
export type ListNotificationsResponse = APIResponse<Notification[]>;
export type UpdateNotificationResponse = APIResponse<{ id: string; status: NotificationStatus }>;
export type GetRemindersResponse = APIResponse<NotificationReminder[]>;
export type UpsertRemindersResponse = APIResponse<null>;
export type RegisterDeviceTokenResponse = APIResponse<{ token: string }>;
export type UnregisterDeviceTokenResponse = APIResponse<{ token: string }>;
export type VendorBroadcastResponse = APIResponse<null>;
export type VendorBulkResponse = APIResponse<null>;
```

## Paginasi (Cursor)

- Endpoint list (`GET /notifications`, vendor list) menggunakan cursor string (`id` uuid) dan `limit` wajib.
- Baca `meta.pagination.next_cursor` untuk memuat data berikutnya bila `has_next = true`.

## Error Singkat yang Perlu Ditangani

- 400: `APIResponse` dengan `errors` per field/body query invalid.
- 401/403: token salah/tenant tidak aktif/role vendor tidak sesuai.
- 404: resource tidak ditemukan (id salah pada update status).

## Checklist Integrasi FE

- Selalu kirim `Authorization` dan `X-Tenant-ID`.
- Untuk list, gunakan filter sesuai kebutuhan dan konsumsi `meta.pagination`.
- Pastikan status transisi UI saat `READ` dan `SENT` sesuai.

Tautan teknis (opsional): implementasi ada di `internal/modules/core/notification/*.go` bila diperlukan detail lebih lanjut.

## Contoh Payload

- Create Notification
```json
{
  "tenant_id": 12,
  "user_id": 99,
  "segment": "KOPERASI",
  "channel": "IN_APP",
  "type": "BILLING",
  "category": "BILLING",
  "target_type": "SINGLE",
  "title": "Tagihan Jatuh Tempo",
  "body": "Segera lakukan pembayaran.",
  "status": "PUBLISHED",
  "send_status": "PENDING"
}
```

- Update Status
```json
{ "status": "READ" }
```

- Register Device Token
```json
{ "token": "abcdef123" }
```

- Unregister Device Token
```json
{ "token": "abcdef123" }
```

## Status & Transisi

- `DRAFT` → `PUBLISHED` → `SENT` (untuk kanal pengiriman) → `READ` → `ARCHIVED` (sesuai kebutuhan).
- Otomasi timestamp: `sent_at` saat `SENT`, `read_at` saat `READ`.

## Paginasi & Response

- Cursor string (uuid `id`) dan `limit` wajib untuk listing. `meta.pagination` disertakan.
 - Catatan: seluruh contoh response di dokumen ini diasumsikan terbungkus `APIResponse`. Untuk ringkas, beberapa contoh hanya menampilkan bagian `data`.

Contoh response:
```json
{
  "success": true,
  "message": "success",
  "data": [
    {"id": "notif-1", "title": "Tagihan Jatuh Tempo"}
  ],
  "meta": {
    "request_id": "...",
    "timestamp": "2025-08-25T10:00:00Z",
    "pagination": {
      "next_cursor": null,
      "prev_cursor": null,
      "has_next": false,
      "has_prev": false,
      "limit": 10
    }
  },
  "errors": null
}
```

## Integrasi & Dampak ke Modul Lain

- Billing/Finance/RAT/Loan/Savings: dapat menggunakan notifikasi tipe terkait untuk informasi status/tagihan/transaksi.
- Livechat: mengirim notifikasi in-app saat agen membalas chat.
- Kanal `EMAIL`/`PUSH` akan membutuhkan integrasi eksternal (placeholder).

## Keamanan

- Isolasi tenant diberlakukan oleh middleware; filter selalu membutuhkan `tenant_id`.

## Catatan Implementasi

- Pengiriman `EMAIL`/`PUSH` belum diimplementasikan; tambahkan service pengirim sesuai penyedia.
- Validasi format waktu filter menggunakan RFC3339.

## Peran Modul Notifications per Jenis Tenant (Rangkuman)

- Vendor: notifikasi sistem dan pengumuman.
- Koperasi/UMKM/BUMDes: komunikasi operasional antar pengguna/anggota.

## Skenario Penggunaan

1. Sistem Billing menerbitkan notifikasi `BILLING` saat invoice mendekati jatuh tempo.
2. Admin tenant menandai notifikasi sebagai `READ` setelah dibuka.
3. Di masa depan, sistem mengirim `EMAIL` untuk broadcast pemberitahuan RAT.
