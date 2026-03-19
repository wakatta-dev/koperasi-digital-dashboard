/** @format */

import type { Metadata } from "next";

import { AnalyticsDashboardPage } from "@/modules/dashboard/analytics/page";

export const metadata: Metadata = {
  title: "Bumdes - Dashboard - Koperasi Digital",
  description: "Bumdes - Dashboard page.",
};

export default function DashboardPage() {
  return <AnalyticsDashboardPage />;
}
