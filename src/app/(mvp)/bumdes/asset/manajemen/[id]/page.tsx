/** @format */

import React from "react";
import { notFound } from "next/navigation";

import { AssetDetailView } from "@/modules/asset/components/asset-detail-view";
import { mapContractAssetToDetailWithBookings } from "@/modules/asset/utils/stitch-contract-mappers";
import { getAssetRentalBookings } from "@/services/api/asset-rental";
import { getAssetById } from "@/services/api/assets";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [assetResponse, bookingsResponse] = await Promise.all([
    getAssetById(id),
    getAssetRentalBookings(),
  ]);
  if (!assetResponse.success || !assetResponse.data) {
    notFound();
  }

  const assetId = Number(assetResponse.data.id);
  const relatedBookings =
    bookingsResponse.success && bookingsResponse.data
      ? bookingsResponse.data.filter((booking) => booking.asset_id === assetId)
      : [];
  const detail = mapContractAssetToDetailWithBookings(assetResponse.data, relatedBookings);

  return <AssetDetailView detail={detail} />;
}
