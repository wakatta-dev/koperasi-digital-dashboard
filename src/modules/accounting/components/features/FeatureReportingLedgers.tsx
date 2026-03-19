/** @format */

import { Download, Printer, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/shared/inputs/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableShell } from "@/components/shared/data-display/TableShell";
import type {
  AccountingReportingAccountLedgerEntry,
  AccountingReportingGeneralLedgerGroup,
  AccountingReportingLedgerEntry,
  AccountingReportingProfitLossComparativeRow,
  AccountingReportingTrialBalanceRow,
} from "@/types/api/accounting-reporting";

import type { ReportingAccountOption } from "../../types/reporting";
import {
  FeatureReportingDateRangeControl,
  FeatureReportingPaginationBar,
} from "./FeatureReportingShared";

type TrialBalanceTableRow =
  | ({
      rowType: "item";
      id: string;
    } & AccountingReportingTrialBalanceRow)
  | {
      rowType: "summary";
      id: string;
      account_code: string;
      account_name: string;
      initial_balance: number;
      debit: number;
      credit: number;
      ending_balance: number;
    };

type GeneralLedgerGroupedTableRow =
  | ({
      rowType: "entry";
      id: string;
    } & AccountingReportingLedgerEntry)
  | {
      rowType: "summary";
      id: string;
      date: string;
      reference: string;
      partner: string;
      label: string;
      debit: number;
      credit: number;
      balance: number;
    };

type AccountLedgerJournalTableRow =
  | ({
      rowType: "entry";
      id: string;
    } & AccountingReportingAccountLedgerEntry)
  | {
      rowType: "summary";
      id: string;
      date: string;
      journal: string;
      description: string;
      reference: string;
      debit: number;
      credit: number;
      balance: number;
    };

export interface FeatureProfitLossComparativeToolbarProps {
  readonly periodLabel: string;
  readonly onPrint?: () => void;
  readonly onExport?: () => void;
}

export function FeatureProfitLossComparativeToolbar({
  periodLabel,
  onPrint,
  onExport,
}: FeatureProfitLossComparativeToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
        {periodLabel}
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

export interface FeatureProfitLossComparativeTableProps {
  readonly rows: ReadonlyArray<AccountingReportingProfitLossComparativeRow>;
}

export function FeatureProfitLossComparativeTable({
  rows,
}: FeatureProfitLossComparativeTableProps) {
  return (
    <div className="overflow-hidden dark:bg-slate-900">
      <TableShell
        columns={[
          {
            id: "label",
            header: <>Account</>,
            cell: ({ row }) => row.original.label,
            meta: {
              headerClassName: "min-w-[260px] bg-gray-50 dark:bg-gray-800",
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? {
                      colSpan: 5,
                      className:
                        "text-xs font-semibold uppercase tracking-wider text-indigo-600",
                    }
                  : {
                      className:
                        row.original.type === "item" ? "pl-10" : undefined,
                    },
            },
          },
          {
            id: "current_value",
            header: <>Current Month</>,
            cell: ({ row }) => formatCurrency(row.original.current_value),
            meta: {
              headerClassName: "text-right",
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? { hidden: true }
                  : { className: "text-right" },
            },
          },
          {
            id: "previous_value",
            header: <>Previous Month</>,
            cell: ({ row }) => formatCurrency(row.original.previous_value),
            meta: {
              headerClassName: "text-right",
              cellProps: ({ row }) =>
                row.original.type === "section"
                  ? { hidden: true }
                  : {
                      className: "text-right text-gray-500 dark:text-gray-400",
                    },
            },
          },
          {
            id: "variance_value",
            header: <>Variance</>,
            cell: ({ row }) =>
              formatSignedCurrency(row.original.variance_value),
            meta: {
              headerClassName: "text-right",
              cellProps: ({ row }) => {
                if (row.original.type === "section") return { hidden: true };
                return {
                  className: `text-right ${
                    row.original.variance_value >= 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`,
                };
              },
            },
          },
          {
            id: "variance_pct",
            header: <>Variance %</>,
            cell: ({ row }) => formatSignedPercent(row.original.variance_pct),
            meta: {
              headerClassName: "text-right",
              cellProps: ({ row }) => {
                if (row.original.type === "section") return { hidden: true };
                return {
                  className: `text-right ${
                    row.original.variance_value >= 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`,
                };
              },
            },
          },
        ]}
        data={[...rows]}
        getRowId={(row, index) => `${row.type}-${row.label}-${index}`}
        headerClassName="bg-gray-50 dark:bg-gray-800"
        rowHoverable={false}
        rowClassName={(row) =>
          row.type === "section"
            ? "bg-gray-50/70 dark:bg-gray-800/40"
            : row.type === "total"
              ? "bg-indigo-50/50 font-semibold dark:bg-indigo-950/20"
              : undefined
        }
      />
    </div>
  );
}

export interface FeatureProfitLossComparativeMetaFooterProps {
  readonly generatedAt: string;
  readonly currency: string;
}

export function FeatureProfitLossComparativeMetaFooter({
  generatedAt,
  currency,
}: FeatureProfitLossComparativeMetaFooterProps) {
  return (
    <div className="flex items-center justify-between border-t mt-4 border-gray-200 px-6 py-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <p>
        Report generated on{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {generatedAt}
        </span>
      </p>
      <p>
        Currency:{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {currency}
        </span>
      </p>
    </div>
  );
}

export interface FeatureTrialBalanceFilterPanelProps {
  readonly branch?: string;
  readonly branches?: ReadonlyArray<ReportingAccountOption>;
  readonly onBranchChange?: (value: string) => void;
  readonly start?: string;
  readonly end?: string;
  readonly onStartChange?: (value: string) => void;
  readonly onEndChange?: (value: string) => void;
  readonly onExport?: () => void;
}

export function FeatureTrialBalanceFilterPanel({
  branch,
  branches,
  onBranchChange,
  start,
  end,
  onStartChange,
  onEndChange,
  onExport,
}: FeatureTrialBalanceFilterPanelProps) {
  const branchOptions =
    branches && branches.length > 0
      ? branches
      : [{ id: "all", label: "All Branches" }];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900 lg:flex-row lg:items-end">
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_14rem]">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Date Range
          </p>
          <FeatureReportingDateRangeControl
            start={start}
            end={end}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Branch
          </p>
          <Select value={branch ?? "all"} onValueChange={onBranchChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              {branchOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex w-full items-center gap-3 lg:w-auto">
        <Button type="button" variant="outline" className="flex-1 lg:flex-none">
          More Filters
        </Button>
        <Button
          type="button"
          className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 lg:flex-none"
          onClick={onExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}

export interface FeatureTrialBalanceTableProps {
  readonly rows: ReadonlyArray<AccountingReportingTrialBalanceRow>;
  readonly totals: {
    initial_balance: number;
    debit: number;
    credit: number;
    ending_balance: number;
  };
  readonly pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  readonly paginationInfo?: string;
  readonly onPageChange?: (nextPage: number) => void;
}

export function FeatureTrialBalanceTable({
  rows,
  totals,
  pagination,
  paginationInfo,
  onPageChange,
}: FeatureTrialBalanceTableProps) {
  const tableRows: TrialBalanceTableRow[] = [
    ...rows.map((row, index) => ({
      ...row,
      rowType: "item" as const,
      id: `${row.account_code}-${index}`,
    })),
    {
      rowType: "summary",
      id: "summary",
      account_code: "",
      account_name: "Total",
      initial_balance: totals.initial_balance,
      debit: totals.debit,
      credit: totals.credit,
      ending_balance: totals.ending_balance,
    },
  ];

  return (
    <div className="overflow-hidden dark:bg-slate-900">
      <TableShell
        className="space-y-0 border border-border rounded-xl overflow-hidden"
        columns={[
          {
            id: "account",
            header: <>Account</>,
            cell: ({ row }) =>
              row.original.rowType === "summary" ? (
                row.original.account_name
              ) : (
                <>
                  <span className="mr-2 text-gray-400">
                    {row.original.account_code}
                  </span>
                  {row.original.account_name}
                </>
              ),
            meta: {
              headerClassName: "bg-gray-50 dark:bg-gray-800",
              cellProps: ({ row }) =>
                row.original.rowType === "summary"
                  ? undefined
                  : {
                      className: "font-medium text-gray-900 dark:text-white",
                    },
            },
          },
          {
            id: "initial_balance",
            header: <>Initial Balance</>,
            cell: ({ row }) => formatCurrency(row.original.initial_balance),
            meta: {
              headerClassName: "text-right",
              cellProps: () => ({
                className:
                  "text-right font-mono text-gray-600 dark:text-gray-400",
              }),
            },
          },
          {
            id: "debit",
            header: <>Debit</>,
            cell: ({ row }) => formatCurrency(row.original.debit),
            meta: {
              headerClassName: "text-right",
              cellProps: () => ({
                className:
                  "text-right font-mono text-gray-600 dark:text-gray-400",
              }),
            },
          },
          {
            id: "credit",
            header: <>Credit</>,
            cell: ({ row }) => formatCurrency(row.original.credit),
            meta: {
              headerClassName: "text-right",
              cellProps: () => ({
                className:
                  "text-right font-mono text-gray-600 dark:text-gray-400",
              }),
            },
          },
          {
            id: "ending_balance",
            header: <>Ending Balance</>,
            cell: ({ row }) => formatCurrency(row.original.ending_balance),
            meta: {
              headerClassName: "text-right",
              cellProps: ({ row }) => ({
                className:
                  row.original.rowType === "summary"
                    ? "text-right font-mono"
                    : "text-right font-mono font-semibold text-gray-900 dark:text-white",
              }),
            },
          },
        ]}
        data={tableRows}
        getRowId={(row) => row.id}
        headerClassName="bg-gray-50 dark:bg-gray-800"
        rowHoverable={false}
        rowClassName={(row) =>
          row.rowType === "summary"
            ? "bg-gray-50 font-semibold dark:bg-gray-800/60"
            : undefined
        }
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

export interface FeatureTrialBalancePaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange?: (next: number) => void;
}

export function FeatureTrialBalancePagination(
  props: FeatureTrialBalancePaginationProps,
) {
  return <FeatureReportingPaginationBar {...props} />;
}

export interface FeatureGeneralLedgerTopActionsProps {
  readonly onPrint?: () => void;
  readonly onExport?: () => void;
}

export function FeatureGeneralLedgerTopActions({
  onPrint,
  onExport,
}: FeatureGeneralLedgerTopActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" onClick={onPrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button
        type="button"
        className="bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={onExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Export XLSX
      </Button>
    </div>
  );
}

export interface FeatureGeneralLedgerFilterPanelProps {
  readonly start?: string;
  readonly end?: string;
  readonly accountId?: string;
  readonly accountOptions: ReadonlyArray<ReportingAccountOption>;
  readonly onStartChange?: (value: string) => void;
  readonly onEndChange?: (value: string) => void;
  readonly onAccountChange?: (value: string) => void;
  readonly onApply?: () => void;
}

export function FeatureGeneralLedgerFilterPanel({
  start,
  end,
  accountId,
  accountOptions,
  onStartChange,
  onEndChange,
  onAccountChange,
  onApply,
}: FeatureGeneralLedgerFilterPanelProps) {
  return (
    <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-slate-900 md:grid-cols-4 md:items-end">
      <div className="space-y-1.5 md:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Date Range
        </p>
        <FeatureReportingDateRangeControl
          start={start}
          end={end}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Account Selection
        </p>
        <Select value={accountId ?? "all"} onValueChange={onAccountChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accountOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        className="text-indigo-600 hover:text-indigo-700"
        onClick={onApply}
      >
        Apply Filters
      </Button>
    </div>
  );
}

export interface FeatureGeneralLedgerGroupedTableProps {
  readonly groups: ReadonlyArray<AccountingReportingGeneralLedgerGroup>;
  readonly onOpenAccountLedger?: (accountId: string) => void;
}

export function FeatureGeneralLedgerGroupedTable({
  groups,
  onOpenAccountLedger,
}: FeatureGeneralLedgerGroupedTableProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card
          key={group.account_id}
          className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900"
        >
          <CardHeader className="border-b border-gray-100 pb-3 dark:border-gray-800">
            <CardTitle className="flex flex-col gap-2 text-base sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="text-left font-semibold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                onClick={() => onOpenAccountLedger?.(group.account_id)}
              >
                <span className="font-bold">{group.account_code}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span>{group.account_name}</span>
              </button>
              <Badge variant="outline" className="w-fit">
                Initial Balance: {formatRupiah(group.initial_balance)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(() => {
              const tableRows: GeneralLedgerGroupedTableRow[] = [
                ...group.entries.map((entry, idx) => ({
                  ...entry,
                  rowType: "entry" as const,
                  id: `${group.account_id}-${idx}`,
                })),
                {
                  rowType: "summary",
                  id: `summary-${group.account_id}`,
                  date: `Total for ${group.account_code}`,
                  reference: "",
                  partner: "",
                  label: "",
                  debit: group.subtotal_debit,
                  credit: group.subtotal_credit,
                  balance: group.ending_balance,
                },
              ];

              return (
                <TableShell
                  className="border border-border rounded-xl overflow-hidden"
                  columns={[
                    {
                      id: "date",
                      header: <>Date</>,
                      cell: ({ row }) => row.original.date,
                      meta: {
                        headerClassName: "bg-gray-50 dark:bg-gray-800",
                        cellProps: ({ row }) =>
                          row.original.rowType === "summary"
                            ? {
                                colSpan: 4,
                                className:
                                  "text-right text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400",
                              }
                            : { className: "text-gray-500 dark:text-gray-400" },
                      },
                    },
                    {
                      id: "reference",
                      header: <>Reference</>,
                      cell: ({ row }) => row.original.reference,
                      meta: {
                        cellProps: ({ row }) =>
                          row.original.rowType === "summary"
                            ? { hidden: true }
                            : {
                                className:
                                  "font-medium text-indigo-600 dark:text-indigo-300",
                              },
                      },
                    },
                    {
                      id: "partner",
                      header: <>Partner</>,
                      meta: {
                        cellProps: ({ row }) =>
                          row.original.rowType === "summary"
                            ? { hidden: true }
                            : undefined,
                      },
                    },
                    {
                      id: "label",
                      header: <>Label</>,
                      cell: ({ row }) => row.original.label,
                      meta: {
                        cellProps: ({ row }) =>
                          row.original.rowType === "summary"
                            ? { hidden: true }
                            : {
                                className: "text-gray-600 dark:text-gray-300",
                              },
                      },
                    },
                    {
                      id: "debit",
                      header: <>Debit</>,
                      cell: ({ row }) =>
                        row.original.debit
                          ? formatLedgerAmount(row.original.debit)
                          : "-",
                      meta: {
                        headerClassName: "text-right",
                        cellProps: () => ({ className: "text-right" }),
                      },
                    },
                    {
                      id: "credit",
                      header: <>Credit</>,
                      cell: ({ row }) =>
                        row.original.credit
                          ? formatLedgerAmount(row.original.credit)
                          : "-",
                      meta: {
                        headerClassName: "text-right",
                        cellProps: () => ({ className: "text-right" }),
                      },
                    },
                    {
                      id: "balance",
                      header: <>Balance</>,
                      cell: ({ row }) =>
                        formatLedgerAmount(row.original.balance),
                      meta: {
                        headerClassName: "text-right",
                        cellProps: ({ row }) => ({
                          className:
                            row.original.rowType === "summary"
                              ? "text-right font-semibold text-gray-900 dark:text-white"
                              : "text-right font-medium",
                        }),
                      },
                    },
                  ]}
                  data={tableRows}
                  getRowId={(row) => row.id}
                  headerClassName="bg-gray-50 dark:bg-gray-800"
                  rowHoverable={false}
                  rowClassName={(row) =>
                    row.rowType === "summary"
                      ? "bg-indigo-50/40 font-medium dark:bg-indigo-950/20"
                      : undefined
                  }
                />
              );
            })()}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export interface FeatureGeneralLedgerPaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange?: (next: number) => void;
  readonly totalLabel?: string;
}

export function FeatureGeneralLedgerPagination(
  props: FeatureGeneralLedgerPaginationProps,
) {
  return <FeatureReportingPaginationBar {...props} />;
}

export interface FeatureAccountLedgerTopActionsProps {
  readonly onPrint?: () => void;
  readonly onExport?: () => void;
}

export function FeatureAccountLedgerTopActions({
  onPrint,
  onExport,
}: FeatureAccountLedgerTopActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" onClick={onPrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button
        type="button"
        className="bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={onExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  );
}

export interface FeatureAccountLedgerFilterPanelProps {
  readonly accountId?: string;
  readonly accountOptions: ReadonlyArray<ReportingAccountOption>;
  readonly start?: string;
  readonly end?: string;
  readonly onAccountChange?: (value: string) => void;
  readonly onStartChange?: (value: string) => void;
  readonly onEndChange?: (value: string) => void;
  readonly onApply?: () => void;
}

export function FeatureAccountLedgerFilterPanel({
  accountId,
  accountOptions,
  start,
  end,
  onAccountChange,
  onStartChange,
  onEndChange,
  onApply,
}: FeatureAccountLedgerFilterPanelProps) {
  const selectedValue = accountId?.trim() || undefined;

  return (
    <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900 md:grid-cols-3 md:items-end">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Account
        </p>
        <Select value={selectedValue} onValueChange={onAccountChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accountOptions.length === 0 ? (
              <SelectItem value="__no-account" disabled>
                Account not available
              </SelectItem>
            ) : null}
            {accountOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Date Range
        </p>
        <FeatureReportingDateRangeControl
          start={start}
          end={end}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full text-indigo-600 hover:text-indigo-700 md:w-auto"
        onClick={onApply}
      >
        Apply Filter
      </Button>
    </div>
  );
}

export interface FeatureAccountLedgerJournalTableProps {
  readonly entries: ReadonlyArray<AccountingReportingAccountLedgerEntry>;
  readonly totals: {
    debit: number;
    credit: number;
  };
  readonly search?: string;
  readonly onSearchChange?: (value: string) => void;
  readonly pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  readonly paginationInfo?: string;
  readonly onPageChange?: (nextPage: number) => void;
}

export function FeatureAccountLedgerJournalTable({
  entries,
  totals,
  search,
  onSearchChange,
  pagination,
  paginationInfo,
  onPageChange,
}: FeatureAccountLedgerJournalTableProps) {
  const tableRows: AccountLedgerJournalTableRow[] = [
    ...entries.map((entry, idx) => ({
      ...entry,
      rowType: "entry" as const,
      id: `account-ledger-${idx}`,
    })),
    {
      rowType: "summary",
      id: "summary",
      date: "Total",
      journal: "",
      description: "",
      reference: "",
      debit: totals.debit,
      credit: totals.credit,
      balance: 0,
    },
  ];

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <CardHeader className="border-b border-gray-100  dark:border-gray-800 py-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Journal Entries</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search ?? ""}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search transactions..."
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4">
        <TableShell
          className="space-y-0 border border-border rounded-xl overflow-hidden"
          columns={[
            {
              id: "date",
              header: <>Date</>,
              cell: ({ row }) => row.original.date,
              meta: {
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? {
                        colSpan: 4,
                        className:
                          "text-right text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400",
                      }
                    : { className: "text-gray-500 dark:text-gray-400" },
              },
            },
            {
              id: "journal",
              header: <>Journal</>,
              cell: ({ row }) => row.original.journal,
              meta: {
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : {
                        className:
                          "font-medium text-indigo-600 dark:text-indigo-300",
                      },
              },
            },
            {
              id: "description",
              header: <>Description</>,
              cell: ({ row }) => row.original.description,
              meta: {
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : {
                        className: "text-gray-900 dark:text-white",
                      },
              },
            },
            {
              id: "reference",
              header: <>Ref</>,
              cell: ({ row }) => row.original.reference,
              meta: {
                cellProps: ({ row }) =>
                  row.original.rowType === "summary"
                    ? { hidden: true }
                    : { className: "text-gray-500" },
              },
            },
            {
              id: "debit",
              header: <>Debit</>,
              cell: ({ row }) =>
                row.original.debit ? formatRupiah(row.original.debit) : "-",
              meta: {
                headerClassName: "text-right",
                cellProps: () => ({ className: "text-right" }),
              },
            },
            {
              id: "credit",
              header: <>Credit</>,
              cell: ({ row }) =>
                row.original.credit ? formatRupiah(row.original.credit) : "-",
              meta: {
                headerClassName: "text-right",
                cellProps: () => ({ className: "text-right" }),
              },
            },
            {
              id: "balance",
              header: <>Balance</>,
              cell: ({ row }) =>
                row.original.rowType === "summary"
                  ? "-"
                  : formatRupiah(row.original.balance),
              meta: {
                headerClassName: "text-right",
                cellProps: ({ row }) => ({
                  className:
                    row.original.rowType === "summary"
                      ? "text-right"
                      : "text-right font-medium",
                }),
              },
            },
          ]}
          data={tableRows}
          getRowId={(row) => row.id}
          headerClassName="bg-gray-50 dark:bg-gray-800/50"
          rowHoverable={false}
          rowClassName={(row) =>
            row.rowType === "summary"
              ? "bg-gray-50 font-semibold dark:bg-gray-800/60"
              : undefined
          }
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
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedCurrency(value: number) {
  const currency = formatCurrency(Math.abs(value));
  if (value > 0) return `+${currency}`;
  if (value < 0) return `-${currency}`;
  return currency;
}

function formatSignedPercent(value: number) {
  const rounded = `${Math.abs(value).toFixed(1)}%`;
  if (value > 0) return `+${rounded}`;
  if (value < 0) return `-${rounded}`;
  return rounded;
}

function formatLedgerAmount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("en-US").format(value)}`;
}
