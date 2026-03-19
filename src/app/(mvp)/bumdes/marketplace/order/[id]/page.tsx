/** @format */

import type { Metadata } from "next";

import { OrderDetailPage } from "@/modules/marketplace/components/penjualan/OrderDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Order - Detail - Koperasi Digital",
  description: "Bumdes - Marketplace - Order - Detail page.",
};

export default async function MarketplaceOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div data-testid="marketplace-admin-order-detail-route-root">
      <OrderDetailPage id={id} />
    </div>
  );
}
