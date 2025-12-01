export type InventoryItem = {
  id: string
  product: { name: string, img: string | null, category: string }
  price: number
  sku: string
  stock: number
}
