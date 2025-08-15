# Notifications

## Path
`/vendor/notifications`

## Main Features
- Shows recent notifications with type indicators and timestamps.
- Allows marking all notifications as read.
- Highlights unread notifications for quick visibility.

## Component Dependencies
- `Card`, `CardContent`
- `Button`, `Badge`
- Icons from `lucide-react`: `CheckCircle`, `AlertCircle`, `Info`

## API Endpoints
- `GET /notifications` - list notifications.
- `PATCH /notifications/:id/read` - mark notification as read.

## Data Format
```json
{
  "id": "1",
  "title": "New Order Received",
  "message": "PT Maju Jaya placed a new order worth Rp 2,450,000",
  "type": "success",
  "time": "2 hours ago",
  "read": false
}
```
