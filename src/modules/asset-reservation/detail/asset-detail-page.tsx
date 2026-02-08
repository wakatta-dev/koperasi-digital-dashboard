/** @format */

"use client";

import { RentalActiveDetailFeature } from "./components/RentalActiveDetailFeature";

type AssetDetailPageProps = {
  assetId?: string;
};

export function AssetDetailPage(_props: AssetDetailPageProps) {
  return (
    <div className="space-y-4">
      <RentalActiveDetailFeature />
    </div>
  );
}
