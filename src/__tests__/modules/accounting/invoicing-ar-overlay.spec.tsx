/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import {
  FeatureCreateInvoiceModal,
  FeatureCreditNoteModal,
  FeatureReceivePaymentModal,
} from "@/modules/accounting";

describe("invoicing-ar overlay features", () => {
  it("renders create invoice modal with backdrop and line item interactions", () => {
    render(<FeatureCreateInvoiceModal open onOpenChange={() => {}} />);

    expect(screen.getByRole("heading", { name: "Create New Invoice" })).toBeTruthy();
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeTruthy();

    const addLineItem = screen.getByRole("button", { name: "Add Line Item" });
    fireEvent.click(addLineItem);
    const removeButtons = screen.getAllByLabelText(/Remove line item/);
    expect(removeButtons.length).toBeGreaterThan(1);

    fireEvent.click(removeButtons[removeButtons.length - 1]);
    expect(screen.getAllByLabelText(/Remove line item/).length).toBe(2);
  });

  it("renders credit note modal with source labels and add/remove item", () => {
    render(<FeatureCreditNoteModal open onOpenChange={() => {}} />);

    expect(screen.getByRole("heading", { name: "New Credit Note" })).toBeTruthy();
    expect(screen.getByText("Items to be Credited")).toBeTruthy();
    expect(screen.getByPlaceholderText("Type item name...")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Add Item" }));
    const removeButtons = screen.getAllByLabelText(/Remove credit item/);
    expect(removeButtons.length).toBe(2);
  });

  it("renders receive payment modal and toggles invoice selection", () => {
    render(<FeatureReceivePaymentModal open onOpenChange={() => {}} />);

    expect(screen.getByRole("heading", { name: "Record Payment" })).toBeTruthy();
    expect(screen.getByText("Pay Against Invoices")).toBeTruthy();

    const secondInvoice = screen.getByLabelText("Select INV-2023-098");
    fireEvent.click(secondInvoice);
    expect(screen.getByText("2 Outstanding")).toBeTruthy();
  });
});
