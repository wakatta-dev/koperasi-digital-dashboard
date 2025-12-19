/** @format */

import type { Metadata } from "next";

import { AssetRepaymentPage } from "@/modules/asset-reservation/repayment";

export const metadata: Metadata = {
  title: "Pembayaran Pelunasan Sewa - BUMDes Sukamaju",
  description: "Selesaikan pelunasan sewa aset Anda di BUMDes Sukamaju.",
};

type RepaymentPageProps = {
  searchParams?: Promise<{ reservationId?: string }>;
};

export default async function PenyewaanAsetRepaymentPage({ searchParams }: RepaymentPageProps) {
  const params = await searchParams;
  const reservationId = params?.reservationId;
  return <AssetRepaymentPage reservationId={reservationId} />;
}
