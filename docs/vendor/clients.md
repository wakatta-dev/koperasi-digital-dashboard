# Clients

## Path
`/vendor/clients`

## Main Features
- Lists clients with contact details, total orders, and total spent.
- Includes search functionality and the option to add new clients.
- Displays client status and provides a button to view details.

## Component Dependencies
- `Card`, `CardHeader`, `CardContent`, `CardTitle`
- `Button`, `Badge`, `Input`
- Icons from `lucide-react`: `Plus`, `Search`, `Mail`, `Phone`

## API Endpoints
- `GET /clients` - retrieve clients.
- `POST /clients` - register a new client.
- `PUT /clients/:id` - update client information.

## Data Format
```json
{
  "id": "1",
  "name": "PT Maju Jaya",
  "email": "contact@majujaya.com",
  "phone": "+62 21 1234567",
  "totalOrders": 15,
  "totalSpent": "Rp 12,500,000",
  "status": "active"
}
```
