/** @format */

import { MoreVertical } from "lucide-react";

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

import type { TaxPphRecordItem } from "../../types/tax";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function resolvePphTypeStyle(type: TaxPphRecordItem["pph_type"]) {
  switch (type) {
    case "PPh21":
      return {
        label: "PPh 21",
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      };
    case "PPh23":
      return {
        label: "PPh 23",
        className: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      };
    case "PPh4_2":
      return {
        label: "PPh 4(2)",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      };
    default:
      return {
        label: "PPh Final",
        className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      };
  }
}

type FeaturePphRecordsTableProps = {
  rows: TaxPphRecordItem[];
};

export function FeaturePphRecordsTable({ rows }: FeaturePphRecordsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Reference
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Partner
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Tax Type
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Gross Amount
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Tax Withheld
            </TableHead>
            <TableHead className="px-6 py-3" />
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No PPh record found.
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => {
            const pphType = resolvePphTypeStyle(row.pph_type);
            return (
              <TableRow key={`${row.reference_number}-${row.date}`} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {row.date}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                    {row.reference_number}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{row.partner_name}</div>
                  <div className="text-xs text-gray-500">
                    {row.partner_npwp ? `NPWP: ${row.partner_npwp}` : "Bulk Payment"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge className={pphType.className}>{pphType.label}</Badge>
                  <div className="mt-1 text-[10px] text-gray-500">{row.category_label}</div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  {formatCurrency(row.gross_amount)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(row.withheld_amount)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
