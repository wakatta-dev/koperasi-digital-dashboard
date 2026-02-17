/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAccountingApOcrMutations } from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { OcrExtractionSession } from "../../types/vendor-bills-ap";
import { FeatureOcrAccuracyFooter } from "../features/FeatureOcrAccuracyFooter";
import { FeatureOcrDocumentPreviewPanel } from "../features/FeatureOcrDocumentPreviewPanel";
import { FeatureOcrExtractedDataPanel } from "../features/FeatureOcrExtractedDataPanel";

const DEFAULT_OCR_FILE_NAME = "vendor_bill_scan_882.pdf";
const DEFAULT_OCR_FILE_SIZE_BYTES = 2_400_000;
const DEFAULT_OCR_FILE_SIZE_LABEL = "2.4 MB";
const DEFAULT_OCR_ZOOM_LABEL = "100%";

const DEFAULT_OCR_RAW_PAYLOAD: Record<string, unknown> = {
  general_info: {
    vendor_name: "Global Tech Solutions",
    bill_number: "INV-2023-882",
    bill_date: "2023-10-25",
    due_date: "2023-11-24",
  },
  financials: {
    total_amount: "12,500,000",
  },
  line_items: [
    {
      description: "Cloud Infrastructure Services (Monthly)",
      qty: "1",
      price: "8,500,000",
      highlight_price: false,
    },
    {
      description: "Security Compliance Audit Fee",
      qty: "1",
      price: "4,000,000",
      highlight_price: true,
    },
  ],
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return fallback;
}

function toOcrLineItems(value: unknown): OcrExtractionSession["line_items"] {
  const rows = Array.isArray(value) ? value : [];
  return rows.map((row, index) => {
    const item = asRecord(row);
    const idValue = asString(item.id, "").trim();
    return {
      id: idValue || `ocr-line-${index + 1}`,
      description: asString(item.description, ""),
      qty: asString(item.qty, "1"),
      price: asString(item.price, "0"),
      highlight_price: Boolean(item.highlight_price),
    };
  });
}

function toOcrSessionModel(params: {
  sessionId: string;
  fileName: string;
  accuracyPercent: number;
  extractedData: Record<string, unknown>;
}): OcrExtractionSession {
  const fallback = asRecord(DEFAULT_OCR_RAW_PAYLOAD);
  const extractedData = asRecord(params.extractedData);
  const generalInfo = asRecord(
    Object.keys(asRecord(extractedData.general_info)).length > 0
      ? extractedData.general_info
      : fallback.general_info
  );
  const financials = asRecord(
    Object.keys(asRecord(extractedData.financials)).length > 0
      ? extractedData.financials
      : fallback.financials
  );
  const lineItems = toOcrLineItems(
    Array.isArray(extractedData.line_items) ? extractedData.line_items : fallback.line_items
  );

  return {
    session_id: params.sessionId,
    file_name: params.fileName,
    file_size_label: DEFAULT_OCR_FILE_SIZE_LABEL,
    zoom_percent_label: DEFAULT_OCR_ZOOM_LABEL,
    accuracy_score: params.accuracyPercent,
    general_info: {
      vendor_name: asString(generalInfo.vendor_name, "Global Tech Solutions"),
      bill_number: asString(generalInfo.bill_number, "INV-2023-882"),
      vendor_confidence_label: "99%",
      bill_number_confidence_label: "65%",
      bill_date: asString(generalInfo.bill_date, "2023-10-25"),
      due_date: asString(generalInfo.due_date, "2023-11-24"),
    },
    financials: {
      total_amount: asString(financials.total_amount, "0"),
    },
    line_items: lineItems.length > 0 ? lineItems : toOcrLineItems(fallback.line_items),
  };
}

export function VendorBillsApOcrReviewPage() {
  const router = useRouter();
  const ocrMutations = useAccountingApOcrMutations();
  const initializedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<OcrExtractionSession>(() =>
    toOcrSessionModel({
      sessionId: "OCR-DRAFT",
      fileName: DEFAULT_OCR_FILE_NAME,
      accuracyPercent: 88,
      extractedData: DEFAULT_OCR_RAW_PAYLOAD,
    })
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const idempotencyKey = globalThis.crypto?.randomUUID?.() ?? `ocr-init-${Date.now()}`;
    void Promise.resolve(
      ocrMutations.createOcrSession.mutateAsync({
        payload: {
          file_name: DEFAULT_OCR_FILE_NAME,
          file_size_bytes: DEFAULT_OCR_FILE_SIZE_BYTES,
          raw_payload: DEFAULT_OCR_RAW_PAYLOAD,
        },
        idempotencyKey,
      })
    )
      .then((created) => {
        if (!created) return;
        setSession(
          toOcrSessionModel({
            sessionId: created.session_id || "OCR-DRAFT",
            fileName: DEFAULT_OCR_FILE_NAME,
            accuracyPercent: created.accuracy_percent ?? 88,
            extractedData: created.extracted_data ?? DEFAULT_OCR_RAW_PAYLOAD,
          })
        );
      })
      .catch((err) => {
        const parsed = toAccountingApApiError(err);
        if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
          setErrorMessage(parsed.message);
          return;
        }
        toast.error(parsed.message);
      });
  }, [ocrMutations.createOcrSession]);

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
            disabled={ocrMutations.confirmOcrSession.isPending || ocrMutations.createOcrSession.isPending}
          >
            {ocrMutations.createOcrSession.isPending
              ? "Preparing OCR Session..."
              : ocrMutations.confirmOcrSession.isPending
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
