/** @format */

"use client";

import { useState } from "react";

import { KpiCards } from "@/components/shared/data-display/KpiCards";
import { Button } from "@/components/ui/button";

import {
  EMPTY_OCR_SESSION,
  EMPTY_PAYMENT_CONFIRMATION,
  buildInitialBatchPaymentDraft,
} from "../../constants/vendor-bills-ap-initial-state";
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
import { FeatureVendorBillsTable } from "../features/FeatureVendorBillsTable";

type DemoStep = "list" | "batch" | "ocr" | "confirmation";

export function VendorBillsApFeatureDemo() {
  const [demoState, setDemoState] = useState({
    step: "list" as DemoStep,
    createModalOpen: false,
    selectedBillNumbers: [] as string[],
    batchBills: [] as BatchPaymentBillItem[],
    batchDraft: {
      ...buildInitialBatchPaymentDraft(new Date()),
      reference_number: "DEMO-BATCH",
    },
    ocrSession: {
      ...EMPTY_OCR_SESSION,
      file_name: "sample.pdf",
      file_size_label: "0 MB",
    } as OcrExtractionSession,
  });
  const {
    step,
    createModalOpen,
    selectedBillNumbers,
    batchBills,
    batchDraft,
    ocrSession,
  } = demoState;

  const patchDemoState = (
    updates:
      | Partial<typeof demoState>
      | ((current: typeof demoState) => typeof demoState),
  ) => {
    setDemoState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Bills (AP)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage, approve, and pay your supplier bills efficiently.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={step === "list" ? "default" : "outline"} onClick={() => patchDemoState({ step: "list" })} className={step === "list" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          List
        </Button>
        <Button type="button" variant={step === "batch" ? "default" : "outline"} onClick={() => patchDemoState({ step: "batch" })} className={step === "batch" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          Batch
        </Button>
        <Button type="button" variant={step === "ocr" ? "default" : "outline"} onClick={() => patchDemoState({ step: "ocr" })} className={step === "ocr" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          OCR
        </Button>
        <Button type="button" variant={step === "confirmation" ? "default" : "outline"} onClick={() => patchDemoState({ step: "confirmation" })} className={step === "confirmation" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-gray-200 dark:border-gray-700"}>
          Confirmation
        </Button>
      </div>

      {step === "list" ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => patchDemoState({ createModalOpen: true })}
            >
              New Bill
            </Button>
          </div>
          <KpiCards
            items={[]}
            emptyState={
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                Ringkasan vendor bill belum tersedia.
              </div>
            }
          />
          <FeatureVendorBillsTable
            selectedBillNumbers={selectedBillNumbers}
            onSelectionChange={(value) =>
              patchDemoState({ selectedBillNumbers: value })
            }
          />
          <FeatureCreateVendorBillModal
            open={createModalOpen}
            onOpenChange={(open) => patchDemoState({ createModalOpen: open })}
            onSubmit={() => patchDemoState({ createModalOpen: false })}
          />
        </div>
      ) : null}

      {step === "batch" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <FeatureBatchSelectedBillsTable
              rows={batchBills}
              onRowsChange={(value) => patchDemoState({ batchBills: value })}
            />
            <FeatureBatchProcessingNote />
          </div>
          <div className="space-y-6">
            <FeatureBatchPaymentDetailsCard
              draft={batchDraft}
              onDraftChange={(value) => patchDemoState({ batchDraft: value })}
              onConfirm={() => patchDemoState({ step: "confirmation" })}
            />
            <FeatureBatchVendorCreditsPanel />
          </div>
        </div>
      ) : null}

      {step === "ocr" ? (
        <div className="grid h-[720px] grid-cols-1 gap-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 xl:grid-cols-[1fr_450px]">
          <FeatureOcrDocumentPreviewPanel session={ocrSession} />
          <div className="flex h-full flex-col border-l border-gray-200 dark:border-gray-700">
            <FeatureOcrExtractedDataPanel
              session={ocrSession}
              onSessionChange={(value) => patchDemoState({ ocrSession: value })}
            />
            <FeatureOcrAccuracyFooter
              onSaveProgress={() => patchDemoState({ step: "list" })}
            />
          </div>
        </div>
      ) : null}

      {step === "confirmation" ? (
        <FeaturePaymentSchedulingSuccessCard
          confirmation={EMPTY_PAYMENT_CONFIRMATION}
          onDone={() => patchDemoState({ step: "list" })}
        />
      ) : null}
    </section>
  );
}
