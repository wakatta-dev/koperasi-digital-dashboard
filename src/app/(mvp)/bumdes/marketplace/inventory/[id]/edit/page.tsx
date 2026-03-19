/** @format */

import type { Metadata } from "next";

import { ProductEditPage } from "@/modules/marketplace/components/penjualan/ProductEditPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Inventory - Detail - Edit - Koperasi Digital",
  description: "Bumdes - Marketplace - Inventory - Detail - Edit page.",
};

export default async function InventoryEditPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div data-testid="marketplace-admin-product-edit-route-root">
      <ProductEditPage id={id} />
    </div>
  );
}
