/** @format */

import React from "react";
import { notFound } from "next/navigation";

import { AssetDetailView } from "@/modules/asset/components/asset-detail-view";
import { mapAssetToItem } from "@/modules/asset/utils/mappers";
import { getAssetById } from "@/services/api/assets";

export default async function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await getAssetById(params.id);
  if (!res.success || !res.data) {
    notFound();
  }

  const asset = mapAssetToItem(res.data);
  return <AssetDetailView asset={asset} />;
}
