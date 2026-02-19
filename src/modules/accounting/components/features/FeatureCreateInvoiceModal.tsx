/** @format */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FeatureCreateInvoiceForm } from "./FeatureCreateInvoiceForm";

type FeatureCreateInvoiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeatureCreateInvoiceModal({
  open,
  onOpenChange,
}: FeatureCreateInvoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-gray-200 p-0 dark:border-gray-700">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">
          <FeatureCreateInvoiceForm
            onCancel={() => onOpenChange(false)}
            onSubmit={() => onOpenChange(false)}
            submitLabel="Create Invoice"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
