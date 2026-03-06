/** @format */

import { VendorClientOverviewPage } from "@/modules/vendor";

type VendorClientOverviewRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function VendorClientOverviewRoute({
  params,
}: VendorClientOverviewRouteProps) {
  const { tenantId } = await params;
  return <VendorClientOverviewPage tenantId={tenantId} />;
}
