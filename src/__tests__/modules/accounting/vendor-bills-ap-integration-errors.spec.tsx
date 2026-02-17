/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { AccountingApApiError } from "@/services/api/accounting-ap";
import {
  VendorBillsApBatchPaymentPage,
  VendorBillsApIndexPage,
  VendorBillsApOcrReviewPage,
} from "@/modules/accounting";

const {
  createBillMutateAsync,
  previewBatchMutateAsync,
  confirmBatchMutateAsync,
  saveOcrProgressMutateAsync,
  confirmOcrMutateAsync,
} = vi.hoisted(() => ({
  createBillMutateAsync: vi.fn(),
  previewBatchMutateAsync: vi.fn(),
  confirmBatchMutateAsync: vi.fn(),
  saveOcrProgressMutateAsync: vi.fn(),
  confirmOcrMutateAsync: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
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
      items: [],
      pagination: { page: 1, per_page: 24, total_items: 0, total_pages: 0 },
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
  useAccountingApVendorCredits: () => ({
    data: { items: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApBatchMutations: () => ({
    previewBatchPayment: {
      isPending: false,
      mutateAsync: previewBatchMutateAsync,
    },
    confirmBatchPayment: {
      isPending: false,
      mutateAsync: confirmBatchMutateAsync,
    },
  }),
  useAccountingApOcrMutations: () => ({
    createOcrSession: { isPending: false, mutateAsync: vi.fn() },
    saveOcrProgress: { isPending: false, mutateAsync: saveOcrProgressMutateAsync },
    confirmOcrSession: { isPending: false, mutateAsync: confirmOcrMutateAsync },
  }),
}));

describe("vendor-bills-ap integration errors", () => {
  beforeEach(() => {
    createBillMutateAsync.mockReset();
    previewBatchMutateAsync.mockReset();
    confirmBatchMutateAsync.mockReset();
    saveOcrProgressMutateAsync.mockReset();
    confirmOcrMutateAsync.mockReset();
  });

  it("shows 409 error message on create vendor bill modal", async () => {
    createBillMutateAsync.mockRejectedValueOnce(
      new AccountingApApiError({
        message: "duplicate bill number",
        statusCode: 409,
      })
    );

    render(<VendorBillsApIndexPage />);

    fireEvent.click(screen.getByRole("button", { name: "New Bill" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Bill" }));

    expect(await screen.findByText("duplicate bill number")).toBeTruthy();
  });

  it("shows 422 error message when batch confirm validation fails", async () => {
    previewBatchMutateAsync.mockResolvedValueOnce({
      selected_bills: [{ bill_number: "BILL-2023-089", vendor_name: "PT. Pemasok Jaya", amount_due: 100000 }],
      selected_credits: [],
      totals: {
        total_bills_amount: 100000,
        credits_applied_amount: 0,
        total_to_pay_amount: 100000,
      },
    });
    confirmBatchMutateAsync.mockRejectedValueOnce(
      new AccountingApApiError({
        message: "payment exceeds outstanding amount",
        statusCode: 422,
      })
    );

    render(<VendorBillsApBatchPaymentPage />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm Batch Payment" }));

    expect(await screen.findByText("payment exceeds outstanding amount")).toBeTruthy();
  });

  it("shows 429 error message when OCR confirm is rate-limited", async () => {
    confirmOcrMutateAsync.mockRejectedValueOnce(
      new AccountingApApiError({
        message: "too many OCR confirmation attempts",
        statusCode: 429,
      })
    );

    render(<VendorBillsApOcrReviewPage />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm & Create Bill" }));

    expect(await screen.findByText("too many OCR confirmation attempts")).toBeTruthy();
  });
});

