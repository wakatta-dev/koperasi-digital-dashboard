/** @format */

import { AssetEditPage } from "@/modules/asset/components/asset-edit-page";

export default async function AssetEditRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ assetId?: string }>;
}) {
  const { assetId } = await searchParams;

  return <AssetEditPage assetId={assetId} />;
}
