/** @format */

import { ArrowRight, Banknote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DUMMY_BATCH_PAYMENT_DRAFT } from "../../constants/vendor-bills-ap-dummy";
import type { BatchPaymentDraft } from "../../types/vendor-bills-ap";

type FeatureBatchPaymentDetailsCardProps = {
  draft?: BatchPaymentDraft;
  onDraftChange?: (nextDraft: BatchPaymentDraft) => void;
  onConfirm?: () => void;
  isConfirming?: boolean;
  confirmationDisabled?: boolean;
  errorMessage?: string | null;
};

export function FeatureBatchPaymentDetailsCard({
  draft = DUMMY_BATCH_PAYMENT_DRAFT,
  onDraftChange,
  onConfirm,
  isConfirming = false,
  confirmationDisabled = false,
  errorMessage,
}: FeatureBatchPaymentDetailsCardProps) {
  return (
    <section className="sticky top-0 flex flex-col rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-100 p-5 dark:border-gray-700">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <Banknote className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Payment Details
        </h3>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Pay From
          </label>
          <Select
            value={draft.pay_from}
            onValueChange={(value) =>
              onDraftChange?.({
                ...draft,
                pay_from: value,
              })
            }
          >
            <SelectTrigger className="w-full border-gray-300 bg-gray-50 text-sm focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BCA Corporate - 8821xxxx">BCA Corporate - 8821xxxx</SelectItem>
              <SelectItem value="Mandiri Business - 123xxxx">
                Mandiri Business - 123xxxx
              </SelectItem>
              <SelectItem value="Petty Cash (IDR)">Petty Cash (IDR)</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            Balance Available
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Payment Date
            </label>
            <Input
              type="date"
              value={draft.payment_date}
              onChange={(event) =>
                onDraftChange?.({
                  ...draft,
                  payment_date: event.target.value,
                })
              }
              className="border-gray-300 bg-gray-50 text-sm focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Reference #
            </label>
            <Input
              type="text"
              value={draft.reference_number}
              onChange={(event) =>
                onDraftChange?.({
                  ...draft,
                  reference_number: event.target.value,
                })
              }
              className="border-gray-300 bg-gray-50 text-sm focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-dashed border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{draft.total_bills_label}</span>
            <span>{draft.total_bills_amount}</span>
          </div>
          <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
            <span>Credits Applied</span>
            <span>{draft.credits_applied_amount}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-gray-900 dark:text-white">Total To Pay</span>
            <span className="text-xl font-bold text-indigo-600">{draft.total_to_pay_amount}</span>
          </div>
        </div>
      </div>

      <div className="rounded-b-xl border-t border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        {errorMessage ? (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </p>
        ) : null}
        <Button
          type="button"
          onClick={onConfirm}
          disabled={confirmationDisabled || isConfirming}
          className="w-full gap-2 bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
        >
          {isConfirming ? "Processing..." : "Confirm Batch Payment"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
