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

  const rawStatus = searchParamsResolved?.status?.toLowerCase();
  const status: ReservationStatus =
    rawStatus === "confirmed_full"
      ? "confirmed_full"
      : rawStatus === "awaiting_dp"
        ? "awaiting_dp"
        : rawStatus === "awaiting_settlement"
        ? "awaiting_settlement"
          : "pending_review";
  const accessToken = searchParamsResolved?.sig;
  return <AssetStatusPage token={id} accessToken={accessToken} status={status} />;
}
