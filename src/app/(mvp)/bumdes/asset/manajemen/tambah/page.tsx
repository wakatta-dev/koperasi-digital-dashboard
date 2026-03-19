/** @format */

import type { Metadata } from "next";

import { AssetCreatePage } from "@/modules/asset/components/asset-create-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Manajemen - Tambah - Koperasi Digital",
  description: "Bumdes - Asset - Manajemen - Tambah page.",
};

export default function AssetTambahPage() {
  return <AssetCreatePage />;
}
