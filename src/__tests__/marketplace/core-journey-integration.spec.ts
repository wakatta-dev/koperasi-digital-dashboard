/** @format */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(relPath: string) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

describe("buyer core journey integration", () => {
  it("keeps checkout route transition on replacement payment route", () => {
    const source = read("src/modules/marketplace/cart-page.tsx");
    expect(source).toContain("/marketplace/pembayaran?order_id=");
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
