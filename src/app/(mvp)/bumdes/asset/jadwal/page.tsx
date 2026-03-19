/** @format */

import type { Metadata } from "next";

import React from "react";
import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Jadwal - Koperasi Digital",
  description: "Bumdes - Asset - Jadwal page.",
};

export default function AssetSchedulePage() {
  return <AssetScheduleView activeSection="penyewaan" />;
}
