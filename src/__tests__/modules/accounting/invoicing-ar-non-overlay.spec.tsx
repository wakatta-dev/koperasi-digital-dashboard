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
    render(
      <FeatureInvoiceSummaryCards
        metrics={[
          { id: "draft", label: "Total Drafts", displayValue: "4" },
          { id: "sent", label: "Total Sent", displayValue: "12" },
          { id: "paid", label: "Total Paid", displayValue: "18" },
          { id: "overdue", label: "Total Overdue", displayValue: "3" },
        ]}
      />
    );

    expect(screen.getByText("Total Drafts")).toBeTruthy();
    expect(screen.getByText("Total Sent")).toBeTruthy();
    expect(screen.getByText("Total Paid")).toBeTruthy();
    expect(screen.getByText("Total Overdue")).toBeTruthy();
  });

  it("filters invoice rows by search input", () => {
    render(
      <FeatureInvoiceTable
        rows={[
          {
            invoice_number: "INV-2023-1024",
            customer_name: "PT. Sumber Makmur",
            invoice_date: "2023-11-14",
            due_date: "2023-11-28",
            total_amount: "Rp 9,200,000",
            status: "Sent",
          },
          {
            invoice_number: "INV-2023-1023",
            customer_name: "CV. Teknologi Maju",
            invoice_date: "2023-11-10",
            due_date: "2023-11-24",
            total_amount: "Rp 4,100,000",
            status: "Overdue",
          },
        ]}
      />
    );

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
    render(
      <FeatureInvoiceDetailView
        detail={{
          current_step: "Sent",
          invoice_number: "INV-2023-1024",
          invoice_date: "2023-11-14",
          due_date: "2023-11-28",
          customer_identity: {
            name: "PT. Sumber Makmur",
            address_lines: ["Jl. Industri Raya No. 10"],
          },
          detail_rows: [
            {
              id: "line-1",
              product_or_service: "Produk A",
              description: "Satuan",
              qty: 2,
              price: "1500000",
              tax: "11%",
              line_total: "3000000",
            },
          ],
          summary_totals: {
            subtotal: "Rp 3,000,000",
            tax: "Rp 330,000",
            total: "Rp 3,330,000",
          },
        }}
      />
    );

    expect(screen.getByRole("button", { name: "Send via Email" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Register Payment" })).toBeTruthy();
    expect(screen.getByText("Total Amount")).toBeTruthy();
  });
});
