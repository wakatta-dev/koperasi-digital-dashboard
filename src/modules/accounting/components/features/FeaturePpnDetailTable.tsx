/** @format */

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { TableShell } from "@/components/shared/data-display/TableShell";

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

  const columns: ColumnDef<TaxPpnTransactionItem, unknown>[] = [
    {
      id: "date",
      header: "Date",
      meta: {
        headerClassName:
          "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-sm text-gray-900 dark:text-white",
      },
      cell: ({ row }) => row.original.date,
    },
    {
      id: "invoiceNumber",
      header: "Invoice No",
      meta: {
        headerClassName:
          "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName:
          "px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-300",
      },
      cell: ({ row }) => row.original.invoice_number,
    },
    {
      id: "counterparty",
      header: "Customer/Vendor",
      meta: {
        headerClassName:
          "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-sm text-gray-900 dark:text-white",
      },
      cell: ({ row }) => (
        <>
          <div>{row.original.counterparty_name}</div>
          {row.original.counterparty_npwp ? (
            <div className="text-xs text-gray-500">
              NPWP: {row.original.counterparty_npwp}
            </div>
          ) : null}
        </>
      ),
    },
    {
      id: "type",
      header: "Type",
      meta: {
        align: "center",
        headerClassName:
          "px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-center",
      },
      cell: ({ row }) => (
        <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
          {row.original.transaction_type}
        </Badge>
      ),
    },
    {
      id: "taxBase",
      header: "DPP (Tax Base)",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName:
          "px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) => formatCurrency(row.original.tax_base_amount),
    },
    {
      id: "vatAmount",
      header: "PPN Amount (11%)",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName:
          "px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white",
      },
      cell: ({ row }) => formatCurrency(row.original.vat_amount),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <TableShell
        tableClassName="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        columns={columns}
        data={rows}
        getRowId={(row) => `${row.invoice_number}-${row.date}`}
        emptyState="No VAT transaction found."
        headerClassName="bg-gray-50 dark:bg-gray-800/50"
        bodyClassName="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900"
        rowClassName="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        footer={
          <div className="flex justify-end bg-gray-50 px-6 py-4 text-sm dark:bg-gray-800/40">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Total PPN (Calculated)
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-300">
                {formatCurrency(resolvedTotal)}
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
}
