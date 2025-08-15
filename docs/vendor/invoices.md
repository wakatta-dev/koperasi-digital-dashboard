# Invoices

## Path
`/vendor/invoices`

## Main Features
- Provides a list of invoices with amount, due date, and status badges.
- Includes search functionality and an option to create invoices.
- Supports viewing and downloading invoice details.

## Component Dependencies
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- `Button`, `Badge`, `Input`
- Icons from `lucide-react`: `FileText`, `Plus`, `Search`, `Download`, `Eye`

## API Endpoints
- `GET /invoices` - fetch invoices.
- `POST /invoices` - create new invoice.
- `GET /invoices/:id` - view invoice details.
- `PATCH /invoices/:id` - update invoice or mark as paid.

## Data Format
```json
{
  "id": "INV-001",
  "client": "PT Maju Jaya",
  "amount": "Rp 2,450,000",
  "date": "2024-01-15",
  "dueDate": "2024-02-15",
  "status": "paid"
}
```
