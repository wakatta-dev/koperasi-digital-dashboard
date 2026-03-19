/** @format */

import type { Metadata } from "next";

import { VendorClientAccountsPage } from "@/modules/vendor";

type VendorClientAccountsRouteProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Clients - Detail - Accounts - Koperasi Digital",
  description: "Vendor - Clients - Detail - Accounts page.",
};

export default async function VendorClientAccountsRoute({
  params,
}: VendorClientAccountsRouteProps) {
  const { tenantId } = await params;
  return <VendorClientAccountsPage tenantId={tenantId} />;
}
