/** @format */

import type { Metadata } from "next";

import { MarketplacePaymentPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Metode Pembayaran - BUMDes Sukamaju",
  description: "Pilih metode pembayaran untuk pesanan marketplace BUMDes Sukamaju.",
};

type MarketplacePaymentPageRouteProps = {
  searchParams?: Promise<{ order_id?: string; tracking_token?: string }>;
};

export default async function MarketplacePayment({
  searchParams,
}: MarketplacePaymentPageRouteProps) {
  const searchParamsResolved = await searchParams;
  const orderId = Number.parseInt(searchParamsResolved?.order_id ?? "", 10);

  return (
    <MarketplacePaymentPage
      orderId={Number.isFinite(orderId) ? orderId : undefined}
      trackingToken={searchParamsResolved?.tracking_token}
    />
  );
}
