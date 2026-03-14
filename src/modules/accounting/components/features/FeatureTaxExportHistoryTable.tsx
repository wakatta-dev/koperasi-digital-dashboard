/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { Download, FileSpreadsheet, FileText, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";

import type { TaxExportHistoryItem } from "../../types/tax";

function resolveExportType(type: TaxExportHistoryItem["export_type"]) {
  switch (type) {
    case "EFaktur":
      return {
        label: "e-Faktur",
        icon: FileSpreadsheet,
        iconClassName: "text-green-600",
      };
    case "PPhReport":
      return {
        label: "PPh Report",
        icon: FileText,
        iconClassName: "text-red-600",
      };
    case "PPNSummary":
      return {
        label: "PPN Summary",
        icon: FileSpreadsheet,
        iconClassName: "text-green-700",
      };
    default:
      return {
        label: "Tax Recapitulation",
        icon: FileText,
        iconClassName: "text-indigo-600",
      };
  }
}

function resolveStatusClass(status: TaxExportHistoryItem["status"]) {
  switch (status) {
    case "Success":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "Processing":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
  }
}

type FeatureTaxExportHistoryTableProps = {
  rows: TaxExportHistoryItem[];
  pagination?: TablePagePaginationMeta;
  paginationInfo?: string;
  onPageChange?: (nextPage: number) => void;
  onDownload?: (row: TaxExportHistoryItem) => void;
  onRetry?: (row: TaxExportHistoryItem) => void;
};

export function FeatureTaxExportHistoryTable({
  rows,
  pagination,
  paginationInfo,
  onPageChange,
  onDownload,
  onRetry,
}: FeatureTaxExportHistoryTableProps) {
  const columns: ColumnDef<TaxExportHistoryItem, unknown>[] = [
    {
      id: "date",
      header: "Date",
      meta: {
        headerClassName:
          "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-sm text-gray-900 dark:text-white",
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.date}</span>
          <span className="text-xs text-gray-500">{row.original.time}</span>
        </div>
      ),
    },
    {
      id: "fileName",
      header: "File Name",
      meta: {
        headerClassName:
          "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName:
          "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white",
      },
      cell: ({ row }) => {
        const exportType = resolveExportType(row.original.export_type);
        const Icon = exportType.icon;
        return (
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${exportType.iconClassName}`} />
            {row.original.file_name}
          </div>
        );
      },
    },
    {
      id: "exportType",
      header: "Export Type",
      meta: {
        headerClassName:
          "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-sm text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) => resolveExportType(row.original.export_type).label,
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
        <Badge className={resolveStatusClass(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "action",
      header: "Action",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) =>
        row.original.can_download ? (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-indigo-600 hover:text-indigo-700"
            onClick={() => onDownload?.(row.original)}
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        ) : (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={!row.original.can_retry}
            onClick={() => onRetry?.(row.original)}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Retry
          </Button>
        ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <TableShell
        tableClassName="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        columns={columns}
        data={rows}
        getRowId={(row) => row.export_id}
        emptyState="No tax export history found."
        headerClassName="bg-gray-50 dark:bg-gray-800/50"
        rowClassName="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
