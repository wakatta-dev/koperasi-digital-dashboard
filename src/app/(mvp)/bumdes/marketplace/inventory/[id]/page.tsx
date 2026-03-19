/** @format */

import type { Metadata } from "next";

import { ProductDetailPage } from "@/modules/marketplace/components/penjualan/ProductDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Inventory - Detail - Koperasi Digital",
  description: "Bumdes - Marketplace - Inventory - Detail page.",
};

export default async function MarketplaceInventoryDetailPage({
  params,
}: PageProps) {
  const paramsResolved = await params;
  return <ProductDetailPage id={paramsResolved.id} />;
}
