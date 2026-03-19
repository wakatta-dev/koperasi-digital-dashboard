/** @format */

import type { Metadata } from "next";

import { PartnerManagementPage } from "@/modules/partner-management/components/PartnerManagementPage";

export const metadata: Metadata = {
  title: "Bumdes - Partner Management - Koperasi Digital",
  description: "Bumdes - Partner Management page.",
};

export default function BumdesPartnerManagementPage() {
  return (
    <div data-testid="bumdes-partner-management-route-root">
      <PartnerManagementPage />
    </div>
  );
}
