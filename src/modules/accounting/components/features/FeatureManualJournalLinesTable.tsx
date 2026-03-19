/** @format */

import { PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ManualJournalAccountOption,
  ManualJournalLineItem,
} from "../../types/journal";

type FeatureManualJournalLinesTableProps = {
  lines?: ManualJournalLineItem[];
  accountOptions?: ManualJournalAccountOption[];
  onChange?: (next: ManualJournalLineItem[]) => void;
};

function parseCurrencyInput(value: string) {
  const numericOnly = value.replace(/[^\d]/g, "");
  if (!numericOnly) {
    return 0;
  }
  return Number.parseInt(numericOnly, 10);
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US");
}

export function FeatureManualJournalLinesTable({
  lines = [],
  accountOptions = [],
  onChange,
}: FeatureManualJournalLinesTableProps) {
  const patch = (next: ManualJournalLineItem[]) => {
    onChange?.(next);
  };

  const patchLine = (
    lineId: string,
    updater: (line: ManualJournalLineItem) => ManualJournalLineItem,
  ) => {
    patch(
      lines.map((line) => (line.line_id === lineId ? updater(line) : line)),
    );
  };

  const addLine = () => {
    patch([
      ...lines,
      {
        line_id: `line-${Date.now()}`,
        account_code: accountOptions[0]?.value ?? "",
        label_description: "",
        debit_amount: 0,
        credit_amount: 0,
      },
    ]);
  };

  const removeLine = (lineId: string) => {
    if (lines.length <= 1) {
      return;
    }
    patch(lines.filter((line) => line.line_id !== lineId));
  };

  const totalDebit = lines.reduce((sum, line) => sum + line.debit_amount, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit_amount, 0);

  return (
    <Card
      className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700"
      data-testid="accounting-journal-create-lines-table"
    >
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <TableShell
            tableClassName="min-w-[800px]"
            columns={[
              {
                id: "account",
                header: <>Account</>,
                cell: ({ row, table }) => (
                  <Select
                    value={row.original.account_code}
                    onValueChange={(next) =>
                      patchLine(row.original.line_id, (current) => ({
                        ...current,
                        account_code: next,
                      }))
                    }
                  >
                    <SelectTrigger
                      data-testid={`accounting-journal-create-line-account-select-${row.original.line_id}`}
                      aria-label={`Account line ${table.getRowModel().rows.findIndex((item) => item.id === row.id) + 1}`}
                      className="bg-white text-sm dark:bg-slate-900"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ),
                meta: {
                  headerClassName:
                    "w-1/4 pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellClassName: "py-3 pr-4 align-top",
                },
              },
              {
                id: "description",
                header: <>Description</>,
                cell: ({ row }) => (
                  <Input
                    type="text"
                    placeholder="Description"
                    value={row.original.label_description}
                    data-testid={`accounting-journal-create-line-description-input-${row.original.line_id}`}
                    onChange={(event) =>
                      patchLine(row.original.line_id, (current) => ({
                        ...current,
                        label_description: event.target.value,
                      }))
                    }
                    className="bg-white text-sm dark:bg-slate-900"
                  />
                ),
                meta: {
                  headerClassName:
                    "pb-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellClassName: "py-3 pr-4 align-top",
                },
              },
              {
                id: "debit",
                header: <>Debit</>,
                cell: ({ row, table }) => {
                  const debitDisabled = row.original.credit_amount > 0;
                  const rowNumber =
                    table
                      .getRowModel()
                      .rows.findIndex((item) => item.id === row.id) + 1;

                  return (
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        Rp
                      </span>
                      <Input
                        type="text"
                        aria-label={`Debit line ${rowNumber}`}
                        value={formatCurrency(row.original.debit_amount)}
                        disabled={debitDisabled}
                        data-testid={`accounting-journal-create-line-debit-input-${row.original.line_id}`}
                        onChange={(event) =>
                          patchLine(row.original.line_id, (current) => {
                            const nextAmount = parseCurrencyInput(
                              event.target.value,
                            );
                            return {
                              ...current,
                              debit_amount: nextAmount,
                              credit_amount:
                                nextAmount > 0 ? 0 : current.credit_amount,
                            };
                          })
                        }
                        className="pl-9 text-right font-mono text-sm"
                      />
                    </div>
                  );
                },
                meta: {
                  headerClassName:
                    "w-32 pb-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellClassName: "py-3 pr-4 align-top",
                },
              },
              {
                id: "credit",
                header: <>Credit</>,
                cell: ({ row, table }) => {
                  const creditDisabled = row.original.debit_amount > 0;
                  const rowNumber =
                    table
                      .getRowModel()
                      .rows.findIndex((item) => item.id === row.id) + 1;

                  return (
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        Rp
                      </span>
                      <Input
                        type="text"
                        aria-label={`Credit line ${rowNumber}`}
                        value={formatCurrency(row.original.credit_amount)}
                        disabled={creditDisabled}
                        data-testid={`accounting-journal-create-line-credit-input-${row.original.line_id}`}
                        onChange={(event) =>
                          patchLine(row.original.line_id, (current) => {
                            const nextAmount = parseCurrencyInput(
                              event.target.value,
                            );
                            return {
                              ...current,
                              credit_amount: nextAmount,
                              debit_amount:
                                nextAmount > 0 ? 0 : current.debit_amount,
                            };
                          })
                        }
                        className="pl-9 text-right font-mono text-sm"
                      />
                    </div>
                  );
                },
                meta: {
                  headerClassName:
                    "w-32 pb-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase",
                  cellClassName: "py-3 pr-4 align-top",
                },
              },
              {
                id: "actions",
                header: "",
                cell: ({ row, table }) => {
                  const rowNumber =
                    table
                      .getRowModel()
                      .rows.findIndex((item) => item.id === row.id) + 1;

                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove line ${rowNumber}`}
                      data-testid={`accounting-journal-create-line-remove-button-${row.original.line_id}`}
                      onClick={() => removeLine(row.original.line_id)}
                      className="text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  );
                },
                meta: {
                  headerClassName: "w-10 pb-3",
                  cellClassName: "py-3 align-middle text-center",
                },
              },
            ]}
            data={lines}
            getRowId={(row) => row.line_id}
            headerRowClassName="border-b border-gray-200 dark:border-gray-700"
            bodyClassName="divide-y divide-gray-100 dark:divide-gray-800"
            rowHoverable={false}
            rowClassName="group border-0"
          />
        </div>

        <div className="mt-4">
          <Button
            type="button"
            variant="link"
            onClick={addLine}
            data-testid="accounting-journal-create-add-line-button"
            className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Line
          </Button>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="grid grid-cols-[1fr_160px_160px_40px] items-center gap-4 text-sm">
            <p className="text-right font-semibold text-gray-700 dark:text-gray-300">
              Total
            </p>
            <p className="text-right font-bold font-mono text-gray-900 dark:text-white">
              Rp {formatCurrency(totalDebit)}
            </p>
            <p className="text-right font-bold font-mono text-gray-900 dark:text-white">
              Rp {formatCurrency(totalCredit)}
            </p>
            <span />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
