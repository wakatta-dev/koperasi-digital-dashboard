/** @format */

"use client";

import { Banknote, Calendar, CreditCard, User } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/shared/inputs/input";
import { TableShell } from "@/components/shared/data-display/TableShell";

import { INITIAL_PAYMENT_DRAFT } from "../../constants/invoicing-ar-initial-state";

export type FeaturePaymentCreateSubmitPayload = {
  customer_name: string;
  payment_date: string;
  payment_method: string;
  destination_account: string;
  amount_received: string;
  selected_invoice_numbers: string[];
};

export type OutstandingInvoiceOption = {
  invoice_number: string;
  due_date: string;
  amount_due: string;
};

type FeaturePaymentCreateFormProps = {
  onCancel?: () => void;
  onSubmit?: (payload: FeaturePaymentCreateSubmitPayload) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  outstandingInvoices?: OutstandingInvoiceOption[];
  customerOptions?: string[];
  paymentMethodOptions?: string[];
  destinationAccountOptions?: string[];
};

const EMPTY_OUTSTANDING_INVOICES: OutstandingInvoiceOption[] = [];
const EMPTY_CUSTOMER_OPTIONS: string[] = [];
const EMPTY_PAYMENT_METHOD_OPTIONS: string[] = [];
const EMPTY_DESTINATION_ACCOUNT_OPTIONS: string[] = [];

export function FeaturePaymentCreateForm({
  onCancel,
  onSubmit,
  submitLabel = "Record Payment",
  isSubmitting = false,
  errorMessage,
  outstandingInvoices = EMPTY_OUTSTANDING_INVOICES,
  customerOptions = EMPTY_CUSTOMER_OPTIONS,
  paymentMethodOptions = EMPTY_PAYMENT_METHOD_OPTIONS,
  destinationAccountOptions = EMPTY_DESTINATION_ACCOUNT_OPTIONS,
}: FeaturePaymentCreateFormProps) {
  const [customer, setCustomer] = useState(INITIAL_PAYMENT_DRAFT.customer);
  const [paymentDate, setPaymentDate] = useState(
    INITIAL_PAYMENT_DRAFT.payment_date,
  );
  const [paymentMethod, setPaymentMethod] = useState(
    INITIAL_PAYMENT_DRAFT.payment_method,
  );
  const [destinationAccount, setDestinationAccount] = useState(
    INITIAL_PAYMENT_DRAFT.destination_account,
  );
  const [amountReceived, setAmountReceived] = useState(
    INITIAL_PAYMENT_DRAFT.amount_received,
  );
  const [selectedInvoiceNumbers, setSelectedInvoiceNumbers] = useState<
    string[]
  >(INITIAL_PAYMENT_DRAFT.selected_invoice_numbers);

  const allChecked =
    outstandingInvoices.length > 0 &&
    outstandingInvoices.every((item) =>
      selectedInvoiceNumbers.includes(item.invoice_number),
    );

  const selectedCount = useMemo(
    () => selectedInvoiceNumbers.length,
    [selectedInvoiceNumbers],
  );

  const toggleInvoice = (invoiceNumber: string, checked: boolean) => {
    setSelectedInvoiceNumbers((current) => {
      if (checked) return Array.from(new Set([...current, invoiceNumber]));
      return current.filter((item) => item !== invoiceNumber);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({
      customer_name: customer,
      payment_date: paymentDate,
      payment_method: paymentMethod,
      destination_account: destinationAccount,
      amount_received: amountReceived,
      selected_invoice_numbers: selectedInvoiceNumbers,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Record Payment
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receive payment from customer for outstanding invoices
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="payment-create-customer"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Customer
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="payment-create-customer"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  className="bg-gray-50 pl-10 dark:bg-gray-800"
                  placeholder="Customer name"
                  list="payment-customer-options"
                />
                {customerOptions.length > 0 ? (
                  <datalist id="payment-customer-options">
                    {customerOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="payment-create-date"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Payment Date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="payment-create-date"
                  type="date"
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                  className="bg-gray-50 pl-10 dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="payment-create-method"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Payment Method
              </label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="payment-create-method"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="bg-gray-50 pl-10 dark:bg-gray-800"
                  placeholder="Payment method"
                  list="payment-method-options"
                />
                {paymentMethodOptions.length > 0 ? (
                  <datalist id="payment-method-options">
                    {paymentMethodOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="payment-create-destination-account"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Destination Account
              </label>
              <div className="relative">
                <Banknote className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="payment-create-destination-account"
                  value={destinationAccount}
                  onChange={(event) =>
                    setDestinationAccount(event.target.value)
                  }
                  className="bg-gray-50 pl-10 dark:bg-gray-800"
                  placeholder="Destination account"
                  list="payment-destination-options"
                />
                {destinationAccountOptions.length > 0 ? (
                  <datalist id="payment-destination-options">
                    {destinationAccountOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="payment-create-amount"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Amount Received
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-gray-400">
                  Rp
                </span>
                <Input
                  id="payment-create-amount"
                  value={amountReceived}
                  onChange={(event) => setAmountReceived(event.target.value)}
                  className="bg-gray-50 pl-10 font-bold dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Pay Against Invoices
                </span>
                <Badge className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:bg-indigo-900/40">
                  {selectedCount} Outstanding
                </Badge>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                <TableShell
                  columns={[
                    {
                      id: "selected",
                      header: (
                        <>
                          <Checkbox
                            checked={allChecked}
                            onCheckedChange={(checked) => {
                              setSelectedInvoiceNumbers(
                                checked
                                  ? outstandingInvoices.map(
                                      (item) => item.invoice_number,
                                    )
                                  : [],
                              );
                            }}
                            aria-label="Select all outstanding invoices"
                          />
                        </>
                      ),
                      cell: ({ row }) => {
                        const selected = selectedInvoiceNumbers.includes(
                          row.original.invoice_number,
                        );

                        return (
                          <Checkbox
                            checked={selected}
                            onCheckedChange={(checked) =>
                              toggleInvoice(
                                row.original.invoice_number,
                                Boolean(checked),
                              )
                            }
                            aria-label={`Select ${row.original.invoice_number}`}
                          />
                        );
                      },
                      meta: {
                        headerClassName: "px-4 py-2.5",
                        cellClassName: "px-4 py-3",
                      },
                    },
                    {
                      id: "invoice_number",
                      header: <>Invoice #</>,
                      cell: ({ row }) => {
                        const selected = selectedInvoiceNumbers.includes(
                          row.original.invoice_number,
                        );

                        return (
                          <span
                            className={
                              selected
                                ? "text-indigo-600"
                                : "text-gray-900 dark:text-white"
                            }
                          >
                            {row.original.invoice_number}
                          </span>
                        );
                      },
                      meta: {
                        headerClassName: "px-4 py-2.5",
                        cellClassName: "px-4 py-3 font-medium",
                      },
                    },
                    {
                      id: "due_date",
                      header: <>Due Date</>,
                      meta: {
                        headerClassName: "px-4 py-2.5",
                        cellClassName: "px-4 py-3 text-gray-500",
                      },
                    },
                    {
                      id: "amount_due",
                      header: <>Amount Due</>,
                      meta: {
                        headerClassName: "px-4 py-2.5 text-right",
                        cellClassName: "px-4 py-3 text-right font-bold",
                      },
                    },
                  ]}
                  data={outstandingInvoices}
                  getRowId={(row) => row.invoice_number}
                  headerClassName="bg-gray-50 dark:bg-gray-800/50"
                  emptyState="No outstanding invoices available."
                  rowClassName={(row) =>
                    selectedInvoiceNumbers.includes(row.invoice_number)
                      ? "bg-indigo-50/30 dark:bg-indigo-900/10"
                      : undefined
                  }
                />
              </div>
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
