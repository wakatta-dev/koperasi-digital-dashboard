# Admin & Billing Dashboard API Endpoints

This document provides detailed REST API specifications for building the internal Admin Dashboard and Billing Dashboard. All endpoints are prefixed with `/api` and expect/return JSON. Authenticated routes require a `Bearer` token in the `Authorization` header.

## Authentication & User Management

### POST /api/auth/register
Registers a new user.

**Request Body**
```json
{
  "email": "user@example.com",
  "full_name": "Admin User",
  "password": "string",
  "role": "superadmin"
}
```

### POST /api/auth/login
Logs in a user and returns auth token.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

### POST /api/auth/forgot-password
Request password reset email.

**Request Body**
```json
{ "email": "user@example.com" }
```

### POST /api/auth/reset-password
Reset password using token.

**Request Body**
```json
{
  "token": "reset-token",
  "password": "newPassword"
}
```

### GET /api/users/me
Get current authenticated user.

### GET /api/users
List users.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

### POST /api/users/invite
Invite a new user by email.

**Request Body**
```json
{ "email": "invitee@example.com" }
```

### PATCH /api/users/{id}/role
Update user role.

**Path Parameters**
- `id` – user identifier

**Request Body**
```json
{ "role": "admin" }
```

### PATCH /api/users/{id}/deactivate
Deactivate a user account.

**Path Parameters**
- `id` – user identifier

## Business Profile

### GET /api/business-profile
Retrieve business profile.

### PATCH /api/business-profile
Update business profile.

**Request Body**
```json
{
  "name": "Koperasi Makmur",
  "address": "Jl. Merdeka 1",
  "phone": "+62xxx"
}
```

## Member Management

### GET /api/anggota
Paginated list of members.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

### POST /api/anggota/register
Register new member.

**Request Body**
```json
{
  "membership_number": "123",
  "user_id": "uuid",
  "status": "active"
}
```

### GET /api/anggota/{id}
Get member detail.

**Path Parameters**
- `id` – member ID

### PATCH /api/anggota/{id}
Update member information.

**Path Parameters**
- `id` – member ID

**Request Body**
```json
{
  "membership_number": "123",
  "status": "inactive"
}
```

### PATCH /api/anggota/{id}/status
Change member status.

**Path Parameters**
- `id` – member ID

**Request Body**
```json
{ "status": "active" }
```

### GET /api/anggota/contributions/{id}
Get member savings and loan totals.

**Path Parameters**
- `id` – member ID

## Savings Module

### GET /api/simpanan/savings
List savings accounts.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

### POST /api/simpanan/savings
Create a savings account.

**Request Body**
```json
{
  "member_id": "uuid",
  "type": "wajib",
  "scheme": "konvensional",
  "balance": 0
}
```

### GET /api/simpanan/savings/admin-summary
Admin summary for savings.

### PATCH /api/simpanan/savings/approve-withdrawal
Approve pending withdrawal.

**Request Body**
```json
{ "id": "withdrawal-id" }
```

### POST /api/simpanan/savings/deposit
Deposit into a savings account.

**Request Body**
```json
{
  "savings_id": "uuid",
  "amount": 100000
}
```

### POST /api/simpanan/savings/distribute-profit-sharing
Distribute profit sharing.

**Request Body**
```json
{
  "savings_id": "uuid",
  "amount": 50000
}
```

### GET /api/simpanan/savings/transactions
Get savings transactions.

**Query Parameters**
- `savings_id` (string, required)

### GET /api/simpanan/savings/types
Get list of savings types.

### PATCH /api/simpanan/savings/verify-deposit
Verify manual deposit.

**Request Body**
```json
{ "id": "transaction-id" }
```

### POST /api/simpanan/savings/withdrawal
Request withdrawal from savings.

**Request Body**
```json
{
  "savings_id": "uuid",
  "amount": 75000
}
```

## Loan Module

### GET /api/pinjaman
List loans.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

### POST /api/pinjaman/apply
Apply for a loan.

**Request Body**
```json
{
  "member_id": "uuid",
  "principal": 1000000,
  "margin": 0.1,
  "tenor": 12,
  "scheme": "murabahah"
}
```

### GET /api/pinjaman/{id}
Get loan detail.

**Path Parameters**
- `id` – loan ID

### PATCH /api/pinjaman/{id}/approve
Approve loan.

**Path Parameters**
- `id` – loan ID

### PATCH /api/pinjaman/{id}/reject
Reject loan.

**Path Parameters**
- `id` – loan ID

### GET /api/pinjaman/{id}/schedule
Get repayment schedule.

**Path Parameters**
- `id` – loan ID

### POST /api/pinjaman/{id}/repayment
Record loan repayment.

**Path Parameters**
- `id` – loan ID

### POST /api/pinjaman/sign-agreement
Sign loan agreement.

**Request Body**
```json
{ "loan_id": "uuid" }
```

### GET /api/pinjaman/admin-summary
Admin loan metrics summary.

## SHU Module

### GET /api/shu
List SHU allocations.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

### GET /api/shu/admin-preview
Preview SHU calculation.

### POST /api/shu/allocate
Create annual SHU allocation.

**Request Body**
```json
{
  "year": 2024,
  "total_amount": 100000000
}
```

### POST /api/shu/distribute
Distribute SHU to member.

**Request Body**
```json
{
  "allocation_id": "uuid",
  "member_id": "uuid",
  "amount": 100000
}
```

### GET /api/shu/history
List SHU distribution history.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

## Dashboard Metrics

### GET /api/dashboard/summary
Overall business summary.

### GET /api/dashboard/sales-chart
Sales chart data.

### GET /api/dashboard/top-products
Top selling products.

### GET /api/dashboard/notifications
Recent notifications for dashboard.

## Reports

### GET /api/reports/profit-loss
Profit & loss report.

### GET /api/reports/cashflow
Cash flow report.

### GET /api/reports/balance-sheet
Balance sheet report.

### GET /api/reports/sales
Sales summary report.

### GET /api/reports/sales-products
Best selling products report.

### GET /api/reports/export
Export report.

**Query Parameters**
- `type` (string, required) – e.g., `csv`

## Module & Billing Management

### GET /api/modules
List available modules.

**Query Parameters**
- `limit` (integer, optional)
- `cursor` (string, optional)

### POST /api/modules/{id}/activate
Activate a module.

**Path Parameters**
- `id` – module ID

### POST /api/modules/{id}/deactivate
Deactivate a module.

**Path Parameters**
- `id` – module ID

### GET /api/billing/summary
Billing summary for active modules.

### GET /api/billing/usage
Usage metrics per module.

## FAQ & Help Center

### GET /api/faq
List FAQs. Supports optional search query.

**Query Parameters**
- `search` (string, optional)

### GET /api/faq/categories
List FAQ categories.

### POST /api/faq/{id}/feedback
Submit helpful/not helpful feedback.

**Path Parameters**
- `id` – FAQ ID

**Request Body**
```json
{ "helpful": true }
```

### POST /api/faq
Create FAQ (admin only).

**Request Body**
```json
{
  "question": "How to register?",
  "answer": "Use the register form",
  "category_id": "uuid"
}
```

### PUT /api/faq/{id}
Update FAQ entry.

**Path Parameters**
- `id` – FAQ ID

### DELETE /api/faq/{id}
Remove FAQ entry.

**Path Parameters**
- `id` – FAQ ID

### POST /api/faq/categories
Create FAQ category.

**Request Body**
```json
{ "name": "General" }
```

### PUT /api/faq/categories/{id}
Update FAQ category.

**Path Parameters**
- `id` – Category ID

### DELETE /api/faq/categories/{id}
Delete FAQ category.

**Path Parameters**
- `id` – Category ID

## Business Unit Management

### GET /api/business-units
List business units.

### POST /api/business-units
Create new unit.

**Request Body**
```json
{ "name": "Unit A" }
```

### PUT /api/business-units/{id}
Update unit.

**Path Parameters**
- `id` – unit ID

### DELETE /api/business-units/{id}
Delete unit.

**Path Parameters**
- `id` – unit ID

### PATCH /api/users/{id}/assign-unit
Assign user to unit.

**Path Parameters**
- `id` – user ID

**Request Body**
```json
{ "unit_id": "uuid" }
```

### GET /api/reports/by-unit
Reports filtered by business unit.

**Query Parameters**
- `unit_id` (string, required)

## Billing Dashboard Widgets

### GET /api/billing/summary
Return total price and active modules for home widget.

### GET /api/billing/usage
Return usage quota per module.

---

All endpoints respond with a standard envelope:
```json
{
  "message": "string",
  "data": { ... }
}
```