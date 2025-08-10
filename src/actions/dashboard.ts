/** @format */

"use server";

import { apiFetch } from "./api";
import { API_ENDPOINTS } from "@/constants/api";

export async function getDashboardSummary(type: "client" | "owner") {
  const endpoint =
    type === "owner"
      ? API_ENDPOINTS.dashboard.summaryOwner
      : API_ENDPOINTS.dashboard.summaryClient;
  return apiFetch(endpoint);
}

export async function getNotifications() {
  const endpoint = API_ENDPOINTS.dashboard.notification;
  return apiFetch(endpoint);
}
