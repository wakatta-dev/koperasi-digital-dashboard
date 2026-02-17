/** @format */

import { History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_VENDOR_BILL_DETAIL } from "../../constants/vendor-bills-ap-dummy";
import type { VendorBillPaymentHistoryItem } from "../../types/vendor-bills-ap";

type FeatureVendorBillPaymentHistoryTableProps = {
  rows?: VendorBillPaymentHistoryItem[];
};

const PAYMENT_HISTORY_STATUS_CLASS: Record<VendorBillPaymentHistoryItem["status"], string> = {
  SUCCESS:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export function FeatureVendorBillPaymentHistoryTable({
  rows = DUMMY_VENDOR_BILL_DETAIL.payment_history,
}: FeatureVendorBillPaymentHistoryTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-bold text-gray-900 dark:text-white">Payment History</h3>
      </div>

      <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <TableHead className="px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Date
                </TableHead>
                <TableHead className="px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Reference
                </TableHead>
                <TableHead className="px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Method
                </TableHead>
                <TableHead className="px-8 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Amount Paid
                </TableHead>
                <TableHead className="px-8 py-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map((row) => (
                <TableRow key={`${row.payment_reference}-${row.payment_date}`}>
                  <TableCell className="px-8 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {row.payment_date}
                  </TableCell>
                  <TableCell className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {row.payment_reference}
                  </TableCell>
                  <TableCell className="px-8 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {row.payment_method}
                  </TableCell>
                  <TableCell className="px-8 py-4 text-right text-sm font-medium text-emerald-600">
                    {row.amount_paid}
                  </TableCell>
                  <TableCell className="px-8 py-4 text-center">
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PAYMENT_HISTORY_STATUS_CLASS[row.status]}`}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
