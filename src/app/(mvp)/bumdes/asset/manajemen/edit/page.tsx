/** @format */

import type { Metadata } from "next";

import { AssetEditPage } from "@/modules/asset/components/asset-edit-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Manajemen - Edit - Koperasi Digital",
  description: "Bumdes - Asset - Manajemen - Edit page.",
};

export default async function AssetEditRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ assetId?: string }>;
}) {
  const { assetId } = await searchParams;

  return <AssetEditPage assetId={assetId} />;
}
