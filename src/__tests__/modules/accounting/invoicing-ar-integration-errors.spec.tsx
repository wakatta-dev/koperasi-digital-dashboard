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
