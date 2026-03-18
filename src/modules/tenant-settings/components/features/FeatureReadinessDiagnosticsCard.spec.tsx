/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureReadinessDiagnosticsCard } from "./FeatureReadinessDiagnosticsCard";

describe("FeatureReadinessDiagnosticsCard", () => {
  it("renders module blockers, effective policy, and support resolution chain", () => {
    render(
      <FeatureReadinessDiagnosticsCard
        isLoading={false}
        error={null}
        showSupportDetails
        data={{
          tenant_id: 1,
          status: "missing",
          state: "blocked",
          checked_at: "2026-03-13T10:00:00Z",
          bootstrap_run: {
            run_id: 91,
            status: "succeeded",
            trigger_type: "provision",
            preset_key: "bumdes-default",
          },
          modules: [
            {
              module_key: "marketplace",
              label: "Marketplace",
              enabled: true,
              status: "missing",
              state: "blocked",
              blocker_reasons: [
                "Lengkapi output baseline starter:marketplace_categories agar module siap operasional.",
              ],
              missing_outputs: ["starter:marketplace_categories"],
              effective_policies: [
                {
                  policy_key: "manual_payment_window_hours",
                  policy_name: "Manual Payment Window",
                  effective_value: 24,
                  source_scope: "tenant",
                  source_label: "tenant config",
                  enforcement_state: "active",
                  resolution_chain: [
                    {
                      scope: "platform",
                      label: "platform default",
                      has_value: false,
                      selected: false,
                    },
                    {
                      scope: "tenant",
                      label: "tenant config",
                      has_value: true,
                      selected: true,
                      enforcement_state: "active",
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Readiness & Diagnostics" })).toBeTruthy();
    expect(screen.getByText("Marketplace")).toBeTruthy();
    expect(screen.getByText("Manual Payment Window")).toBeTruthy();
    expect(
      screen.getAllByText((_, element) =>
        Boolean(element?.textContent?.includes("tenant config")),
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Runtime aktif, tetapi baseline belum lengkap.")).toBeTruthy();
    expect(screen.getByText("Output baseline yang belum terbukti")).toBeTruthy();
    expect(screen.getByText("selected")).toBeTruthy();
  });
});
