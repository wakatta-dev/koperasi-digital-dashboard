/** @format */

import { Building2, Home, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { TaxIncomeTaxReportLine } from "../../types/tax";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function resolveToneStyle(tone: TaxIncomeTaxReportLine["tone"]) {
  switch (tone) {
    case "purple":
      return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
    case "orange":
      return "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
    default:
      return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
  }
}

function resolveToneIcon(tone: TaxIncomeTaxReportLine["tone"]) {
  switch (tone) {
    case "purple":
      return Building2;
    case "orange":
      return Home;
    default:
      return Users;
  }
}

type FeatureIncomeTaxReportCardProps = {
  lines: TaxIncomeTaxReportLine[];
  totalTaxPayable: number;
  onViewDetailedReport?: () => void;
};

export function FeatureIncomeTaxReportCard({
  lines,
  totalTaxPayable,
  onViewDetailedReport,
}: FeatureIncomeTaxReportCardProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <CardHeader className="pb-2">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          Income Tax Report
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lines.map((line) => {
            const Icon = resolveToneIcon(line.tone);
            return (
              <div
                key={line.key}
                className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${resolveToneStyle(line.tone)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{line.label}</p>
                    <p className="text-xs text-gray-500">{line.helper_text}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(line.value)}
                </span>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-500">Total Tax Payable</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
              {formatCurrency(totalTaxPayable)}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          onClick={onViewDetailedReport}
        >
          View Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
}
