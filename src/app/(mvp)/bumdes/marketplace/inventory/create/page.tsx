/** @format */

import type { Metadata } from "next";

import { ProductCreatePage } from "@/modules/marketplace/components/penjualan/ProductCreatePage";

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Inventory - Create - Koperasi Digital",
  description: "Bumdes - Marketplace - Inventory - Create page.",
};

export default function InventoryCreatePage() {
  return (
    <div data-testid="marketplace-admin-product-create-route-root">
      <ProductCreatePage />
    </div>
  );
}
