/** @format */

import { render, screen } from "@testing-library/react";

import {
  InvoicingArCreditNoteCreatePage,
  InvoicingArCreditNotesPaymentsPage,
  InvoicingArIndexPage,
  InvoicingArInvoiceDetailPage,
  InvoicingArPaymentCreatePage,
} from "@/modules/accounting";

describe("invoicing-ar page wiring", () => {
  it("renders index page feature-only sections for invoicing AR", () => {
    render(<InvoicingArIndexPage />);

    expect(screen.getByRole("heading", { name: "Invoicing (AR)" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Daftar Invoice" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Create Invoice" }).getAttribute("href")).toBe(
      "/bumdes/accounting/invoicing-ar/create"
    );
    expect(screen.getByRole("link", { name: "Record Payment" }).getAttribute("href")).toBe(
      "/bumdes/accounting/invoicing-ar/credit-notes-payments/payments/create"
    );
  });

  it("renders credit notes and payments overview route page", () => {
    render(<InvoicingArCreditNotesPaymentsPage />);

    expect(
      screen.getByRole("heading", { name: "Credit Notes & Payments" })
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Credit Notes (Customer)" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Payments Received" })).toBeTruthy();

    expect(screen.getByRole("link", { name: "New Credit Note" }).getAttribute("href")).toBe(
      "/bumdes/accounting/invoicing-ar/credit-notes-payments/credit-notes/create"
    );
    expect(screen.getByRole("link", { name: "Record Payment" }).getAttribute("href")).toBe(
      "/bumdes/accounting/invoicing-ar/credit-notes-payments/payments/create"
    );
  });

  it("renders dedicated create/detail route containers", () => {
    const creditNote = render(<InvoicingArCreditNoteCreatePage />);
    expect(screen.getByRole("heading", { name: "New Credit Note" })).toBeTruthy();
    creditNote.unmount();

    const payment = render(<InvoicingArPaymentCreatePage />);
    expect(screen.getByRole("heading", { name: "Record Payment" })).toBeTruthy();
    payment.unmount();

    render(<InvoicingArInvoiceDetailPage invoiceNumber="INV-TEST-001" />);
    expect(screen.getByText("INV-TEST-001")).toBeTruthy();
  });

  it("does not render unrelated layout chrome text", () => {
    render(<InvoicingArIndexPage />);

    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.queryByText("Halaman placeholder untuk invoicing accounts receivable.")).toBeNull();
  });
});
