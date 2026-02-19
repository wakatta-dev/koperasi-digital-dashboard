/** @format */

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  VendorBillLineItem,
  VendorBillTotals,
} from "../../types/vendor-bills-ap";

type FeatureVendorBillLineItemsTableProps = {
  rows: VendorBillLineItem[];
  totals: VendorBillTotals;
};

export function FeatureVendorBillLineItemsTable({
  rows,
  totals,
}: FeatureVendorBillLineItemsTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                <TableHead className="px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Item Description
                </TableHead>
                <TableHead className="w-24 px-8 py-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Qty
                </TableHead>
                <TableHead className="px-8 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Unit Price
                </TableHead>
                <TableHead className="px-8 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell className="px-8 py-8 text-center text-sm text-gray-500" colSpan={4}>
                    No line items available.
                  </TableCell>
                </TableRow>
              ) : null}
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-8 py-5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {row.item_description}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{row.detail}</p>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-center text-sm text-gray-700 dark:text-gray-300">
                    {row.qty}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right text-sm text-gray-700 dark:text-gray-300">
                    {row.unit_price}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end bg-gray-50/50 p-8 dark:bg-gray-800/30">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">{totals.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Tax (PPN 11%)</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {totals.tax_amount}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
              <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {totals.total_amount}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Paid to date</span>
              <span className="font-medium text-emerald-600">{totals.paid_to_date}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-600">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Balance Due</span>
              <span className="text-sm font-bold text-red-600">{totals.balance_due}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
