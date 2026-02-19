/** @format */

"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/shared/inputs/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { INITIAL_CREATE_VENDOR_BILL_DRAFT } from "../../constants/vendor-bills-ap-initial-state";
import type {
  CreateVendorBillDraft,
  CreateVendorBillLineItem,
} from "../../types/vendor-bills-ap";

type FeatureCreateVendorBillModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (draft: CreateVendorBillDraft) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  vendorOptions?: string[];
};

export function FeatureCreateVendorBillModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  errorMessage,
  vendorOptions = [],
}: FeatureCreateVendorBillModalProps) {
  const [draft, setDraft] = useState<CreateVendorBillDraft>(INITIAL_CREATE_VENDOR_BILL_DRAFT);

  const computedTotals = useMemo(() => {
    const subtotalValue = draft.line_items.reduce((total, item) => {
      const amount = Number(item.amount.replace(/[^\d.-]/g, ""));
      return total + (Number.isNaN(amount) ? 0 : amount);
    }, 0);
    const taxValue = 0;

    return {
      subtotal: subtotalValue > 0 ? `Rp ${subtotalValue.toLocaleString("id-ID")}` : "Rp 0",
      tax: taxValue > 0 ? `Rp ${taxValue.toLocaleString("id-ID")}` : "Rp 0",
      total:
        subtotalValue + taxValue > 0
          ? `Rp ${(subtotalValue + taxValue).toLocaleString("id-ID")}`
          : "Rp 0",
    };
  }, [draft.line_items]);

  const updateLineItem = (
    lineId: string,
    updater: (current: CreateVendorBillLineItem) => CreateVendorBillLineItem
  ) => {
    setDraft((current) => ({
      ...current,
      line_items: current.line_items.map((line) => (line.id === lineId ? updater(line) : line)),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm"
        style={{ width: "80vw", maxWidth: "80vw" }}
        className="flex max-h-[90vh] min-h-0 flex-col gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-900"
      >
        <DialogHeader className="border-b border-gray-100 px-8 py-5 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Bill
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
            Record a new vendor invoice for processing.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Vendor <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={draft.vendor_name}
                placeholder="Type vendor name"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, vendor_name: event.target.value }))
                }
                className="border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-800"
                list="vendor-bill-vendor-options"
              />
              {vendorOptions.length > 0 ? (
                <datalist id="vendor-bill-vendor-options">
                  {vendorOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bill Number
              </label>
              <Input
                type="text"
                value={draft.bill_number}
                placeholder="e.g. INV-2024-001"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, bill_number: event.target.value }))
                }
                className="border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 italic dark:bg-gray-800">
                <div className="h-2 w-2 rounded-full bg-gray-400" /> Draft
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bill Date
              </label>
              <Input
                type="date"
                value={draft.bill_date}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, bill_date: event.target.value }))
                }
                className="border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <Input
                type="date"
                value={draft.due_date}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, due_date: event.target.value }))
                }
                className="border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Line Items</h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    line_items: [
                      ...current.line_items,
                      {
                        id: `draft-line-${Date.now()}`,
                        product_or_service: "",
                        description: "",
                        qty: "1",
                        price: "",
                        tax_name: "VAT 11%",
                        amount: "0.00",
                      },
                    ],
                  }))
                }
                className="h-auto p-0 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Line
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 text-[10px] tracking-wider text-gray-500 uppercase dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead className="w-48 px-4 py-3">Product/Service</TableHead>
                    <TableHead className="px-4 py-3">Description</TableHead>
                    <TableHead className="w-20 px-4 py-3 text-center">Qty</TableHead>
                    <TableHead className="w-32 px-4 py-3">Price</TableHead>
                    <TableHead className="w-28 px-4 py-3">Tax</TableHead>
                    <TableHead className="w-32 px-4 py-3 text-right">Amount</TableHead>
                    <TableHead className="w-10 px-4 py-3" />
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {draft.line_items.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="px-4 py-3">
                        <Input
                          value={line.product_or_service}
                          placeholder="Search product..."
                          onChange={(event) =>
                            updateLineItem(line.id, (current) => ({
                              ...current,
                              product_or_service: event.target.value,
                            }))
                          }
                          className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Input
                          value={line.description}
                          placeholder="Detailed description..."
                          onChange={(event) =>
                            updateLineItem(line.id, (current) => ({
                              ...current,
                              description: event.target.value,
                            }))
                          }
                          className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Input
                          value={line.qty}
                          type="number"
                          onChange={(event) =>
                            updateLineItem(line.id, (current) => ({
                              ...current,
                              qty: event.target.value,
                            }))
                          }
                          className="border-none bg-transparent p-0 text-center text-sm shadow-none focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Input
                          value={line.price}
                          placeholder="0.00"
                          onChange={(event) =>
                            updateLineItem(line.id, (current) => ({
                              ...current,
                              price: event.target.value,
                              amount: event.target.value || "0",
                            }))
                          }
                          className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                          <Select
                          value={line.tax_name || "__empty"}
                          onValueChange={(value) =>
                            updateLineItem(line.id, (current) => ({
                              ...current,
                              tax_name: value === "__empty" ? "" : value,
                            }))
                          }
                        >
                          <SelectTrigger className="h-auto border-none bg-transparent p-0 text-sm shadow-none focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__empty">No tax</SelectItem>
                            <SelectItem value="VAT 11%">VAT 11%</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        {line.amount || "0.00"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              line_items:
                                current.line_items.length === 1
                                  ? current.line_items
                                  : current.line_items.filter((item) => item.id !== line.id),
                            }))
                          }
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          aria-label={`Remove line ${line.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col items-end gap-2 text-sm">
              <div className="flex w-48 justify-between py-1">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{computedTotals.subtotal}</span>
              </div>
              <div className="flex w-48 justify-between py-1">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">{computedTotals.tax}</span>
              </div>
              <div className="flex w-48 justify-between border-t border-gray-100 py-2 dark:border-gray-700">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-indigo-600">{computedTotals.total}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Attachments
            </label>
            <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
                <UploadCloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {draft.attachments.label}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {draft.attachments.helper_text}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-8 py-5 dark:border-gray-700 dark:bg-gray-800/50">
          {errorMessage ? (
            <p className="mr-auto rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit?.(draft)}
            disabled={isSubmitting}
            className="bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
          >
            {isSubmitting ? "Saving..." : "Save Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
