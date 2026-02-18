/** @format */

import { Download, Printer, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
  AccountingReportingAccountLedgerEntry,
  AccountingReportingAccountLedgerResponse,
  AccountingReportingGeneralLedgerGroup,
  AccountingReportingLedgerEntry,
  AccountingReportingProfitLossComparativeRow,
  AccountingReportingTrialBalanceRow,
} from "@/types/api/accounting-reporting";

import type { ReportingAccountOption } from "../../types/reporting";
import { FeatureReportingDateRangeControl, FeatureReportingPaginationBar } from "./FeatureReportingShared";

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
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="min-w-[260px]">Account</TableHead>
            <TableHead className="text-right">Current Month</TableHead>
            <TableHead className="text-right">Previous Month</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead className="text-right">Variance %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => {
            const key = `${row.type}-${row.label}-${idx}`;
            if (row.type === "section") {
              return (
                <TableRow key={key} className="bg-gray-50/70 dark:bg-gray-800/40">
                  <TableCell colSpan={5} className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {row.label}
                  </TableCell>
                </TableRow>
              );
            }

            const varianceColor = row.variance_value >= 0 ? "text-emerald-600" : "text-red-500";
            return (
              <TableRow
                key={key}
                className={
                  row.type === "total"
                    ? "bg-indigo-50/50 font-semibold dark:bg-indigo-950/20"
                    : ""
                }
              >
                <TableCell className={row.type === "item" ? "pl-10" : undefined}>{row.label}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.current_value)}</TableCell>
                <TableCell className="text-right text-gray-500 dark:text-gray-400">
                  {formatCurrency(row.previous_value)}
                </TableCell>
                <TableCell className={`text-right ${varianceColor}`}>
                  {formatSignedCurrency(row.variance_value)}
                </TableCell>
                <TableCell className={`text-right ${varianceColor}`}>
                  {formatSignedPercent(row.variance_pct)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
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
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <p>
        Report generated on{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">{generatedAt}</span>
      </p>
      <p>
        Currency: <span className="font-medium text-gray-700 dark:text-gray-300">{currency}</span>
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
}

export function FeatureTrialBalanceTable({ rows, totals }: FeatureTrialBalanceTableProps) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Initial Balance</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
            <TableHead className="text-right">Ending Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={`${row.account_code}-${idx}`}>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                <span className="mr-2 text-gray-400">{row.account_code}</span>
                {row.account_name}
              </TableCell>
              <TableCell className="text-right font-mono text-gray-600 dark:text-gray-400">
                {formatCurrency(row.initial_balance)}
              </TableCell>
              <TableCell className="text-right font-mono text-gray-600 dark:text-gray-400">
                {formatCurrency(row.debit)}
              </TableCell>
              <TableCell className="text-right font-mono text-gray-600 dark:text-gray-400">
                {formatCurrency(row.credit)}
              </TableCell>
              <TableCell className="text-right font-mono font-semibold text-gray-900 dark:text-white">
                {formatCurrency(row.ending_balance)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-gray-50 font-semibold dark:bg-gray-800/60">
            <TableCell>Total</TableCell>
            <TableCell className="text-right font-mono">{formatCurrency(totals.initial_balance)}</TableCell>
            <TableCell className="text-right font-mono">{formatCurrency(totals.debit)}</TableCell>
            <TableCell className="text-right font-mono">{formatCurrency(totals.credit)}</TableCell>
            <TableCell className="text-right font-mono">{formatCurrency(totals.ending_balance)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

export interface FeatureTrialBalancePaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange?: (next: number) => void;
}

export function FeatureTrialBalancePagination(props: FeatureTrialBalancePaginationProps) {
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
      <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={onExport}>
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
      <Button type="button" variant="outline" className="text-indigo-600 hover:text-indigo-700" onClick={onApply}>
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
        <Card key={group.account_id} className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900">
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
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.entries.map((entry, idx) => (
                  <FeatureGeneralLedgerRow key={`${group.account_id}-${idx}`} entry={entry} />
                ))}
                <TableRow className="bg-indigo-50/40 font-medium dark:bg-indigo-950/20">
                  <TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Total for {group.account_code}
                  </TableCell>
                  <TableCell className="text-right">{formatLedgerAmount(group.subtotal_debit)}</TableCell>
                  <TableCell className="text-right">{formatLedgerAmount(group.subtotal_credit)}</TableCell>
                  <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                    {formatLedgerAmount(group.ending_balance)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface FeatureGeneralLedgerRowProps {
  readonly entry: AccountingReportingLedgerEntry;
}

function FeatureGeneralLedgerRow({ entry }: FeatureGeneralLedgerRowProps) {
  return (
    <TableRow>
      <TableCell className="text-gray-500 dark:text-gray-400">{entry.date}</TableCell>
      <TableCell className="font-medium text-indigo-600 dark:text-indigo-300">{entry.reference}</TableCell>
      <TableCell>{entry.partner}</TableCell>
      <TableCell className="text-gray-600 dark:text-gray-300">{entry.label}</TableCell>
      <TableCell className="text-right">{entry.debit ? formatLedgerAmount(entry.debit) : "-"}</TableCell>
      <TableCell className="text-right">{entry.credit ? formatLedgerAmount(entry.credit) : "-"}</TableCell>
      <TableCell className="text-right font-medium">{formatLedgerAmount(entry.balance)}</TableCell>
    </TableRow>
  );
}

export interface FeatureGeneralLedgerPaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange?: (next: number) => void;
  readonly totalLabel?: string;
}

export function FeatureGeneralLedgerPagination(props: FeatureGeneralLedgerPaginationProps) {
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
      <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={onExport}>
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
  const fallbackValue = accountOptions[0]?.id ?? "";
  const selectedValue = accountId?.trim() || fallbackValue;

  return (
    <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900 md:grid-cols-3 md:items-end">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</p>
        <Select value={selectedValue} onValueChange={onAccountChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accountOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</p>
        <FeatureReportingDateRangeControl
          start={start}
          end={end}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      </div>
      <Button type="button" variant="outline" className="w-full text-indigo-600 hover:text-indigo-700 md:w-auto" onClick={onApply}>
        Apply Filter
      </Button>
    </div>
  );
}

export interface FeatureAccountLedgerSummaryCardsProps {
  readonly summary: AccountingReportingAccountLedgerResponse["summary"];
}

export function FeatureAccountLedgerSummaryCards({
  summary,
}: FeatureAccountLedgerSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Debit</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {formatRupiah(summary.total_debit)}
          </h3>
        </CardContent>
      </Card>
      <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Credit</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {formatRupiah(summary.total_credit)}
          </h3>
        </CardContent>
      </Card>
      <Card className="border-indigo-100 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Current Balance</p>
          <h3 className="mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {formatRupiah(summary.current_balance)}
          </h3>
        </CardContent>
      </Card>
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
}

export function FeatureAccountLedgerJournalTable({
  entries,
  totals,
  search,
  onSearchChange,
}: FeatureAccountLedgerJournalTableProps) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 dark:bg-slate-900">
      <CardHeader className="border-b border-gray-100 pb-3 dark:border-gray-800">
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
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Journal</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, idx) => (
              <TableRow key={`account-ledger-${idx}`}>
                <TableCell className="text-gray-500 dark:text-gray-400">{entry.date}</TableCell>
                <TableCell className="font-medium text-indigo-600 dark:text-indigo-300">{entry.journal}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">{entry.description}</TableCell>
                <TableCell className="text-gray-500">{entry.reference}</TableCell>
                <TableCell className="text-right">{entry.debit ? formatRupiah(entry.debit) : "-"}</TableCell>
                <TableCell className="text-right">{entry.credit ? formatRupiah(entry.credit) : "-"}</TableCell>
                <TableCell className="text-right font-medium">{formatRupiah(entry.balance)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gray-50 font-semibold dark:bg-gray-800/60">
              <TableCell colSpan={4} className="text-right text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Total
              </TableCell>
              <TableCell className="text-right">{formatRupiah(totals.debit)}</TableCell>
              <TableCell className="text-right">{formatRupiah(totals.credit)}</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
