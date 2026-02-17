/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  VendorBillsApBatchPaymentPage,
  VendorBillsApDetailPage,
  VendorBillsApIndexPage,
  VendorBillsApOcrReviewPage,
  VendorBillsApPaymentConfirmationPage,
} from "@/modules/accounting";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("vendor-bills-ap page wiring", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("opens bill detail when a table row is clicked", () => {
    render(<VendorBillsApIndexPage />);

    fireEvent.click(screen.getByTestId("vendor-bill-row-BILL-2023-089"));
    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/vendor-bills-ap/BILL-2023-089");
  });

  it("keeps checkbox as selection-only without triggering row navigation", () => {
    render(<VendorBillsApIndexPage />);

    fireEvent.click(screen.getByLabelText("Select BILL-2023-089"));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("routes pay now to batch payment with preselected active bill", () => {
    render(<VendorBillsApDetailPage billNumber="BILL-2023-089" />);

    fireEvent.click(screen.getByRole("button", { name: "Pay Now" }));
    expect(pushMock).toHaveBeenCalledWith(
      "/bumdes/accounting/vendor-bills-ap/batch-payment?bills=BILL-2023-089"
    );
  });

  it("shows preselected bill labels on batch page", () => {
    render(<VendorBillsApBatchPaymentPage preselectedBillNumbers={["BILL-2023-089"]} />);

    expect(screen.getByText("Selected bill count: 1")).toBeTruthy();
  });

  it("routes OCR confirm action to created bill detail", () => {
    render(<VendorBillsApOcrReviewPage />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm & Create Bill" }));
    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/vendor-bills-ap/INV-2023-882");
  });

  it("routes Done action on confirmation page back to AP list", () => {
    render(<VendorBillsApPaymentConfirmationPage />);

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/vendor-bills-ap");
  });
});
