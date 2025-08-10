/** @format */

import { getDashboardSummary } from "@/actions/dashboard";
import DashboardContent from "@/app/admin-owner/dashboard/dashboard-content";

export default async function DashboardPage() {
  let summary;
  try {
    summary = await getDashboardSummary();
  } catch {
    summary = null;
  }

  return <DashboardContent summary={summary} />;
}
