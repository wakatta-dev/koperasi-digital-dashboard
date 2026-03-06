/** @format */

import { redirect } from "next/navigation";

type VendorClientIndexPageProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function VendorClientIndexPage({
  params,
}: VendorClientIndexPageProps) {
  const { tenantId } = await params;
  redirect(`/vendor/clients/${tenantId}/overview`);
}
