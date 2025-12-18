/** @format */

import type { Metadata } from "next";

import { MarketplacePaymentPage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Metode Pembayaran - BUMDes Sukamaju",
  description: "Pilih metode pembayaran untuk pesanan marketplace BUMDes Sukamaju.",
};

export default function MarketplacePayment() {
  return <MarketplacePaymentPage />;
}
