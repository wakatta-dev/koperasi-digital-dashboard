/** @format */

import type { Metadata } from "next";

import { AssetRentalAdminDetailPage } from "@/modules/asset-reservation/detail/asset-rental-admin-detail-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Pengajuan Sewa - Detail - Koperasi Digital",
  description: "Bumdes - Asset - Pengajuan Sewa - Detail page.",
};

export default async function AssetPengajuanSewaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssetRentalAdminDetailPage bookingId={id} section="pengajuan" />;
}
