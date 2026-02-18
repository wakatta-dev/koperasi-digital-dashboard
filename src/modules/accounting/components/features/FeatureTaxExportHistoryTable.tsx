/** @format */

import { Download, FileSpreadsheet, FileText, RotateCcw } from "lucide-react";

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

import type { TaxExportHistoryItem } from "../../types/tax";

function resolveExportType(type: TaxExportHistoryItem["export_type"]) {
  switch (type) {
    case "EFaktur":
      return { label: "e-Faktur", icon: FileSpreadsheet, iconClassName: "text-green-600" };
    case "PPhReport":
      return { label: "PPh Report", icon: FileText, iconClassName: "text-red-600" };
    case "PPNSummary":
      return { label: "PPN Summary", icon: FileSpreadsheet, iconClassName: "text-green-700" };
    default:
      return { label: "Tax Recapitulation", icon: FileText, iconClassName: "text-indigo-600" };
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
  onDownload?: (row: TaxExportHistoryItem) => void;
  onRetry?: (row: TaxExportHistoryItem) => void;
};

export function FeatureTaxExportHistoryTable({
  rows,
  onDownload,
  onRetry,
}: FeatureTaxExportHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              File Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Export Type
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No tax export history found.
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => {
            const exportType = resolveExportType(row.export_type);
            const Icon = exportType.icon;
            const isDownload = row.can_download;

            return (
              <TableRow key={row.export_id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="flex flex-col">
                    <span className="font-medium">{row.date}</span>
                    <span className="text-xs text-gray-500">{row.time}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${exportType.iconClassName}`} />
                    {row.file_name}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {exportType.label}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge className={resolveStatusClass(row.status)}>{row.status}</Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {isDownload ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-indigo-600 hover:text-indigo-700"
                      onClick={() => onDownload?.(row)}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      disabled={!row.can_retry}
                      onClick={() => onRetry?.(row)}
                    >
                      <RotateCcw className="mr-1 h-4 w-4" />
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
