/** @format */

import { CustomerDetailPage } from "@/modules/marketplace/components/penjualan/CustomerDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceCustomerDetailPage({ params }: PageProps) {
  const paramsResolved = await params;
  return <CustomerDetailPage id={paramsResolved.id} />;
}
