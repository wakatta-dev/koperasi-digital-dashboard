/** @format */

import type { AssetDetailModel } from "../types/stitch";
import { AssetDetailFeature } from "./stitch/AssetDetailFeature";

type AssetDetailViewProps = {
  detail: AssetDetailModel;
  onBack?: () => void;
};

export function AssetDetailView({ detail }: AssetDetailViewProps) {
  return <AssetDetailFeature detail={detail} />;
}
