/** @format */

import { describe, expect, it } from "vitest";

import { withRowKeys } from "@/modules/bumdes/report/utils/report-keys";

type TransactionRow = {
  date: string;
  description: string;
  amount: string;
  category: string;
};

describe("report key stability", () => {
  it("keeps existing keys stable when data is appended", () => {
    const baseRows: TransactionRow[] = [
      {
        date: "10/01/2026",
        description: "Penjualan POS",
        amount: "Rp 1.200.000",
        category: "POS",
      },
      {
        date: "10/01/2026",
        description: "Penjualan POS",
        amount: "Rp 1.200.000",
        category: "POS",
      },
      {
        date: "11/01/2026",
        description: "Penjualan Online",
        amount: "Rp 800.000",
        category: "Online",
      },
    ];

    const baseKeys = withRowKeys(
      baseRows,
      (row) => [row.date, row.description, row.amount, row.category],
      "trx"
    ).map((row) => row.rowKey);

    const updatedKeys = withRowKeys(
      [
        ...baseRows,
        {
          date: "12/01/2026",
          description: "Penjualan POS",
          amount: "Rp 500.000",
          category: "POS",
        },
      ],
      (row) => [row.date, row.description, row.amount, row.category],
      "trx"
    )
      .slice(0, baseRows.length)
      .map((row) => row.rowKey);

    expect(updatedKeys).toEqual(baseKeys);
  });
});
