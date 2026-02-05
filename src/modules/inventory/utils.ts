/** @format */

import type { InventoryProductResponse } from "@/types/api/inventory";
import type { InventoryItem } from "./types";

export function computeEligibility(product: InventoryProductResponse) {
  const reasons: string[] = [];
  const hasVariants = product.has_variants ?? false;
  const variantsRequired = product.variants_required ?? false;
  const variantInStock = product.variant_in_stock ?? false;
  const variantPriceValid = product.variant_price_valid ?? true;
  if (product.status !== "ACTIVE") {
    reasons.push("Status bukan ACTIVE");
  }
  if (!product.show_in_marketplace) {
    reasons.push("Disembunyikan");
  }
  if (hasVariants) {
    if (!variantsRequired) {
      reasons.push("Varian belum lengkap");
    } else if (!variantPriceValid) {
      reasons.push("Harga varian belum diatur");
    } else if (!variantInStock) {
      reasons.push("Varian habis");
    }
  } else if (product.price_sell <= 0) {
    reasons.push("Harga belum diatur");
  } else if (product.track_stock && product.stock <= 0) {
    reasons.push("Stok habis");
  }
  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function mapInventoryProduct(product: InventoryProductResponse): InventoryItem {
  const eligibility = computeEligibility(product);
  const images = product.images && product.images.length > 0
    ? product.images
    : product.photo_url
      ? [
          {
            id: 0,
            url: product.photo_url,
            is_primary: true,
            sort_order: 0,
          },
        ]
      : [];
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];
  return {
    id: String(product.id),
    name: product.name,
    sku: product.sku,
    product,
    category: product.category,
    categoryClassName: product.category ?? "",
    stock: product.stock,
    price: product.price_sell,
    image: primaryImage?.url,
    images,
    brand: product.brand,
    weightKg: product.weight_kg,
    createdAt: product.created_at,
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
