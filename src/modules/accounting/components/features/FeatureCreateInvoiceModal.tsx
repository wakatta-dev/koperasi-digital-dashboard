/** @format */

"use client";

import { Plus, Trash2, X, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DUMMY_INVOICE_DRAFT } from "../../constants/dummy-data";
import type { InvoiceLineItem } from "../../types/invoicing-ar";

type FeatureCreateInvoiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeatureCreateInvoiceModal({
  open,
  onOpenChange,
}: FeatureCreateInvoiceModalProps) {
  const [customerQuery, setCustomerQuery] = useState(DUMMY_INVOICE_DRAFT.customer_query);
  const [invoiceDate, setInvoiceDate] = useState(DUMMY_INVOICE_DRAFT.invoice_date);
  const [dueDate, setDueDate] = useState(DUMMY_INVOICE_DRAFT.due_date);
  const [notes, setNotes] = useState(DUMMY_INVOICE_DRAFT.internal_notes);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(DUMMY_INVOICE_DRAFT.line_items);

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, row) => {
      const normalized = Number(row.price.replaceAll(",", "")) || 0;
      return sum + row.qty * normalized;
    }, 0);
    const tax = subtotal * 0.11;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toLocaleString("id-ID"),
      tax: tax.toLocaleString("id-ID"),
      total: total.toLocaleString("id-ID"),
    };
  }, [lineItems]);

  const addLineItem = () => {
    setLineItems((current) => [
      ...current,
      {
        id: `line-${Date.now()}`,
        product_or_service: "",
        description: "",
        qty: 1,
        price: "0",
        tax: "11%",
        line_total: "0",
      },
    ]);
  };

  const updateLineItem = (id: string, key: keyof InvoiceLineItem, value: string | number) => {
    setLineItems((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        return {
          ...row,
          [key]: value,
        };
      })
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-5xl overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/60 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Invoice
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                Generate a new customer billing statement
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-8 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Customer
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={customerQuery}
                  onChange={(event) => setCustomerQuery(event.target.value)}
                  placeholder="Search customer..."
                  className="bg-gray-50 pl-10 dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Invoice Number
              </label>
              <Input value={DUMMY_INVOICE_DRAFT.invoice_number} disabled className="bg-gray-100 dark:bg-gray-900" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Invoice Date
              </label>
              <Input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} className="bg-gray-50 dark:bg-gray-800" />
            </div>
            <div className="md:col-start-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="bg-gray-50 dark:bg-gray-800" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Line Items
              </h3>
              <Button type="button" variant="ghost" className="gap-1 p-0 text-xs font-semibold text-indigo-600 hover:text-indigo-700" onClick={addLineItem}>
                <Plus className="h-4 w-4" />
                Add Line Item
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead className="px-4 py-3 text-xs uppercase">Product / Service</TableHead>
                    <TableHead className="px-4 py-3 text-xs uppercase">Description</TableHead>
                    <TableHead className="px-4 py-3 text-center text-xs uppercase">Qty</TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs uppercase">Price</TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs uppercase">Tax (PPN)</TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs uppercase">Total</TableHead>
                    <TableHead className="w-10 px-4 py-3" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((row) => {
                    const price = Number(row.price.replaceAll(",", "")) || 0;
                    const rowTotal = price * row.qty * 1.11;
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="px-4 py-3">
                          <Select
                            value={row.product_or_service || "__empty"}
                            onValueChange={(value) =>
                              updateLineItem(row.id, "product_or_service", value === "__empty" ? "" : value)
                            }
                          >
                            <SelectTrigger className="border-none bg-transparent px-0 text-sm shadow-none">
                              <SelectValue placeholder="Select product or service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__empty">Select product or service</SelectItem>
                              <SelectItem value="Cloud Infrastructure - Tier 2">Cloud Infrastructure - Tier 2</SelectItem>
                              <SelectItem value="Onboarding Support">Onboarding Support</SelectItem>
                              <SelectItem value="Consulting Fee">Consulting Fee</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Input
                            value={row.description}
                            onChange={(event) => updateLineItem(row.id, "description", event.target.value)}
                            className="border-none bg-transparent px-0 shadow-none"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Input
                            type="number"
                            value={row.qty}
                            onChange={(event) =>
                              updateLineItem(row.id, "qty", Number(event.target.value || "0"))
                            }
                            className="border-none bg-transparent px-0 text-center shadow-none"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Input
                            value={row.price}
                            onChange={(event) => updateLineItem(row.id, "price", event.target.value)}
                            className="border-none bg-transparent px-0 text-right shadow-none"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Select
                            value={row.tax}
                            onValueChange={(value) => updateLineItem(row.id, "tax", value)}
                          >
                            <SelectTrigger className="border-none bg-transparent px-0 text-right shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="11%">11%</SelectItem>
                              <SelectItem value="0%">0%</SelectItem>
                              <SelectItem value="Exempt">Exempt</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                          {rowTotal.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => removeLineItem(row.id)}
                            aria-label={`Remove line item ${row.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Internal Notes
              </label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any notes for internal reference..."
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-3 md:ml-auto md:w-72">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{totals.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAT (11%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{totals.tax}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-black text-indigo-600">{totals.total}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
