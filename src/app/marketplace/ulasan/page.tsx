/** @format */

import type { Metadata } from "next";

import { MarketplaceReviewPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Ulasan Pesanan - BUMDes Sukamaju",
  description: "Tinjau pesanan sebelum konfirmasi di marketplace BUMDes Sukamaju.",
};

export default function MarketplaceReview() {
  return <MarketplaceReviewPage />;
}
