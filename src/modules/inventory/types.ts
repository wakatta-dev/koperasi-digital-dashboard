/** @format */

export type InventoryItem = {
  name: string;
  sku: string;
  category: string;
  categoryClassName: string;
  stock: number | string;
  price: number | string;
  image: string;
  product: {
    id: string;
    name: string;
    category: string;
    img: string | null;
  };
  id: string;
};
