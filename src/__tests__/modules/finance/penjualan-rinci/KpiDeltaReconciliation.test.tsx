/** @format */

import { describe, expect, it } from "vitest";
import { sampleSummary } from "@/__tests__/__fixtures__/finance-report/sampleResponses";

const TOLERANCE = 0.5; // percent

function percentDelta(current: number, prior: number) {
  return ((current - prior) / prior) * 100;
}

describe("KPI delta reconciliation", () => {
  it("keeps revenue delta within tolerance of label", () => {
    const current = sampleSummary.kpis.total_revenue;
    const prior = 406_924_000; // derived from +12.5% in fixture
    const delta = percentDelta(current, prior);
    expect(Math.abs(delta - 12.5)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("keeps transaction delta direction aligned with label", () => {
    const direction = sampleSummary.kpis.delta_direction;
    const priorTransactions = 1133; // back-calculated within ~8.9% vs 1234 current
    const delta = percentDelta(sampleSummary.kpis.transaction_count, priorTransactions);
    expect(delta > 0).toBe(direction !== "down");
  });
});
