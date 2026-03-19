/** @format */

import { ProductVariantPage } from "@/modules/marketplace/components/penjualan/ProductVariantPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InventoryVariantPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div data-testid="marketplace-admin-product-variants-route-root">
      <ProductVariantPage id={id} />
    </div>
  );
}
