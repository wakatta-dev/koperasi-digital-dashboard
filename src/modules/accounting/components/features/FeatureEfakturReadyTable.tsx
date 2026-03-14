/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableShell } from "@/components/shared/data-display/TableShell";

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
  const allSelected =
    rows.length > 0 &&
    rows.every((row) => selectedIds.includes(row.invoice_id));
  const columns: ColumnDef<TaxEfakturReadyItem, unknown>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => onToggleAll?.(checked === true)}
        />
      ),
      meta: {
        headerClassName:
          "px-6 py-3 bg-gray-50 text-xs font-medium tracking-wider text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.invoice_id)}
          onCheckedChange={(checked) =>
            onToggleRow?.(row.original.invoice_id, checked === true)
          }
        />
      ),
    },
    {
      id: "invoiceNumber",
      header: "Invoice No.",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName:
          "px-6 py-4 font-medium text-gray-900 dark:text-white",
      },
      cell: ({ row }) => row.original.invoice_number,
    },
    {
      id: "date",
      header: "Date",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 text-gray-500",
      },
      cell: ({ row }) => row.original.date,
    },
    {
      id: "counterparty",
      header: "Counterparty",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 text-gray-900 dark:text-white",
      },
      cell: ({ row }) => row.original.counterparty,
    },
    {
      id: "taxBaseAmount",
      header: "Tax Base (DPP)",
      meta: {
        align: "right",
        headerClassName: "px-6 py-3 text-right",
        cellClassName:
          "px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) =>
        new Intl.NumberFormat("id-ID").format(row.original.tax_base_amount),
    },
    {
      id: "vatAmount",
      header: "VAT (PPN)",
      meta: {
        align: "right",
        headerClassName: "px-6 py-3 text-right",
        cellClassName:
          "px-6 py-4 text-right font-mono font-medium text-gray-900 dark:text-white",
      },
      cell: ({ row }) =>
        new Intl.NumberFormat("id-ID").format(row.original.vat_amount),
    },
  ];

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

      <TableShell
        className="space-y-0"
        tableClassName="w-full text-left text-sm"
        containerClassName="overflow-x-auto"
        columns={columns}
        data={rows}
        getRowId={(row) => row.invoice_id}
        emptyState="No e-Faktur-ready invoice found."
        headerClassName="bg-gray-50 text-xs font-medium tracking-wider text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400"
        rowClassName="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        surface="bare"
        pagination={{
          page,
          pageSize: perPage,
          totalItems,
          totalPages: Math.max(1, Math.ceil(totalItems / perPage)),
        }}
        paginationInfo={`Showing ${rows.length} of ${totalItems} results`}
        onPrevPage={() => onPageChange?.(Math.max(1, page - 1))}
        onNextPage={() =>
          onPageChange?.(
            Math.min(Math.max(1, Math.ceil(totalItems / perPage)), page + 1),
          )
        }
        paginationClassName="rounded-none border-x-0 border-b-0 px-6 py-4 dark:border-gray-700"
        previousPageLabel="Previous"
        nextPageLabel="Next"
      />
    </div>
  );
}
