/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { KpiCards } from "@/components/shared/data-display/KpiCards";

import {
  FeatureAddBankAccountModal,
  FeatureBankAccountTransactionFilters,
  FeatureBankAccountTransactionsTable,
  FeatureBankAccountsGrid,
  FeatureBankStatementMatchTable,
  FeatureCashRegistersGrid,
  FeatureImportBankStatementModal,
  FeatureReconciliationActions,
  FeatureReconciliationDifferenceBanner,
  FeatureReconciliationSelectionBar,
  FeatureSystemTransactionsMatchTable,
  FeatureUnreconciledTransactionsTable,
} from "@/modules/accounting";

describe("bank-cash core features", () => {
  it("renders overview and reconciliation labels from source", () => {
    render(
      <div>
        <KpiCards
          items={[
            {
              id: "total-cash-balance",
              label: "Total Cash Balance",
              value: "Rp 55,000,000",
              tone: "primary",
              footer: (
                <p className="text-xs text-muted-foreground">
                  Across all active accounts
                </p>
              ),
            },
            {
              id: "pending-reconciliation",
              label: "Pending Reconciliation",
              value: "Rp 2,500,000",
              tone: "warning",
              footer: (
                <p className="text-xs text-muted-foreground">Needs matching</p>
              ),
            },
            {
              id: "petty-cash-balance",
              label: "Petty Cash Balance",
              value: "Rp 1,200,000",
              tone: "success",
              footer: (
                <p className="text-xs text-muted-foreground">Cash register total</p>
              ),
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
        <KpiCards
          items={[
            { id: "statement", label: "Statement Balance", value: "Rp 0" },
            { id: "system", label: "System Balance", value: "Rp 0" },
            { id: "difference", label: "Difference to Reconcile", value: "Rp 0" },
          ]}
        />
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
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
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
