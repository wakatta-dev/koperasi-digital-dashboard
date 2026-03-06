/** @format */

import { VendorClientActivityPage } from "@/modules/vendor";

type VendorClientActivityRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function VendorClientActivityRoute({
  params,
}: VendorClientActivityRouteProps) {
  const { tenantId } = await params;
  return <VendorClientActivityPage tenantId={tenantId} />;
}
