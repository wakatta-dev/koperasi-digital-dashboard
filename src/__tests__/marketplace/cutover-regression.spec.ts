/** @format */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(relPath: string) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

describe("marketplace cutover regression", () => {
  it("keeps buyer route entrypoints wired to replacement module pages", () => {
    const listing = read("src/app/marketplace/page.tsx");
    const detail = read("src/app/marketplace/[id]/page.tsx");
    const cart = read("src/app/marketplace/keranjang/page.tsx");
    const payment = read("src/app/marketplace/pembayaran/page.tsx");
    const confirmation = read("src/app/marketplace/konfirmasi/page.tsx");
    const shipping = read("src/app/marketplace/pengiriman/page.tsx");
    const review = read("src/app/marketplace/ulasan/page.tsx");

    expect(listing).toContain("MarketplacePage");
    expect(detail).toContain("MarketplaceProductDetailPage");
    expect(cart).toContain("MarketplaceCartPage");
    expect(payment).toContain("MarketplacePaymentPage");
    expect(confirmation).toContain("MarketplaceConfirmationPage");
    expect(shipping).toContain("MarketplaceShippingPage");
    expect(review).toContain("MarketplaceReviewPage");
  });

  it("keeps CTA targets on replacement buyer routes", () => {
    const summaryCard = read("src/modules/marketplace/components/order/order-summary-card.tsx");
    const paymentPage = read("src/modules/marketplace/payment-page.tsx");
    const header = read("src/modules/marketplace/components/layout/header.tsx");

    expect(summaryCard).toContain('href="/marketplace/pembayaran"');
    expect(paymentPage).toContain("/marketplace/konfirmasi?order_id=");
    expect(paymentPage).not.toContain('router.push("/marketplace/ulasan")');
    expect(header).toContain('href="/marketplace/pengiriman"');
  });

  it("keeps tracking and review pages on replacement feature components only", () => {
    const shippingPage = read("src/modules/marketplace/shipping-page.tsx");
    const reviewPage = read("src/modules/marketplace/review-page.tsx");

    expect(shippingPage).toContain("TrackingFormFeature");
    expect(shippingPage).toContain("StatusDetailFeature");
    expect(shippingPage).toContain("ReviewOverlayDialog");
    expect(shippingPage).not.toContain("ShippingSteps");
    expect(shippingPage).not.toContain("ShippingBreadcrumbs");

    expect(reviewPage).toContain("ReviewOverlayDialog");
    expect(reviewPage).not.toContain("ReviewSteps");
    expect(reviewPage).not.toContain("ReviewBreadcrumbs");
  });

  it("removes legacy buyer wrapper files for covered cutover scope", () => {
    const removedFiles = [
      "src/modules/marketplace/components/review/review-breadcrumbs.tsx",
      "src/modules/marketplace/components/review/review-steps.tsx",
      "src/modules/marketplace/components/shipping/shipping-breadcrumbs.tsx",
      "src/modules/marketplace/components/shipping/shipping-steps.tsx",
      "src/modules/marketplace/state/checkout-store.ts",
    ];

    removedFiles.forEach((relPath) => {
      expect(fs.existsSync(path.join(ROOT, relPath))).toBe(false);
    });
  });
});
