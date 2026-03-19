/** @format */

import type { Metadata } from "next";

import { VendorClientOverviewPage } from "@/modules/vendor";

type VendorClientOverviewRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Clients - Detail - Overview - Koperasi Digital",
  description: "Vendor - Clients - Detail - Overview page.",
};

export default async function VendorClientOverviewRoute({
  params,
}: VendorClientOverviewRouteProps) {
  const { tenantId } = await params;
  return <VendorClientOverviewPage tenantId={tenantId} />;
}
