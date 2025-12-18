/** @format */

import type { Metadata } from "next";

import { MarketplaceCartPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Keranjang Belanja - BUMDes Sukamaju",
  description: "Ringkasan keranjang belanja marketplace desa Sukamaju.",
};

export default function MarketplaceCart() {
  return <MarketplaceCartPage />;
}
