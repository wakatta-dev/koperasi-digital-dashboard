/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ReportingAccountLedgerPage,
  ReportingGeneralLedgerPage,
  ReportingProfitLossComparativePage,
  ReportingTrialBalancePage,
} from "@/modules/accounting";

const { pushMock, replaceMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
}));

let pathnameMock = "/bumdes/accounting/reporting/general-ledger";
let searchParamsMock = new URLSearchParams();
let withMissingAccountContext = false;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => pathnameMock,
  useSearchParams: () => searchParamsMock,
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingReportingProfitLossComparative: () => ({
    data: {
      period_label: "Oct 2023",
      compare_label: "Oct 2023 vs Sep 2023",
      rows: [
        { type: "section", label: "Income", current_value: 0, previous_value: 0, variance_value: 0, variance_pct: 0 },
        { type: "item", label: "Sales Revenue", current_value: 124500, previous_value: 118200, variance_value: 6300, variance_pct: 5.3 },
      ],
      meta: {
        generated_at: "Oct 31, 2023 18:00",
        currency: "USD",
      },
    },
    error: null,
    isPending: false,
  }),
  useAccountingReportingTrialBalance: () => ({
    data: {
      period_label: "01 Jan 2024 - 31 Dec 2024",
      rows: [
        {
          group: "Assets",
          account_code: "10-001",
          account_name: "Cash on Hand",
          initial_balance: 15000,
          debit: 5000,
          credit: 2000,
          ending_balance: 18000,
        },
      ],
      totals: {
        initial_balance: 0,
        debit: 30500,
        credit: 33700,
        ending_balance: -3200,
      },
    },
    error: null,
    isPending: false,
  }),
  useAccountingReportingGeneralLedger: () => ({
    data: {
      period_label: "Oct 2023",
      groups: [
        {
          account_id: "101000",
          account_code: "101000",
          account_name: "Bank Central Asia",
          initial_balance: 50000000,
          entries: [
            {
              date: "Oct 01, 2023",
              reference: "INV/2023/001",
              partner: "PT. Maju Mundur",
              label: "Customer Invoice Payment",
              debit: 15000000,
              credit: 0,
              balance: 65000000,
            },
          ],
          subtotal_debit: 15000000,
          subtotal_credit: 2500000,
          ending_balance: 62500000,
        },
      ],
      pagination: {
        page: 1,
        page_size: 20,
        total_accounts: 50,
      },
    },
    error: null,
    isPending: false,
  }),
  useAccountingReportingAccountLedger: (params?: { accountId?: string }) => ({
    data:
      withMissingAccountContext || !params?.accountId
        ? null
        : {
            account: {
              id: "101000",
              code: "101000",
              name: "Bank Central Asia",
            },
            summary: {
              total_debit: 125000000,
              total_credit: 45000000,
              current_balance: 80000000,
            },
            entries: [
              {
                date: "Oct 2, 2023",
                journal: "INV/2023/001",
                description: "Customer Payment - PT Maju Jaya",
                reference: "PAY/001",
                debit: 25000000,
                credit: 0,
                balance: 75000000,
              },
            ],
            totals: { debit: 75000000, credit: 21000000 },
            pagination: {
              page: 1,
              page_size: 20,
              total_entries: 6,
            },
          },
    error: null,
    isPending: false,
  }),
}));

describe("reporting ledger flow", () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();
    pathnameMock = "/bumdes/accounting/reporting/general-ledger";
    searchParamsMock = new URLSearchParams();
    withMissingAccountContext = false;
  });

  it("renders comparative and trial-balance pages", () => {
    pathnameMock = "/bumdes/accounting/reporting/p-and-l-comparative";
    render(<ReportingProfitLossComparativePage />);
    expect(screen.getByRole("heading", { name: "P&L Comparative" })).toBeTruthy();
    expect(screen.getByText("Current Month")).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/trial-balance";
    render(<ReportingTrialBalancePage />);
    expect(screen.getByRole("heading", { name: "Detail Trial Balance Report" })).toBeTruthy();
    expect(screen.getByText("Cash on Hand")).toBeTruthy();
  });

  it("moves context from general-ledger to account-ledger", () => {
    pathnameMock = "/bumdes/accounting/reporting/general-ledger";
    searchParamsMock = new URLSearchParams(
      "preset=custom&start=2023-10-01&end=2023-10-31&page=1&page_size=20",
    );

    render(<ReportingGeneralLedgerPage />);

    fireEvent.click(screen.getByRole("button", { name: /101000/i }));

    expect(pushMock).toHaveBeenCalledWith(
      "/bumdes/accounting/reporting/account-ledger?preset=custom&start=2023-10-01&end=2023-10-31&accountId=101000&page=1&page_size=20",
    );
  });

  it("stays on account-ledger and resolves first account when opened without accountId", async () => {
    pathnameMock = "/bumdes/accounting/reporting/account-ledger";
    searchParamsMock = new URLSearchParams("preset=custom&start=2023-10-01&end=2023-10-31");
    withMissingAccountContext = true;

    render(<ReportingAccountLedgerPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(
        "/bumdes/accounting/reporting/account-ledger?preset=custom&start=2023-10-01&end=2023-10-31&accountId=101000&page=1&page_size=20",
        { scroll: false },
      );
    });
  });
});
