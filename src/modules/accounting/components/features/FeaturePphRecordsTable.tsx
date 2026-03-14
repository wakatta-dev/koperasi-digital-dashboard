/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableShell } from "@/components/shared/data-display/TableShell";

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
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      };
    case "PPh23":
      return {
        label: "PPh 23",
        className:
          "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      };
    case "PPh4_2":
      return {
        label: "PPh 4(2)",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      };
    default:
      return {
        label: "PPh Final",
        className:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      };
  }
}

type FeaturePphRecordsTableProps = {
  rows: TaxPphRecordItem[];
};

const columns: ColumnDef<TaxPphRecordItem, unknown>[] = [
  {
    id: "date",
    header: "Date",
    meta: {
      headerClassName:
        "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
      cellClassName: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400",
    },
    cell: ({ row }) => row.original.date,
  },
  {
    id: "reference",
    header: "Reference",
    meta: {
      headerClassName:
        "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
      cellClassName: "px-6 py-4",
    },
    cell: ({ row }) => (
      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
        {row.original.reference_number}
      </span>
    ),
  },
  {
    id: "partner",
    header: "Partner",
    meta: {
      headerClassName:
        "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
      cellClassName: "px-6 py-4",
    },
    cell: ({ row }) => (
      <>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {row.original.partner_name}
        </div>
        <div className="text-xs text-gray-500">
          {row.original.partner_npwp
            ? `NPWP: ${row.original.partner_npwp}`
            : "Bulk Payment"}
        </div>
      </>
    ),
  },
  {
    id: "taxType",
    header: "Tax Type",
    meta: {
      headerClassName:
        "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
      cellClassName: "px-6 py-4",
    },
    cell: ({ row }) => {
      const pphType = resolvePphTypeStyle(row.original.pph_type);
      return (
        <>
          <Badge className={pphType.className}>{pphType.label}</Badge>
          <div className="mt-1 text-[10px] text-gray-500">
            {row.original.category_label}
          </div>
        </>
      );
    },
  },
  {
    id: "grossAmount",
    header: "Gross Amount",
    meta: {
      align: "right",
      headerClassName:
        "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
      cellClassName: "px-6 py-4 text-right text-sm text-gray-900 dark:text-white",
    },
    cell: ({ row }) => formatCurrency(row.original.gross_amount),
  },
  {
    id: "taxWithheld",
    header: "Tax Withheld",
    meta: {
      align: "right",
      headerClassName:
        "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
      cellClassName:
        "px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white",
    },
    cell: ({ row }) => formatCurrency(row.original.withheld_amount),
  },
  {
    id: "actions",
    header: "",
    meta: {
      align: "right",
      headerClassName: "px-6 py-3",
      cellClassName: "px-6 py-4 text-right",
    },
    cell: () => (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    ),
  },
];

export function FeaturePphRecordsTable({ rows }: FeaturePphRecordsTableProps) {
  return (
    <div className="overflow-x-auto">
      <TableShell
        tableClassName="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        columns={columns}
        data={rows}
        getRowId={(row) => `${row.reference_number}-${row.date}`}
        emptyState="No PPh record found."
        headerClassName="bg-gray-50 dark:bg-gray-800/50"
        bodyClassName="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900"
      />
    </div>
  );
}
