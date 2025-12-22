/** @format */

import type { Metadata } from "next";

import { MarketplaceProductDetailPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Detail Produk - BUMDes Sukamaju",
  description: "Detail produk marketplace desa Sukamaju.",
};

export default async function MarketplaceProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsResolved = await params;
  return <MarketplaceProductDetailPage productId={paramsResolved.id} />;
}
