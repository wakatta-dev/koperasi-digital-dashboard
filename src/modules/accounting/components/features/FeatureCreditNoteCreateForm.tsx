/** @format */

"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_CREDIT_NOTE_DRAFT } from "../../constants/dummy-data";

type CreditLine = {
  id: string;
  item_name: string;
  qty: number;
  rate: string;
};

export type FeatureCreditNoteCreateSubmitPayload = {
  customer_name: string;
  credit_note_date: string;
  original_invoice_reference: string;
  reason_for_credit: string;
  items: Array<{
    item_name: string;
    qty: number;
    rate: string;
  }>;
};

type FeatureCreditNoteCreateFormProps = {
  onCancel?: () => void;
  onSubmit?: (payload: FeatureCreditNoteCreateSubmitPayload) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function FeatureCreditNoteCreateForm({
  onCancel,
  onSubmit,
  submitLabel = "Create Credit Note",
  isSubmitting = false,
  errorMessage,
}: FeatureCreditNoteCreateFormProps) {
  const [customer, setCustomer] = useState(DUMMY_CREDIT_NOTE_DRAFT.customer);
  const [creditNoteDate, setCreditNoteDate] = useState(DUMMY_CREDIT_NOTE_DRAFT.credit_note_date);
  const [invoiceRef, setInvoiceRef] = useState(DUMMY_CREDIT_NOTE_DRAFT.original_invoice_reference);
  const [reason, setReason] = useState(DUMMY_CREDIT_NOTE_DRAFT.reason_for_credit);
  const [items, setItems] = useState<CreditLine[]>([
    { id: "credit-item-1", item_name: "", qty: 1, rate: "" },
  ]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const rate = Number(item.rate.replaceAll(",", "")) || 0;
      return sum + item.qty * rate;
    }, 0);

    const tax = subtotal * 0.11;
    const totalCredit = subtotal + tax;

    return {
      subtotal,
      tax,
      totalCredit,
    };
  }, [items]);

  const addItem = () => {
    setItems((current) => [...current, { id: `credit-item-${Date.now()}`, item_name: "", qty: 1, rate: "" }]);
  };

  const updateItem = (id: string, key: keyof CreditLine, value: string | number) => {
    setItems((current) =>
      current.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({
      customer_name: customer,
      credit_note_date: creditNoteDate,
      original_invoice_reference: invoiceRef,
      reason_for_credit: reason,
      items: items.map((item) => ({
        item_name: item.item_name,
        qty: item.qty,
        rate: item.rate,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Credit Note</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Customer <span className="text-red-500">*</span>
              </label>
              <Select value={customer || "__empty"} onValueChange={(value) => setCustomer(value === "__empty" ? "" : value)}>
                <SelectTrigger className="bg-gray-50 text-sm dark:bg-gray-800">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__empty">Select a customer</SelectItem>
                  <SelectItem value="PT. Suka Maju">PT. Suka Maju</SelectItem>
                  <SelectItem value="CV. Abadi Jaya">CV. Abadi Jaya</SelectItem>
                  <SelectItem value="Tech Solutions Inc">Tech Solutions Inc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Credit Note Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={creditNoteDate}
                onChange={(event) => setCreditNoteDate(event.target.value)}
                className="bg-gray-50 text-sm dark:bg-gray-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Original Invoice Reference <span className="font-normal text-gray-400">(Optional)</span>
              </label>
              <Input
                value={invoiceRef}
                onChange={(event) => setInvoiceRef(event.target.value)}
                placeholder="e.g. INV-2023-108"
                className="bg-gray-50 text-sm dark:bg-gray-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reason for Credit <span className="text-red-500">*</span>
              </label>
              <Select value={reason || "__empty"} onValueChange={(value) => setReason(value === "__empty" ? "" : value)}>
                <SelectTrigger className="bg-gray-50 text-sm dark:bg-gray-800">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__empty">Select reason</SelectItem>
                  <SelectItem value="Product Return">Product Return</SelectItem>
                  <SelectItem value="Post-billing Discount">Post-billing Discount</SelectItem>
                  <SelectItem value="Correction in Invoice">Correction in Invoice</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Items to be Credited
              </h3>
              <Button type="button" variant="ghost" className="gap-1 p-0 text-xs font-semibold text-indigo-600" onClick={addItem}>
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead className="px-4 py-3">Item Details</TableHead>
                    <TableHead className="w-24 px-4 py-3">Qty</TableHead>
                    <TableHead className="w-32 px-4 py-3 text-right">Rate</TableHead>
                    <TableHead className="w-32 px-4 py-3 text-right">Amount</TableHead>
                    <TableHead className="w-12 px-4 py-3 text-center" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const rate = Number(item.rate.replaceAll(",", "")) || 0;
                    const amount = item.qty * rate;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="px-4 py-3">
                          <Input
                            value={item.item_name}
                            onChange={(event) => updateItem(item.id, "item_name", event.target.value)}
                            placeholder="Type item name..."
                            className="border-none bg-transparent p-0 shadow-none"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(event) => updateItem(item.id, "qty", Number(event.target.value || "0"))}
                            className="border-none bg-transparent p-0 shadow-none"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Input
                            value={item.rate}
                            onChange={(event) => updateItem(item.id, "rate", event.target.value)}
                            placeholder="0.00"
                            className="border-none bg-transparent p-0 text-right shadow-none"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                          {`Rp ${amount.toLocaleString("id-ID")}`}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove credit item ${item.id}`}
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

          <div className="flex flex-col items-end space-y-2 pt-4">
            <div className="flex w-64 justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">Rp {totals.subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex w-64 justify-between border-b border-gray-200 pb-2 text-sm dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Tax (11%)</span>
              <span className="font-medium">Rp {totals.tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex w-64 justify-between pt-2">
              <span className="text-base font-bold text-gray-900 dark:text-white">Total Credit</span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                Rp {totals.totalCredit.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            {errorMessage ? (
              <p className="mr-auto text-sm font-medium text-red-600">{errorMessage}</p>
            ) : null}
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
