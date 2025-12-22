/** @format */

import type { InventoryProductResponse } from "@/types/api/inventory";
import type { InventoryItem } from "./types";

export function computeEligibility(product: InventoryProductResponse) {
  const reasons: string[] = [];
  if (product.status !== "ACTIVE") {
    reasons.push("Status bukan ACTIVE");
  }
  if (!product.show_in_marketplace) {
    reasons.push("Disembunyikan");
  }
  if (product.price_sell <= 0) {
    reasons.push("Harga belum diatur");
  }
  if (product.track_stock && product.stock <= 0) {
    reasons.push("Stok habis");
  }
  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function mapInventoryProduct(product: InventoryProductResponse): InventoryItem {
  const eligibility = computeEligibility(product);
  return {
    id: String(product.id),
    name: product.name,
    sku: product.sku,
    product,
    category: product.category,
    categoryClassName: product.category ?? "",
    stock: product.stock,
    price: product.price_sell,
    image: product.photo_url || "https://via.placeholder.com/80x80?text=Produk",
    status: product.status,
    showInMarketplace: product.show_in_marketplace,
    trackStock: product.track_stock,
    description: product.description,
    minStock: product.min_stock,
    costPrice: product.cost_price,
    marketplaceEligible: eligibility.eligible,
    ineligibleReasons: eligibility.reasons,
  };
}
