/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendorDashboardSummary } from "@/services/api";
import { QK } from "./queryKeys";

export function useVendorDashboard() {
  return useQuery({
    queryKey: QK.vendorDashboard.summary(),
    queryFn: getVendorDashboardSummary,
  });
}
