/** @format */

import type { Metadata } from "next";

import React from "react";
import { AssetManagementPage } from "@/modules/asset/components/asset-page";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Manajemen - Koperasi Digital",
  description: "Bumdes - Asset - Manajemen page.",
};

export default function AssetManajemenPage() {
  return <AssetManagementPage />;
}
