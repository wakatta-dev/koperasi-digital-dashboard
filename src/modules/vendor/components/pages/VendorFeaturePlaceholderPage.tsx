/** @format */

import { VendorPageHeader } from "../VendorPageHeader";
import { VendorPlaceholderState } from "../VendorPlaceholderState";

type VendorFeaturePlaceholderPageProps = {
  title: string;
  description: string;
};

export function VendorFeaturePlaceholderPage({
  title,
  description,
}: VendorFeaturePlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <VendorPageHeader title={title} description={description} />
      <VendorPlaceholderState
        title={`${title} belum diaktifkan`}
        description={description}
      />
    </div>
  );
}
