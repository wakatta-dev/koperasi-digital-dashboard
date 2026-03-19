/** @format */

import type { Metadata } from "next";

import React from "react";
import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Pengajuan Sewa - Koperasi Digital",
  description: "Bumdes - Asset - Pengajuan Sewa page.",
};

export default function AssetPengajuanSewaPage() {
  return <AssetScheduleView activeSection="pengajuan" />;
}
