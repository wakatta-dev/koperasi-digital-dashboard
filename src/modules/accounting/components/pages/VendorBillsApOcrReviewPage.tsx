/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { DUMMY_OCR_SESSION } from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { OcrExtractionSession } from "../../types/vendor-bills-ap";
import { FeatureOcrAccuracyFooter } from "../features/FeatureOcrAccuracyFooter";
import { FeatureOcrDocumentPreviewPanel } from "../features/FeatureOcrDocumentPreviewPanel";
import { FeatureOcrExtractedDataPanel } from "../features/FeatureOcrExtractedDataPanel";

export function VendorBillsApOcrReviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<OcrExtractionSession>(DUMMY_OCR_SESSION);

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
            onClick={() =>
              router.push(VENDOR_BILLS_AP_ROUTES.detail(session.general_info.bill_number))
            }
          >
            Confirm &amp; Create Bill
          </Button>
        </div>
      </section>

      <div className="grid h-[720px] grid-cols-1 gap-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 xl:grid-cols-[1fr_450px]">
        <FeatureOcrDocumentPreviewPanel session={session} />
        <div className="flex h-full flex-col border-l border-gray-200 dark:border-gray-700">
          <FeatureOcrExtractedDataPanel session={session} onSessionChange={setSession} />
          <FeatureOcrAccuracyFooter />
        </div>
      </div>
    </div>
  );
}
