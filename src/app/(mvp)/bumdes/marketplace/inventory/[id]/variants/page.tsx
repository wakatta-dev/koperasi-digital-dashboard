/** @format */

import type { Metadata } from "next";

import { ProductVariantPage } from "@/modules/marketplace/components/penjualan/ProductVariantPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Inventory - Detail - Variants - Koperasi Digital",
  description: "Bumdes - Marketplace - Inventory - Detail - Variants page.",
};

export default async function InventoryVariantPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div data-testid="marketplace-admin-product-variants-route-root">
      <ProductVariantPage id={id} />
    </div>
  );
}
