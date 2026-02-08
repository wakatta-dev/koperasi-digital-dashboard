/** @format */

"use client";

import { AssetRentalScheduleFeature } from "./asset-rental/AssetRentalScheduleFeature";

type AssetRentalSection = "penyewaan" | "pengajuan" | "pengembalian";

type AssetScheduleViewProps = {
  activeSection?: AssetRentalSection;
};

export function AssetScheduleView({
  activeSection = "penyewaan",
}: AssetScheduleViewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <AssetRentalScheduleFeature initialSection={activeSection} />
    </div>
  );
}
