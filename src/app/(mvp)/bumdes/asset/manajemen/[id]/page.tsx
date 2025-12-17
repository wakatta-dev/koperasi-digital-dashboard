/** @format */

import React from "react";
import { notFound } from "next/navigation";

import { assetItems } from "@/modules/asset/data/assets";
import { AssetDetailView } from "@/modules/asset/components/asset-detail-view";

export default function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const asset = assetItems.find((item) => item.id === params.id);

  if (!asset) {
    notFound();
  }

  return <AssetDetailView asset={asset} />;
}
