/** @format */

import type { Metadata } from "next";

import { MarketplaceProductDetailPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Detail Produk - BUMDes Sukamaju",
  description: "Detail produk marketplace desa Sukamaju.",
};

export default function MarketplaceProductDetail({
  params,
}: {
  params: { id: string };
}) {
  return <MarketplaceProductDetailPage productId={params.id} />;
}
