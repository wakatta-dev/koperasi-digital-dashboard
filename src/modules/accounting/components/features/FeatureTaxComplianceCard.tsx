/** @format */

import { CheckCircle2, Circle, ShieldCheck, XCircle } from "lucide-react";

import type { TaxComplianceStep } from "../../types/tax";

type FeatureTaxComplianceCardProps = {
  periodLabel: string;
  steps: TaxComplianceStep[];
  deadline: string;
};

function resolveStatusIcon(status: TaxComplianceStep["status"]) {
  switch (status) {
    case "Completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-300" />;
    case "Failed":
      return <XCircle className="h-4 w-4 text-red-300" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
}

function resolveStatusClass(status: TaxComplianceStep["status"]) {
  if (status === "Pending") {
    return "opacity-70";
  }
  return "opacity-100";
}

export function FeatureTaxComplianceCard({
  periodLabel,
  steps,
  deadline,
}: FeatureTaxComplianceCardProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">Tax Compliance</h3>
          <p className="mt-1 text-sm text-indigo-200">Status for {periodLabel}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.key} className={`flex items-center gap-2 text-sm ${resolveStatusClass(step.status)}`}>
            {resolveStatusIcon(step.status)}
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-white/20 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-indigo-100">Deadline</span>
          <span className="font-bold text-white">{deadline}</span>
        </div>
      </div>
    </div>
  );
}
