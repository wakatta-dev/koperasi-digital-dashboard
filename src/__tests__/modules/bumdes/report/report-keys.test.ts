/** @format */

import { describe, expect, it } from "vitest";

import {
  createKeyGenerator,
  withRowKeys,
} from "@/modules/bumdes/report/utils/report-keys";
import { overviewReportWithDuplicates } from "@/__tests__/modules/bumdes/report/report-fixtures";

type TransactionRow = {
  date: string;
  description: string;
  amount: string;
  category: string;
};

describe("report key helpers", () => {
  it("creates unique keys for duplicate rows", () => {
    const transactions: TransactionRow[] =
      overviewReportWithDuplicates.recent_transactions.map((trx) => ({
        date: trx.date_display,
        description: trx.description,
        amount: trx.amount_display,
        category: trx.category,
      }));

    const keyed = withRowKeys(
      transactions,
      (trx) => [trx.date, trx.description, trx.amount, trx.category],
      "trx"
    );

    const keys = keyed.map((item) => item.rowKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keeps keys stable for identical data order", () => {
    const transactions: TransactionRow[] =
      overviewReportWithDuplicates.recent_transactions.map((trx) => ({
        date: trx.date_display,
        description: trx.description,
        amount: trx.amount_display,
        category: trx.category,
      }));

    const first = withRowKeys(
      transactions,
      (trx) => [trx.date, trx.description, trx.amount, trx.category],
      "trx"
    ).map((item) => item.rowKey);

    const second = withRowKeys(
      transactions,
      (trx) => [trx.date, trx.description, trx.amount, trx.category],
      "trx"
    ).map((item) => item.rowKey);

    expect(second).toEqual(first);
  });

  it("uses fallback index when duplicate bases occur", () => {
    const keyFor = createKeyGenerator("row");
    const first = keyFor(["penjualan", "10/01/2026"], 0);
    const second = keyFor(["penjualan", "10/01/2026"], 1);

    expect(first).toBe("row-penjualan-10/01/2026");
    expect(second).toBe("row-penjualan-10/01/2026-1");
  });
});
