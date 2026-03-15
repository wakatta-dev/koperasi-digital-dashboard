/** @format */

import type { InventoryProductResponse } from "@/types/api/inventory";
import type { InventoryItem } from "./types";

export function computeMarketplacePublicationReadiness(
  product: InventoryProductResponse,
  options?: { requireImage?: boolean },
) {
  const reasons: string[] = [];
  const hasVariants = product.has_variants ?? false;
  const variantsRequired = product.variants_required ?? false;
  const variantInStock = product.variant_in_stock ?? false;
  const variantPriceValid = product.variant_price_valid ?? true;

  if (product.status !== "ACTIVE") {
    reasons.push("Aktifkan produk terlebih dahulu");
  }
  if (!product.category?.trim()) {
    reasons.push("Pilih kategori produk");
  }
  if (!product.description?.trim()) {
    reasons.push("Lengkapi deskripsi produk");
  }
  const hasImage =
    (product.images ?? []).some((image) => Boolean(image.url)) ||
    Boolean(product.photo_url?.trim());
  if ((options?.requireImage ?? false) && !hasImage) {
    reasons.push("Unggah minimal satu gambar produk");
  }
  if (hasVariants) {
    if (!variantsRequired) {
      reasons.push("Lengkapi minimal satu varian aktif yang dapat dijual");
    } else if (!variantPriceValid) {
      reasons.push("Lengkapi harga varian yang dijual");
    } else if (!variantInStock) {
      reasons.push("Pastikan ada stok varian yang dijual");
    }
  } else if (product.price_sell <= 0) {
    reasons.push("Isi harga jual produk");
  } else if (product.track_stock && product.stock <= 0) {
    reasons.push("Isi stok produk lebih dari 0");
  }
  return {
    ready: reasons.length === 0,
    reasons,
  };
}

export function computeEligibility(product: InventoryProductResponse) {
  const publication = computeMarketplacePublicationReadiness(product);
  const reasons = [...publication.reasons];
  if (!product.show_in_marketplace) {
    reasons.unshift("Produk masih draft internal");
  }
  return {
    eligible: publication.ready && product.show_in_marketplace,
    reasons,
  };
}

export function mapInventoryProduct(product: InventoryProductResponse): InventoryItem {
  const eligibility = computeEligibility(product);
  const publication = computeMarketplacePublicationReadiness(product);
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
    listingId: product.listing_id ?? undefined,
    name: product.name,
    sku: product.sku,
    product,
    category: product.category,
    categoryClassName: product.category ?? "",
    stock: product.stock,
    price: product.price_sell,
    sellerId: (product as InventoryProductResponse & { seller_id?: string | number }).seller_id,
    ownershipMode: product.ownership_mode,
    channelTarget: product.channel_target,
    publishabilityState: product.publishability_state,
    sourceStockType: product.source_stock_type,
    sourceStockReference: product.source_stock_reference,
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
    marketplacePublicationReady: publication.ready,
    marketplacePublicationIssues: publication.reasons,
  };
}
