/** @format */

import { VendorClientAccountsPage } from "@/modules/vendor";

type VendorClientAccountsRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function VendorClientAccountsRoute({
  params,
}: VendorClientAccountsRouteProps) {
  const { tenantId } = await params;
  return <VendorClientAccountsPage tenantId={tenantId} />;
}
