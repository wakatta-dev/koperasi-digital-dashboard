# Indeks Endpoint per Modul

Ringkasan cepat seluruh endpoint per modul. Kecuali disebutkan, endpoint dilindungi `Authorization: Bearer <token>` dan membutuhkan `X-Tenant-ID` (atau resolusi domain bila diterapkan).

Kategori prefix:
- `/api/koperasi/...` — endpoint khusus tenant koperasi
- `/api/vendor/...` — endpoint vendor
- `/api/bumdes/...` — endpoint khusus BUMDes
- `/api/umkm/...` — endpoint khusus UMKM
- `/api/...` — endpoint lintas-tenant (publik/vendor)

## Auth
- POST `/auth/login` — login
- POST `/auth/refresh` — refresh token
- POST `/auth/logout` — logout

## Tenant
- GET `/tenants` — list; POST `/tenants` — create; GET `/tenants/{id}` — detail; PATCH `/tenants/{id}` — update; PATCH `/tenants/{id}/status` — status
- POST `/tenants/{id}/users` — add user; GET `/tenants/{id}/users` — list by tenant
- GET `/tenants/{id}/modules` — list modules; PATCH `/tenants/{id}/modules` — upsert status
- GET `/tenant/by-domain` — publik
- POST `/api/vendor/tenants` — registrasi OTP (publik); POST `/api/vendor/tenants/verify` — verifikasi OTP (publik)
- PATCH `/api/vendor/tenants/{id}/status` — admin vendor

## Users
- POST `/users`; GET `/users`; GET `/users/{id}`; PUT `/users/{id}`; PATCH `/users/{id}/status`; DELETE `/users/{id}`; POST `/users/reset-password`

## Roles & Permissions
- GET/POST `/roles`; PUT/DELETE `/roles/{id}`; POST `/roles/tenants`
- GET/POST `/roles/{id}/permissions`; DELETE `/roles/{id}/permissions/{pid}`
- GET/POST `/users/{id}/roles`; DELETE `/users/{id}/roles/{rid}`

## Billing
- Plans (vendor): GET/POST `/api/vendor/plans`; GET/PUT/PATCH/DELETE `/api/vendor/plans/{id}`
- Invoices (vendor): GET/POST `/api/vendor/invoices`; PATCH/DELETE `/api/vendor/invoices/{id}`; PATCH `/api/vendor/invoices/{id}/status`
- Payments (vendor): POST `/api/vendor/invoices/{id}/payments`; PATCH `/api/vendor/payments/{id}/verify`
- Subscriptions (vendor): GET `/api/vendor/subscriptions`; PATCH `/api/vendor/subscriptions/{id}/status`; GET `/api/vendor/subscriptions/summary`
- Payment gateway (vendor): POST `/api/vendor/payment-gateways/{gateway}/webhook`
- Audit (vendor): GET `/api/vendor/audits`
- Client invoices: GET `/client/invoices`; GET `/client/invoices/{id}`; POST `/client/invoices/{id}/payments`; GET `/client/invoices/{id}/audits`
- Client subscription: GET `/client/subscription`

## Finance / Transactions
- POST `/transactions`; GET `/transactions`
- GET `/transactions/{id}/history`; PATCH `/transactions/{id}`; DELETE `/transactions/{id}`
- GET `/transactions/export`

## Cashbook
- POST `/api/koperasi/cash/manual`; GET `/api/koperasi/cash/summary`; POST `/api/koperasi/cash/export`

## Reporting
- GET `/reports/finance`; GET `/reports/billing`; GET `/reports/cashflow`; GET `/reports/profit-loss`; GET `/reports/balance-sheet`
- GET `/reports/export`; GET `/reports/history`
- Vendor reports: GET `/api/vendor/reports/financial`; GET `/api/vendor/reports/usage`
- Vendor exports: POST `/api/vendor/reports/export`; GET `/api/vendor/reports/exports`

## Analytics (Vendor)
- GET `/api/vendor/analytics/clients` — statistik klien per paket/status dan pertumbuhan bulanan

## Asset
- POST `/api/koperasi/assets`; PUT `/api/koperasi/assets/{id}`; DELETE `/api/koperasi/assets/{id}`; GET `/api/koperasi/assets`
- GET `/api/koperasi/assets/{id}/depreciation`; PATCH `/api/koperasi/assets/{id}/status`; GET `/api/koperasi/assets/export`

## Membership
- POST `/api/koperasi/members/register`; POST `/api/koperasi/members/{id}/verify`; GET `/api/koperasi/members/{id}`; PATCH `/api/koperasi/members/{id}/status`
- POST `/api/koperasi/members/{id}/card`; GET `/api/koperasi/members/card/validate/{qr}`

## Savings
- POST `/api/koperasi/savings/{member_id}/deposit`; POST `/api/koperasi/savings/{transaction_id}/verify`
- POST `/api/koperasi/savings/{member_id}/withdraw`; POST `/api/koperasi/savings/{transaction_id}/approve`
- GET `/api/koperasi/savings/{member_id}/transactions`; GET `/api/koperasi/savings/{transaction_id}/proof`

## Loan
- POST `/api/koperasi/loans/apply`; POST `/api/koperasi/loans/{id}/approve`; POST `/api/koperasi/loans/{id}/disburse`
- GET `/api/koperasi/loans/{id}/installments`; POST `/api/koperasi/loans/installments/{id}/pay`; GET `/api/koperasi/loans/{id}/release-letter`

## Sharia Financing
- POST `/api/koperasi/sharia-financings/apply`; POST `/api/koperasi/sharia-financings/{id}/approve`; POST `/api/koperasi/sharia-financings/{id}/disburse`
- GET `/api/koperasi/sharia-financings/{id}/installments`; POST `/api/koperasi/sharia-financings/installments/{id}/pay`; GET `/api/koperasi/sharia-financings/{id}/release-letter`

## Risk
- POST `/api/koperasi/risk/score`; GET `/api/koperasi/risk/result/{member_id}`
- GET/POST `/api/koperasi/risk/config`; DELETE `/api/koperasi/risk/config/{id}`

## RAT
- POST `/api/koperasi/rat`; POST `/api/koperasi/rat/{id}/notify`; POST `/api/koperasi/rat/{id}/documents`
- POST `/api/koperasi/rat/{id}/voting`; POST `/api/koperasi/rat/voting/{item_id}/vote`; GET `/api/koperasi/rat/voting/{item_id}/result`
- GET `/api/koperasi/rat/history`

## Ticket
- POST `/tickets`; GET `/tickets`; GET `/tickets/{id}`; POST `/tickets/{id}/replies`; PATCH `/tickets/{id}`; GET `/tickets/{id}/activities`
- Vendor tickets: GET `/api/vendor/tickets`
- Vendor ticket replies: GET/POST `/api/vendor/tickets/{id}/replies`
- Vendor ticket SLA: GET/POST `/api/vendor/tickets/sla`

## Livechat
- POST `/api/vendor/livechat/sessions` — mulai sesi chat
- POST `/api/vendor/livechat/sessions/{id}/messages` — kirim pesan
- GET `/api/vendor/livechat/sessions/{id}/messages` — riwayat pesan

## Dashboard
- GET `/api/koperasi/dashboard/summary`; GET `/api/koperasi/dashboard/trend`; GET `/api/koperasi/dashboard/notifications`
- GET `/api/vendor/dashboard`
