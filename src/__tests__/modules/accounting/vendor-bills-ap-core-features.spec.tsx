/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  FeatureVendorBillDetailOverview,
  FeatureVendorBillInternalNoteCard,
  FeatureVendorBillLineItemsTable,
  FeatureVendorBillPaymentHistoryTable,
  FeatureVendorBillsSummaryCards,
  FeatureVendorBillsTable,
} from "@/modules/accounting";

describe("vendor-bills-ap core features", () => {
  it("renders summary cards and list table labels from source", () => {
    render(
      <div>
        <FeatureVendorBillsSummaryCards />
        <FeatureVendorBillsTable />
      </div>
    );

    expect(screen.getByText("Total Outstanding")).toBeTruthy();
    expect(screen.getByText("Due This Week")).toBeTruthy();
    expect(screen.getByText("Overdue Bills")).toBeTruthy();
    expect(screen.getByText("Vendor Credits")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Daftar Bill" })).toBeTruthy();
    expect(screen.getByLabelText("Search bill #, vendor...")).toBeTruthy();
  });

  it("separates row navigation interaction from checkbox selection", () => {
    const handleRowOpen = vi.fn();
    const handleSelectionChange = vi.fn();

    render(
      <FeatureVendorBillsTable
        onRowOpen={handleRowOpen}
        onSelectionChange={handleSelectionChange}
      />
    );

    fireEvent.click(screen.getByTestId("vendor-bill-row-BILL-2023-089"));
    expect(handleRowOpen).toHaveBeenCalledWith(
      expect.objectContaining({ bill_number: "BILL-2023-089" })
    );

    handleRowOpen.mockClear();
    fireEvent.click(screen.getByLabelText("Select BILL-2023-089"));
    expect(handleSelectionChange).toHaveBeenCalled();
    expect(handleRowOpen).not.toHaveBeenCalled();
  });

  it("renders detail overview, line items, payment history, and internal note", () => {
    render(
      <div>
        <FeatureVendorBillDetailOverview />
        <FeatureVendorBillLineItemsTable />
        <FeatureVendorBillPaymentHistoryTable />
        <FeatureVendorBillInternalNoteCard />
      </div>
    );

    expect(screen.getByRole("heading", { name: "BILL-2023-089" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pay Now" })).toBeTruthy();
    expect(screen.getByText("Item Description")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Payment History" })).toBeTruthy();
    expect(screen.getByText("Internal Note")).toBeTruthy();
  });
});
