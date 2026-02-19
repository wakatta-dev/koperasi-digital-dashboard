/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { AccountingArApiError } from "@/services/api/accounting-ar";
import {
  InvoicingArCreateInvoicePage,
  InvoicingArCreditNoteCreatePage,
  InvoicingArPaymentCreatePage,
} from "@/modules/accounting";

const createInvoiceMutateAsync = vi.fn();
const createCreditNoteMutateAsync = vi.fn();
const createPaymentMutateAsync = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingArInvoices: () => ({
    data: {
      items: [
        {
          invoice_number: "INV-2023-097",
          customer_name: "PT. Sumber Makmur",
          invoice_date: "2023-11-14",
          due_date: "2023-11-28",
          total_amount: 1250000,
          status: "Sent",
        },
        {
          invoice_number: "INV-2023-098",
          customer_name: "CV. Teknologi Maju",
          invoice_date: "2023-11-16",
          due_date: "2023-11-30",
          total_amount: 2300000,
          status: "Overdue",
        },
      ],
      pagination: { page: 1, per_page: 100, total_items: 2, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingArPayments: () => ({
    data: {
      items: [
        {
          date: "2023-11-10",
          payment_number: "PAY-2023-001",
          customer: "PT. Sumber Makmur",
          method: "Bank Transfer",
          amount: 750000,
          status: "Cleared",
          invoice_number: "INV-2023-090",
        },
      ],
      pagination: { page: 1, per_page: 100, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingArInvoiceMutations: () => ({
    createInvoice: {
      isPending: false,
      mutateAsync: createInvoiceMutateAsync,
    },
    sendInvoice: {
      isPending: false,
      mutateAsync: vi.fn(),
    },
  }),
  useAccountingArCreditNoteMutations: () => ({
    createCreditNote: {
      isPending: false,
      mutateAsync: createCreditNoteMutateAsync,
    },
  }),
  useAccountingArPaymentMutations: () => ({
    createPayment: {
      isPending: false,
      mutateAsync: createPaymentMutateAsync,
    },
  }),
}));

describe("invoicing-ar integration errors", () => {
  beforeEach(() => {
    createInvoiceMutateAsync.mockReset();
    createCreditNoteMutateAsync.mockReset();
    createPaymentMutateAsync.mockReset();
  });

  it("shows 409 error message on create invoice page", async () => {
    createInvoiceMutateAsync.mockRejectedValueOnce(
      new AccountingArApiError({
        message: "duplicate invoice number",
        statusCode: 409,
      })
    );

    render(<InvoicingArCreateInvoicePage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Invoice" }));

    expect(await screen.findByText("duplicate invoice number")).toBeTruthy();
  });

  it("shows 422 error message on create credit note page", async () => {
    createCreditNoteMutateAsync.mockRejectedValueOnce(
      new AccountingArApiError({
        message: "missing required fields in create forms",
        statusCode: 422,
      })
    );

    render(<InvoicingArCreditNoteCreatePage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Credit Note" }));

    expect(await screen.findByText("missing required fields in create forms")).toBeTruthy();
  });

  it("shows 422 error message on record payment page", async () => {
    createPaymentMutateAsync.mockRejectedValueOnce(
      new AccountingArApiError({
        message: "over-allocation payment",
        statusCode: 422,
      })
    );

    render(<InvoicingArPaymentCreatePage />);

    fireEvent.click(screen.getByRole("button", { name: "Record Payment" }));

    expect(await screen.findByText("over-allocation payment")).toBeTruthy();
  });
});
