/** @format */

import { getDashboardSummary } from "@/actions/dashboard";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  let summary;
  try {
    summary = await getDashboardSummary();
  } catch {
    summary = null;
  }

  return <DashboardContent summary={summary} />;
}
