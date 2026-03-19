/** @format */

import type { Metadata } from "next";

import { VendorProductDetailPage } from "@/modules/vendor";

type VendorProductDetailPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Products - Detail - Koperasi Digital",
  description: "Vendor - Products - Detail page.",
};

export default async function VendorProductDetailRoute({
  params,
}: VendorProductDetailPageProps) {
  const { productId } = await params;
  return <VendorProductDetailPage productId={productId} />;
}
