/** @format */

import type { Metadata } from "next";

import { VendorClientSubscriptionPage } from "@/modules/vendor";

type VendorClientSubscriptionRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Clients - Detail - Subscription - Koperasi Digital",
  description: "Vendor - Clients - Detail - Subscription page.",
};

export default async function VendorClientSubscriptionRoute({
  params,
}: VendorClientSubscriptionRouteProps) {
  const { tenantId } = await params;
  return <VendorClientSubscriptionPage tenantId={tenantId} />;
}
