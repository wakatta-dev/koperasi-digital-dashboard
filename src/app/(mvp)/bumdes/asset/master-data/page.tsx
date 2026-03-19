/** @format */

import type { Metadata } from "next";

import { AssetMasterDataPage } from "@/modules/asset/components/asset-master-data-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Master Data - Koperasi Digital",
  description: "Bumdes - Asset - Master Data page.",
};

export default function AssetMasterDataRoutePage() {
  return <AssetMasterDataPage />;
}
