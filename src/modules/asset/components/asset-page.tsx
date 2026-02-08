/** @format */

"use client";

import { AssetListFeature } from "./features/AssetListFeature";

export function AssetManagementPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <AssetListFeature />
    </div>
  );
}
