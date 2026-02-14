/** @format */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(relPath: string) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

describe("marketplace quickstart coverage", () => {
  it("keeps all documented buyer routes available in app router", () => {
    const routePages = [
      "src/app/marketplace/page.tsx",
      "src/app/marketplace/[id]/page.tsx",
      "src/app/marketplace/keranjang/page.tsx",
      "src/app/marketplace/pembayaran/page.tsx",
      "src/app/marketplace/pengiriman/page.tsx",
      "src/app/marketplace/konfirmasi/page.tsx",
      "src/app/marketplace/ulasan/page.tsx",
    ];

    routePages.forEach((relPath) => {
      expect(fs.existsSync(path.join(ROOT, relPath))).toBe(true);
    });
  });

  it("keeps marketplace module exports aligned with quickstart routes", () => {
    const indexSource = read("src/modules/marketplace/index.ts");

    expect(indexSource).toContain("MarketplacePage");
    expect(indexSource).toContain("MarketplaceProductDetailPage");
    expect(indexSource).toContain("MarketplaceCartPage");
    expect(indexSource).toContain("MarketplacePaymentPage");
    expect(indexSource).toContain("MarketplaceShippingPage");
    expect(indexSource).toContain("MarketplaceConfirmationPage");
    expect(indexSource).toContain("MarketplaceReviewPage");
  });
});
