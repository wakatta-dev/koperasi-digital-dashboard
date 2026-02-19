/** @format */

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { TaxPpnTransactionItem } from "../../types/tax";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

type FeaturePpnDetailTableProps = {
  rows: TaxPpnTransactionItem[];
  vatAmountTotal?: number;
};

export function FeaturePpnDetailTable({
  rows,
  vatAmountTotal,
}: FeaturePpnDetailTableProps) {
  const resolvedTotal =
    vatAmountTotal ?? rows.reduce((total, row) => total + row.vat_amount, 0);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Invoice No
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Customer/Vendor
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
              Type
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              DPP (Tax Base)
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              PPN Amount (11%)
            </TableHead>
            <TableHead className="px-6 py-3" />
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No VAT transaction found.
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => (
            <TableRow key={`${row.invoice_number}-${row.date}`} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">{row.date}</TableCell>
              <TableCell className="px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-300">
                {row.invoice_number}
              </TableCell>
              <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div>{row.counterparty_name}</div>
                {row.counterparty_npwp ? (
                  <div className="text-xs text-gray-500">NPWP: {row.counterparty_npwp}</div>
                ) : null}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {row.transaction_type}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(row.tax_base_amount)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                {formatCurrency(row.vat_amount)}
              </TableCell>
              <TableCell className="px-6 py-4" />
            </TableRow>
          ))}
          <TableRow className="bg-gray-50 dark:bg-gray-800/40">
            <TableCell
              colSpan={5}
              className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              Total PPN (Calculated)
            </TableCell>
            <TableCell className="px-6 py-4 text-right text-sm font-bold text-indigo-600 dark:text-indigo-300">
              {formatCurrency(resolvedTotal)}
            </TableCell>
            <TableCell className="px-6 py-4" />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
