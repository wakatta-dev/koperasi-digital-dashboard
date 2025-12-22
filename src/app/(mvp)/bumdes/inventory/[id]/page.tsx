/** @format */

import { InventoryDetailPage } from "@/modules/inventory/components/inventory-detail-page";

type PageProps = {
  params: { id: string };
};

export default function InventoryDetailRoutePage({ params }: PageProps) {
  return <InventoryDetailPage id={params.id} />;
}
