/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";

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
  pagination?: TablePagePaginationMeta;
  paginationInfo?: string;
  onPageChange?: (nextPage: number) => void;
  onDetails?: (row: TaxSummaryPeriodItem) => void;
};

export function FeatureTaxSummaryPeriodTable({
  rows,
  pagination,
  paginationInfo,
  onPageChange,
  onDetails,
}: FeatureTaxSummaryPeriodTableProps) {
  return (
    <div className="overflow-x-auto">
      <TableShell
        tableClassName="min-w-full"
        columns={[
          {
            id: "period",
            header: "Period",
            meta: {
              headerClassName:
                "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName:
                "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white",
            },
            cell: ({ row }) => row.original.period_label,
          },
          {
            id: "ppnKeluaran",
            header: "PPN Keluaran",
            meta: {
              align: "right",
              headerClassName:
                "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName:
                "px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300",
            },
            cell: ({ row }) => formatCurrency(row.original.ppn_keluaran),
          },
          {
            id: "ppnMasukan",
            header: "PPN Masukan",
            meta: {
              align: "right",
              headerClassName:
                "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName:
                "px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300",
            },
            cell: ({ row }) => formatCurrency(row.original.ppn_masukan),
          },
          {
            id: "net",
            header: "Net (Payable/Refund)",
            meta: {
              align: "right",
              headerClassName:
                "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName:
                "px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white",
            },
            cell: ({ row }) => formatCurrency(row.original.net_amount),
          },
          {
            id: "totalPph",
            header: "Total PPh",
            meta: {
              align: "right",
              headerClassName:
                "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName:
                "px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300",
            },
            cell: ({ row }) => formatCurrency(row.original.total_pph),
          },
          {
            id: "status",
            header: "Status",
            meta: {
              align: "center",
              headerClassName:
                "px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName: "px-6 py-4 text-center",
            },
            cell: ({ row }) => (
              <Badge className={statusClassName(row.original.status)}>
                {row.original.status}
              </Badge>
            ),
          },
          {
            id: "actions",
            header: "",
            meta: {
              align: "right",
              headerClassName:
                "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
              cellClassName: "px-6 py-4 text-right",
            },
            cell: ({ row }) => (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-indigo-600 hover:text-indigo-700"
                onClick={() => onDetails?.(row.original)}
              >
                Details
              </Button>
            ),
          },
        ]}
        data={rows}
        getRowId={(row) => row.period_code}
        emptyState="No tax summary period found."
        headerClassName="bg-gray-50 dark:bg-gray-800/50"
        bodyClassName="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900"
        pagination={pagination}
        paginationInfo={paginationInfo}
        onPrevPage={() =>
          pagination && onPageChange?.(Math.max(1, pagination.page - 1))
        }
        onNextPage={() =>
          pagination &&
          onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1))
        }
        paginationClassName="rounded-none border-x-0 border-b-0 px-6 py-4 dark:border-gray-700"
        previousPageLabel="Previous"
        nextPageLabel="Next"
      />
    </div>
  );
}
