/** @format */

import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FeatureBatchProcessingNoteProps = {
  totalToPay?: string;
};

export function FeatureBatchProcessingNote({
  totalToPay = "Rp 208.200.000",
}: FeatureBatchProcessingNoteProps) {
  return (
    <Alert className="border border-blue-100 bg-blue-50 p-4 text-blue-700 dark:border-blue-800 dark:bg-blue-900/10 dark:text-blue-300">
      <Info className="h-5 w-5 text-blue-500" />
      <AlertTitle className="text-sm font-semibold">Batch Processing Note</AlertTitle>
      <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
        Payments will be grouped by vendor where possible. Ensure your bank account has
        sufficient funds for the total amount of <strong>{totalToPay}</strong>.
      </AlertDescription>
    </Alert>
  );
}
