/** @format */

import { AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type FeatureReconciliationDifferenceBannerProps = {
  label?: string;
};

export function FeatureReconciliationDifferenceBanner({
  label = "Unreconciled Difference: Rp 2,500,000",
}: FeatureReconciliationDifferenceBannerProps) {
  return (
    <Badge className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
      <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
      {label}
    </Badge>
  );
}
