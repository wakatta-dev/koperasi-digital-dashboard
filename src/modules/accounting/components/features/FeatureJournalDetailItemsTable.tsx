/** @format */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableShell } from "@/components/shared/data-display/TableShell";

import {
  JOURNAL_INITIAL_DETAIL_ITEMS,
  JOURNAL_INITIAL_DETAIL_TOTALS,
} from "../../constants/journal-initial-state";
import type { JournalDetailItem } from "../../types/journal";

type FeatureJournalDetailItemsTableProps = {
  rows?: JournalDetailItem[];
  totals?: {
    debit_amount: string;
    credit_amount: string;
  };
};

type JournalDetailTableRow = {
  rowType: "item" | "summary";
  id: string;
  account_name: string;
  account_category: string;
  label: string;
  debit_amount: string;
  credit_amount: string;
};

export function FeatureJournalDetailItemsTable({
  rows = JOURNAL_INITIAL_DETAIL_ITEMS,
  totals = JOURNAL_INITIAL_DETAIL_TOTALS,
}: FeatureJournalDetailItemsTableProps) {
  const tableRows: JournalDetailTableRow[] = [
    ...rows.map((row, index) => ({
      rowType: "item" as const,
      id: `${row.account_name}-${row.label}-${index}`,
      account_name: row.account_name,
      account_category: row.account_category,
      label: row.label,
      debit_amount: row.debit_amount,
      credit_amount: row.credit_amount,
    })),
    {
      rowType: "summary",
      id: "summary",
      account_name: "Total",
      account_category: "",
      label: "",
      debit_amount: totals.debit_amount,
      credit_amount: totals.credit_amount,
    },
  ];

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Journal Items
        </h3>
        <span className="text-xs text-gray-500">{rows.length} Items Total</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <TableShell
            tableClassName="border-collapse text-left"
            columns={[
              {
                id: "account",
                header: <>Account</>,
                cell: ({ row }) =>
                  row.original.rowType === "summary" ? (
                    row.original.account_name
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {row.original.account_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {row.original.account_category}
                      </span>
                    </div>
                  ),
                meta: {
                  headerClassName:
                    "px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellProps: ({ row }) =>
                    row.original.rowType === "summary"
                      ? {
                          colSpan: 2,
                          className:
                            "px-6 py-4 text-sm font-bold text-gray-900 dark:text-white",
                        }
                      : {
                          className: "px-6 py-4 whitespace-nowrap",
                        },
                },
              },
              {
                id: "label",
                header: <>Label</>,
                cell: ({ row }) => row.original.label,
                meta: {
                  headerClassName:
                    "px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellProps: ({ row }) =>
                    row.original.rowType === "summary"
                      ? { hidden: true }
                      : {
                          className:
                            "px-6 py-4 text-sm text-gray-600 dark:text-gray-300",
                        },
                },
              },
              {
                id: "debit_amount",
                header: <>Debit</>,
                cell: ({ row }) => row.original.debit_amount,
                meta: {
                  headerClassName:
                    "px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellProps: ({ row }) => ({
                    className:
                      row.original.rowType === "summary"
                        ? "px-6 py-4 text-right text-sm font-bold text-gray-900 underline decoration-2 decoration-indigo-500/30 underline-offset-4 dark:text-white"
                        : "px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white",
                  }),
                },
              },
              {
                id: "credit_amount",
                header: <>Credit</>,
                cell: ({ row }) => row.original.credit_amount,
                meta: {
                  headerClassName:
                    "px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellProps: ({ row }) => ({
                    className:
                      row.original.rowType === "summary"
                        ? "px-6 py-4 text-right text-sm font-bold text-gray-900 underline decoration-2 decoration-indigo-500/30 underline-offset-4 dark:text-white"
                        : "px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white",
                  }),
                },
              },
            ]}
            data={tableRows}
            getRowId={(row) => row.id}
            headerRowClassName="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
            bodyClassName="divide-y divide-gray-100 dark:divide-gray-700"
            rowHoverable={false}
            rowClassName={(row) =>
              row.rowType === "summary"
                ? "border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30"
                : undefined
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
