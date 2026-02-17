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

  it("toggles local modal states without API calls", () => {
    render(<InvoicingArFeatureDemo />);

    const createInvoice = screen.getByRole("button", { name: "Create Invoice" });
    const createCreditNote = screen.getByRole("button", { name: "Create Credit Note" });
    const recordPayment = screen.getByRole("button", { name: "Record Payment" });

    fireEvent.click(createInvoice);
    fireEvent.click(createCreditNote);
    fireEvent.click(recordPayment);

    expect(screen.getByText("create_invoice modal: open")).toBeTruthy();
    expect(screen.getByText("create_credit_note modal: open")).toBeTruthy();
    expect(screen.getByText("record_payment modal: open")).toBeTruthy();
  });
});
