/** @format */

import { OrderManualPaymentPage } from "@/modules/marketplace/order/components/order-manual-payment-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceOrderManualPaymentPage({
  params,
}: PageProps) {
  const { id } = await params;
  return <OrderManualPaymentPage id={id} />;
}
