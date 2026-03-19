/** @format */

import type { Metadata } from "next";

import { OrderManualPaymentPage } from "@/modules/marketplace/order/components/order-manual-payment-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Order - Detail - Manual Payment - Koperasi Digital",
  description: "Bumdes - Marketplace - Order - Detail - Manual Payment page.",
};

export default async function MarketplaceOrderManualPaymentPage({
  params,
}: PageProps) {
  const { id } = await params;
  return (
    <div data-testid="marketplace-admin-order-manual-payment-route-root">
      <OrderManualPaymentPage id={id} />
    </div>
  );
}
