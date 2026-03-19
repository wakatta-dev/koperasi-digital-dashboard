/** @format */

"use client";

import { Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/shared/inputs/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableShell } from "@/components/shared/data-display/TableShell";

import type { BatchPaymentBillItem } from "../../types/vendor-bills-ap";

type FeatureBatchSelectedBillsTableProps = {
  rows?: BatchPaymentBillItem[];
  onRowsChange?: (rows: BatchPaymentBillItem[]) => void;
};

const EMPTY_BATCH_PAYMENT_ROWS: BatchPaymentBillItem[] = [];

const DUE_STATE_CLASS: Record<BatchPaymentBillItem["due_state_tone"], string> =
  {
    normal: "text-gray-600 dark:text-gray-400",
    warning: "text-orange-600 dark:text-orange-400",
    danger: "text-red-600 dark:text-red-400",
  };

type BatchSelectedBillsTableRow =
  | ({ rowType: "item" } & BatchPaymentBillItem)
  | {
      rowType: "summary";
      id: string;
      subtotalDisplay: string;
    };

export function FeatureBatchSelectedBillsTable({
  rows = EMPTY_BATCH_PAYMENT_ROWS,
  onRowsChange,
}: FeatureBatchSelectedBillsTableProps) {
  const selectedRows = rows.filter((row) => row.is_selected);
  const subtotal = selectedRows.reduce((total, row) => {
    const amount = Number(row.payment_amount.replace(/[^\d]/g, ""));
    return total + (Number.isNaN(amount) ? 0 : amount);
  }, 0);

  const updateRows = (nextRows: BatchPaymentBillItem[]) => {
    onRowsChange?.(nextRows);
  };

  const toggleRow = (billNumber: string, checked: boolean) => {
    updateRows(
      rows.map((row) =>
        row.bill_number === billNumber ? { ...row, is_selected: checked } : row,
      ),
    );
  };

  const toggleAll = (checked: boolean) => {
    updateRows(rows.map((row) => ({ ...row, is_selected: checked })));
  };

  const tableRows: BatchSelectedBillsTableRow[] =
    rows.length === 0
      ? []
      : [
          ...rows.map((row) => ({ ...row, rowType: "item" as const })),
          {
            rowType: "summary",
            id: "summary",
            subtotalDisplay:
              subtotal > 0 ? `Rp ${subtotal.toLocaleString("id-ID")}` : "Rp 0",
          },
        ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Selected Bills
          </h3>
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
            {selectedRows.length} Bills
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sorted by:</span>
          <Select defaultValue="due-date-asc">
            <SelectTrigger className="h-auto border-none bg-transparent p-0 text-xs font-medium text-gray-700 shadow-none focus:ring-0 dark:text-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due-date-asc">Due Date (Asc)</SelectItem>
              <SelectItem value="amount-desc">Amount (Desc)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <TableShell
          columns={[
            {
              id: "selected",
              header: (
                <>
                  <Checkbox
                    checked={
                      rows.length > 0 && rows.every((row) => row.is_selected)
                    }
                    onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                    aria-label="Select all selected bills"
                  />
                </>
              ),
              cell: ({ row }) => {
                const currentRow = row.original;

                if (currentRow.rowType === "summary") {
                  return "Subtotal Bills:";
                }

                return (
                  <Checkbox
                    checked={currentRow.is_selected}
                    onCheckedChange={(checked) =>
                      toggleRow(currentRow.bill_number, Boolean(checked))
                    }
                    aria-label={`Select ${currentRow.bill_number}`}
                  />
                );
              },
              meta: {
                headerClassName: "w-10 px-5 py-3",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? {
                        colSpan: 5,
                        className:
                          "px-5 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white",
                      }
                    : {
                        className: "px-5 py-4",
                      },
              },
            },
            {
              id: "vendor_name",
              header: <>Vendor</>,
              cell: ({ row }) => {
                if (row.original.rowType === "summary") return null;

                return (
                  <>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {row.original.vendor_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {row.original.vendor_id_label}
                    </div>
                  </>
                );
              },
              meta: {
                headerClassName: "px-5 py-3",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : { className: "px-5 py-4" },
              },
            },
            {
              id: "reference",
              header: <>Reference</>,
              cell: ({ row }) => {
                if (row.original.rowType === "summary") return null;

                return (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
                    {row.original.reference}
                  </span>
                );
              },
              meta: {
                headerClassName: "px-5 py-3",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : {
                        className: "px-5 py-4 text-gray-600 dark:text-gray-300",
                      },
              },
            },
            {
              id: "due_state",
              header: <>Due Date</>,
              cell: ({ row }) => {
                if (row.original.rowType === "summary") return null;

                return (
                  <span className="text-xs font-medium">
                    {row.original.due_state}
                  </span>
                );
              },
              meta: {
                headerClassName: "px-5 py-3",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : {
                        className: `px-5 py-4 ${DUE_STATE_CLASS[row.original.due_state_tone]}`,
                      },
              },
            },
            {
              id: "amount_due",
              header: <>Amount Due</>,
              cell: ({ row }) =>
                row.original.rowType === "summary"
                  ? null
                  : row.original.amount_due,
              meta: {
                headerClassName: "px-5 py-3 text-right",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : {
                        className:
                          "px-5 py-4 text-right font-medium text-gray-900 dark:text-white",
                      },
              },
            },
            {
              id: "payment",
              header: <>Payment</>,
              cell: ({ row }) => {
                const currentRow = row.original;

                if (currentRow.rowType === "summary") {
                  return currentRow.subtotalDisplay;
                }

                return (
                  <Input
                    value={currentRow.payment_amount}
                    onChange={(event) =>
                      updateRows(
                        rows.map((item) =>
                          item.bill_number === currentRow.bill_number
                            ? {
                                ...item,
                                payment_amount: event.target.value,
                              }
                            : item,
                        ),
                      )
                    }
                    className="ml-auto w-32 border-gray-300 py-1 text-right text-sm shadow-sm focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                );
              },
              meta: {
                headerClassName: "px-5 py-3 text-right",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? {
                        className:
                          "px-5 py-3 text-right text-sm font-bold text-gray-900 dark:text-white",
                      }
                    : {
                        className: "px-5 py-4 text-right",
                      },
              },
            },
            {
              id: "actions",
              header: "",
              cell: ({ row }) =>
                row.original.rowType === "summary" ? null : (
                  <button
                    type="button"
                    className="text-gray-400 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
                    aria-label={`Remove ${row.original.bill_number}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ),
              meta: {
                headerClassName: "w-10 px-5 py-3",
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { className: "px-5 py-3" }
                    : { className: "px-5 py-4 text-center" },
              },
            },
          ]}
          data={tableRows}
          getRowId={(row) =>
            row.rowType === "summary" ? row.id : row.bill_number
          }
          headerClassName="bg-gray-50 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-800/50"
          bodyClassName="divide-y divide-gray-100 dark:divide-gray-700"
          emptyState="No bills selected."
          rowHoverable={false}
          rowClassName={(row) =>
            row.rowType === "summary"
              ? "border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
              : "group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
          }
        />
      </div>
    </section>
  );
}
