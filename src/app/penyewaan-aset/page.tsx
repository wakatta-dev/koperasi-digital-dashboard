/** @format */

import type { Metadata } from "next";
import { Suspense } from "react";

import { AssetReservationPage } from "@/modules/asset-reservation";

export const metadata: Metadata = {
  title: "Penyewaan Aset - BUMDes Sukamaju",
  description:
    "Sewa gedung, alat pertanian, kendaraan, dan fasilitas desa dengan transparan di BUMDes Sukamaju.",
};

type PenyewaanAssetPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PenyewaanAssetPage({
  searchParams,
}: PenyewaanAssetPageProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Memuat…
        </div>
      }
    >
      <AssetReservationPage queryString={query.toString()} />
    </Suspense>
  );
}
