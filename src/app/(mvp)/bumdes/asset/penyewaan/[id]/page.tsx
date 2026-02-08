/** @format */

import { AssetRentalAdminDetailPage } from "@/modules/asset-reservation/detail/asset-rental-admin-detail-page";

export default async function AssetPenyewaanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssetRentalAdminDetailPage bookingId={id} section="penyewaan" />;
}
