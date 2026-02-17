/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { MoreVertical, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TAX_ROWS } from "../../constants/settings-dummy";
import type { TaxRow } from "../../types/settings";

type FeatureTaxesTableProps = {
  rows?: TaxRow[];
  onCreateTax?: () => void;
  onOpenActions?: (tax: TaxRow) => void;
  renderActions?: (tax: TaxRow) => ReactNode;
};

const TAX_TYPE_CLASS: Record<TaxRow["tax_type"], string> = {
  Sales:
    "bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
  Purchase:
    "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Both:
    "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  None:
    "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700/40 dark:text-gray-400 dark:border-gray-700",
};

export function FeatureTaxesTable({
  rows = TAX_ROWS,
  onCreateTax,
  onOpenActions,
  renderActions,
}: FeatureTaxesTableProps) {
  const [statusByTaxId, setStatusByTaxId] = useState<Record<string, boolean>>(() =>
    rows.reduce<Record<string, boolean>>((acc, row) => {
      acc[row.tax_id] = row.is_active;
      return acc;
    }, {})
  );

  const normalizedRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        is_active: statusByTaxId[row.tax_id] ?? row.is_active,
      })),
    [rows, statusByTaxId]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Taxes</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure and manage tax rates, types, and accounts.
          </p>
        </div>
        <Button
          type="button"
          onClick={onCreateTax}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Tax
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-1/4 px-6 py-4 font-semibold">Tax Name</TableHead>
                <TableHead className="w-1/6 px-6 py-4 font-semibold">Tax Type</TableHead>
                <TableHead className="w-1/6 px-6 py-4 font-semibold">Rate (%)</TableHead>
                <TableHead className="w-1/4 px-6 py-4 font-semibold">Tax Account</TableHead>
                <TableHead className="w-1/6 px-6 py-4 text-center font-semibold">Status</TableHead>
                <TableHead className="w-12 px-6 py-4 font-semibold" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalizedRows.map((row) => (
                <TableRow
                  key={row.tax_id}
                  className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{row.tax_name}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{row.description}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`px-2.5 py-1 text-xs font-medium ${TAX_TYPE_CLASS[row.tax_type]}`}>
                      {row.tax_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-900 dark:text-gray-200">
                    {row.rate_percent}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">{row.tax_account}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{row.tax_account_description}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Switch
                      checked={row.is_active}
                      onCheckedChange={(next) =>
                        setStatusByTaxId((prev) => ({
                          ...prev,
                          [row.tax_id]: next,
                        }))
                      }
                      className="data-[state=checked]:bg-indigo-600"
                      aria-label={`Toggle status for ${row.tax_name}`}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {renderActions ? (
                      renderActions(row)
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                        onClick={() => onOpenActions?.(row)}
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open tax actions</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
