/** @format */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FeatureCreditNoteCreateForm } from "./FeatureCreditNoteCreateForm";

type FeatureCreditNoteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeatureCreditNoteModal({
  open,
  onOpenChange,
}: FeatureCreditNoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-gray-200 p-0 dark:border-gray-700">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Create Credit Note</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">
          <FeatureCreditNoteCreateForm
            onCancel={() => onOpenChange(false)}
            onSubmit={() => onOpenChange(false)}
            submitLabel="Create Credit Note"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
