/** @format */

import type { Metadata } from "next";

import { AssetRentalAdminDetailPage } from "@/modules/asset-reservation/detail/asset-rental-admin-detail-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Pengembalian - Detail - Koperasi Digital",
  description: "Bumdes - Asset - Pengembalian - Detail page.",
};

export default async function AssetPengembalianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssetRentalAdminDetailPage bookingId={id} section="pengembalian" />;
}
