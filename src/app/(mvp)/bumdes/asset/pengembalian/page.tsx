/** @format */

import type { Metadata } from "next";

import React from "react";
import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";

export const metadata: Metadata = {
  title: "Bumdes - Asset - Pengembalian - Koperasi Digital",
  description: "Bumdes - Asset - Pengembalian page.",
};

export default function AssetPengembalianPage() {
  return <AssetScheduleView activeSection="pengembalian" />;
}
