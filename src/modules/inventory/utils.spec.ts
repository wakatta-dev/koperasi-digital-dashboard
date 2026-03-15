/** @format */

import { describe, expect, it } from "vitest";
import {
  computeEligibility,
  computeMarketplacePublicationReadiness,
  mapInventoryProduct,
} from "./utils";

describe("inventory publication readiness", () => {
  it("reports missing publication requirements for draft product", () => {
    const readiness = computeMarketplacePublicationReadiness(
      {
        id: 1,
        name: "Kopi Desa",
        sku: "KOP-001",
        price_sell: 15000,
        track_stock: true,
        category: "",
        status: "ACTIVE",
        stock: 0,
        description: "",
        show_in_marketplace: false,
        has_variants: false,
      },
      { requireImage: true },
    );

    expect(readiness.ready).toBe(false);
    expect(readiness.reasons).toContain("Pilih kategori produk");
    expect(readiness.reasons).toContain("Lengkapi deskripsi produk");
    expect(readiness.reasons).toContain("Unggah minimal satu gambar produk");
    expect(readiness.reasons).toContain("Isi stok produk lebih dari 0");
  });

  it("marks hidden but complete product as draft instead of eligible", () => {
    const eligibility = computeEligibility({
      id: 2,
      name: "Kopi Desa",
      sku: "KOP-002",
      price_sell: 15000,
      track_stock: true,
      category: "Pangan",
      status: "ACTIVE",
      stock: 5,
      description: "Kopi robusta pilihan",
      photo_url: "https://cdn.example.com/kopi.jpg",
      show_in_marketplace: false,
      has_variants: false,
    });

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.reasons[0]).toBe("Produk masih draft internal");
  });

  it("marks complete visible product as eligible", () => {
    const eligibility = computeEligibility({
      id: 3,
      name: "Kopi Desa",
      sku: "KOP-003",
      price_sell: 15000,
      track_stock: true,
      category: "Pangan",
      status: "ACTIVE",
      stock: 5,
      description: "Kopi robusta pilihan",
      images: [
        {
          id: 1,
          url: "https://cdn.example.com/kopi.jpg",
          is_primary: true,
          sort_order: 0,
        },
      ],
      show_in_marketplace: true,
      has_variants: false,
    });

    expect(eligibility.eligible).toBe(true);
    expect(eligibility.reasons).toHaveLength(0);
  });

  it("maps canonical listing context when present", () => {
    const mapped = mapInventoryProduct({
      id: 77,
      listing_id: 901,
      name: "Kopi Listing",
      sku: "KOPI-LIST",
      price_sell: 15000,
      track_stock: true,
      stock: 7,
      status: "ACTIVE",
      description: "Kopi siap jual",
      category: "Pangan",
      show_in_marketplace: true,
      seller_id: 11,
      ownership_mode: "merchant_payout",
      channel_target: "marketplace",
      publishability_state: "published",
      source_stock_type: "inventory_product",
      source_stock_reference: "77",
      images: [{ id: 1, url: "https://cdn.example.com/kopi.jpg", is_primary: true, sort_order: 0 }],
    });

    expect(mapped.listingId).toBe(901);
    expect(mapped.sellerId).toBe(11);
    expect(mapped.ownershipMode).toBe("merchant_payout");
    expect(mapped.publishabilityState).toBe("published");
    expect(mapped.sourceStockReference).toBe("77");
  });
});
