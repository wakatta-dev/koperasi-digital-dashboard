/** @format */

import { render, screen } from "@testing-library/react";

import { InvoicingArFeaturePage } from "@/modules/accounting";

describe("invoicing-ar page wiring", () => {
  it("renders feature-only sections for invoicing AR", () => {
    render(<InvoicingArFeaturePage />);

    expect(screen.getByRole("heading", { name: "Invoicing (AR)" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Daftar Invoice" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Credit Notes (Customer)" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Payments Received" })).toBeTruthy();
  });

  it("does not render unrelated layout chrome text", () => {
    render(<InvoicingArFeaturePage />);

    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.queryByText("Halaman placeholder untuk invoicing accounts receivable.")).toBeNull();
  });
});
