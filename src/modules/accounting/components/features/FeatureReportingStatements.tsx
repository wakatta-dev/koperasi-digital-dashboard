/** @format */

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableShell } from "@/components/shared/data-display/TableShell";
import type {
  AccountingReportingBalanceLine,
  AccountingReportingCashFlowRow,
  AccountingReportingProfitLossRow,
} from "@/types/api/accounting-reporting";

import { FeatureReportingDateRangeControl } from "./FeatureReportingShared";

type BalanceSheetTreeRow = {
  id: string;
  rowType: "section" | "item";
  label: string;
  value_display?: string;
};

export interface FeatureProfitLossToolbarProps {
  readonly preset: string;
  readonly onPresetChange?: (value: string) => void;
  readonly onExport?: () => void;
}

export function FeatureProfitLossToolbar({
  preset,
  onPresetChange,
  onExport,
}: FeatureProfitLossToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Select value={preset} onValueChange={onPresetChange}>
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="last_month">Last Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="last_year">Last Year</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        className="bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={onExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Export Report
      </Button>
    </div>
  );
}

export interface FeatureProfitLossSummaryHeaderProps {
  readonly periodLabel: string;
  readonly netProfit: string;
}

export function FeatureProfitLossSummaryHeader({
  periodLabel,
  netProfit,
}: FeatureProfitLossSummaryHeaderProps) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/70 pb-4 dark:border-gray-800 dark:bg-gray-800/30">
        <div>
          <CardTitle className="text-base text-gray-900 dark:text-white">
            Profit &amp; Loss Statement
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {periodLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Net Profit</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {netProfit}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}

export interface FeatureProfitLossDetailTableProps {
  readonly rows: ReadonlyArray<AccountingReportingProfitLossRow>;
}

export function FeatureProfitLossDetailTable({
  rows,
}: FeatureProfitLossDetailTableProps) {
  return (
    <div className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <TableShell
        columns={[
          {
            id: "label",
            header: <>Account Name</>,
            cell: ({ row }) => row.original.label,
            meta: {
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? {
                      colSpan: 3,
                      className:
                        "font-semibold text-gray-800 dark:text-gray-200",
                    }
                  : {
                      className:
                        row.original.type === "row"
                          ? "pl-10 text-gray-700 dark:text-gray-300"
                          : "font-semibold",
                    },
            },
          },
          {
            id: "code",
            header: <>Code</>,
            cell: ({ row }) => row.original.code_display ?? "-",
            meta: {
              headerClassName: "w-32",
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? { hidden: true }
                  : { className: "font-mono text-xs text-gray-500" },
            },
          },
          {
            id: "value",
            header: <>Total</>,
            cell: ({ row }) => row.original.value_display ?? "-",
            meta: {
              headerClassName: "w-48 text-right",
              cellProps: ({ row }) => {
                if (row.original.type === "section") {
                  return { hidden: true };
                }

                const totalClassName =
                  row.original.type === "net"
                    ? "text-base font-bold text-emerald-600 dark:text-emerald-400"
                    : row.original.type === "gross"
                      ? "font-bold text-emerald-600 dark:text-emerald-400"
                      : "font-semibold text-gray-900 dark:text-white";

                return {
                  className: `text-right ${totalClassName}`,
                };
              },
            },
          },
        ]}
        data={[...rows]}
        getRowId={(row, index) => `${row.type}-${row.label}-${index}`}
        headerRowClassName="bg-gray-50/70 dark:bg-gray-800/30"
        rowHoverable={false}
        rowClassName={(row) =>
          row.type === "section"
            ? "bg-gray-50/60 dark:bg-gray-800/30"
            : row.type === "net"
              ? "bg-gray-50 dark:bg-slate-950/50"
              : undefined
        }
      />
    </div>
  );
}

export interface FeatureCashFlowToolbarProps {
  readonly start?: string;
  readonly end?: string;
  readonly onStartChange?: (value: string) => void;
  readonly onEndChange?: (value: string) => void;
  readonly onPrint?: () => void;
  readonly onDownload?: () => void;
}

export function FeatureCashFlowToolbar({
  start,
  end,
  onStartChange,
  onEndChange,
  onPrint,
  onDownload,
}: FeatureCashFlowToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <FeatureReportingDateRangeControl
        start={start}
        end={end}
        onStartChange={onStartChange}
        onEndChange={onEndChange}
      />
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onPrint}>
          <Printer className="h-4 w-4" />
          <span className="sr-only">Print</span>
        </Button>
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}

export interface FeatureCashFlowStatementHeaderProps {
  readonly companyName?: string;
  readonly currencyLabel?: string;
}

export function FeatureCashFlowStatementHeader({
  companyName,
  currencyLabel,
}: FeatureCashFlowStatementHeaderProps) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
            Statement of Cash Flows
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            {companyName || "-"}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Reporting Currency
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currencyLabel || "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export interface FeatureCashFlowTableProps {
  readonly rows: ReadonlyArray<AccountingReportingCashFlowRow>;
}

export function FeatureCashFlowTable({ rows }: FeatureCashFlowTableProps) {
  return (
    <div className="overflow-hidden dark:bg-slate-900 p-0">
      <TableShell
        columns={[
          {
            id: "label",
            header: <>Description</>,
            cell: ({ row }) => row.original.label,
            meta: {
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? {
                      colSpan: 2,
                      className: "font-bold text-gray-900 dark:text-white",
                    }
                  : {
                      className: resolveCashFlowIndentClassName(
                        row.original.indent,
                      ),
                    },
            },
          },
          {
            id: "value",
            header: <>Amount</>,
            cell: ({ row }) => row.original.value_display ?? "-",
            meta: {
              headerClassName: "w-48 text-right",
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? { hidden: true }
                  : { className: "text-right font-medium" },
            },
          },
        ]}
        data={[...rows]}
        getRowId={(row, index) => `${row.type}-${row.label}-${index}`}
        headerRowClassName="bg-gray-50 dark:bg-gray-800/50"
        rowHoverable={false}
        rowClassName={(row) => {
          if (row.type === "section") {
            return "bg-gray-50/70 dark:bg-gray-800/30";
          }

          if (row.type === "finalPrimary") {
            return "bg-indigo-600 text-white";
          }

          return [
            "total",
            "netPrimary",
            "summaryGray",
            "plainBold",
            "finalPrimary",
          ].includes(row.type)
            ? "bg-indigo-50/30 dark:bg-indigo-900/10"
            : undefined;
        }}
      />
    </div>
  );
}

export interface FeatureBalanceSheetToolbarProps {
  readonly asOfDate?: string;
  readonly onDateChange?: (value: string) => void;
  readonly onExport?: () => void;
}

export function FeatureBalanceSheetToolbar({
  asOfDate,
  onDateChange,
  onExport,
}: FeatureBalanceSheetToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-slate-900">
        <span className="border-r border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
          As of Date
        </span>
        <input
          type="date"
          value={asOfDate ?? ""}
          onChange={(event) => onDateChange?.(event.target.value)}
          className="bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none dark:text-white"
        />
      </div>
      <Button
        type="button"
        className="bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={onExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Export PDF/Excel
      </Button>
    </div>
  );
}

export interface FeatureBalanceSheetTreeTableProps {
  readonly assets: ReadonlyArray<AccountingReportingBalanceLine>;
  readonly liabilities: ReadonlyArray<AccountingReportingBalanceLine>;
  readonly equity: ReadonlyArray<AccountingReportingBalanceLine>;
}

export function FeatureBalanceSheetTreeTable({
  assets,
  liabilities,
  equity,
}: FeatureBalanceSheetTreeTableProps) {
  const tableRows: BalanceSheetTreeRow[] = [
    { id: "section-assets", rowType: "section", label: "Assets" },
    ...assets.map((item, index) => ({
      id: `asset-${item.label}-${index}`,
      rowType: "item" as const,
      label: item.label,
      value_display: item.value_display,
    })),
    { id: "section-liabilities", rowType: "section", label: "Liabilities" },
    ...liabilities.map((item, index) => ({
      id: `liability-${item.label}-${index}`,
      rowType: "item" as const,
      label: item.label,
      value_display: item.value_display,
    })),
    { id: "section-equity", rowType: "section", label: "Equity" },
    ...equity.map((item, index) => ({
      id: `equity-${item.label}-${index}`,
      rowType: "item" as const,
      label: item.label,
      value_display: item.value_display,
    })),
  ];

  return (
    <div className="overflow-hidden dark:bg-slate-900">
      <TableShell
        columns={[
          {
            id: "label",
            header: <>Account</>,
            cell: ({ row }) => row.original.label,
            meta: {
              cellProps: ({ row }) =>
                row.original.rowType === "section"
                  ? {
                      colSpan: 2,
                      className:
                        "text-lg font-bold text-gray-900 dark:text-white",
                    }
                  : {
                      className: "pl-10 text-gray-700 dark:text-gray-300",
                    },
            },
          },
          {
            id: "value_display",
            header: <>Balance</>,
            cell: ({ row }) => row.original.value_display ?? "-",
            meta: {
              headerClassName: "text-right",
              cellProps: ({ row }) =>
                row.original.rowType === "section"
                  ? { hidden: true }
                  : { className: "text-right font-medium" },
            },
          },
        ]}
        data={tableRows}
        getRowId={(row) => row.id}
        headerRowClassName="bg-gray-50 dark:bg-gray-800/50"
        rowHoverable={false}
        rowClassName={(row) =>
          row.rowType === "section"
            ? "bg-gray-50/70 dark:bg-gray-800/30"
            : undefined
        }
      />
    </div>
  );
}

export interface FeatureBalanceSheetTotalFooterProps {
  readonly label: string;
  readonly value: string;
}

export function FeatureBalanceSheetTotalFooter({
  label,
  value,
}: FeatureBalanceSheetTotalFooterProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-6 py-4 dark:border-indigo-800 dark:bg-indigo-900/20">
      <span className="text-base font-bold text-indigo-600 dark:text-indigo-300">
        {label}
      </span>
      <span className="text-base font-bold text-indigo-600 dark:text-indigo-300">
        {value}
      </span>
    </div>
  );
}

function resolveCashFlowIndentClassName(indent?: number) {
  if (!indent || indent <= 0) {
    return undefined;
  }

  switch (indent) {
    case 1:
      return "pl-10";
    case 2:
      return "pl-12";
    case 3:
      return "pl-14";
    default:
      return "pl-16";
  }
}
