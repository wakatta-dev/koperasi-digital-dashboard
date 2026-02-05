/** @format */

import { ProductDetailPage } from "@/modules/marketplace/components/penjualan/ProductDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceInventoryDetailPage({
  params,
}: PageProps) {
  const paramsResolved = await params;
  return <ProductDetailPage id={paramsResolved.id} />;
}
