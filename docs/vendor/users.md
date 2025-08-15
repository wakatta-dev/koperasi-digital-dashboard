# Users

## Path
`/vendor/users`

## Main Features
- Manages team members with roles, status, and last login information.
- Provides search and ability to add new users.
- Offers edit and delete actions for each user.

## Component Dependencies
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- `Button`, `Badge`, `Input`
- Icons from `lucide-react`: `Users`, `Plus`, `Search`, `Shield`, `Edit`, `Trash2`

## API Endpoints
- `GET /users` - list team members.
- `POST /users` - add a user.
- `PATCH /users/:id` - update user role or status.
- `DELETE /users/:id` - remove user.

## Data Format
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@vendor.com",
  "role": "Admin",
  "status": "active",
  "lastLogin": "2024-01-15"
}
```
