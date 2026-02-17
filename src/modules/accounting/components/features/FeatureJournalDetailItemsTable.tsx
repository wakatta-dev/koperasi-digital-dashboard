/** @format */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  JOURNAL_DETAIL_ITEMS,
  JOURNAL_DETAIL_TOTALS,
} from "../../constants/journal-seed";
import type { JournalDetailItem } from "../../types/journal";

type FeatureJournalDetailItemsTableProps = {
  rows?: JournalDetailItem[];
  totals?: {
    debit_amount: string;
    credit_amount: string;
  };
};

export function FeatureJournalDetailItemsTable({
  rows = JOURNAL_DETAIL_ITEMS,
  totals = JOURNAL_DETAIL_TOTALS,
}: FeatureJournalDetailItemsTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
        <h3 className="font-semibold text-gray-900 dark:text-white">Journal Items</h3>
        <span className="text-xs text-gray-500">{rows.length} Items Total</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="border-collapse text-left">
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Account</TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Label</TableHead>
                <TableHead className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">Debit</TableHead>
                <TableHead className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map((row) => (
                <TableRow key={`${row.account_name}-${row.label}`}>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {row.account_name}
                      </span>
                      <span className="text-xs text-gray-500">{row.account_category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {row.label}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {row.debit_amount}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {row.credit_amount}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
                <TableCell
                  colSpan={2}
                  className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white"
                >
                  Total
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-bold text-gray-900 underline decoration-2 decoration-indigo-500/30 underline-offset-4 dark:text-white">
                  {totals.debit_amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-bold text-gray-900 underline decoration-2 decoration-indigo-500/30 underline-offset-4 dark:text-white">
                  {totals.credit_amount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
