/** @format */

import { OrderDetailPage } from "@/modules/marketplace/order/components/order-detail-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
