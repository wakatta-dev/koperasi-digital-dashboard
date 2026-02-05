/** @format */

import { ProductEditPage } from "@/modules/marketplace/components/penjualan/ProductEditPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InventoryEditPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductEditPage id={id} />;
}
