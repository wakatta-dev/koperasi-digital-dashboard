/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAccountingApOcrMutations } from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import { EMPTY_OCR_SESSION } from "../../constants/vendor-bills-ap-initial-state";
import type { OcrExtractionSession } from "../../types/vendor-bills-ap";
import { FeatureOcrAccuracyFooter } from "../features/FeatureOcrAccuracyFooter";
import { FeatureOcrDocumentPreviewPanel } from "../features/FeatureOcrDocumentPreviewPanel";
import { FeatureOcrExtractedDataPanel } from "../features/FeatureOcrExtractedDataPanel";

const DEFAULT_OCR_FILE_NAME = "vendor_bill_scan_882.pdf";
const DEFAULT_OCR_FILE_SIZE_BYTES = 2_400_000;
const DEFAULT_OCR_FILE_SIZE_LABEL = "2.4 MB";
const DEFAULT_OCR_ZOOM_LABEL = "100%";

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
  const extractedData = asRecord(params.extractedData);
  const generalInfo = asRecord(extractedData.general_info);
  const financials = asRecord(extractedData.financials);
  const lineItems = toOcrLineItems(extractedData.line_items);

  return {
    session_id: params.sessionId,
    file_name: params.fileName,
    file_size_label: DEFAULT_OCR_FILE_SIZE_LABEL,
    zoom_percent_label: DEFAULT_OCR_ZOOM_LABEL,
    accuracy_score: params.accuracyPercent,
    general_info: {
      vendor_name: asString(generalInfo.vendor_name, ""),
      bill_number: asString(generalInfo.bill_number, ""),
      vendor_confidence_label: asString(generalInfo.vendor_confidence_label, ""),
      bill_number_confidence_label: asString(generalInfo.bill_number_confidence_label, ""),
      bill_date: asString(generalInfo.bill_date, ""),
      due_date: asString(generalInfo.due_date, ""),
    },
    financials: {
      total_amount: asString(financials.total_amount, "0"),
    },
    line_items: lineItems,
  };
}

function toOcrErrorMessage(err: unknown): string {
  const parsed = toAccountingApApiError(err);
  const lowered = parsed.message.toLowerCase();

  if (lowered.includes("failed to fetch") || lowered.includes("networkerror")) {
    return "Unable to reach OCR API. Check CORS allow-origin/allow-headers and NEXT_PUBLIC_API_URL.";
  }

  return parsed.message;
}

export function VendorBillsApOcrReviewPage() {
  const router = useRouter();
  const ocrMutations = useAccountingApOcrMutations();
  const initializedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<OcrExtractionSession>({
    ...EMPTY_OCR_SESSION,
    file_name: DEFAULT_OCR_FILE_NAME,
    file_size_label: DEFAULT_OCR_FILE_SIZE_LABEL,
    zoom_percent_label: DEFAULT_OCR_ZOOM_LABEL,
  });

  const initializeOcrSession = useCallback(async () => {
    setErrorMessage(null);

    try {
      const created = await Promise.resolve(
        ocrMutations.createOcrSession.mutateAsync({
          payload: {
            file_name: DEFAULT_OCR_FILE_NAME,
            file_size_bytes: DEFAULT_OCR_FILE_SIZE_BYTES,
            raw_payload: {},
          },
        })
      );

      if (!created) return;
      setSession(
        toOcrSessionModel({
          sessionId: created.session_id || "",
          fileName: DEFAULT_OCR_FILE_NAME,
          accuracyPercent: created.accuracy_percent ?? 0,
          extractedData: created.extracted_data ?? {},
        })
      );
    } catch (err) {
      setErrorMessage(toOcrErrorMessage(err));
    }
  }, [ocrMutations.createOcrSession]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    void initializeOcrSession();
  }, [initializeOcrSession]);

  const handleSaveProgress = async () => {
    setErrorMessage(null);
    if (!session.session_id.trim()) {
      setErrorMessage("OCR session is not ready.");
      return;
    }

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
      const message = toOcrErrorMessage(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
        setErrorMessage(message);
        return;
      }
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleConfirm = async () => {
    setErrorMessage(null);
    if (!session.session_id.trim()) {
      setErrorMessage("OCR session is not ready.");
      return;
    }

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
      });

      toast.success("Vendor bill created from OCR");
      router.push(VENDOR_BILLS_AP_ROUTES.detail(created.bill_number));
    } catch (err) {
      const parsed = toAccountingApApiError(err);
      const message = toOcrErrorMessage(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
        setErrorMessage(message);
        return;
      }
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
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
          {errorMessage ? (
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 dark:border-gray-700"
              onClick={() => {
                void initializeOcrSession();
              }}
              disabled={ocrMutations.createOcrSession.isPending}
            >
              Retry OCR Session
            </Button>
          ) : null}
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleConfirm}
            disabled={
              ocrMutations.confirmOcrSession.isPending ||
              ocrMutations.createOcrSession.isPending ||
              session.session_id.trim().length === 0
            }
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

      <div className="grid h-[min(78vh,780px)] min-h-[560px] grid-cols-1 gap-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 xl:grid-cols-[1fr_450px]">
        <FeatureOcrDocumentPreviewPanel session={session} />
        <div className="flex h-full min-h-0 flex-col border-t border-gray-200 dark:border-gray-700 xl:border-t-0 xl:border-l">
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
