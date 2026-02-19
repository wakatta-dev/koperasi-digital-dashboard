/** @format */

import { CheckCircle2, Download, Home, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import type { PaymentConfirmationModel } from "../../types/vendor-bills-ap";

type FeaturePaymentSchedulingSuccessCardProps = {
  confirmation: PaymentConfirmationModel;
  onDone?: () => void;
};

export function FeaturePaymentSchedulingSuccessCard({
  confirmation,
  onDone,
}: FeaturePaymentSchedulingSuccessCardProps) {
  return (
    <Card className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pembayaran Berhasil!</h2>
          <p className="mx-auto max-w-sm text-gray-500 dark:text-gray-400">
            Payment of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {confirmation.total_paid}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {confirmation.bill_count_label}
            </span>{" "}
            has been successfully scheduled.
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800/50">
          <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Bill Detail Breakdown
          </p>
          <div className="space-y-2">
            {confirmation.bill_breakdowns.length === 0 ? (
              <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900">
                Tidak ada detail bill untuk batch ini.
              </div>
            ) : null}
            {confirmation.bill_breakdowns.map((item) => (
              <div
                key={item.bill_number}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.bill_number}
                  </span>
                  <span className="text-xs text-gray-500">{item.vendor_name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={onDone}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 dark:shadow-indigo-900/20"
          >
            Done
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-xl border-gray-200 py-2.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-xl border-gray-200 py-2.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t border-gray-100 bg-gray-50/50 px-8 py-4 dark:border-gray-700 dark:bg-gray-800/30">
        <p className="flex items-center gap-1 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          {confirmation.security_note || "Transaction status provided by backend."}
        </p>
      </CardFooter>
    </Card>
  );
}
