/** @format */

import { Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FeatureTaxPaginationBar } from "./FeatureTaxPaginationBar";

import type { TaxEfakturReadyItem } from "../../types/tax";

type FeatureEfakturReadyTableProps = {
  rows: TaxEfakturReadyItem[];
  selectedIds: string[];
  page: number;
  perPage: number;
  totalItems: number;
  onToggleAll?: (checked: boolean) => void;
  onToggleRow?: (invoiceId: string, checked: boolean) => void;
  onPageChange?: (nextPage: number) => void;
};

export function FeatureEfakturReadyTable({
  rows,
  selectedIds,
  page,
  perPage,
  totalItems,
  onToggleAll,
  onToggleRow,
  onPageChange,
}: FeatureEfakturReadyTableProps) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.invoice_id));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <Receipt className="h-4 w-4 text-indigo-600" />
          Ready for Export
        </h3>
        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          {totalItems} Invoices
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full text-left text-sm">
          <TableHeader className="bg-gray-50 text-xs font-medium tracking-wider text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
            <TableRow>
              <TableHead className="px-6 py-3">
                <Checkbox checked={allSelected} onCheckedChange={(checked) => onToggleAll?.(checked === true)} />
              </TableHead>
              <TableHead className="px-6 py-3">Invoice No.</TableHead>
              <TableHead className="px-6 py-3">Date</TableHead>
              <TableHead className="px-6 py-3">Counterparty</TableHead>
              <TableHead className="px-6 py-3 text-right">Tax Base (DPP)</TableHead>
              <TableHead className="px-6 py-3 text-right">VAT (PPN)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900">
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No e-Faktur-ready invoice found.
                </TableCell>
              </TableRow>
            ) : null}

            {rows.map((row) => (
              <TableRow key={row.invoice_id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="px-6 py-4">
                  <Checkbox
                    checked={selectedIds.includes(row.invoice_id)}
                    onCheckedChange={(checked) => onToggleRow?.(row.invoice_id, checked === true)}
                  />
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {row.invoice_number}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-500">{row.date}</TableCell>
                <TableCell className="px-6 py-4 text-gray-900 dark:text-white">
                  {row.counterparty}
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-300">
                  {new Intl.NumberFormat("id-ID").format(row.tax_base_amount)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-mono font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("id-ID").format(row.vat_amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FeatureTaxPaginationBar
        page={page}
        perPage={perPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </div>
  );
}
