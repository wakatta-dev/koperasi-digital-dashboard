/** @format */

import { ProductEditPage } from "@/modules/marketplace/components/penjualan/ProductEditPage";

type PageProps = {
  params: { id: string };
};

export default function InventoryEditPage({ params }: PageProps) {
  return <ProductEditPage id={params.id} />;
}
