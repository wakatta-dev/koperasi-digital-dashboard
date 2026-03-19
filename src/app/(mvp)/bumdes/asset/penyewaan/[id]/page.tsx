/** @format */

import type { Metadata } from "next";

import { AssetRentalAdminDetailPage } from "@/modules/asset-reservation/detail/asset-rental-admin-detail-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Penyewaan - Detail - Koperasi Digital",
  description: "Bumdes - Asset - Penyewaan - Detail page.",
};

export default async function AssetPenyewaanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssetRentalAdminDetailPage bookingId={id} section="penyewaan" />;
}
