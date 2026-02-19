/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import {
  BankCashAccountTransactionsPage,
  BankCashOverviewPage,
  BankCashReconciliationPage,
} from "@/modules/accounting";
import { AccountingBankCashApiError } from "@/services/api/accounting-bank-cash";

const {
  createAccountMutateAsync,
  confirmMutateAsync,
  createManualTransactionMutateAsync,
  toastError,
} = vi.hoisted(() => ({
  createAccountMutateAsync: vi.fn(),
  confirmMutateAsync: vi.fn(),
  createManualTransactionMutateAsync: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: toastError,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingBankCashOverview: () => ({
    data: { cards: [], cash_register_summary: [] },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashAccounts: () => ({
    data: {
      items: [
        {
          account_id: "bca-corporate",
          bank_name: "Bank Central Asia",
          account_name: "BCA Corporate",
          masked_account_number: "**** 8899",
          currency_code: "IDR",
          available_balance: 100,
          unreconciled_count: 1,
          status: "Active",
          last_sync_at: "2026-02-17T00:00:00Z",
        },
      ],
      pagination: { page: 1, per_page: 20, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashUnreconciledTransactions: () => ({
    data: { items: [], pagination: { page: 1, per_page: 20, total_items: 0, total_pages: 0 } },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashReconciliationSession: () => ({
    data: {
      session_reference: "REC-001",
      statement_balance_amount: 145200000,
      system_balance_amount: 145200000,
      difference_amount: 0,
      status: "Draft",
      can_confirm: true,
      can_open_detail: false,
    },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashBankLines: () => ({
    data: { items: [], pagination: { page: 1, per_page: 20, total_items: 0, total_pages: 0 } },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashSystemLines: () => ({
    data: { items: [], pagination: { page: 1, per_page: 20, total_items: 0, total_pages: 0 } },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashAccountTransactions: () => ({
    data: {
      summary: { current_balance: 100, last_synced_at: "2026-02-17T00:00:00Z" },
      items: [],
      pagination: { page: 1, per_page: 20, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashMutations: () => ({
    createAccount: { isPending: false, mutateAsync: createAccountMutateAsync },
    importStatement: { isPending: false, mutateAsync: vi.fn() },
    createMatches: { isPending: false, mutateAsync: vi.fn() },
    suggestMatches: { isPending: false, mutateAsync: vi.fn() },
    confirmReconciliation: { isPending: false, mutateAsync: confirmMutateAsync },
    createManualTransaction: {
      isPending: false,
      mutateAsync: createManualTransactionMutateAsync,
    },
    exportTransactions: { isPending: false, mutateAsync: vi.fn() },
  }),
}));

describe("bank-cash integration errors", () => {
  beforeEach(() => {
    createAccountMutateAsync.mockReset();
    confirmMutateAsync.mockReset();
    createManualTransactionMutateAsync.mockReset();
    toastError.mockReset();
  });

  it("surfaces 409 duplicate account errors on add account flow", async () => {
    createAccountMutateAsync.mockRejectedValueOnce(
      new AccountingBankCashApiError({
        message: "duplicate account number",
        statusCode: 409,
      })
    );

    render(<BankCashOverviewPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Bank Account" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Account" }));

    await waitFor(() => {
      expect(createAccountMutateAsync).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith("duplicate account number");
    });
  });

  it("surfaces 422 unresolved difference errors on confirm reconciliation", async () => {
    confirmMutateAsync.mockRejectedValueOnce(
      new AccountingBankCashApiError({
        message: "difference must be zero before confirmation",
        statusCode: 422,
      })
    );

    render(<BankCashReconciliationPage accountId="bca-corporate" />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm Reconciliation" }));

    await waitFor(() => {
      expect(confirmMutateAsync).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith("difference must be zero before confirmation");
    });
  });

  it("surfaces 422 validation errors on manual entry action", async () => {
    createManualTransactionMutateAsync.mockRejectedValueOnce(
      new AccountingBankCashApiError({
        message: "invalid amount composition",
        statusCode: 422,
      })
    );

    render(<BankCashAccountTransactionsPage accountId="bca-corporate" />);

    fireEvent.click(screen.getByRole("button", { name: "Manual Entry" }));

    await waitFor(() => {
      expect(createManualTransactionMutateAsync).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith("invalid amount composition");
    });
  });
});
