/** @format */

import { InventoryDetailPage } from "@/modules/inventory/components/inventory-detail-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceInventoryDetailPage({
  params,
}: PageProps) {
  const paramsResolved = await params;
  return <InventoryDetailPage id={paramsResolved.id} />;
}
