# Notifications API — Panduan Integrasi Frontend (Singkat)

Modul notification menangani pembuatan notifikasi tenant, pengaturan reminder otomatis, registrasi device token push, serta fitur broadcast/bulk yang khusus untuk vendor. Endpoint tersebar di prefix `/notifications` dengan variasi akses berdasarkan role.

Dokumen ringkas untuk kebutuhan integrasi UI. Fokus pada header, payload, response, paginasi, dan keselarasan tipe data sesuai template standar.

## Header Wajib

- Authorization: `Bearer <token>`
- `X-Tenant-ID`: `number` (kecuali endpoint vendor yang bertindak lintas tenant)
- `Content-Type`: `application/json` atau `multipart/form-data` (untuk upload lampiran)
- `Accept`: `application/json`
- Tidak ada header tambahan; role menentukan hak akses (tenant finance/support vs vendor admin/publisher).

## Ringkasan Endpoint

**Tenant / Support**

- POST `/notifications` — `tenant admin/support`: buat notifikasi manual → 201 `APIResponse<Notification>`
- GET `/notifications?tenant_id=&user_id=&type=&status=&category=&send_status=&from=&to=&term=&limit=&cursor=` — `tenant admin/support`: daftar notifikasi tenant → 200 `APIResponse<Notification[]>`
- PATCH `/notifications/:id` — `tenant admin/support`: ubah status (`DRAFT|PUBLISHED|SENT|READ|ARCHIVED`) → 200 `APIResponse<Notification>`
- GET `/notifications/reminders?term=&type=&status=&limit=&cursor=` — `tenant admin`: daftar reminder → 200 `APIResponse<NotificationReminder[]>`
- PUT `/notifications/reminders` — `tenant admin`: upsert reminder (array payload) → 200 `APIResponse<null>`
- POST `/notifications/device-tokens` — `tenant user`: registrasi token push → 201 `APIResponse<DeviceToken>`
- DELETE `/notifications/device-tokens` — `tenant user`: hapus token push → 200 `APIResponse<{ token: string }>`
- POST `/notifications/bumdes/announcements` — `BUMDes admin`: kirim pengumuman ke unit → 201 `APIResponse<Notification>`

**Vendor**

- GET `/notifications/vendor?tenant=&category=&date=&term=&limit=&cursor=` — `vendor publisher`: daftar notifikasi vendor → 200 `APIResponse<Notification[]>`
- POST `/notifications/broadcast` — `vendor publisher`: broadcast ke tenant tertentu → 200 `APIResponse<void>`
- POST `/notifications/bulk` — `vendor publisher`: kirim notifikasi ke segment tenant → 200 `APIResponse<void>`
- PUT `/notifications/:id/publish` — `vendor publisher`: publish notifikasi + unggah lampiran → 200 `APIResponse<Notification>`
- PUT `/notifications/:id/unpublish` — `vendor publisher`: batalkan publish → 200 `APIResponse<Notification>`

> Upload lampiran vendor memakai `multipart/form-data` field `attachment`. Format yang diterima hanya `pdf`, `png`, atau `jpeg` dengan ukuran maksimal 3 MB.

## Skema Data Ringkas

- Notification: `id:string`, `tenant_id?:number`, `business_unit_id?:number`, `user_id?:number`, `segment?:'vendor'|'koperasi'|'umkm'|'bumdes'`, `channel:'IN_APP'|'EMAIL'|'PUSH'|'SMS'`, `type:'SYSTEM'|'BILLING'|'RAT'|'LOAN'|'SAVINGS'|'CUSTOM'|'PROMOTION'`, `category:string`, `target_type:'SINGLE'|'ALL'|'GROUP'`, `title:string`, `body:string`, `status:'DRAFT'|'PUBLISHED'|'SENT'|'READ'|'ARCHIVED'`, `send_status:'PENDING'|'SENT'|'FAILED'`, `attachment_name?:string`, `attachment_url?:string`, `attachment_type?:string`, `created_by?:number`, `created_at:Rfc3339`, `sent_at?:Rfc3339`, `read_at?:Rfc3339`, `published_at?:Rfc3339`, `unpublished_at?:Rfc3339`.
- NotificationReminder: `id:string`, `tenant_id:number`, `event_type:string`, `schedule_offset:number`, `schedule_unit:'DAY'|'HOUR'`, `active:boolean`, audit timestamp.
- DeviceToken: `id:string`, `user_id:number`, `token:string`, `created_at:Rfc3339`.

> Field `EmailRecipients`, `EmailAttachments`, dan metadata email lain hanya diisi saat channel email digunakan (khusus vendor broadcast/bulk). Nilai `status` untuk filter reminder harus berupa `ACTIVE` atau `INACTIVE` (case-insensitive).

## Payload Utama

- CreateNotificationRequest:
  - `{ tenant_id: number, user_id?: number, channel: 'IN_APP'|'EMAIL'|'PUSH'|'SMS', type: string, category: string, title: string, body: string, target_type?: 'SINGLE'|'ALL'|'GROUP', status?: 'DRAFT'|'PUBLISHED'|'SENT'|'READ'|'ARCHIVED' }`
  - Saat `target_type='SINGLE'` wajib menyertakan `user_id`; untuk `ALL/GROUP` `user_id` harus kosong.

- UpdateStatusRequest (PATCH `/notifications/:id`):
  - `{ status: 'DRAFT'|'PUBLISHED'|'SENT'|'READ'|'ARCHIVED' }`

- ReminderRequest (PUT `/notifications/reminders`):
  - `{ id?: string, event_type: string, schedule_offset: number, schedule_unit: 'DAY'|'HOUR', active: boolean }`
  - Kirim dalam bentuk array JSON; reminder dengan `id` yang sama akan diperbarui, sedangkan entri tanpa `id` akan dibuat baru.

- Reminder list query (`GET /notifications/reminders`): `term`, `type`, `status` (`'ACTIVE'|'INACTIVE'`), `limit` (default 10), `cursor` (UUID reminder).

- DeviceTokenRequest:
  - `{ token: string }`

- BumdesAnnouncementRequest:
  - `{ title: string, message: string, business_unit_id?: number }`

- VendorBroadcastRequest:
  - `{ message: string, targetType: 'SINGLE'|'ALL'|'GROUP', tenantIDs?: number[], category: string }`

- VendorBulkRequest:
  - `{ message: string, targetType: 'SINGLE'|'ALL'|'GROUP', segment: 'vendor'|'koperasi'|'umkm'|'bumdes' }`

## Bentuk Response

- Semua endpoint mengembalikan `APIResponse<T>` kecuali vendor broadcast/bulk yang mengembalikan data `null` dengan `success=true`.
- Endpoint daftar (`/notifications`, `/notifications/vendor`) menyertakan `meta.pagination` (cursor string UUID).
- Endpoint ekspor lampiran mengembalikan objek notifikasi dengan URL lampiran hasil unggah.

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

type Notification = {
  id: string;
  tenant_id?: number;
  business_unit_id?: number;
  user_id?: number;
  segment?: 'vendor' | 'koperasi' | 'umkm' | 'bumdes';
  channel: 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS';
  type: 'SYSTEM' | 'BILLING' | 'RAT' | 'LOAN' | 'SAVINGS' | 'CUSTOM' | 'PROMOTION';
  category: string;
  target_type: 'SINGLE' | 'ALL' | 'GROUP';
  title: string;
  body: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SENT' | 'READ' | 'ARCHIVED';
  send_status: 'PENDING' | 'SENT' | 'FAILED';
  attachment_name?: string;
  attachment_url?: string;
  attachment_type?: string;
  created_by?: number;
  created_at: Rfc3339String;
  sent_at?: Rfc3339String;
  read_at?: Rfc3339String;
  published_at?: Rfc3339String;
  unpublished_at?: Rfc3339String;
};

type NotificationReminder = {
  id: string;
  tenant_id: number;
  event_type: string;
  schedule_offset: number;
  schedule_unit: 'DAY' | 'HOUR';
  active: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

type DeviceToken = {
  id: string;
  user_id: number;
  token: string;
  created_at: Rfc3339String;
};

type CreateNotificationRequest = {
  tenant_id: number;
  user_id?: number;
  channel: 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS';
  type: string;
  category: string;
  title: string;
  body: string;
  target_type?: 'SINGLE' | 'ALL' | 'GROUP';
  status?: 'DRAFT' | 'PUBLISHED' | 'SENT' | 'READ' | 'ARCHIVED';
};

type UpdateStatusRequest = {
  status: 'DRAFT' | 'PUBLISHED' | 'SENT' | 'READ' | 'ARCHIVED';
};

type ReminderRequest = {
  id?: string;
  event_type: string;
  schedule_offset: number;
  schedule_unit: 'DAY' | 'HOUR';
  active: boolean;
};

type DeviceTokenRequest = {
  token: string;
};

type VendorBroadcastRequest = {
  message: string;
  targetType: 'SINGLE' | 'ALL' | 'GROUP';
  tenantIDs?: number[];
  category: string;
};

type VendorBulkRequest = {
  message: string;
  targetType: 'SINGLE' | 'ALL' | 'GROUP';
  segment: 'vendor' | 'koperasi' | 'umkm' | 'bumdes';
};

type NotificationListResponse = APIResponse<Notification[]>;
type NotificationDetailResponse = APIResponse<Notification>;
type ReminderListResponse = APIResponse<NotificationReminder[]>;
type ReminderMutationResponse = APIResponse<null>;
type DeviceTokenResponse = APIResponse<DeviceToken>;
```

> FE yang menjalankan broadcast/bulk harus menangani lampiran secara terpisah (upload multipart) dan memastikan ukuran/tipe file sesuai batas.

## Paginasi (Cursor)

- `GET /notifications`, `/notifications/vendor`, dan `/notifications/reminders` memakai cursor berbasis `id` (UUID untuk reminder). Gunakan `meta.pagination.next_cursor` untuk permintaan lanjutan.

## Error Singkat yang Perlu Ditangani

- 400: payload atau query tidak valid (target_type vs user_id, lampiran salah format, offset/unit keliru, filter `status` reminder bukan `ACTIVE|INACTIVE`).
- 401/403: role tidak memiliki izin (vendor publisher saja yang dapat broadcast/publish).
- 404: notifikasi tidak ditemukan saat publish/unpublish.
- 409/422 (diterjemahkan sebagai 400): duplikasi device token atau status transisi tidak sah.
- 500: kegagalan internal (penyimpanan lampiran, pengiriman email/push) — tampilkan pesan umum dan sarankan coba ulang.

## Checklist Integrasi FE

- Validasi kombinasi `target_type` dan `user_id` sebelum mengirim request.
- Tampilkan progress upload saat publish dengan lampiran; berikan feedback jika ukuran/tipe file tidak sesuai.
- Gunakan pagination cursor untuk memuat notifikasi lama dan sediakan filter tanggal/kategori.
- Sinkronkan device token saat login/logout; hapus token ketika user keluar agar push tidak salah sasaran.
- Untuk BUMDes, pastikan pilihan unit sesuai akses user; backend akan menolak jika unit tidak valid.

## Tautan Teknis (Opsional)

- `internal/modules/support/notification/handler.go` — implementasi endpoint & validasi payload.
- `internal/modules/support/notification/service.go` — logika broadcast, reminder, dan integrasi channel.
- `internal/modules/support/notification/types.go` — definisi entitas `Notification`, `NotificationReminder`, `DeviceToken`.
