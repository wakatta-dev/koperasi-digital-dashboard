/** @format */

import { VendorClientSubscriptionPage } from "@/modules/vendor";

type VendorClientSubscriptionRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function VendorClientSubscriptionRoute({
  params,
}: VendorClientSubscriptionRouteProps) {
  const { tenantId } = await params;
  return <VendorClientSubscriptionPage tenantId={tenantId} />;
}
