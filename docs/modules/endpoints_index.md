# Indeks Endpoint per Modul (Standar FE)

- Core: [Auth](auth.md) · [Tenant](tenant.md) · [Authorization](authorization.md) · [Users](user.md)
- Finance & Billing: [Billing](billing.md) · [Finance/Transactions](finance_transactions.md) · [Cashbook](cashbook.md) · [Reporting](reporting.md) · [Asset](asset.md) · [SHU](shu.md)
- Operasional Anggota: [Membership](membership.md) · [Savings](savings.md) · [Loan](loan.md) · [Sharia Financing](sharia.md) · [Risk](risk.md)
- Governance & Support: [RAT](rat.md) · [Notifications](notification.md) · [Ticket](ticket.md) · [Livechat](livechat.md) · [Dashboard](dashboard.md)

Catatan standar:
- Header wajib: Authorization `Bearer <token>`, header `X-Tenant-ID` (atau domain).
- Paginasi: query `limit` dan `cursor` (numerik atau string/UUID sesuai entitas).
- Response: `APIResponse<T>` untuk list/histori/umumnya; beberapa create/update mengembalikan objek langsung sesuai handler modul.
