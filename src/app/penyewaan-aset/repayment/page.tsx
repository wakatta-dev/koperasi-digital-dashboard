/** @format */

import type { Metadata } from "next";

import { AssetRepaymentPage } from "@/modules/asset-reservation/repayment";

export const metadata: Metadata = {
  title: "Pembayaran Pelunasan Sewa - BUMDes Sukamaju",
  description: "Selesaikan pelunasan sewa aset Anda di BUMDes Sukamaju.",
};

export default function PenyewaanAsetRepaymentPage() {
  return <AssetRepaymentPage />;
}
