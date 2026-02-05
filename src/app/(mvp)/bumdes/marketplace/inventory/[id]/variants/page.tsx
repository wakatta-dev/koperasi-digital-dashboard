/** @format */

import { ProductVariantPage } from "@/modules/marketplace/components/penjualan/ProductVariantPage";

type PageProps = {
  params: { id: string };
};

export default function InventoryVariantPage({ params }: PageProps) {
  return <ProductVariantPage id={params.id} />;
}
