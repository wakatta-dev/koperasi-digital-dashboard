/** @format */

import type { Metadata } from "next";

import { AssetPaymentPage } from "@/modules/asset-reservation/payment";

export const metadata: Metadata = {
  title: "Pembayaran Sewa Aset - BUMDes Sukamaju",
  description: "Selesaikan pembayaran DP untuk mengamankan reservasi aset BUMDes Sukamaju.",
};

export default function PenyewaanAsetPaymentPage() {
  return <AssetPaymentPage />;
}
