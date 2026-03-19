/** @format */

import type { Metadata } from "next";

import { MarketplaceReviewPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Ulasan Pesanan - BUMDes Sukamaju",
  description: "Tinjau pesanan sebelum konfirmasi di marketplace BUMDes Sukamaju.",
};

type MarketplaceReviewRouteProps = {
  searchParams?: Promise<{ order_id?: string; tracking_token?: string }>;
};

export default async function MarketplaceReview({
  searchParams,
}: MarketplaceReviewRouteProps) {
  const searchParamsResolved = await searchParams;
  const orderId = Number.parseInt(searchParamsResolved?.order_id ?? "", 10);

  return (
    <MarketplaceReviewPage
      orderId={Number.isFinite(orderId) ? orderId : undefined}
      trackingToken={searchParamsResolved?.tracking_token}
    />
  );
}
