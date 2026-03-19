/** @format */

import type { Metadata } from "next";

import { CustomerDetailPage } from "@/modules/marketplace/components/penjualan/CustomerDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Pelanggan - Detail - Koperasi Digital",
  description: "Bumdes - Marketplace - Pelanggan - Detail page.",
};

export default async function MarketplaceCustomerDetailPage({ params }: PageProps) {
  const paramsResolved = await params;
  return (
    <div data-testid="marketplace-admin-customer-detail-route-root">
      <CustomerDetailPage id={paramsResolved.id} />
    </div>
  );
}
