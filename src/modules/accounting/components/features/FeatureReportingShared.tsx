/** @format */

import {
  ArrowLeftRight,
  BarChart3,
  BookMarked,
  Calendar,
  Download,
  Eye,
  FolderOpen,
  ListOrdered,
  Printer,
  Scale,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/shared/inputs/input";

import type { ReportingCardItem } from "../../types/reporting";

export type FeatureReportingActionKind = "view" | "print" | "download" | "export";

export interface FeatureReportingActionButtonsProps {
  readonly actions: ReadonlyArray<FeatureReportingActionKind>;
  readonly onAction?: (kind: FeatureReportingActionKind) => void;
}

export function FeatureReportingActionButtons({
  actions,
  onAction,
}: FeatureReportingActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.includes("view") ? (
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => onAction?.("view")}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      ) : null}
      {actions.includes("print") ? (
        <Button type="button" variant="outline" onClick={() => onAction?.("print")}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      ) : null}
      {actions.includes("download") ? (
        <Button
          type="button"
          variant="outline"
          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          onClick={() => onAction?.("download")}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      ) : null}
      {actions.includes("export") ? (
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => onAction?.("export")}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      ) : null}
    </div>
  );
}

export interface FeatureReportingPaginationBarProps {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange?: (next: number) => void;
  readonly totalLabel?: string;
}

export function FeatureReportingPaginationBar({
  page,
  pageSize,
  totalItems,
  onPageChange,
  totalLabel,
}: FeatureReportingPaginationBarProps) {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const totalPages = Math.max(Math.ceil(totalItems / safePageSize), 1);

  return (
    <nav className="flex flex-col gap-2 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {totalLabel ?? `Page ${safePage} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange?.(safePage - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange?.(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}

export interface FeatureReportingDateRangeControlProps {
  readonly start?: string;
  readonly end?: string;
  readonly onStartChange?: (value: string) => void;
  readonly onEndChange?: (value: string) => void;
}

export function FeatureReportingDateRangeControl({
  start,
  end,
  onStartChange,
  onEndChange,
}: FeatureReportingDateRangeControlProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="date"
          value={start ?? ""}
          onChange={(event) => onStartChange?.(event.target.value)}
          className="border-none bg-transparent pl-9 pr-2 shadow-none focus-visible:ring-0"
          aria-label="Start date"
        />
      </div>
      <span className="text-sm text-gray-400">-</span>
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="date"
          value={end ?? ""}
          onChange={(event) => onEndChange?.(event.target.value)}
          className="border-none bg-transparent pl-9 pr-2 shadow-none focus-visible:ring-0"
          aria-label="End date"
        />
      </div>
    </div>
  );
}

export interface FeatureReportingSectionHeaderProps {
  readonly title: string;
  readonly badgeText?: string;
}

export function FeatureReportingSectionHeader({
  title,
  badgeText,
}: FeatureReportingSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-lg bg-indigo-100 p-1.5 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
        <BarChart3 className="h-4 w-4" />
      </span>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {badgeText ? (
        <Badge
          variant="secondary"
          className="border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
        >
          {badgeText}
        </Badge>
      ) : null}
    </div>
  );
}

export interface FeatureReportingReportCardProps {
  readonly card: ReportingCardItem;
  readonly onView?: (card: ReportingCardItem) => void;
  readonly onDownload?: (card: ReportingCardItem) => void;
}

export function FeatureReportingReportCard({
  card,
  onView,
  onDownload,
}: FeatureReportingReportCardProps) {
  return (
    <Card className="flex h-full flex-col border-gray-200 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-slate-900 dark:hover:border-indigo-700">
      <CardHeader className="space-y-3">
        <span className={resolveCardIconClassName(card.iconTone)}>
          {renderCardIcon(card.key)}
        </span>
        <CardTitle className="text-base text-gray-900 dark:text-white">{card.title}</CardTitle>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button
          type="button"
          className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => onView?.(card)}
        >
          View
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Download ${card.title}`}
          onClick={() => onDownload?.(card)}
        >
          <Download className="h-4 w-4 text-gray-500" />
        </Button>
      </CardContent>
    </Card>
  );
}

export interface FeatureReportingCardsGridProps {
  readonly cards: ReadonlyArray<ReportingCardItem>;
  readonly onView?: (card: ReportingCardItem) => void;
  readonly onDownload?: (card: ReportingCardItem) => void;
}

export function FeatureReportingStatementCardsGrid({
  cards,
  onView,
  onDownload,
}: FeatureReportingCardsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <FeatureReportingReportCard
          key={card.key}
          card={card}
          onView={onView}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}

export function FeatureReportingLedgerCardsGrid({
  cards,
  onView,
  onDownload,
}: FeatureReportingCardsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <FeatureReportingReportCard
          key={card.key}
          card={card}
          onView={onView}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}

function resolveCardIconClassName(
  tone: ReportingCardItem["iconTone"],
): string {
  switch (tone) {
    case "blue":
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300";
    case "emerald":
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300";
    case "orange":
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300";
    case "purple":
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300";
    case "teal":
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300";
    case "cyan":
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300";
    default:
      return "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300";
  }
}

function renderCardIcon(key: string) {
  switch (key) {
    case "balance-sheet":
      return <Scale className="h-5 w-5" />;
    case "profit-loss":
      return <TrendingUp className="h-5 w-5" />;
    case "cash-flow":
      return <ArrowLeftRight className="h-5 w-5" />;
    case "p-and-l-comparative":
      return <BarChart3 className="h-5 w-5" />;
    case "trial-balance":
      return <ListOrdered className="h-5 w-5" />;
    case "general-ledger":
      return <BookMarked className="h-5 w-5" />;
    case "account-ledger":
      return <FolderOpen className="h-5 w-5" />;
    default:
      return <BarChart3 className="h-5 w-5" />;
  }
}
