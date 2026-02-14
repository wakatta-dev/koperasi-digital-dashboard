/** @format */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(relPath: string) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

describe("buyer core journey integration", () => {
  it("keeps checkout summary CTA on replacement payment route", () => {
    const source = read(
      "src/modules/marketplace/components/order/order-summary-card.tsx",
    );

    expect(source).toContain('href="/marketplace/pembayaran"');
  });

  it("routes payment confirmation into replacement confirmation page", () => {
    const source = read("src/modules/marketplace/payment-page.tsx");

    expect(source).toContain("/marketplace/konfirmasi?order_id=");
    expect(source).not.toContain('router.push("/marketplace/ulasan")');
  });

  it("keeps core buyer page entrypoints wired to marketplace module exports", () => {
    const cartPage = read("src/app/marketplace/keranjang/page.tsx");
    const paymentPage = read("src/app/marketplace/pembayaran/page.tsx");
    const confirmationPage = read("src/app/marketplace/konfirmasi/page.tsx");

    expect(cartPage).toContain("MarketplaceCartPage");
    expect(paymentPage).toContain("MarketplacePaymentPage");
    expect(confirmationPage).toContain("MarketplaceConfirmationPage");
  });

  it("keeps route metadata aligned for core journey pages", () => {
    const cartPage = read("src/app/marketplace/keranjang/page.tsx");
    const paymentPage = read("src/app/marketplace/pembayaran/page.tsx");
    const confirmationPage = read("src/app/marketplace/konfirmasi/page.tsx");

    expect(cartPage).toContain("Keranjang Belanja - BUMDes Sukamaju");
    expect(paymentPage).toContain("Metode Pembayaran - BUMDes Sukamaju");
    expect(confirmationPage).toContain("Pesanan Berhasil - BUMDes Sukamaju");
  });
});
