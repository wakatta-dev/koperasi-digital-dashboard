# Support Tickets

## Path
`/vendor/tickets`

## Main Features
- Lists support tickets with priority, status, and last update information.
- Allows creating new tickets and searching existing ones.
- Shows timestamps for creation and updates for each ticket.

## Component Dependencies
- `Card`, `CardContent`
- `Button`, `Badge`, `Input`
- Icons from `lucide-react`: `Ticket`, `Plus`, `Search`, `MessageCircle`, `Clock`

## API Endpoints
- `GET /tickets` - list support tickets.
- `POST /tickets` - create a new ticket.
- `PUT /tickets/:id` - update ticket status or details.

## Data Format
```json
{
  "id": "TKT-001",
  "title": "Payment Gateway Integration Issue",
  "description": "Having trouble with payment processing for large orders",
  "priority": "high",
  "status": "open",
  "created": "2024-01-15",
  "lastUpdate": "2024-01-16"
}
```
