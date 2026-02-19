/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  BankCashAccountTransactionsPage,
  BankCashReconciliationPage,
} from "@/modules/accounting";
import { AccountingBankCashApiError } from "@/services/api/accounting-bank-cash";

const { pushMock, confirmMutateAsync } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  confirmMutateAsync: vi.fn(),
}));

let transactionsError: unknown = null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingBankCashOverview: () => ({
    data: null,
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
    data: null,
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
    error: transactionsError,
    isPending: false,
  }),
  useAccountingBankCashMutations: () => ({
    createAccount: { isPending: false, mutateAsync: vi.fn() },
    importStatement: { isPending: false, mutateAsync: vi.fn() },
    createMatches: { isPending: false, mutateAsync: vi.fn() },
    suggestMatches: { isPending: false, mutateAsync: vi.fn() },
    confirmReconciliation: { isPending: false, mutateAsync: confirmMutateAsync },
    createManualTransaction: { isPending: false, mutateAsync: vi.fn() },
    exportTransactions: { isPending: false, mutateAsync: vi.fn() },
  }),
}));

describe("bank-cash page flow", () => {
  beforeEach(() => {
    pushMock.mockReset();
    confirmMutateAsync.mockReset();
    transactionsError = null;
  });

  it("shows in-page success CTA after confirm and keeps user on reconciliation page", async () => {
    confirmMutateAsync.mockResolvedValueOnce({
      session_reference: "REC-001",
      status: "Confirmed",
      confirmed_at: "2026-02-17T10:00:00Z",
      detail_cta: {
        account_id: "bca-corporate",
        href: "/bumdes/accounting/bank-cash/accounts/bca-corporate/transactions",
      },
    });

    render(<BankCashReconciliationPage accountId="bca-corporate" />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm Reconciliation" }));

    expect(await screen.findByText("Reconciliation confirmed")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Detail Transactions" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/bumdes/accounting/bank-cash/accounts/bca-corporate/transactions?from=reconciliation&accountId=bca-corporate"
    );
  });

  it("returns to same reconciliation context when back is pressed from details", () => {
    render(<BankCashAccountTransactionsPage accountId="bca-corporate" />);

    fireEvent.click(screen.getByRole("button", { name: "Back to reconciliation" }));

    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/bank-cash?accountId=bca-corporate");
  });

  it("shows precondition gate when detail is opened before reconciliation confirmation", () => {
    transactionsError = new AccountingBankCashApiError({
      message: "reconciliation must be confirmed first",
      statusCode: 412,
    });

    render(<BankCashAccountTransactionsPage accountId="bca-corporate" />);

    expect(screen.getByText("Reconciliation confirmation required")).toBeTruthy();
    expect(screen.getByText("reconciliation must be confirmed first")).toBeTruthy();
  });
});
