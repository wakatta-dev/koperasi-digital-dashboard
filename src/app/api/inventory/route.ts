/** @format */

import { InventoryItem } from "@/modules/inventory/types";

export async function GET() {
  const datas: InventoryItem[] = [
    {
      id: "728ed52f",
      product: {
        name: "Power Bank 20.000mAh AirTech",
        img: null,
        category: "Elektronik",
        id: "p1",
      },
      sku: "VD876543",
      stock: 113,
      price: 35000,
      name: "",
      category: "",
      categoryClassName: "",
      image: "",
    },
    {
      id: "728ed52h",
      product: {
        name: "Keripik Pisang",
        img: null,
        category: "Makanan & Minuman",
        id: "p2",
      },
      sku: "BD345678",
      stock: 200,
      price: 150000,
      name: "",
      category: "",
      categoryClassName: "",
      image: "",
    },
    {
      id: "728ed52z",
      product: {
        name: "Macbook M1 Pro",
        img: null,
        category: "Elektronik",
        id: "p3",
      },
      sku: "MP345678",
      stock: 50,
      price: 25000000,
      name: "",
      category: "",
      categoryClassName: "",
      image: "",
    },
  ];

  return new Response(JSON.stringify(datas), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
