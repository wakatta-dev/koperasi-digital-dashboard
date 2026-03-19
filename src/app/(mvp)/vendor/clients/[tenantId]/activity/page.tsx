/** @format */

import type { Metadata } from "next";

import { VendorClientActivityPage } from "@/modules/vendor";

type VendorClientActivityRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Clients - Detail - Activity - Koperasi Digital",
  description: "Vendor - Clients - Detail - Activity page.",
};

export default async function VendorClientActivityRoute({
  params,
}: VendorClientActivityRouteProps) {
  const { tenantId } = await params;
  return <VendorClientActivityPage tenantId={tenantId} />;
}
