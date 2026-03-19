/** @format */

import type { Metadata } from "next";

import { redirect } from "next/navigation";

type VendorClientIndexPageProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Clients - Detail - Koperasi Digital",
  description: "Vendor - Clients - Detail page.",
};

export default async function VendorClientIndexPage({
  params,
}: VendorClientIndexPageProps) {
  const { tenantId } = await params;
  redirect(`/vendor/clients/${tenantId}/overview`);
}
