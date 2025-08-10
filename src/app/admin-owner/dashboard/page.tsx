/** @format */

import { getDashboardSummary, getRevenueExpense } from "@/actions/dashboard";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  let summary;
  let chartData;
  try {
    summary = await getDashboardSummary();
  } catch {
    summary = null;
  }

  try {
    chartData = await getRevenueExpense();
  } catch {
    chartData = [];
  }

  return <DashboardContent summary={summary} chartData={chartData} />;
}
