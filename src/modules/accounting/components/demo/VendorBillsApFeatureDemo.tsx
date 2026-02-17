/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  DUMMY_BATCH_PAYMENT_BILLS,
  DUMMY_OCR_SESSION,
} from "../../constants/vendor-bills-ap-dummy";
import type { BatchPaymentBillItem, OcrExtractionSession } from "../../types/vendor-bills-ap";
import { FeatureBatchPaymentDetailsCard } from "../features/FeatureBatchPaymentDetailsCard";
import { FeatureBatchProcessingNote } from "../features/FeatureBatchProcessingNote";
import { FeatureBatchSelectedBillsTable } from "../features/FeatureBatchSelectedBillsTable";
import { FeatureBatchVendorCreditsPanel } from "../features/FeatureBatchVendorCreditsPanel";
import { FeatureCreateVendorBillModal } from "../features/FeatureCreateVendorBillModal";
import { FeatureOcrAccuracyFooter } from "../features/FeatureOcrAccuracyFooter";
import { FeatureOcrDocumentPreviewPanel } from "../features/FeatureOcrDocumentPreviewPanel";
import { FeatureOcrExtractedDataPanel } from "../features/FeatureOcrExtractedDataPanel";
import { FeaturePaymentSchedulingSuccessCard } from "../features/FeaturePaymentSchedulingSuccessCard";
import { FeatureVendorBillsSummaryCards } from "../features/FeatureVendorBillsSummaryCards";
import { FeatureVendorBillsTable } from "../features/FeatureVendorBillsTable";

type DemoStep = "list" | "batch" | "ocr" | "confirmation";

export function VendorBillsApFeatureDemo() {
  const [step, setStep] = useState<DemoStep>("list");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBillNumbers, setSelectedBillNumbers] = useState<string[]>([]);
  const [batchBills, setBatchBills] = useState<BatchPaymentBillItem[]>(DUMMY_BATCH_PAYMENT_BILLS);
  const [ocrSession, setOcrSession] = useState<OcrExtractionSession>(DUMMY_OCR_SESSION);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Bills (AP)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage, approve, and pay your supplier bills efficiently.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={step === "list" ? "default" : "outline"} onClick={() => setStep("list")} className={step === "list" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          List
        </Button>
        <Button type="button" variant={step === "batch" ? "default" : "outline"} onClick={() => setStep("batch")} className={step === "batch" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          Batch
        </Button>
        <Button type="button" variant={step === "ocr" ? "default" : "outline"} onClick={() => setStep("ocr")} className={step === "ocr" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          OCR
        </Button>
        <Button type="button" variant={step === "confirmation" ? "default" : "outline"} onClick={() => setStep("confirmation")} className={step === "confirmation" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          Confirmation
        </Button>
      </div>

      {step === "list" ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setCreateModalOpen(true)}
            >
              New Bill
            </Button>
          </div>
          <FeatureVendorBillsSummaryCards />
          <FeatureVendorBillsTable
            selectedBillNumbers={selectedBillNumbers}
            onSelectionChange={setSelectedBillNumbers}
          />
          <FeatureCreateVendorBillModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={() => setCreateModalOpen(false)}
          />
        </div>
      ) : null}

      {step === "batch" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <FeatureBatchSelectedBillsTable rows={batchBills} onRowsChange={setBatchBills} />
            <FeatureBatchProcessingNote />
          </div>
          <div className="space-y-6">
            <FeatureBatchPaymentDetailsCard onConfirm={() => setStep("confirmation")} />
            <FeatureBatchVendorCreditsPanel />
          </div>
        </div>
      ) : null}

      {step === "ocr" ? (
        <div className="grid h-[720px] grid-cols-1 gap-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 xl:grid-cols-[1fr_450px]">
          <FeatureOcrDocumentPreviewPanel session={ocrSession} />
          <div className="flex h-full flex-col border-l border-gray-200 dark:border-gray-700">
            <FeatureOcrExtractedDataPanel session={ocrSession} onSessionChange={setOcrSession} />
            <FeatureOcrAccuracyFooter onSaveProgress={() => setStep("list")} />
          </div>
        </div>
      ) : null}

      {step === "confirmation" ? (
        <FeaturePaymentSchedulingSuccessCard onDone={() => setStep("list")} />
      ) : null}
    </section>
  );
}
