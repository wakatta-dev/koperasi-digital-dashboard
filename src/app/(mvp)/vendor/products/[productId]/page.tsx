/** @format */

import { VendorFeaturePlaceholderPage } from "@/modules/vendor";

type VendorProductDetailPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function VendorProductDetailPage({
  params,
}: VendorProductDetailPageProps) {
  const { productId } = await params;
  return (
    <VendorFeaturePlaceholderPage
      title={`Product ${productId}`}
      description="Halaman detail modul/produk vendor masih menunggu kontrak admin product catalog."
    />
  );
}
