/** @format */

import type { Metadata } from "next";

import { MarketplaceConfirmationPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Pesanan Berhasil - BUMDes Sukamaju",
  description: "Konfirmasi pesanan marketplace BUMDes Sukamaju.",
};

type MarketplaceConfirmationRouteProps = {
  searchParams?: Promise<{ order_id?: string; tracking_token?: string }>;
};

export default async function MarketplaceConfirmation({
  searchParams,
}: MarketplaceConfirmationRouteProps) {
  const searchParamsResolved = await searchParams;
  const orderId = Number.parseInt(searchParamsResolved?.order_id ?? "", 10);

  return (
    <MarketplaceConfirmationPage
      orderId={Number.isFinite(orderId) ? orderId : undefined}
      trackingToken={searchParamsResolved?.tracking_token}
    />
  );
}
