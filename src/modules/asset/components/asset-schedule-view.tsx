/** @format */

"use client";

import { AssetRentalTablesShowcase } from "@/modules/asset-reservation/components/stitch/AssetRentalTablesShowcase";

type AssetRentalSection = "penyewaan" | "pengajuan" | "pengembalian";

type AssetScheduleViewProps = {
  activeSection?: AssetRentalSection;
};

export function AssetScheduleView({
  activeSection = "penyewaan",
}: AssetScheduleViewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <AssetRentalTablesShowcase initialSection={activeSection} />
    </div>
  );
}
