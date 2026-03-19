/** @format */

import type { Metadata } from "next";

import React from "react";
import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Penyewaan - Koperasi Digital",
  description: "Bumdes - Asset - Penyewaan page.",
};

export default function AssetPenyewaanPage() {
  return <AssetScheduleView activeSection="penyewaan" />;
}
