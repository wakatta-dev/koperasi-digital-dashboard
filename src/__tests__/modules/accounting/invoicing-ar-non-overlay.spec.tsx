/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import {
  FeatureCreditNotesTable,
  FeatureInvoiceDetailView,
  FeatureInvoiceSummaryCards,
  FeatureInvoiceTable,
  FeaturePaymentsTable,
} from "@/modules/accounting";

describe("invoicing-ar non-overlay features", () => {
  it("renders invoice summary cards with key labels", () => {
    render(<FeatureInvoiceSummaryCards />);

    expect(screen.getByText("Total Drafts")).toBeTruthy();
    expect(screen.getByText("Total Sent")).toBeTruthy();
    expect(screen.getByText("Total Paid")).toBeTruthy();
    expect(screen.getByText("Total Overdue")).toBeTruthy();
  });

  it("filters invoice rows by search input", () => {
    render(<FeatureInvoiceTable />);

    expect(screen.getByText("INV-2023-1024")).toBeTruthy();
    const searchInput = screen.getByLabelText("Search invoice number or customer...");
    fireEvent.change(searchInput, { target: { value: "CV. Teknologi Maju" } });

    expect(screen.getByText("INV-2023-1023")).toBeTruthy();
    expect(screen.queryByText("INV-2023-1024")).toBeNull();
  });

  it("renders credit note and payment sections", () => {
    render(
      <div>
        <FeatureCreditNotesTable />
        <FeaturePaymentsTable />
      </div>
    );

    expect(screen.getByText("Credit Notes (Customer)")).toBeTruthy();
    expect(screen.getByText("Payments Received")).toBeTruthy();
    expect(screen.getByLabelText("Search credit note...")).toBeTruthy();
    expect(screen.getByLabelText("Search payment...")).toBeTruthy();
  });

  it("renders invoice detail actions and totals", () => {
    render(<FeatureInvoiceDetailView />);

    expect(screen.getByRole("button", { name: "Send via Email" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Register Payment" })).toBeTruthy();
    expect(screen.getByText("Total Amount")).toBeTruthy();
  });
});
