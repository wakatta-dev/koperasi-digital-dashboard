/** @format */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  BankCashAccountTransactionsPage,
  BankCashOverviewPage,
  BankCashReconciliationPage,
} from "@/modules/accounting";
import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingBankCashOverview: () => ({
    data: {
      cards: [
        { key: "total", label: "Total Cash Balance", value: "Rp 100", tone: "primary" },
      ],
      cash_register_summary: [],
    },
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
      statement_balance_amount: 100,
      system_balance_amount: 100,
      difference_amount: 0,
      status: "Draft",
      can_confirm: true,
      can_open_detail: false,
    },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashBankLines: () => ({
    data: {
      items: [],
      pagination: { page: 1, per_page: 20, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingBankCashSystemLines: () => ({
    data: {
      items: [],
      pagination: { page: 1, per_page: 20, total_items: 0, total_pages: 0 },
    },
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
    createAccount: { isPending: false, mutateAsync: vi.fn() },
    importStatement: { isPending: false, mutateAsync: vi.fn() },
    createMatches: { isPending: false, mutateAsync: vi.fn() },
    suggestMatches: { isPending: false, mutateAsync: vi.fn() },
    confirmReconciliation: { isPending: false, mutateAsync: vi.fn() },
    createManualTransaction: { isPending: false, mutateAsync: vi.fn() },
    exportTransactions: { isPending: false, mutateAsync: vi.fn() },
  }),
}));

describe("bank-cash foundation", () => {
  it("renders all bank-cash page containers", () => {
    const reconciliation = render(<BankCashReconciliationPage />);
    expect(
      screen.getByRole("button", { name: "Confirm Reconciliation" })
    ).toBeTruthy();
    reconciliation.unmount();

    const overview = render(<BankCashOverviewPage />);
    expect(screen.getByRole("heading", { name: "Bank & Cash" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add Bank Account" })).toBeTruthy();
    overview.unmount();

    render(<BankCashAccountTransactionsPage accountId="bca-corporate" />);
    expect(
      screen.getByRole("heading", { name: "Detail Transaksi: BCA Corporate" })
    ).toBeTruthy();
  });

  it("registers bank-cash submenu entries under accounting", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const bankCashItem = accountingItem?.items?.find((item) => item.name === "Bank & Cash");
    expect(bankCashItem).toBeTruthy();
    expect(bankCashItem?.items).toEqual([
      { name: "Overview", href: "/bumdes/accounting/bank-cash/overview" },
      {
        name: "Rekonsiliasi",
        href: "/bumdes/accounting/bank-cash/reconciliation",
      },
    ]);
  });

  it("registers title map entries for bank-cash child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/bank-cash"]).toBe("Accounting - Bank & Cash");
    expect(bumdesTitleMap["/bumdes/accounting/bank-cash/reconciliation"]).toBe(
      "Accounting - Bank & Cash - Reconciliation"
    );
    expect(bumdesTitleMap["/bumdes/accounting/bank-cash/overview"]).toBe(
      "Accounting - Bank & Cash - Overview"
    );
    expect(
      bumdesTitleMap["/bumdes/accounting/bank-cash/accounts/[accountId]/transactions"]
    ).toBe("Accounting - Bank & Cash - Account Transactions");
  });
});
