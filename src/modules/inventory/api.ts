export async function getInventory() {
  const response = await fetch('/api/inventory')
  return response.json()
}
