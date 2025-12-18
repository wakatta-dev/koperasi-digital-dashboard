/** @format */

import type { Metadata } from "next";

import { MarketplaceShippingPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Informasi Pengiriman - BUMDes Sukamaju",
  description: "Isi informasi pengiriman untuk pesanan marketplace BUMDes Sukamaju.",
};

export default function MarketplaceShipping() {
  return <MarketplaceShippingPage />;
}
