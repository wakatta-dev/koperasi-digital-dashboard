/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { KpiCards } from "@/components/shared/data-display/KpiCards";

import {
  FeatureVendorBillDetailOverview,
  FeatureVendorBillInternalNoteCard,
  FeatureVendorBillLineItemsTable,
  FeatureVendorBillPaymentHistoryTable,
  FeatureVendorBillsTable,
} from "@/modules/accounting";

describe("vendor-bills-ap core features", () => {
  it("renders summary cards and list table labels from source", () => {
    render(
      <div>
        <KpiCards
          items={[
            {
              id: "total-outstanding",
              label: "Total Outstanding",
              value: "Rp 12,500,000",
              tone: "primary",
              footer: <p className="text-xs text-muted-foreground">Belum dibayar</p>,
            },
            {
              id: "due-this-week",
              label: "Due This Week",
              value: "Rp 4,200,000",
              tone: "warning",
              footer: (
                <p className="text-xs text-muted-foreground">Jatuh tempo pekan ini</p>
              ),
            },
            {
              id: "overdue-bills",
              label: "Overdue Bills",
              value: "2",
              tone: "danger",
              footer: <p className="text-xs text-muted-foreground">Lewat jatuh tempo</p>,
            },
            {
              id: "vendor-credits",
              label: "Vendor Credits",
              value: "Rp 500,000",
              tone: "success",
              footer: <p className="text-xs text-muted-foreground">Kredit tersedia</p>,
            },
          ]}
        />
        <FeatureVendorBillsTable
          rows={[
            {
              bill_number: "BILL-2023-089",
              vendor_name: "PT. Pemasok Jaya",
              vendor_initial: "P",
              vendor_initial_class_name: "bg-blue-100 text-blue-700",
              bill_date: "Oct 25, 2023",
              due_date: "Nov 24, 2023",
              amount: "Rp 12,500,000",
              status: "Overdue",
              is_selectable: true,
            },
          ]}
        />
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
        rows={[
          {
            bill_number: "BILL-2023-089",
            vendor_name: "PT. Pemasok Jaya",
            vendor_initial: "P",
            vendor_initial_class_name: "bg-blue-100 text-blue-700",
            bill_date: "Oct 25, 2023",
            due_date: "Nov 24, 2023",
            amount: "Rp 12,500,000",
            status: "Overdue",
            is_selectable: true,
          },
        ]}
        onRowOpen={handleRowOpen}
        onSelectionChange={handleSelectionChange}
      />
    );

    fireEvent.click(screen.getByRole("row", { name: /BILL-2023-089/i }));
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
        <FeatureVendorBillDetailOverview
          detail={{
            bill_number: "BILL-2023-089",
            status: "Overdue",
            created_label: "Created on Oct 25, 2023 by System OCR",
            vendor: {
              name: "PT. Pemasok Jaya",
              address_lines: ["Jl. Industri Raya No. 45"],
              email: "billing@pemasokjaya.co.id",
              avatar_initial: "P",
              avatar_tone_class_name: "bg-blue-100 text-blue-700",
            },
            meta: {
              bill_date: "Oct 25, 2023",
              due_date: "Nov 24, 2023",
              due_note: "15 days overdue",
              reference_number: "INV/PJ/2023/1029",
              currency: "IDR - Indonesian Rupiah",
            },
          }}
        />
        <FeatureVendorBillLineItemsTable
          rows={[
            {
              id: "line-1",
              item_description: "Raw Material - Grade A Silicon",
              detail: "Batch #8829-X",
              qty: "500 kg",
              unit_price: "Rp 15,000",
              total: "Rp 7,500,000",
            },
          ]}
          totals={{
            subtotal: "Rp 12,500,000",
            tax_amount: "Rp 1,375,000",
            total_amount: "Rp 13,875,000",
            paid_to_date: "Rp 5,000,000",
            balance_due: "Rp 8,875,000",
          }}
        />
        <FeatureVendorBillPaymentHistoryTable
          rows={[
            {
              payment_date: "Nov 01, 2023",
              payment_reference: "PAY-001",
              payment_method: "Bank Transfer",
              amount_paid: "Rp 5,000,000",
              status: "SUCCESS",
            },
          ]}
        />
        <FeatureVendorBillInternalNoteCard note="The remaining balance is scheduled." />
      </div>
    );

    expect(screen.getByRole("heading", { name: "BILL-2023-089" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pay Now" })).toBeTruthy();
    expect(screen.getByText("Item Description")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Payment History" })).toBeTruthy();
    expect(screen.getByText("Internal Note")).toBeTruthy();
  });
});
