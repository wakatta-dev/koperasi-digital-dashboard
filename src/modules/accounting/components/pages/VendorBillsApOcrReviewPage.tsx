/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAccountingApOcrMutations } from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { DUMMY_OCR_SESSION } from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { OcrExtractionSession } from "../../types/vendor-bills-ap";
import { FeatureOcrAccuracyFooter } from "../features/FeatureOcrAccuracyFooter";
import { FeatureOcrDocumentPreviewPanel } from "../features/FeatureOcrDocumentPreviewPanel";
import { FeatureOcrExtractedDataPanel } from "../features/FeatureOcrExtractedDataPanel";

export function VendorBillsApOcrReviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<OcrExtractionSession>(DUMMY_OCR_SESSION);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ocrMutations = useAccountingApOcrMutations();

  const handleSaveProgress = async () => {
    setErrorMessage(null);

    try {
      await ocrMutations.saveOcrProgress.mutateAsync({
        sessionId: session.session_id,
        payload: {
          status: "Reviewed",
          edited_data: {
            general_info: session.general_info,
            financials: session.financials,
            line_items: session.line_items,
          },
        },
      });
      toast.success("OCR progress saved");
    } catch (err) {
      const parsed = toAccountingApApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
        setErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  const handleConfirm = async () => {
    setErrorMessage(null);

    try {
      const created = await ocrMutations.confirmOcrSession.mutateAsync({
        sessionId: session.session_id,
        payload: {
          confirmation_payload: {
            general_info: session.general_info,
            financials: session.financials,
            line_items: session.line_items,
          },
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      toast.success("Vendor bill created from OCR");
      router.push(VENDOR_BILLS_AP_ROUTES.detail(created.bill_number));
    } catch (err) {
      const parsed = toAccountingApApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
        setErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            OCR Bill Review &amp; Extraction
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review extracted bill data before creating a vendor bill.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleConfirm}
            disabled={ocrMutations.confirmOcrSession.isPending}
          >
            {ocrMutations.confirmOcrSession.isPending
              ? "Creating Bill..."
              : "Confirm & Create Bill"}
          </Button>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid h-[720px] grid-cols-1 gap-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 xl:grid-cols-[1fr_450px]">
        <FeatureOcrDocumentPreviewPanel session={session} />
        <div className="flex h-full flex-col border-l border-gray-200 dark:border-gray-700">
          <FeatureOcrExtractedDataPanel session={session} onSessionChange={setSession} />
          <FeatureOcrAccuracyFooter
            accuracyScore={session.accuracy_score}
            onDiscard={() => router.push(VENDOR_BILLS_AP_ROUTES.index)}
            onSaveProgress={handleSaveProgress}
          />
        </div>
      </div>
    </div>
  );
}
