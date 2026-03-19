/** @format */

import type { Metadata } from "next";

import { ProductCategoryManagementPage } from "@/modules/marketplace/components/penjualan/ProductCategoryManagementPage";

export const metadata: Metadata = {
  title: "Bumdes - Marketplace - Categories - Koperasi Digital",
  description: "Bumdes - Marketplace - Categories page.",
};

export default function MarketplaceCategoriesPage() {
  return <ProductCategoryManagementPage />;
}
