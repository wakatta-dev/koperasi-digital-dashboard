/** @format */

import { getDashboardSummary, getSalesChart } from "@/actions/dashboard";
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
    chartData = await getSalesChart();
  } catch {
    chartData = [];
  }

  return <DashboardContent summary={summary} chartData={chartData} />;
}
