/** @format */

import type { Metadata } from "next";

import { AssetDetailPage } from "@/modules/asset-reservation";

type AssetDetailPageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Detail Aset - BUMDes Sukamaju",
  description: "Lihat detail aset, fasilitas, jadwal, dan ajukan penyewaan di BUMDes Sukamaju.",
};

export default function PenyewaanAsetDetailPage({ params }: AssetDetailPageProps) {
  return <AssetDetailPage assetId={params.id} />;
}
