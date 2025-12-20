/** @format */

import type { Metadata } from "next";

import { AssetPaymentPage } from "@/modules/asset-reservation/payment";

export const metadata: Metadata = {
  title: "Pembayaran Sewa Aset - BUMDes Sukamaju",
  description: "Selesaikan pembayaran DP untuk mengamankan reservasi aset BUMDes Sukamaju.",
};

type PaymentPageProps = {
  searchParams?: Promise<{ reservationId?: string; type?: string }>;
};

export default async function PenyewaanAsetPaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;
  const reservationId = params?.reservationId;
  const mode = params?.type === "settlement" ? "settlement" : "dp";
  return <AssetPaymentPage reservationId={reservationId} mode={mode} />;
}
