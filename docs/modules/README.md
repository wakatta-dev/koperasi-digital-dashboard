# Dokumentasi Modul

Dokumen ini merangkum seluruh modul pada sistem dan menautkan ke detail masing-masing modul. Semua endpoint mengikuti pola autentikasi Bearer + X-Tenant-ID (kecuali endpoint publik yang disebutkan di dokumen modul terkait) dan menggunakan response standar `APIResponse`, kecuali disebutkan berbeda.

## Daftar Modul

- Core
  - [Auth](auth.md)
  - [Tenant](tenant.md)
  - [Roles & Permissions](authorization.md)
  - [Users](user.md)

- Finance & Billing
  - [Billing](billing.md)
  - [Finance/Transactions](finance_transactions.md)
  - [Cashbook](cashbook.md)
  - [Reporting](reporting.md)
  - [Asset](asset.md)
  - [SHU](shu.md)

- Operasional Anggota
  - [Membership](membership.md)
  - [Savings](savings.md)
  - [Loan](loan.md)
  - [Sharia Financing](sharia.md)
  - [Risk](risk.md)

- Governance & Support
  - [RAT](rat.md)
  - [Notifications](notification.md)
  - [Ticket](ticket.md)
  - [Livechat](livechat.md)
  - [Dashboard](dashboard.md)
  - [Analytics](analytics.md)

## Konvensi Umum

- Keamanan
  - Authorization: `Bearer <token>`
  - `X-Tenant-ID`: ID tenant (atau resolusi domain, bila diaktifkan)
- Paginasi
  - Numerik: `cursor` berbasis integer (umumnya untuk entitas dengan PK auto-increment)
  - String: `cursor` berbasis UUID/string (umumnya untuk ID bertipe UUID)
- Response
  - `APIResponse` dengan bidang `data`, `meta.pagination` (bila ada), dan `errors` (bila ada)

