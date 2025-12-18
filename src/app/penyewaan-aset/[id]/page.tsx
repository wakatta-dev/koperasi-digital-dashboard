/** @format */

import type { Metadata } from "next";

import { AssetDetailPage } from "@/modules/asset-reservation";

type AssetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Detail Aset - BUMDes Sukamaju",
  description:
    "Lihat detail aset, fasilitas, jadwal, dan ajukan penyewaan di BUMDes Sukamaju.",
};

export default async function PenyewaanAsetDetailPage({
  params,
}: AssetDetailPageProps) {
  const param = await params;
  return <AssetDetailPage assetId={param.id} />;
}
