# Vendor Dashboard

## Path
`/vendor/dashboard`

## Main Features
- Displays key statistics like revenue, active products, client count and pending invoices.
- Shows recent orders with status indicators.
- Provides quick action links for frequent tasks such as adding products or creating invoices.

## Component Dependencies
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`, `Badge`
- Icons from `lucide-react`: `DollarSign`, `Package`, `Users`, `FileText`, `Ticket`, `TrendingUp`

## API Endpoints
- `GET /dashboard/summary/client` - fetches revenue, product, client and invoice metrics.
- `GET /orders/recent` - retrieves recent order activity.

## Data Format
### Summary Item
```json
{
  "title": "Total Revenue",
  "value": "Rp 2,450,000",
  "change": "+12.5%",
  "trend": "up"
}
```

### Recent Order
```json
{
  "client": "PT Maju Jaya",
  "product": "Office Supplies",
  "amount": "Rp 450,000",
  "status": "completed"
}
```
