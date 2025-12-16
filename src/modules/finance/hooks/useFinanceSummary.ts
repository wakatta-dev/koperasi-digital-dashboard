/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "@/hooks/queries/queryKeys";
import { getSalesSummary } from "@/services/api";
import type { FinanceQuery, SalesSummaryResponse } from "../types";
import { sampleSummaryResponse } from "@/modules/finance/fixtures";

export function useFinanceSummary(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.summary(params ?? {}),
    queryFn: async (): Promise<SalesSummaryResponse> => {
      try {
        const res = ensureSuccess(await getSalesSummary(params));
        // Backend may return KPI fields at the root; normalize to kpis object.
        if (!res.kpis && typeof res.total_revenue === "number") {
          return {
            ...res,
            kpis: {
              total_revenue: res.total_revenue,
              transaction_count: res.transaction_count ?? 0,
              average_ticket: res.average_ticket ?? 0,
              delta_label: res.delta_label,
              delta_direction: res.delta_direction,
              comparison_period: res.comparison_period,
              last_updated: res.last_updated,
            },
          };
        }
        return res;
      } catch (err) {
        console.warn("finance summary fallback to sample data", err);
        return sampleSummaryResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}
