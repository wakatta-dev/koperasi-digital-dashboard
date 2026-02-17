/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import { InvoicingArFeatureDemo } from "@/modules/accounting";

describe("invoicing-ar foundation", () => {
  it("renders demo wrapper with source title and subtitle", () => {
    render(<InvoicingArFeatureDemo />);

    expect(screen.getByRole("heading", { name: "Invoicing (AR)" })).toBeTruthy();
    expect(
      screen.getByText("Manage customer invoices and accounts receivable.")
    ).toBeTruthy();
  });

  it("switches create page-form flows with local state only", () => {
    render(<InvoicingArFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Create Invoice" }));
    expect(screen.getByRole("heading", { name: "Create New Invoice" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Create Credit Note" }));
    expect(screen.getByRole("heading", { name: "New Credit Note" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Record Payment" }));
    expect(screen.getByRole("heading", { name: "Record Payment" })).toBeTruthy();
  });
});
