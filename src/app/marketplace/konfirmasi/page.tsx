/** @format */

import type { Metadata } from "next";

import { MarketplaceConfirmationPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Pesanan Berhasil - BUMDes Sukamaju",
  description: "Konfirmasi pesanan marketplace BUMDes Sukamaju.",
};

export default function MarketplaceConfirmation() {
  return <MarketplaceConfirmationPage />;
}
