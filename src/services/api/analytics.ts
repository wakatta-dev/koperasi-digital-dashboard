/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  AnalyticsQuery,
  AnalyticsResponseData,
  ApiResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function getAnalytics(
  params?: AnalyticsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AnalyticsResponseData>> {
  const search = new URLSearchParams();
  if (params?.range) search.set("range", params.range);
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  if (typeof params?.limit_top_products !== "undefined") {
    search.set("limit_top_products", String(params.limit_top_products));
  }
  const query = search.toString() ? `?${search.toString()}` : "";

  const res = api.get<AnalyticsResponseData>(
    `${API_PREFIX}${API_ENDPOINTS.analytics.dashboard}${query}`,
    { signal: opts?.signal }
  );

  return res;
}
