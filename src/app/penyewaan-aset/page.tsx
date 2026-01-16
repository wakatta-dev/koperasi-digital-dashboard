/** @format */

import type { Metadata } from "next";
import { Suspense } from "react";

import { AssetReservationPage } from "@/modules/asset-reservation";

export const metadata: Metadata = {
  title: "Penyewaan Aset - BUMDes Sukamaju",
  description:
    "Sewa gedung, alat pertanian, kendaraan, dan fasilitas desa dengan transparan di BUMDes Sukamaju.",
};

export default function PenyewaanAssetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Memuat…
        </div>
      }
    >
      <AssetReservationPage />
    </Suspense>
  );
}
