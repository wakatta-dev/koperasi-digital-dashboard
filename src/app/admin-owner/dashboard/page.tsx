/** @format */

import { getDashboardSummary, getNotifications } from "@/actions/dashboard";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  let summary;
  let notifications = [];

  try {
    summary = await getDashboardSummary("owner");
  } catch {
    summary = null;
  }

  try {
    // Assuming getNotifications is a function that fetches notifications
    notifications = await getNotifications();
  } catch {
    notifications = [];
  }

  return <DashboardContent summary={summary} notifications={notifications} />;
}
