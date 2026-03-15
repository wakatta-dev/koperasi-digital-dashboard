/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturePolicyCatalogCard } from "./FeaturePolicyCatalogCard";

describe("FeaturePolicyCatalogCard", () => {
  it("renders canonical policy metadata for admin review", () => {
    render(
      <FeaturePolicyCatalogCard
        isLoading={false}
        error={null}
        data={{
          tenant_id: 1,
          items: [
            {
              policy_key: "manual_payment_window_hours",
              policy_name: "Manual Payment Window",
              policy_class: "bounded_override",
              default_source: "tenant_type",
              value_type: "integer",
              allowed_scopes: ["platform", "tenant_type", "tenant", "module"],
              validation_rules: { min: 1, max: 48 },
              management_roles: ["tenant admin", "super_admin", "support"],
              reviewer_roles: ["support", "super_admin"],
            },
          ],
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Katalog Policy Canonical" })).toBeTruthy();
    expect(screen.getByText("Manual Payment Window")).toBeTruthy();
    expect(screen.getByText("manual_payment_window_hours")).toBeTruthy();
    expect(screen.getByText("source: tenant_type")).toBeTruthy();
    expect(screen.getByText(/Allowed scopes:/)).toBeTruthy();
    expect(screen.getByText(/Manage by:/)).toBeTruthy();
    expect(screen.getByText(/Review by:/)).toBeTruthy();
  });
});
