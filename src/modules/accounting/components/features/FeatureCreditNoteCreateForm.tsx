/** @format */

"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/shared/inputs/input";
import { TableShell } from "@/components/shared/data-display/TableShell";

import { INITIAL_CREDIT_NOTE_DRAFT } from "../../constants/invoicing-ar-initial-state";

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
  customerOptions?: string[];
  invoiceReferenceOptions?: string[];
};

const EMPTY_CUSTOMER_OPTIONS: string[] = [];
const EMPTY_INVOICE_REFERENCE_OPTIONS: string[] = [];

export function FeatureCreditNoteCreateForm({
  onCancel,
  onSubmit,
  submitLabel = "Create Credit Note",
  isSubmitting = false,
  errorMessage,
  customerOptions = EMPTY_CUSTOMER_OPTIONS,
  invoiceReferenceOptions = EMPTY_INVOICE_REFERENCE_OPTIONS,
}: FeatureCreditNoteCreateFormProps) {
  const [customer, setCustomer] = useState(INITIAL_CREDIT_NOTE_DRAFT.customer);
  const [creditNoteDate, setCreditNoteDate] = useState(
    INITIAL_CREDIT_NOTE_DRAFT.credit_note_date,
  );
  const [invoiceRef, setInvoiceRef] = useState(
    INITIAL_CREDIT_NOTE_DRAFT.original_invoice_reference,
  );
  const [reason, setReason] = useState(
    INITIAL_CREDIT_NOTE_DRAFT.reason_for_credit,
  );
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
    setItems((current) => [
      ...current,
      { id: `credit-item-${Date.now()}`, item_name: "", qty: 1, rate: "" },
    ]);
  };

  const updateItem = (
    id: string,
    key: keyof CreditLine,
    value: string | number,
  ) => {
    setItems((current) =>
      current.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) =>
      current.length > 1 ? current.filter((row) => row.id !== id) : current,
    );
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              New Credit Note
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="credit-note-customer"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Customer <span className="text-red-500">*</span>
              </label>
              <Input
                id="credit-note-customer"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="Type customer name"
                className="bg-gray-50 text-sm dark:bg-gray-800"
                list="credit-note-customer-options"
              />
              {customerOptions.length > 0 ? (
                <datalist id="credit-note-customer-options">
                  {customerOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="credit-note-date"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Credit Note Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="credit-note-date"
                type="date"
                value={creditNoteDate}
                onChange={(event) => setCreditNoteDate(event.target.value)}
                className="bg-gray-50 text-sm dark:bg-gray-800"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="credit-note-invoice-ref"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Original Invoice Reference{" "}
                <span className="font-normal text-gray-400">(Optional)</span>
              </label>
              <Input
                id="credit-note-invoice-ref"
                value={invoiceRef}
                onChange={(event) => setInvoiceRef(event.target.value)}
                placeholder="e.g. INV-2023-108"
                className="bg-gray-50 text-sm dark:bg-gray-800"
                list="credit-note-invoice-options"
              />
              {invoiceReferenceOptions.length > 0 ? (
                <datalist id="credit-note-invoice-options">
                  {invoiceReferenceOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="credit-note-reason"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Reason for Credit <span className="text-red-500">*</span>
              </label>
              <Input
                id="credit-note-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Describe credit reason"
                className="bg-gray-50 text-sm dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Items to be Credited
              </h3>
              <Button
                type="button"
                variant="ghost"
                className="gap-1 p-0 text-xs font-semibold text-indigo-600"
                onClick={addItem}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <TableShell
                columns={[
                  {
                    id: "item_name",
                    header: <>Item Details</>,
                    cell: ({ row }) => (
                      <Input
                        value={row.original.item_name}
                        onChange={(event) =>
                          updateItem(
                            row.original.id,
                            "item_name",
                            event.target.value,
                          )
                        }
                        placeholder="Type item name..."
                        className="border-none bg-transparent p-0 shadow-none"
                      />
                    ),
                    meta: {
                      headerClassName: "px-4 py-3",
                      cellClassName: "px-4 py-3",
                    },
                  },
                  {
                    id: "qty",
                    header: <>Qty</>,
                    cell: ({ row }) => (
                      <Input
                        type="number"
                        value={row.original.qty}
                        onChange={(event) =>
                          updateItem(
                            row.original.id,
                            "qty",
                            Number(event.target.value || "0"),
                          )
                        }
                        className="border-none bg-transparent p-0 shadow-none"
                      />
                    ),
                    meta: {
                      headerClassName: "w-24 px-4 py-3",
                      cellClassName: "px-4 py-3",
                    },
                  },
                  {
                    id: "rate",
                    header: <>Rate</>,
                    cell: ({ row }) => (
                      <Input
                        value={row.original.rate}
                        onChange={(event) =>
                          updateItem(
                            row.original.id,
                            "rate",
                            event.target.value,
                          )
                        }
                        placeholder="0.00"
                        className="border-none bg-transparent p-0 text-right shadow-none"
                      />
                    ),
                    meta: {
                      headerClassName: "w-32 px-4 py-3 text-right",
                      cellClassName: "px-4 py-3",
                    },
                  },
                  {
                    id: "amount",
                    header: <>Amount</>,
                    cell: ({ row }) => {
                      const rate =
                        Number(row.original.rate.replaceAll(",", "")) || 0;
                      const amount = row.original.qty * rate;

                      return `Rp ${amount.toLocaleString("id-ID")}`;
                    },
                    meta: {
                      headerClassName: "w-32 px-4 py-3 text-right",
                      cellClassName:
                        "px-4 py-3 text-right font-medium text-gray-900 dark:text-white",
                    },
                  },
                  {
                    id: "actions",
                    header: "",
                    cell: ({ row }) => (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(row.original.id)}
                        aria-label={`Remove credit item ${row.original.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ),
                    meta: {
                      headerClassName: "w-12 px-4 py-3 text-center",
                      cellClassName: "px-4 py-3 text-center",
                    },
                  },
                ]}
                data={items}
                getRowId={(row) => row.id}
                headerClassName="bg-gray-50 dark:bg-gray-800/50"
                rowHoverable={false}
              />
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2 pt-4">
            <div className="flex w-64 justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">
                Rp {totals.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex w-64 justify-between border-b border-gray-200 pb-2 text-sm dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">
                Tax (11%)
              </span>
              <span className="font-medium">
                Rp {totals.tax.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex w-64 justify-between pt-2">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                Total Credit
              </span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                Rp {totals.totalCredit.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            {errorMessage ? (
              <p className="mr-auto text-sm font-medium text-red-600">
                {errorMessage}
              </p>
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
