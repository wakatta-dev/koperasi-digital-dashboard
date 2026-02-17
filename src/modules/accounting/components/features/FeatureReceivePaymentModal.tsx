/** @format */

"use client";

import { Banknote, Calendar, CreditCard, User, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

import { DUMMY_PAYMENT_DRAFT } from "../../constants/dummy-data";

type FeatureReceivePaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type OutstandingInvoice = {
  invoice_number: string;
  due_date: string;
  amount_due: string;
};

const OUTSTANDING_INVOICES: OutstandingInvoice[] = [
  {
    invoice_number: "INV-2023-112",
    due_date: "Nov 24, 2023",
    amount_due: "Rp 25.000.000",
  },
  {
    invoice_number: "INV-2023-098",
    due_date: "Nov 10, 2023",
    amount_due: "Rp 12.450.000",
  },
];

export function FeatureReceivePaymentModal({
  open,
  onOpenChange,
}: FeatureReceivePaymentModalProps) {
  const [customer, setCustomer] = useState(DUMMY_PAYMENT_DRAFT.customer);
  const [paymentDate, setPaymentDate] = useState(DUMMY_PAYMENT_DRAFT.payment_date);
  const [paymentMethod, setPaymentMethod] = useState(DUMMY_PAYMENT_DRAFT.payment_method);
  const [destinationAccount, setDestinationAccount] = useState(
    DUMMY_PAYMENT_DRAFT.destination_account
  );
  const [amountReceived, setAmountReceived] = useState(DUMMY_PAYMENT_DRAFT.amount_received);
  const [selectedInvoiceNumbers, setSelectedInvoiceNumbers] = useState<string[]>(
    DUMMY_PAYMENT_DRAFT.selected_invoice_numbers
  );

  const allChecked =
    OUTSTANDING_INVOICES.length > 0 &&
    OUTSTANDING_INVOICES.every((item) => selectedInvoiceNumbers.includes(item.invoice_number));

  const selectedCount = useMemo(
    () => selectedInvoiceNumbers.length,
    [selectedInvoiceNumbers]
  );

  const toggleInvoice = (invoiceNumber: string, checked: boolean) => {
    setSelectedInvoiceNumbers((current) => {
      if (checked) return Array.from(new Set([...current, invoiceNumber]));
      return current.filter((item) => item !== invoiceNumber);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-slate-900/60 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Record Payment
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                Receive payment from customer for outstanding invoices
              </DialogDescription>
            </div>
          </div>

          <Button type="button" variant="ghost" size="icon" className="text-gray-400" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Customer
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger className="bg-gray-50 pl-10 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PT. Maju Bersama">PT. Maju Bersama</SelectItem>
                    <SelectItem value="CV. Abadi Jaya">CV. Abadi Jaya</SelectItem>
                    <SelectItem value="Tech Solutions Inc">Tech Solutions Inc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Payment Date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                  className="bg-gray-50 pl-10 dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Payment Method
              </label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-gray-50 pl-10 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Destination Account
              </label>
              <div className="relative">
                <Banknote className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Select value={destinationAccount} onValueChange={setDestinationAccount}>
                  <SelectTrigger className="bg-gray-50 pl-10 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Central Asia - 12209301">Bank Central Asia - 12209301</SelectItem>
                    <SelectItem value="Petty Cash">Petty Cash</SelectItem>
                    <SelectItem value="Mandiri - 4452010">Mandiri - 4452010</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Amount Received
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-gray-400">Rp</span>
                <Input
                  value={amountReceived}
                  onChange={(event) => setAmountReceived(event.target.value)}
                  className="bg-gray-50 pl-10 font-bold dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="col-span-2 pt-2">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-bold text-gray-900 dark:text-white">Pay Against Invoices</label>
                <Badge className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:bg-indigo-900/40">
                  {selectedCount} Outstanding
                </Badge>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow>
                      <TableHead className="px-4 py-2.5">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(checked) => {
                            setSelectedInvoiceNumbers(
                              checked
                                ? OUTSTANDING_INVOICES.map((item) => item.invoice_number)
                                : []
                            );
                          }}
                          aria-label="Select all outstanding invoices"
                        />
                      </TableHead>
                      <TableHead className="px-4 py-2.5">Invoice #</TableHead>
                      <TableHead className="px-4 py-2.5">Due Date</TableHead>
                      <TableHead className="px-4 py-2.5 text-right">Amount Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OUTSTANDING_INVOICES.map((item) => {
                      const selected = selectedInvoiceNumbers.includes(item.invoice_number);
                      return (
                        <TableRow key={item.invoice_number} className={selected ? "bg-indigo-50/30 dark:bg-indigo-900/10" : undefined}>
                          <TableCell className="px-4 py-3">
                            <Checkbox
                              checked={selected}
                              onCheckedChange={(checked) => toggleInvoice(item.invoice_number, Boolean(checked))}
                              aria-label={`Select ${item.invoice_number}`}
                            />
                          </TableCell>
                          <TableCell className={`px-4 py-3 font-medium ${selected ? "text-indigo-600" : "text-gray-900 dark:text-white"}`}>
                            {item.invoice_number}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500">{item.due_date}</TableCell>
                          <TableCell className="px-4 py-3 text-right font-bold">{item.amount_due}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-gray-700 dark:bg-gray-800/30">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
