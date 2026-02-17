/** @format */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  InvoicingArCreditNoteCreatePage,
  InvoicingArCreditNotesPaymentsPage,
  InvoicingArIndexPage,
  InvoicingArInvoiceDetailPage,
  InvoicingArPaymentCreatePage,
} from "@/modules/accounting";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingArInvoices: () => ({
    data: {
      items: [],
      pagination: {
        page: 1,
        per_page: 20,
        total_items: 0,
        total_pages: 0,
      },
    },
    error: null,
  }),
  useAccountingArCreditNotes: () => ({
    data: {
      items: [],
      pagination: {
        page: 1,
        per_page: 20,
        total_items: 0,
        total_pages: 0,
      },
    },
    error: null,
  }),
  useAccountingArPayments: () => ({
    data: {
      items: [],
      pagination: {
        page: 1,
        per_page: 20,
        total_items: 0,
        total_pages: 0,
      },
    },
    error: null,
  }),
  useAccountingArInvoiceDetail: () => ({
    data: null,
    error: null,
  }),
  useAccountingArInvoiceMutations: () => ({
    createInvoice: {
      isPending: false,
      mutateAsync: vi.fn(),
    },
    sendInvoice: {
      isPending: false,
      mutateAsync: vi.fn(),
    },
  }),
  useAccountingArCreditNoteMutations: () => ({
    createCreditNote: {
      isPending: false,
      mutateAsync: vi.fn(),
    },
  }),
  useAccountingArPaymentMutations: () => ({
    createPayment: {
      isPending: false,
      mutateAsync: vi.fn(),
    },
  }),
}));

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
    expect(screen.getByText("Invoice detail is unavailable.")).toBeTruthy();
  });

  it("does not render unrelated layout chrome text", () => {
    render(<InvoicingArIndexPage />);

    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.queryByText("Halaman placeholder untuk invoicing accounts receivable.")).toBeNull();
  });
});
