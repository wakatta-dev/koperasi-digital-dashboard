/** @format */

import type { Metadata } from "next";

import { ProductListPage } from "@/modules/marketplace/components/penjualan/ProductListPage";

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Inventory - Koperasi Digital",
  description: "Bumdes - Marketplace - Inventory page.",
};

export default function MarketplaceInventoryPage() {
  return (
    <div data-testid="marketplace-admin-inventory-route-root">
      <ProductListPage />
    </div>
  );
}
