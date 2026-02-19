/** @format */

import { describe, expect, it } from "vitest";

import { mapContractAssetToFormModel } from "@/modules/asset/utils/stitch-contract-mappers";

describe("asset-rental stitch contract mappers", () => {
  it("maps rental price as primary form price and keeps purchase price optional", () => {
    const model = mapContractAssetToFormModel({
      id: 11,
      name: "Generator",
      rate_amount: 250000,
      purchase_price: 15000000,
      description: "Lokasi: Gudang Barat; Kondisi prima",
    });

    expect(model.rentalPriceDisplay).toBe("250000");
    expect(model.purchasePriceDisplay).toBe("15000000");
    expect(model.location).toBe("Gudang Barat");
    expect(model.description).toBe("Kondisi prima");
  });

  it("builds multiline description from structured specifications", () => {
    const model = mapContractAssetToFormModel({
      id: 12,
      name: "Laptop Operasional",
      rate_amount: 100000,
      specifications: [
        { label: "Processor", value: "Intel Core i7" },
        { label: "RAM", value: "16 GB" },
      ],
    });

    expect(model.description).toBe("Processor: Intel Core i7\nRAM: 16 GB");
    expect(model.rentalPriceDisplay).toBe("100000");
    expect(model.purchasePriceDisplay).toBe("");
  });
});
