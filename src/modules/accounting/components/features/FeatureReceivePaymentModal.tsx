/** @format */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FeaturePaymentCreateForm } from "./FeaturePaymentCreateForm";

type FeatureReceivePaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeatureReceivePaymentModal({
  open,
  onOpenChange,
}: FeatureReceivePaymentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-gray-200 p-0 dark:border-gray-700">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">
          <FeaturePaymentCreateForm
            onCancel={() => onOpenChange(false)}
            onSubmit={() => onOpenChange(false)}
            submitLabel="Record Payment"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
