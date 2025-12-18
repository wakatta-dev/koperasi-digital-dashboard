/** @format */

import type { Metadata } from "next";

import { AssetReservationPage } from "@/modules/asset-reservation";

export const metadata: Metadata = {
  title: "Penyewaan Aset - BUMDes Sukamaju",
  description:
    "Sewa gedung, alat pertanian, kendaraan, dan fasilitas desa dengan transparan di BUMDes Sukamaju.",
};

export default function PenyewaanAssetPage() {
  return <AssetReservationPage />;
}
