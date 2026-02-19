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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { BatchPaymentBillItem } from "../../types/vendor-bills-ap";

type FeatureBatchSelectedBillsTableProps = {
  rows?: BatchPaymentBillItem[];
  onRowsChange?: (rows: BatchPaymentBillItem[]) => void;
};

const DUE_STATE_CLASS: Record<BatchPaymentBillItem["due_state_tone"], string> = {
  normal: "text-gray-600 dark:text-gray-400",
  warning: "text-orange-600 dark:text-orange-400",
  danger: "text-red-600 dark:text-red-400",
};

export function FeatureBatchSelectedBillsTable({
  rows = [],
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
        row.bill_number === billNumber ? { ...row, is_selected: checked } : row
      )
    );
  };

  const toggleAll = (checked: boolean) => {
    updateRows(rows.map((row) => ({ ...row, is_selected: checked })));
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white">Selected Bills</h3>
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
        <Table>
          <TableHeader className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-800/50">
            <TableRow>
              <TableHead className="w-10 px-5 py-3">
                <Checkbox
                  checked={rows.length > 0 && rows.every((row) => row.is_selected)}
                  onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                  aria-label="Select all selected bills"
                />
              </TableHead>
              <TableHead className="px-5 py-3">Vendor</TableHead>
              <TableHead className="px-5 py-3">Reference</TableHead>
              <TableHead className="px-5 py-3">Due Date</TableHead>
              <TableHead className="px-5 py-3 text-right">Amount Due</TableHead>
              <TableHead className="px-5 py-3 text-right">Payment</TableHead>
              <TableHead className="w-10 px-5 py-3" />
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-8 text-center text-sm text-gray-500" colSpan={7}>
                  No bills selected.
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => (
              <TableRow
                key={row.bill_number}
                className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
              >
                <TableCell className="px-5 py-4">
                  <Checkbox
                    checked={row.is_selected}
                    onCheckedChange={(checked) =>
                      toggleRow(row.bill_number, Boolean(checked))
                    }
                    aria-label={`Select ${row.bill_number}`}
                  />
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{row.vendor_name}</div>
                  <div className="text-xs text-gray-500">{row.vendor_id_label}</div>
                </TableCell>
                <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
                    {row.reference}
                  </span>
                </TableCell>
                <TableCell className={`px-5 py-4 ${DUE_STATE_CLASS[row.due_state_tone]}`}>
                  <span className="text-xs font-medium">{row.due_state}</span>
                </TableCell>
                <TableCell className="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {row.amount_due}
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <Input
                    value={row.payment_amount}
                    onChange={(event) =>
                      updateRows(
                        rows.map((item) =>
                          item.bill_number === row.bill_number
                            ? { ...item, payment_amount: event.target.value }
                            : item
                        )
                      )
                    }
                    className="ml-auto w-32 border-gray-300 py-1 text-right text-sm shadow-sm focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <button
                    type="button"
                    className="text-gray-400 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
                    aria-label={`Remove ${row.bill_number}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-5 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white"
              >
                Subtotal Bills:
              </TableCell>
              <TableCell className="px-5 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                {subtotal > 0 ? `Rp ${subtotal.toLocaleString("id-ID")}` : "Rp 0"}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
