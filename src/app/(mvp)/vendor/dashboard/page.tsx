/** @format */

import type { Metadata } from "next";

import { VendorDashboardPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Dashboard - Koperasi Digital",
  description: "Vendor - Dashboard page.",
};

export default function DashboardPage() {
  return <VendorDashboardPage />;
}
