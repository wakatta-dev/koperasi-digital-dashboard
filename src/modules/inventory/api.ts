/** @format */

import { ensureSuccess } from "@/lib/api";
import { listInventoryProducts } from "@/services/api";
import { mapInventoryProduct } from "./utils";
import type { InventoryItem } from "./types";

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await listInventoryProducts();
  const data = ensureSuccess(res);
  return data.items.map(mapInventoryProduct);
}
