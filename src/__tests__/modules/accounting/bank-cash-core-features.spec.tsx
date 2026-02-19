/** @format */

import { fireEvent, render, screen } from "@testing-library/react";

import {
  FeatureAddBankAccountModal,
  FeatureBankAccountTransactionFilters,
  FeatureBankAccountTransactionsTable,
  FeatureBankAccountsGrid,
  FeatureBankCashSummaryCards,
  FeatureBankStatementMatchTable,
  FeatureCashRegistersGrid,
  FeatureImportBankStatementModal,
  FeatureReconciliationActions,
  FeatureReconciliationBalanceCards,
  FeatureReconciliationDifferenceBanner,
  FeatureReconciliationSelectionBar,
  FeatureSystemTransactionsMatchTable,
  FeatureUnreconciledTransactionsTable,
} from "@/modules/accounting";

describe("bank-cash core features", () => {
  it("renders overview and reconciliation labels from source", () => {
    render(
      <div>
        <FeatureBankCashSummaryCards
          cards={[
            {
              key: "total-cash-balance",
              label: "Total Cash Balance",
              value: "Rp 55,000,000",
              helper_text: "Across all active accounts",
              tone: "primary",
            },
            {
              key: "pending-reconciliation",
              label: "Pending Reconciliation",
              value: "Rp 2,500,000",
              helper_text: "Needs matching",
              tone: "warning",
            },
            {
              key: "petty-cash-balance",
              label: "Petty Cash Balance",
              value: "Rp 1,200,000",
              helper_text: "Cash register total",
              tone: "success",
            },
          ]}
        />
        <FeatureBankAccountsGrid
          accounts={[
            {
              account_id: "acc-1",
              bank_badge: "BCA",
              bank_badge_class_name: "bg-blue-600",
              bank_name: "Bank Central Asia",
              account_name: "Operational Account",
              masked_account_number: "•••• 1023",
              available_balance: "Rp 25,000,000",
              last_sync_label: "Synced 5m ago",
              unreconciled_count: 2,
              status: "Active",
            },
          ]}
        />
        <FeatureUnreconciledTransactionsTable
          rows={[
            {
              id: "unrec-1",
              date: "2026-02-18",
              description: "Bank transfer",
              source: "Bank Feed",
              amount: "-Rp 150,000",
              direction: "Debit",
              can_match: true,
            },
          ]}
        />
        <FeatureCashRegistersGrid
          items={[
            {
              id: "cash-1",
              register_name: "Kas Kecil Gudang",
              register_type: "Petty Cash",
              balance_label: "Rp 1,200,000",
              status_label: "Open",
            },
          ]}
        />
        <FeatureReconciliationDifferenceBanner />
        <FeatureReconciliationBalanceCards />
        <FeatureReconciliationSelectionBar
          selectedBankLinesCount={2}
          selectedSystemLinesCount={2}
          netDifferenceLabel="Rp 0"
        />
      </div>
    );

    expect(screen.getByText("Total Cash Balance")).toBeTruthy();
    expect(screen.getByText("Pending Reconciliation")).toBeTruthy();
    expect(screen.getByText("Petty Cash Balance")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Rekening Bank" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Unreconciled Transactions" })).toBeTruthy();
    expect(screen.getByText("Difference to Reconcile")).toBeTruthy();
    expect(screen.getByText("Selected:")).toBeTruthy();
    expect(screen.getByText("2 Bank Lines")).toBeTruthy();
    expect(screen.getByText("2 System Lines")).toBeTruthy();
    expect(screen.getByText("Net Difference")).toBeTruthy();
  });

  it("renders table/filter placeholders and pagination controls", () => {
    render(
      <div>
        <FeatureBankStatementMatchTable />
        <FeatureSystemTransactionsMatchTable />
        <FeatureBankAccountTransactionFilters />
        <FeatureBankAccountTransactionsTable
          rows={[
            {
              transaction_id: "tx-1",
              date: "Nov 14",
              description: "A",
              reference_label: "R1",
              amount: "-Rp 100",
              direction: "Debit",
              status: "Unreconciled",
            },
            {
              transaction_id: "tx-2",
              date: "Nov 13",
              description: "B",
              reference_label: "R2",
              amount: "+Rp 200",
              direction: "Credit",
              status: "Reconciled",
            },
            {
              transaction_id: "tx-3",
              date: "Nov 12",
              description: "C",
              reference_label: "R3",
              amount: "-Rp 300",
              direction: "Debit",
              status: "Reconciled",
            },
            {
              transaction_id: "tx-4",
              date: "Nov 11",
              description: "D",
              reference_label: "R4",
              amount: "-Rp 400",
              direction: "Debit",
              status: "Unreconciled",
            },
            {
              transaction_id: "tx-5",
              date: "Nov 10",
              description: "E",
              reference_label: "R5",
              amount: "+Rp 500",
              direction: "Credit",
              status: "Reconciled",
            },
          ]}
        />
      </div>
    );

    expect(screen.getByPlaceholderText("Search description or amount...")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search ref, partner, or amount...")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search transactions...")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("E")).toBeTruthy();
  });

  it("renders overlay-only modal content and actions", () => {
    const addModal = render(
      <FeatureAddBankAccountModal open onOpenChange={() => undefined} />
    );
    expect(screen.getByText("Add Bank Account")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search bank (e.g. BCA, Mandiri...)")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add Account" })).toBeTruthy();
    addModal.unmount();

    const importModal = render(
      <FeatureImportBankStatementModal open onOpenChange={() => undefined} />
    );
    expect(screen.getByRole("heading", { name: "Import Bank Statement" })).toBeTruthy();
    expect(screen.getByText("Click to upload or drag and drop")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Upload & Process" })).toBeTruthy();
    importModal.unmount();

    render(<FeatureReconciliationActions />);
    expect(screen.getByRole("button", { name: "Suggest Matches" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Confirm Reconciliation" })).toBeTruthy();
  });
});
