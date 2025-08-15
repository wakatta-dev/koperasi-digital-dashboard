# Products

## Path
`/vendor/products`

## Main Features
- Presents a searchable list of products with price, stock, and status.
- Supports adding, editing, and deleting items in the catalog.
- Provides basic filter and search utilities.

## Component Dependencies
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- `Button`, `Badge`, `Input`
- Icons from `lucide-react`: `Package`, `Plus`, `Search`, `Edit`, `Trash2`

## API Endpoints
- `GET /products` - retrieve product list.
- `POST /products` - add a new product.
- `PUT /products/:id` - update product details.
- `DELETE /products/:id` - remove product.

## Data Format
```json
{
  "id": "1",
  "name": "Office Chair Premium",
  "category": "Furniture",
  "price": "Rp 1,250,000",
  "stock": 45,
  "status": "active"
}
```
