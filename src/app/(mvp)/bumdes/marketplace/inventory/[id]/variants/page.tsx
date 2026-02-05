/** @format */

import { ProductVariantPage } from "@/modules/marketplace/components/penjualan/ProductVariantPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InventoryVariantPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductVariantPage id={id} />;
}
