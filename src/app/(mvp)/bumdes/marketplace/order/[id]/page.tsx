/** @format */

import { OrderDetailPage } from "@/modules/marketplace/components/penjualan/OrderDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div data-testid="marketplace-admin-order-detail-route-root">
      <OrderDetailPage id={id} />
    </div>
  );
}
