/** @format */

import type { Metadata } from "next";

import { AssetStatusPage } from "@/modules/asset-reservation/status";
import type { ReservationStatus } from "@/modules/asset-reservation/status";

type StatusPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ status?: string; sig?: string }>;
};

export const metadata: Metadata = {
  title: "Status Permintaan Sewa - BUMDes Sukamaju",
  description:
    "Lihat status permintaan sewa aset Anda, termasuk konfirmasi, jadwal, dan rincian biaya.",
};

export default async function PenyewaanAsetStatusPage({
  searchParams,
  params,
}: StatusPageProps) {
  const searchParamsResolved = await searchParams;
  const { id } = await params;

  const status: ReservationStatus =
    searchParamsResolved?.status === "confirmed" ? "confirmed" : "pending";
  const signature = searchParamsResolved?.sig;

  return <AssetStatusPage token={id} signature={signature} status={status} />;
}
