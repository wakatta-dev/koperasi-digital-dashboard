/** @format */

import type { Metadata } from "next";

import { AssetStatusPage } from "@/modules/asset-reservation/status";
import type { ReservationStatus } from "@/modules/asset-reservation/status";

type StatusPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ status?: string }>;
};

export const metadata: Metadata = {
  title: "Status Permintaan Sewa - BUMDes Sukamaju",
  description:
    "Lihat status permintaan sewa aset Anda, termasuk konfirmasi, jadwal, dan rincian biaya.",
};

export default async function PenyewaanAsetStatusPage({
  searchParams,
}: StatusPageProps) {
  const searchParamsResolved = await searchParams;

  const status: ReservationStatus =
    searchParamsResolved?.status === "pending" ? "pending" : "confirmed";

  return <AssetStatusPage status={status} />;
}
