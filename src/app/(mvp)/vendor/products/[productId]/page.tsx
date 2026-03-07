/** @format */

import { VendorProductDetailPage } from "@/modules/vendor";

type VendorProductDetailPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function VendorProductDetailRoute({
  params,
}: VendorProductDetailPageProps) {
  const { productId } = await params;
  return <VendorProductDetailPage productId={productId} />;
}
