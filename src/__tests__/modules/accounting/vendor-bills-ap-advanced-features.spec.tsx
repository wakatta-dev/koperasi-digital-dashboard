/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import { VendorBillsApFeatureDemo } from "@/modules/accounting";

describe("vendor-bills-ap advanced features", () => {
  it("opens and closes create bill modal from demo list step", () => {
    render(<VendorBillsApFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "New Bill" }));
    expect(screen.getByRole("heading", { name: "Create New Bill" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("heading", { name: "Create New Bill" })).toBeNull();
  });

  it("navigates batch flow to confirmation in demo", () => {
    render(<VendorBillsApFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Batch" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Batch Payment" }));

    expect(screen.getByRole("heading", { name: "Pembayaran Berhasil!" })).toBeTruthy();
  });

  it("navigates OCR flow back to list when saving progress", () => {
    render(<VendorBillsApFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "OCR" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Progress" }));

    expect(screen.getByRole("heading", { name: "Daftar Bill" })).toBeTruthy();
  });

  it("returns from confirmation to list when done is clicked", () => {
    render(<VendorBillsApFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Confirmation" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(screen.getByRole("heading", { name: "Daftar Bill" })).toBeTruthy();
  });
});
