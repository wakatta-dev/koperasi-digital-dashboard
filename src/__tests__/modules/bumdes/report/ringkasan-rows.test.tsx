/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { withRowKeys } from "@/modules/bumdes/report/utils/report-keys";
import { overviewReportWithDuplicates } from "@/__tests__/modules/bumdes/report/report-fixtures";

type TransactionRow = {
  date: string;
  description: string;
  amount: string;
  category: string;
};

const RecentTransactionsTable = ({ transactions }: { transactions: TransactionRow[] }) => {
  const keyedRows = withRowKeys(
    transactions,
    (trx) => [trx.date, trx.description, trx.amount, trx.category],
    "trx"
  );

  return (
    <table>
      <tbody>
        {keyedRows.map((row) => (
          <tr key={row.rowKey}>
            <td>{row.date}</td>
            <td>{row.description}</td>
            <td>{row.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

describe("Ringkasan report rows", () => {
  it("renders duplicate transactions without dropping rows", () => {
    const transactions: TransactionRow[] =
      overviewReportWithDuplicates.recent_transactions.map((trx) => ({
        date: trx.date_display,
        description: trx.description,
        amount: trx.amount_display,
        category: trx.category,
      }));

    render(<RecentTransactionsTable transactions={transactions} />);

    expect(screen.getAllByText("Penjualan POS")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });
});
