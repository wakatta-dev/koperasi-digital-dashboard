/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { TaxSummaryPeriodItem } from "../../types/tax";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClassName(status: TaxSummaryPeriodItem["status"]) {
  switch (status) {
    case "Reported":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
    case "Compensated":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }
}

type FeatureTaxSummaryPeriodTableProps = {
  rows: TaxSummaryPeriodItem[];
  onDetails?: (row: TaxSummaryPeriodItem) => void;
};

export function FeatureTaxSummaryPeriodTable({
  rows,
  onDetails,
}: FeatureTaxSummaryPeriodTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Period
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              PPN Keluaran
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              PPN Masukan
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Net (Payable/Refund)
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Total PPh
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase" />
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No tax summary period found.
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => (
            <TableRow key={row.period_code} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {row.period_label}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(row.ppn_keluaran)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(row.ppn_masukan)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(row.net_amount)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(row.total_pph)}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <Badge className={statusClassName(row.status)}>{row.status}</Badge>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-indigo-600 hover:text-indigo-700"
                  onClick={() => onDetails?.(row)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
