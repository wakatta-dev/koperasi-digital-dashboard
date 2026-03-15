/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TableShell } from "@/components/shared/data-display/TableShell";

import type { VendorBillPaymentHistoryItem } from "../../types/vendor-bills-ap";

type FeatureVendorBillPaymentHistoryTableProps = {
  rows?: VendorBillPaymentHistoryItem[];
};

const PAYMENT_HISTORY_STATUS_CLASS: Record<
  VendorBillPaymentHistoryItem["status"],
  string
> = {
  SUCCESS:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export function FeatureVendorBillPaymentHistoryTable({
  rows = [],
}: FeatureVendorBillPaymentHistoryTableProps) {
  const columns: ColumnDef<VendorBillPaymentHistoryItem, unknown>[] = [
    {
      id: "date",
      header: "Date",
      meta: {
        headerClassName:
          "px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-8 py-4 text-sm text-gray-700 dark:text-gray-300",
      },
      cell: ({ row }) => row.original.payment_date,
    },
    {
      id: "reference",
      header: "Reference",
      meta: {
        headerClassName:
          "px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase",
        cellClassName:
          "px-8 py-4 text-sm font-medium text-gray-900 dark:text-white",
      },
      cell: ({ row }) => row.original.payment_reference,
    },
    {
      id: "method",
      header: "Method",
      meta: {
        headerClassName:
          "px-8 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-8 py-4 text-sm text-gray-700 dark:text-gray-300",
      },
      cell: ({ row }) => row.original.payment_method,
    },
    {
      id: "amountPaid",
      header: "Amount Paid",
      meta: {
        align: "right",
        headerClassName:
          "px-8 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase",
        cellClassName:
          "px-8 py-4 text-right text-sm font-medium text-emerald-600",
      },
      cell: ({ row }) => row.original.amount_paid,
    },
    {
      id: "status",
      header: "Status",
      meta: {
        align: "center",
        headerClassName:
          "px-8 py-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-8 py-4 text-center",
      },
      cell: ({ row }) => (
        <Badge
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PAYMENT_HISTORY_STATUS_CLASS[row.original.status]}`}
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-bold text-gray-900 dark:text-white">
          Payment History
        </h3>
      </div>

      <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="p-0">
          <TableShell
            columns={columns}
            data={rows}
            getRowId={(row) => `${row.payment_reference}-${row.payment_date}`}
            emptyState="No payment history available."
            headerRowClassName="border-b border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"
          />
        </CardContent>
      </Card>
    </section>
  );
}
