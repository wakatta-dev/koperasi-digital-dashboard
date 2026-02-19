/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  VendorBillsApBatchPaymentPage,
  VendorBillsApDetailPage,
  VendorBillsApIndexPage,
  VendorBillsApOcrReviewPage,
  VendorBillsApPaymentConfirmationPage,
} from "@/modules/accounting";

const pushMock = vi.fn();
const createOcrSessionMutateAsync = vi.fn();
const confirmOcrSessionMutateAsync = vi.fn();
const createBillMutateAsync = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingApOverview: () => ({
    data: { cards: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApBills: () => ({
    data: {
      items: [
        {
          bill_number: "BILL-2023-089",
          vendor_name: "PT. Pemasok Jaya",
          bill_date: "2023-10-25",
          due_date: "2023-11-24",
          amount: 12500000,
          status: "Overdue",
        },
      ],
      pagination: { page: 1, per_page: 24, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingApBillMutations: () => ({
    createBill: {
      isPending: false,
      mutateAsync: createBillMutateAsync,
    },
    updateBill: { isPending: false, mutateAsync: vi.fn() },
    updateBillStatus: { isPending: false, mutateAsync: vi.fn() },
  }),
  useAccountingApBillDetail: () => ({
    data: {
      bill_number: "BILL-2023-089",
      status: "Overdue",
      created_label: "Created on Oct 25, 2023 by System OCR",
      vendor: {
        name: "PT. Pemasok Jaya",
        address_lines: ["Jl. Industri Raya No. 45"],
        email: "billing@pemasokjaya.co.id",
      },
      meta: {
        bill_date: "2023-10-25",
        due_date: "2023-11-24",
        due_note: "15 days overdue",
        reference_number: "INV/PJ/2023/1029",
        currency: "IDR - Indonesian Rupiah",
      },
      line_items: [
        {
          item_description: "Raw Material - Grade A Silicon",
          detail: "Batch #8829-X",
          qty: "500 kg",
          unit_price: 15000,
          total: 7500000,
        },
      ],
      totals: {
        subtotal: 12500000,
        tax_amount: 1375000,
        total_amount: 13875000,
        paid_to_date: 5000000,
        balance_due: 8875000,
      },
      internal_note: "The remaining balance is scheduled.",
    },
    error: null,
    isPending: false,
  }),
  useAccountingApBillPayments: () => ({
    data: { items: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApVendorCredits: () => ({
    data: { items: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApBatchMutations: () => ({
    previewBatchPayment: { isPending: false, mutateAsync: vi.fn() },
    confirmBatchPayment: { isPending: false, mutateAsync: vi.fn() },
  }),
  useAccountingApOcrMutations: () => ({
    createOcrSession: { isPending: false, mutateAsync: createOcrSessionMutateAsync },
    saveOcrProgress: { isPending: false, mutateAsync: vi.fn() },
    confirmOcrSession: {
      isPending: false,
      mutateAsync: confirmOcrSessionMutateAsync,
    },
  }),
  useAccountingApBatchDetail: () => ({
    data: {
      batch_reference: "BATCH-001",
      status: "Scheduled",
      totals: {
        total_bills_amount: 1000000,
        credits_applied_amount: 0,
        total_to_pay_amount: 1000000,
      },
      bill_breakdowns: [],
    },
    error: null,
    isPending: false,
  }),
}));

describe("vendor-bills-ap page wiring", () => {
  beforeEach(() => {
    pushMock.mockReset();
    createOcrSessionMutateAsync.mockReset();
    confirmOcrSessionMutateAsync.mockReset();
    createBillMutateAsync.mockReset();
    createOcrSessionMutateAsync.mockResolvedValue({
      session_id: "ocr-session-001",
      status: "Draft",
      accuracy_percent: 87,
      extracted_data: {
        general_info: {
          vendor_name: "PT. Pemasok Jaya",
          bill_number: "INV/PJ/2023/1029",
          bill_date: "2023-10-25",
          due_date: "2023-11-24",
        },
        financials: { total_amount: "13875000" },
        line_items: [],
      },
    });
    confirmOcrSessionMutateAsync.mockResolvedValue({ bill_number: "INV-2023-882" });
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

  it("routes OCR confirm action to created bill detail", async () => {
    render(<VendorBillsApOcrReviewPage />);

    await waitFor(() => {
      expect(createOcrSessionMutateAsync).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm & Create Bill" }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/vendor-bills-ap/INV-2023-882");
    });
  });

  it("routes Done action on confirmation page back to AP list", () => {
    render(<VendorBillsApPaymentConfirmationPage />);

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/vendor-bills-ap");
  });
});
