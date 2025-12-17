/** @format */

import React from "react";
import { notFound } from "next/navigation";

import { assetItems } from "@/modules/asset/data/assets";
import { AssetDetailView } from "@/modules/asset/components/asset-detail-view";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const asset = assetItems.find((item) => item.id === param.id);

  if (!asset) {
    notFound();
  }

  return <AssetDetailView asset={asset} />;
}
