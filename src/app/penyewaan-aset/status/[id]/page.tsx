/** @format */

import type { Metadata } from "next";

import { AssetStatusPage } from "@/modules/asset-reservation/status";
import type { ReservationStatus } from "@/modules/asset-reservation/status";

type StatusPageProps = {
  params: { id: string };
  searchParams?: { status?: string };
};

export const metadata: Metadata = {
  title: "Status Permintaan Sewa - BUMDes Sukamaju",
  description:
    "Lihat status permintaan sewa aset Anda, termasuk konfirmasi, jadwal, dan rincian biaya.",
};

export default function PenyewaanAsetStatusPage({ searchParams }: StatusPageProps) {
  const status: ReservationStatus = searchParams?.status === "pending" ? "pending" : "confirmed";

  return <AssetStatusPage status={status} />;
}
